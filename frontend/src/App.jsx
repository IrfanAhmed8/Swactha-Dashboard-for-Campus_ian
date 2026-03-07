import CampusMap from "./CampusMap";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useZones } from "./context/ZoneContext";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const { zones } = useZones();

  const handleZoneClick = (zone) => {
    if (zone === "cctv_zone") {
      navigate("/zone/cctv_zone");
    }
  };

  const zoneList = Object.entries(zones || {});

  const peopleTotal = zoneList.reduce((sum, z) => sum + (z[1]?.people || 0), 0);
  const garbageTotal = zoneList.reduce((sum, z) => sum + (z[1]?.garbage || 0), 0);

  const dirtyZones = zoneList.filter(z => z[1]?.riskLevel === "HIGH").length;

  const cleanlinessScore =
    Math.max(0, 100 - (garbageTotal * 3 + peopleTotal * 0.5)).toFixed(0);

  const totalZones = zoneList.length;

  const cleanestZone =
  zoneList.sort((a,b)=> (a[1]?.garbage||0)-(b[1]?.garbage||0))[0]?.[0];

  const dirtiestZone =
  zoneList.sort((a,b)=> (b[1]?.garbage||0)-(a[1]?.garbage||0))[0]?.[0];

  return (
    <div className="dashboard">

      {/* HEADER */}
      <header className="header">
        <div>
          <h1>🛰 Smart Swachhta Dashboard</h1>
          <p>AI Powered Campus Cleanliness Monitoring</p>
        </div>

        <div className="live">
          <span className="live-dot"></span>
          LIVE
        </div>
      </header>

      {/* MAIN GRID */}
      <main className="main-grid">

        {/* MAP */}
        <div className="card map-card">
          <div className="map-title">
Campus Live Monitoring
</div>
          <CampusMap onZoneClick={handleZoneClick} />
        </div>

        {/* STATS */}
        <div className="card stats-card">

          <div className="stat">
            <span>👥 Total People Detected across Zones</span>
            <h2>{peopleTotal}</h2>
          </div>

          <div className="stat">
            <span>🗑 Total Garbage Objects across Zones</span>
            <h2>{garbageTotal}</h2>
          </div>

          <div className="stat">
            <span>🚨 Dirty Zones</span>
            <h2>{dirtyZones}</h2>
          </div>

          <div className="stat">
            <span>📊 Campus Cleanliness</span>
            <h2>{cleanlinessScore}%</h2>
          </div>

          <div className="stat highlight">
          <span>📍 Total Zones</span>
          <h2>{totalZones}</h2>
          </div>

          <div className="stat highlight">
          <span>✨ Cleanest Zone</span>
          <h2>{cleanestZone || "--"}</h2>
          </div>

          <div className="stat highlight">
          <span>🧹 Dirtiest Zone</span>
          <h2>{dirtiestZone || "--"}</h2>
          </div>

        </div>

      </main>
    </div>
  );
}
export default App;