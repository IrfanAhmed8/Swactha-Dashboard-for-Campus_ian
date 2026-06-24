import { createContext, useContext, useEffect, useState } from "react";

const ZoneContext = createContext();

export const ZoneProvider = ({ children }) => {

  const [zones, setZones] = useState({});
  const [frames, setFrames] = useState({});
  const [history, setHistory] = useState({});
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = "info") => {

    const id = Date.now();

    setNotifications((prev) => [
      ...prev,
      { id, message, type }
    ]);

    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== id)
      );
    }, 3000);
  };

  useEffect(() => {

    const ws = new WebSocket("ws://localhost:8000/ws/zones");

    ws.onmessage = (event) => {

      const data = JSON.parse(event.data);

      // ======================
      // ZONE DATA
      // ======================

      setZones((prev) => ({
        ...prev,
        [data.zone]: {
          people: data.people,
          garbage: data.garbage,

          risk: data.risk,

          cleanlinessScore: data.cleanliness_score,
          cleanlinessLabel: data.cleanliness_label,
          cleanlinessColor: data.cleanliness_color,
        },
      }));

      // ======================
      // FRAME
      // ======================

      if (data.frame) {

        setFrames((prev) => ({
          ...prev,
          [data.zone]: `data:image/jpeg;base64,${data.frame}`,
        }));

      }

      // ======================
      // HISTORY
      // ======================

      setHistory((prev) => {

        const zoneHistory = prev[data.zone] || [];

        const newEntry = {
          time: new Date().toLocaleTimeString(),
          timestamp: Date.now(),

          people: data.people,
          garbage: data.garbage,

          risk: data.risk,

          cleanlinessScore: data.cleanliness_score,
          cleanlinessLabel: data.cleanliness_label,
        };

        const MAX_HISTORY = 2000;

        return {
          ...prev,
          [data.zone]: [...zoneHistory, newEntry].slice(-MAX_HISTORY),
        };
      });

      // ======================
      // ALERTS FROM BACKEND DATA
      // ======================

      if (data.cleanliness_score < 50) {

        addNotification(
          `🚨 ${data.zone} requires immediate cleaning`,
          "danger"
        );

      }
    };

    return () => ws.close();

  }, []);

  return (
    <ZoneContext.Provider
      value={{
        zones,
        frames,
        history,
        notifications,
        addNotification,
      }}
    >
      {children}
    </ZoneContext.Provider>
  );
};

export const useZones = () => useContext(ZoneContext);