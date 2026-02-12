import { createContext, useContext, useEffect, useState } from "react";

const ZoneContext = createContext();

export const ZoneProvider = ({ children }) => {
  const [zones, setZones] = useState({});
  const [frames, setFrames] = useState({});

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/zones");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setZones((prev) => ({
        ...prev,
        [data.zone]: {
          risk: data.risk,
          people: data.people,
        },
      }));

      if (data.frame) {
        setFrames((prev) => ({
          ...prev,
          [data.zone]: `data:image/jpeg;base64,${data.frame}`,
        }));
      }
    };

    return () => ws.close();
  }, []);

  return (
    <ZoneContext.Provider value={{ zones, frames }}>
      {children}
    </ZoneContext.Provider>
  );
};

export const useZones = () => useContext(ZoneContext);
