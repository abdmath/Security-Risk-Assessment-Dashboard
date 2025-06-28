import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from "recharts";

export default function RadarChartComp({ domainScores }) {
  const data = Object.entries(domainScores).map(([key, value]) => ({
    domain: key,
    score: value,
  }));

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Radar View</h3>
      <RadarChart outerRadius={90} width={350} height={300} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="domain" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Radar name="Score" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        <Tooltip />
      </RadarChart>
    </div>
  );
}
