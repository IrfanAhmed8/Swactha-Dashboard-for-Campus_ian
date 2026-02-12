import React, { useEffect, useState } from "react";
import { useZones } from "./context/ZoneContext.jsx";
const CampusMap = ({ onZoneClick }) => {
  const {zones}=useZones();
  const riskColors = {
  LOW: "#4CAF50",
  MODERATE: "#FFC107",
  HIGH: "#F44336",
};

  return (
    <svg
  viewBox="0 0 794.9834 809.13501"
  preserveAspectRatio="xMidYMid meet"
  width="100%"
  height="100%"
  style={{
    background: "#f5f5f5",
    borderRadius: "12px",
    display: "block"
  }}
>

  <defs>
    <filter id="softGlow" x="-0.07" y="-0.19" width="1.14" height="1.38">
      <feGaussianBlur stdDeviation="8" />
    </filter>
  </defs>

  {/* ===== Top Building ===== */}
  <polygon
    points="790,15 760,40 230,40 260,15"
    fill="#b0bec5"
    stroke="#000"
    strokeWidth="2"
    transform="translate(-198,-12.864959)"
  />

  <polygon
    points="790,115 760,120 760,40 790,15"
    fill="#b0bec5"
    stroke="#000"
    strokeWidth="2"
    transform="translate(-198,-12.864959)"
  />

  <rect
    x="32"
    y="27.13504"
    width="530"
    height="80"
    fill="#cfd8dc"
    stroke="#000"
    strokeWidth="3"
    onClick={() => onZoneClick("building_front")}
  />

  {/* Windows */}
  {[62, 122, 182, 242, 302, 362, 422, 482].map((x) => (
    <rect key={x} x={x} y="47.13504" width="30" height="20" fill="#90a4ae" />
  ))}

  <rect x="272" y="72.13504" width="50" height="35" fill="#757575" />

  <rect
    x="32"
    y="107.13504"
    width="530"
    height="10"
    fill="#b0bec5"
    opacity="0.6"
  />

  <text
    x="297"
    y="77.13504"
    textAnchor="middle"
    fontSize="14"
    fontWeight="bold"
  >
    Building 1
  </text>

  {/* ===== Front Road ===== */}
  <rect
    x="32"
    y="117.13504"
    width="540"
    height="50"
    fill="#9e9e9e"
    onClick={() => onZoneClick("front_road")}
  />

  <line
    x1="27"
    y1="142.13504"
    x2="570.23364"
    y2="142.13504"
    stroke="#fff"
    strokeWidth="4.3"
    strokeDasharray="10 10"
  />

  <text x="302" y="152.13504" textAnchor="middle" fill="#fff">
    Road
  </text>

  {/* ===== Left Road ===== */}
  <rect
    x="0"
    y="117.13504"
    width="50"
    height="530"
    rx="20"
    fill="#9e9e9e"
    onClick={() => onZoneClick("left_road")}
  />

  <line
    x1="27"
    y1="139.97783"
    x2="27"
    y2="627.13507"
    stroke="#fff"
    strokeWidth="3.6"
    strokeDasharray="10 10"
  />

  <text
    x="-337.13504"
    y="27"
    transform="rotate(-90)"
    textAnchor="middle"
    fill="#fff"
  >
    Road
  </text>

  {/* ===== Right Road ===== */}
  {/* ===== Right Road Strip ===== */}
<rect
  x="552"
  y="117.13504"
  width="50"
  height="520"
  rx="30"
  fill="#9e9e9e"
  onClick={() => onZoneClick("right_road")}
/>

<line
  x1="572"
  y1="137.13504"
  x2="572"
  y2="605.13507"
  stroke="#ffffff"
  strokeWidth="3.5"
  strokeDasharray="10 10"
/>


  {/* ===== Playground ===== */}
  <rect
    x="67"
    y="182.13504"
    width="470"
    height="250"
    rx="40"
    ry="40"
    fill="#a5d6a7"
    stroke="#2e7d32"
    strokeWidth="3"
    onClick={() => onZoneClick("playground")}
  />

  <rect
    x="102"
    y="220.13504"
    width="400"
    height="180"
    rx="30"
    ry="30"
    fill="none"
    stroke="#fff"
    strokeWidth="3"
    strokeDasharray="8 6"
  />

  <line
    x1="102"
    y1="307.13504"
    x2="502"
    y2="307.13504"
    stroke="#fff"
    strokeWidth="2"
  />

  <text x="302" y="312.13504" textAnchor="middle" fontWeight="bold">
    Ground
  </text>

  {/* ===== BB Court ===== */}
  <rect
    x="67"
    y="457.13504"
    width="470"
    height="120"
    rx="25"
    ry="25"
    fill="#90caf9"
    stroke="#1e88e5"
    strokeWidth="3"
    onClick={() => onZoneClick("bb_court")}
  />

  <line
    x1="302"
    y1="457.13504"
    x2="302"
    y2="577.13507"
    stroke="#fff"
    strokeWidth="3"
  />

  <circle
    cx="302"
    cy="517.13507"
    r="25"
    fill="none"
    stroke="#fff"
    strokeWidth="3"
  />

  <text x="302" y="522.13507" textAnchor="middle" fontWeight="bold">
    BB Court
  </text>

  {/* ===== Parking ===== */}
  <rect
    x="2"
    y="607.13507"
    width="600"
    height="200"
    rx="25"
    ry="25"
    fill="#cfcfcf"
    stroke="#424242"
    strokeWidth="4"
    onClick={() => onZoneClick("parking")}
  />

  {[32, 92, 152, 212, 272, 332, 392, 452, 512].map((x) => (
    <line
      key={x}
      x1={x}
      y1="637.13507"
      x2={x}
      y2="777.13507"
      stroke="#fff"
      strokeWidth="3"
    />
  ))}

  <text
    x="302"
    y="722.13507"
    textAnchor="middle"
    fontSize="24"
    fontWeight="bold"
  >
    Parking
  </text>

  {/* ===== CCTV Zone (Live Risk) ===== */}
  <rect
    x="157"
    y="97.13504"
    width="270"
    height="100"
    rx="80"
    ry="80"
    fill={riskColors[zones?.cctv_zone?.risk] || "#d85711"}
    opacity="0.42"
    filter="url(#softGlow)"
    onClick={() => onZoneClick("cctv_zone",zones)}
  />
  {/* ===== Right Side Building Complex ===== */}
<g transform="translate(-198,-12.864959)">
  {/* Main vertical block */}
  <rect
    x="830.09821"
    y="60.098198"
    width="79.803604"
    height="398.30359"
    fill="#cfd8dc"
    stroke="#cfd8dc"
    strokeWidth="3.1964"
    onClick={() => onZoneClick("right_building",zones)}
  />

  {/* Horizontal connector */}
  <rect
    x="829.58118"
    y="450"
    width="120.838"
    height="40.837646"
    rx="10"
    fill="#cfd8dc"
    onClick={() => onZoneClick("right_building")}
  />

  {/* Vertical extension */}
  <rect
    x="940"
    y="450"
    width="50"
    height="220"
    rx="12.5"
    fill="#cfd8dc"
    onClick={() => onZoneClick("right_building")}
  />

  {/* Bottom left block */}
  <rect
    x="830"
    y="630"
    width="80"
    height="170"
    fill="#cfd8dc"
    onClick={() => onZoneClick("right_building")}
  />

  {/* Bottom right small block */}
  <rect
    x="910"
    y="630"
    width="40"
    height="40"
    fill="#cfd8dc"
    onClick={() => onZoneClick("right_building")}
  />
</g>
{/* ===== Canteen ===== */}
<rect
  x="612"
  y="507.13504"
  width="120"
  height="90"
  rx="20"
  ry="20"
  fill="#ffe082"
  stroke="#000"
  strokeWidth="3"
  onClick={() => onZoneClick("canteen")}
/>

<text
  x="662"
  y="557.13507"
  textAnchor="middle"
  fontWeight="bold"
>
  Canteen
</text>

</svg>

  );
};

export default CampusMap;
