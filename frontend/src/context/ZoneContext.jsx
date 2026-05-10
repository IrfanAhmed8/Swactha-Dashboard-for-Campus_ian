import { createContext, useContext, useEffect, useState } from "react";

const ZoneContext = createContext();

export const ZoneProvider = ({ children }) => {

  const [zones, setZones] = useState({});
  const [frames, setFrames] = useState({});
  const [history, setHistory] = useState({});
  const [notifications, setNotifications] = useState([]);

  // 🧠 prevent spam notifications
  const lastAlerts = {};

  const addNotification = (message, type = "info") => {
    const id = Date.now();

    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  // 🧠 garbage % calculator (smarter scaling)
  const getGarbagePercent = (garbage) => {
    const MAX = 10; // adjust based on model
    return Math.min(100, (garbage / MAX) * 100);
  };

  useEffect(() => {

    const ws = new WebSocket("ws://localhost:8000/ws/zones");

    ws.onmessage = (event) => {

      const data = JSON.parse(event.data);

      const garbagePercent = getGarbagePercent(data.garbage);

      // ======================
      // LIVE ZONES DATA
      // ======================
      setZones((prev) => ({
        ...prev,
        [data.zone]: {
          riskLevel: data.risk,
          people: data.people,
          garbage: data.garbage,
          garbagePercent,
        },
      }));

      // ======================
      // FRAME DATA
      // ======================
      if (data.frame) {
        setFrames((prev) => ({
          ...prev,
          [data.zone]: `data:image/jpeg;base64,${data.frame}`,
        }));
      }

      // ======================
      // HISTORY (NO RESET)
      // ======================
      setHistory((prev) => {

        const zoneHistory = prev[data.zone] || [];

        const newEntry = {
          time: new Date().toLocaleTimeString(),
          timestamp: Date.now(),
          riskLevel: data.risk,
          people: data.people,
          garbage: data.garbage,
          garbagePercent,
        };

        const MAX_HISTORY = 2000;

        return {
          ...prev,
          [data.zone]: [...zoneHistory, newEntry].slice(-MAX_HISTORY),
        };
      });

      // ======================
      // SMART NOTIFICATIONS (ANTI-SPAM)
      // ======================

      const key = data.zone;

      if (!lastAlerts[key]) lastAlerts[key] = {};

      const now = Date.now();

      // Crowd alert
      if (data.people >= 10 && now - (lastAlerts[key].people || 0) > 5000) {
        addNotification(`👥 High Crowd: ${data.people} people in ${data.zone}`, "warning");
        lastAlerts[key].people = now;
      }

      // Garbage alerts
      if (garbagePercent >= 70 && now - (lastAlerts[key].garbage || 0) > 5000) {
        addNotification(`🚨 High Waste: ${garbagePercent.toFixed(0)}% in ${data.zone}`, "danger");
        lastAlerts[key].garbage = now;
      }
      else if (garbagePercent >= 30 && now - (lastAlerts[key].midGarbage || 0) > 5000) {
        addNotification(`🗑 Moderate Waste: ${garbagePercent.toFixed(0)}%`, "warning");
        lastAlerts[key].midGarbage = now;
      }

      // Risk alert
      if (data.risk === "HIGH" && now - (lastAlerts[key].risk || 0) > 5000) {
        addNotification(`🚨 High Risk Zone: ${data.zone}`, "danger");
        lastAlerts[key].risk = now;
      }
    };

    return () => ws.close();

  }, []);

  return (
    <ZoneContext.Provider value={{
      zones,
      frames,
      history,
      notifications,
      addNotification
    }}>
      {children}
    </ZoneContext.Provider>
  );
};

export const useZones = () => useContext(ZoneContext);