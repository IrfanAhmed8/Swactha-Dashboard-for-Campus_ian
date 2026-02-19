import React from "react";
import { useZones } from "./context/ZoneContext.jsx";
import ZoneRiskGraph from "./ZoneRiskGraph.jsx";
import RiskAnalysis from "./RiskAnalysis.jsx";
import LineGraph from "./LineGraph.jsx";

function Cctv_zone() {
  const { zones, frames, history } = useZones();

  const zone = zones?.cctv_zone;
  const zoneHistory = history?.cctv_zone || [];

  // Map history to line graph data
  const lineGraphData = zoneHistory.map((entry) => ({
    time: entry.time,          // e.g., "10:30:15"
    value: entry.riskLevel === "LOW" ? 1 : entry.riskLevel === "MODERATE" ? 2 : 3
  }));

  return (
    <div style={{ padding: "20px" }}>
      {/* LIVE indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "red", animation: "pulse 1.2s infinite" }} />
        <strong style={{ color: "red" }}>LIVE</strong>
      </div>

      {/* GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* LIVE DATA */}
        <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "20px" }}>
          <h3>CCTV Zone Risk — {zone?.riskLevel || "No data"}</h3>
          <p>People detected: {zone?.people ?? "No data"}</p>
          {frames?.cctv_zone && <img src={frames.cctv_zone} alt="Live CCTV" style={{ width: "100%", borderRadius: "6px" }} />}
        </div>

        {/* BAR GRAPH */}
        <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "20px" }}>
          <h3>CCTV Risk History</h3>
          <ZoneRiskGraph data={zoneHistory} />
          <RiskAnalysis riskLevel={zone?.riskLevel} people={zone?.people} />
        </div>
      </div>

      {/* LINE GRAPH */}
      {lineGraphData.length > 0 && <LineGraph data={lineGraphData} />}

      {/* pulse animation */}
      <style>{`
        @keyframes pulse {
          0% {opacity:1}
          50% {opacity:0.3}
          100% {opacity:1}
        }
      `}</style>
    </div>
  );
}

export default Cctv_zone;
