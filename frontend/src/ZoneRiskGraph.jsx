import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";


// Convert backend risk → number
const riskToNumber = (risk) => {

  if (!risk) return 0;

  const r = risk.toUpperCase();

  if (r === "LOW") return 1;
  if (r === "MODERATE") return 2;
  if (r === "HIGH") return 3;

  return 0;
};


// Convert number → label
const numberToRisk = {
  1: "Low",
  2: "Moderate",
  3: "High",
};


// Color mapping
const getColor = (risk) => {

  if (!risk) return "gray";

  const r = risk.toUpperCase();

  if (r === "LOW") return "#00C853";
  if (r === "MODERATE") return "#FF9800";
  if (r === "HIGH") return "#FF0000";

  return "gray";
};


function ZoneRiskGraph({ data }) {

  if (!data || data.length === 0) {
    return <p>No data yet...</p>;
  }

  const formattedData = data.map((item, index) => ({
    id: index,
    time: item.time,
    riskLevel: item.riskLevel,
    riskNumber: riskToNumber(item.riskLevel),
  }));

  return (

    <ResponsiveContainer width="100%" height={300}>

      <BarChart
        data={formattedData}
        barCategoryGap="30%"
      >

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="time" />

        <YAxis
          ticks={[1, 2, 3]}
          domain={[0, 3]}
          tickFormatter={(value) => numberToRisk[value]}
        />

        <Tooltip
          formatter={(value) => numberToRisk[value]}
        />

        <Bar
          dataKey="riskNumber"
          barSize={40}
          radius={[6, 6, 0, 0]}
        >

          {formattedData.map((entry, index) => (

            <Cell
              key={index}
              fill={getColor(entry.riskLevel)}
            />

          ))}

        </Bar>

      </BarChart>

    </ResponsiveContainer>

  );

}

export default ZoneRiskGraph;
