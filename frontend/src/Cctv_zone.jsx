import React from 'react'
import image1 from './images/graph1.jpeg'
import image2 from './images/graph2.jpg'
import { useZones } from './context/ZoneContext.jsx';

function Cctv_zone() {
  const { zones, frames } = useZones();

  return (
    <div style={{ padding: "20px" }}>

      {/* 🔴 LIVE INDICATOR */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "12px"
      }}>
        <span
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: "red",
            animation: "pulse 1.2s infinite"
          }}
        />
        <strong style={{ color: "red", letterSpacing: "1px" }}>
          LIVE
        </strong>
      </div>

      {/* GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px"
      }}>
        <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "20px" }}>
          <h3>CCTV Zone Risk — {zones?.risk}</h3>
          <p>People detected: {zones?.people}</p>

          {frames?.cctv_zone && (
            <img
              src={frames.cctv_zone}
              alt="Live CCTV"
              style={{ width: "100%", borderRadius: "6px" }}
            />
          )}
        </div>

        <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "20px" }}>
          <h3>CCTV Zone Cleanliness</h3>
          <video width="100%" controls>
            <source
              src="https://www.w3schools.com/html/mov_bbb.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "20px" }}>
          <h3>CCTV Zone Risk History</h3>
          <img src={image1} alt="Risk Graph" style={{ width: "100%" }} />
        </div>

        <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "20px" }}>
          <h3>CCTV Zone Cleanliness History</h3>
          <img src={image2} alt="Cleanliness Graph" style={{ width: "100%" }} />
        </div>
      </div>

      {/* 🔄 Pulse animation */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.3; }
            100% { opacity: 1; }
          }
        `}
      </style>

    </div>
  );
}

export default Cctv_zone;
