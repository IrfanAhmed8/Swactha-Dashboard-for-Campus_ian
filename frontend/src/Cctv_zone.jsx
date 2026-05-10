import React from "react";
import { useZones } from "./context/ZoneContext.jsx";
import ZoneRiskGraph from "./ZoneRiskGraph.jsx";
import RiskAnalysis from "./RiskAnalysis.jsx";
import LineGraph from "./LineGraph.jsx";
import "./style/Cctv_zone.css";

function Cctv_zone() {

  const { zones, frames, history, notifications } = useZones();

  const zone = zones?.cctv_zone;
  const zoneHistory = history?.cctv_zone || [];

  const lineGraphData = zoneHistory.map((entry) => ({
    time: entry.time,
    value: entry.riskLevel === "LOW" ? 1 : entry.riskLevel === "MODERATE" ? 2 : 3
  }));

  const riskColors = {
    LOW: "#22c55e",
    MODERATE: "#facc15",
    HIGH: "#ef4444"
  };

  const cleanlinessScore = Math.max(
    0,
    100 - ((zone?.garbage || 0) * 10 + (zone?.people || 0) * 2)
  );

  return (
    <div className="dashboard">

      {/* 🔔 GLOBAL NOTIFICATIONS UI (ONLY ADDITION) */}
      <div style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 99999
      }}>
        {notifications?.map((n) => (
          <div
            key={n.id}
            style={{
              background: "Black",
              padding: "12px 15px",
              marginBottom: "10px",
              borderRadius: "10px",
              minWidth: "250px",
              borderLeft:
                n.type === "danger"
                  ? "6px solid red"
                  : "6px solid orange",
              boxShadow: "0 0 10px rgba(0,0,0,0.2)",
              animation: "slideIn 0.4s ease",
              fontFamily: "Arial"
            }}
          >
            {n.message}
          </div>
        ))}
      </div>

      {/* HEADER */}
      <div className="header">
        <h2>📡 CCTV Zone Monitoring</h2>

        <div className="live-indicator">
          <span className="live-dot"></span>
          LIVE
        </div>
      </div>

      {/* TOP GRID */}
      <div className="top-grid">

        <div className="card camera-card">
          <h3>Live Camera</h3>

          {frames?.cctv_zone && (
            <img
              src={frames.cctv_zone}
              alt="Live CCTV"
              className="camera-feed"
            />
          )}
        </div>

        <div className="card stats-card">

          <div className="stat">
            <span>👥 People</span>
            <h2>{zone?.people ?? "--"}</h2>
          </div>

          <div className="stat">
            <span>🗑 Garbage</span>
            <h2>{zone?.garbage ?? "--"}</h2>
          </div>

          <div className="stat">
            <span>⚠ Risk Level</span>
            <h2 style={{ color: riskColors[zone?.riskLevel] }}>
              {zone?.riskLevel || "--"}
            </h2>
          </div>

          <div className="stat clean-score-box">

  <span>📊 Cleanliness Score</span>

  <h2 className="score-value">
    {cleanlinessScore}%
    <span className="score-emoji">
      {cleanlinessScore > 75 ? "🧹" : cleanlinessScore > 50 ? "⚠️" : "🔥"}
    </span>
  </h2>

  <div className="progress-bar">
    <div
      className={`progress-fill ${
        cleanlinessScore > 75
          ? "good"
          : cleanlinessScore > 50
          ? "mid"
          : "bad"
      }`}
      style={{ width: `${cleanlinessScore}%` }}
    />
  </div>

  <p className="score-text">
    {cleanlinessScore > 75
      ? "Area is Clean"
      : cleanlinessScore > 50
      ? "Moderate Attention Needed"
      : "Immediate Cleaning Required"}
  </p>

</div>

        </div>
      </div>

      {/* GRAPHS */}
      <div className="graph-grid">

        <div className="card">
          <h3>Risk Timeline</h3>
          <ZoneRiskGraph data={zoneHistory} />
        </div>

        <div className="card">
          <h3>Risk Trend</h3>
          {lineGraphData.length > 0 && (
            <LineGraph data={lineGraphData} />
          )}
        </div>

      </div>

      {/* AI ANALYSIS */}
      <div className="card analysis-card">
        <h3>AI Cleanliness Analysis</h3>
        <RiskAnalysis
          riskLevel={zone?.riskLevel}
          people={zone?.people}
        />
      </div>

    </div>
  );
}

export default Cctv_zone;