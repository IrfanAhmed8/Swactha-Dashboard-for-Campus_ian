import React from "react";
import { useZones } from "./context/ZoneContext.jsx";
import ZoneRiskGraph from "./ZoneRiskGraph.jsx";
import RiskAnalysis from "./RiskAnalysis.jsx";
import LineGraph from "./LineGraph.jsx";
import "./style/Cctv_zone.css"; // Importing CSS for styling

function Cctv_zone() {
  const { zones, frames, history } = useZones();

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

        {/* CAMERA FEED */}
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

        {/* AI STATUS PANEL */}
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

          <div className="stat">
            <span>📊 Cleanliness Score</span>
            {/* <h2>{cleanlinessScore}%</h2> */}
            <h5>--Under Process --</h5>
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