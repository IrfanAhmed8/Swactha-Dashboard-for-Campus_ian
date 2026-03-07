
import { createContext, useContext, useEffect, useState } from "react";

const ZoneContext = createContext();

export const ZoneProvider = ({ children }) => {

  const [zones, setZones] = useState({});
  const [frames, setFrames] = useState({});
  const [history, setHistory] = useState({});

  useEffect(() => {

    const ws = new WebSocket("ws://localhost:8000/ws/zones");

    ws.onmessage = (event) => {

      const data = JSON.parse(event.data);

      console.log("Received:", data);

      // Store live data
      setZones((prev) => ({
        ...prev,
        [data.zone]: {
          riskLevel: data.risk,   // LOW MODERATE HIGH
          people: data.people,
          garbage: data.garbage,
        },
      }));

      // Store frame if exists
      if (data.frame) {
        setFrames((prev) => ({
          ...prev,
          [data.zone]: `data:image/jpeg;base64,${data.frame}`,
        }));
      }

      // Store history for graph
      setHistory((prev) => {

        const zoneHistory = prev[data.zone] || [];

        const newEntry = {
          time: new Date().toLocaleTimeString(),
          riskLevel: data.risk,   // IMPORTANT
          people: data.people,
        };

        return {
          ...prev,
          [data.zone]: [...zoneHistory.slice(-10), newEntry],
        };
      });

    };

    return () => ws.close();

  }, []);

  return (
    <ZoneContext.Provider value={{ zones, frames, history }}>
      {children}
    </ZoneContext.Provider>
  );

};

export const useZones = () => useContext(ZoneContext);
