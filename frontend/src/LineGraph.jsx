import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

// Friendly labels and colors
const riskLabels = {
  1.1: "🟢 Safe",
  2: "🟡 Caution",
  2.9: "🔴 Danger"
};

const riskColors = {
  1.1: "#28a745", // green
  2: "#ffc107",   // yellow
  2.9: "#dc3545"  // red
};

// Map original risk numbers (1/2/3) to padded values
const mapRisk = (value) => {
  if (value === 1) return 1.1; // LOW slightly above bottom
  if (value === 2) return 2;   // MODERATE center
  if (value === 3) return 2.9; // HIGH slightly below top
  return value;
};

function LineGraph({ data }) {
  const paddedData = data.map(item => ({
    ...item,
    value: mapRisk(item.value)
  }));

  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "20px",
      marginTop: "20px"
    }}>
      <h3>Live CCTV Risk Graph</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={paddedData} margin={{ top: 20, bottom: 20 }}>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <XAxis dataKey="time" />
          <YAxis
            type="number"
            domain={[1, 3]} // still covers all
            ticks={[1.1, 2, 2.9]} // same as mapped values
            tickFormatter={(value) => riskLabels[value]}
          />
          <Tooltip
            formatter={(value) => riskLabels[value]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            dot={{
              stroke: "#fff",
              strokeWidth: 2,
              r: 6, // slightly bigger dots
              fill: (props) => riskColors[props.payload.value]
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LineGraph;
