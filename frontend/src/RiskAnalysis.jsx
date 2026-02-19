import React from "react";

function RiskAnalysis({ riskLevel, people }) {

  if (!riskLevel) {
    return <p>No analysis available</p>;
  }

  const risk = riskLevel.toUpperCase();

  let color = "gray";
  let message = "";
  let advice = "";

  if (risk === "LOW") {
    color = "green";
    message = "Area is safe.";
    advice = "No action needed.";
  }

  if (risk === "MODERATE") {
    color = "orange";
    message = "Crowd increasing.";
    advice = "Monitor the area closely.";
  }

  if (risk === "HIGH") {
    color = "red";
    message = "Dangerous crowd level detected.";
    advice = "Security intervention recommended.";
  }

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "15px",
        borderRadius: "8px",
        border: `2px solid ${color}`,
        backgroundColor: "#f9f9f9",
      }}
    >
      <h3 style={{ color }}>Risk Analysis</h3>

      <p>
        <strong>Risk Level:</strong> {riskLevel}
      </p>

      <p>
        <strong>People Detected:</strong> {people}
      </p>

      <p>
        <strong>Status:</strong> {message}
      </p>

      <p>
        <strong>Recommendation:</strong> {advice}
      </p>
    </div>
  );
}

export default RiskAnalysis;
