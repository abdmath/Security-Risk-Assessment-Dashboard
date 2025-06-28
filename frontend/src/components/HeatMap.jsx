import React from "react";

export default function HeatMapComp({ domainScores }) {
  const getColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 50) return "bg-yellow-400";
    return "bg-red-500";
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Heatmap</h3>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(domainScores).map(([domain, score]) => (
          <div
            key={domain}
            className={`text-white p-4 rounded shadow ${getColor(score)}`}
          >
            <h4 className="font-semibold">{domain}</h4>
            <p>{score}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
