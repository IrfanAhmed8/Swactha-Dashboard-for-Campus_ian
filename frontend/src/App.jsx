import CampusMap from "./CampusMap";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function App() {
  const navigate = useNavigate();

  const handleZoneClick = (zone, zones) => {
    if (zone === "cctv_zone") {
      navigate("/zone/cctv_zone", { state: { risk: zones.cctv_zone } });
      return;
    }
    alert(`Clicked on ${zone}`);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1>Smart Campus Cleanliness</h1>
        <p>Live zone monitoring & hygiene risk analysis</p>
      </header>

      {/* Main Content */}
      <main className="content">
        <div className="map-card">
          <div className="live-indicator">
    <span className="live-dot" />
    LIVE
  </div>
          <CampusMap onZoneClick={handleZoneClick} />
        </div>

        {/* Legend */}
        <div className="legend">
          <h3>Risk Levels</h3>
          <div className="legend-item">
            <span className="dot low" /> Low
          </div>
          <div className="legend-item">
            <span className="dot moderate" /> Moderate
          </div>
          <div className="legend-item">
            <span className="dot high" /> High
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        Click on any zone to view cleanliness details
      </footer>
    </div>
  );
}

export default App;
