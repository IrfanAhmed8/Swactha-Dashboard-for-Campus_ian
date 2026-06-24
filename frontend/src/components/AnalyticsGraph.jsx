import React, { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const riskMap = {
  LOW: 1,
  MODERATE: 2,
  HIGH: 3,
};

const AnalyticsGraph = () => {

  const [data, setData] = useState([]);

  const fetchAnalytics = async () => {

    try {

      const res = await fetch("http://localhost:8000/analytics");

      const json = await res.json();

      const formatted = json.map((item) => ({
        ...item,
        riskValue: riskMap[item.risk] || 0,
      }));

      setData(formatted);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {

    fetchAnalytics();

    const interval = setInterval(() => {
      fetchAnalytics();
    }, 10000);

    return () => clearInterval(interval);

  }, []);

  return (

    <div className="card graph-card">

      <h3>📈 Live Analytics</h3>

      <ResponsiveContainer width="100%" height={350}>

        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="timestamp" />

          <YAxis />

          <Tooltip />

          <Legend />

          <Line
            type="monotone"
            dataKey="people"
            stroke="#2196F3"
            strokeWidth={3}
            dot={false}
            name="People Count"
          />

          <Line
            type="monotone"
            dataKey="garbage"
            stroke="#F44336"
            strokeWidth={3}
            dot={false}
            name="Garbage Count"
          />

          <Line
            type="monotone"
            dataKey="riskValue"
            stroke="#FF9800"
            strokeWidth={3}
            dot={false}
            name="Risk Level"
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
};

export default AnalyticsGraph;