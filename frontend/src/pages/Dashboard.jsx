import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import InputForm from "../components/InputForm";
import RadarChartComp from "../components/RadarChart";
import HeatMapComp from "../components/HeatMap";

export default function Dashboard() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [frameworkFilter, setFrameworkFilter] = useState("");
  const [sortBy, setSortBy] = useState("date");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ✅ Redirect to login if no token
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // ✅ Fetch history after login or new result
  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/assessments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [result]);

  const filtered = history
    .filter((a) => !frameworkFilter || a.framework === frameworkFilter)
    .sort((a, b) => {
      if (sortBy === "score") return b.overall_score - a.overall_score;
      return new Date(b.created_at) - new Date(a.created_at);
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-8 relative">
      {/* ✅ Logout Button */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
        className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-md hover:bg-red-700"
      >
        Logout
      </button>

      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">
        Security Risk Assessment Dashboard
      </h1>

      <div className="max-w-4xl mx-auto mb-10">
        <InputForm onResult={setResult} />
      </div>

      {result && (
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-md transition-all duration-300">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Latest Risk Result</h2>
          <p className="text-lg mb-6">
            Overall Score: <span className="font-bold text-blue-700">{result.score}</span>
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <RadarChartComp domainScores={result.domains} />
            <HeatMapComp domainScores={result.domains} />
          </div>

          <div className="flex gap-4 mt-8">
            <a
              href={`http://localhost:8000/api/v1/assessment/${result.id}/json`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              Export JSON
            </a>
            <a
              href={`http://localhost:8000/api/v1/assessment/${result.id}/pdf`}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              Export PDF
            </a>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="max-w-6xl mx-auto mt-16 bg-white p-8 rounded-2xl shadow-md transition-all duration-300">
          <div className="flex flex-wrap gap-4 mb-6 justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-700">Assessment History</h2>
            <div className="flex gap-4">
              <select
                value={frameworkFilter}
                onChange={(e) => setFrameworkFilter(e.target.value)}
                className="p-2 border rounded-md"
              >
                <option value="">All Frameworks</option>
                <option value="NIST">NIST</option>
                <option value="ISO">ISO</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-2 border rounded-md"
              >
                <option value="date">Newest First</option>
                <option value="score">Highest Score</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700 border border-gray-300 rounded-md">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border">System</th>
                  <th className="p-3 border">Criticality</th>
                  <th className="p-3 border">Framework</th>
                  <th className="p-3 border">Score</th>
                  <th className="p-3 border">Created</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition">
                    <td className="p-3 border">{item.system_name}</td>
                    <td className="p-3 border">{item.criticality}</td>
                    <td className="p-3 border">{item.framework}</td>
                    <td className="p-3 border">{item.overall_score}</td>
                    <td className="p-3 border">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                    <td className="p-3 border space-x-3">
                      <a
                        href={`http://localhost:8000/api/v1/assessment/${item._id}/json`}
                        className="text-blue-600 underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        JSON
                      </a>
                      <a
                        href={`http://localhost:8000/api/v1/assessment/${item._id}/pdf`}
                        className="text-red-600 underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        PDF
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
