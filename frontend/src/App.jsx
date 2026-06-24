import CampusMap from "./CampusMap";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useZones } from "./context/ZoneContext";
import "./App.css";
import { exportToExcel, exportToPDF } from "./utils/exportReport";

function App() {
  const navigate = useNavigate();

  // ✅ IMPORTANT FIX: added history
  const { zones, history } = useZones();

  const handleZoneClick = (zone) => {
    if (zone === "cctv_zone") {
      navigate("/zone/cctv_zone");
    }
  };

  const zoneList = Object.entries(zones || {});

  const peopleTotal = zoneList.reduce(
  (sum, z) => sum + (z[1]?.people || 0),
  0
);

const garbageTotal = zoneList.reduce(
  (sum, z) => sum + (z[1]?.garbage || 0),
  0
);

const dirtyZones = zoneList.filter(
  z => z[1]?.cleanlinessScore < 50
).length;

const totalZones = zoneList.length;

const avgCleanliness =
  totalZones > 0
    ? (
        zoneList.reduce(
          (sum, z) => sum + (z[1]?.cleanlinessScore || 0),
          0
        ) / totalZones
      ).toFixed(0)
    : 100;

const cleanestZone =
  [...zoneList].sort(
    (a, b) =>
      (b[1]?.cleanlinessScore || 0) -
      (a[1]?.cleanlinessScore || 0)
  )[0]?.[0];

const dirtiestZone =
  [...zoneList].sort(
    (a, b) =>
      (a[1]?.cleanlinessScore || 0) -
      (b[1]?.cleanlinessScore || 0)
  )[0]?.[0];
  const zoneLegend = [
  { label: "Very Clean", color: "#1B5E20" },
  { label: "Clean", color: "#4CAF50" },
  { label: "Slightly Dirty", color: "#FBC02D" },
  { label: "Moderate Risk", color: "#FB8C00" },
  { label: "Dirty", color: "#E53935" },
  { label: "Critical", color: "#8B0000" },
];

  return (
    <div className="dashboard">

      {/* HEADER */}
      <header className="header">
        <div>
          <h1>🛰 Smart Swachhta Dashboard</h1>
          <p>For Campus Cleanliness Monitoring</p>
        </div>

        {/* LIVE + BUTTONS */}
        <div className="live-container">

          <div className="live">
            <span className="live-dot"></span>
            LIVE
          </div>

          <div className="live-actions">

            <button
              className="live-btn excel"
              onClick={() => exportToExcel(history)}   // ✅ FIXED
              title="Export Excel"
            >
              📊 Excel
            </button>

            <button
              className="live-btn pdf"
              onClick={() => exportToPDF(history)}     // ✅ FIXED
              title="Export PDF"
            >
              📄 PDF
            </button>

          </div>

        </div>
      </header>

      {/* MAIN GRID */}
      <main className="main-grid">

        {/* MAP */}
        {/* MAP */}
<div className="card map-card">

  <div className="map-title">
    Campus Live Monitoring
  </div>

  <div className="map-layout">

    {/* LEFT SIDE LEGEND */}
    <div className="map-legend">

      <h3>Zone Status</h3>

      {zoneLegend.map((zone) => (
        <div key={zone.label} className="legend-item">

          <span
            className="legend-color"
            style={{ backgroundColor: zone.color }}
          ></span>

          <span className="legend-label">
            {zone.label}
          </span>

        </div>
      ))}

    </div>

    {/* RIGHT SIDE MAP */}
    <div className="map-container">
      <CampusMap onZoneClick={handleZoneClick} />
    </div>

  </div>
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
            <h2>📊 Campus Cleanliness: {avgCleanliness}%</h2>

            <p className="score-text">
              {avgCleanliness > 75
                ? "🟢 Campus is Clean and Well Maintained"
                : avgCleanliness > 50
                ? "🟡 Moderate Cleanliness - Needs Monitoring"
                : "🔴 Dirty Zones Detected - Immediate Action Required"}
            </p>
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