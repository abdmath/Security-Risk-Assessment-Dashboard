import React, { useState } from "react";
import api from "../services/api";

export default function InputForm({ onResult }) {
  const [systemName, setSystemName] = useState("");
  const [criticality, setCriticality] = useState("medium");
  const [framework, setFramework] = useState("NIST");
  const [controls, setControls] = useState([{ name: "", description: "", implemented: false }]);
  const [threats, setThreats] = useState([{ category: "", description: "", likelihood: 1, impact: 1 }]);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!systemName.trim()) newErrors.systemName = "System Name is required.";

    controls.forEach((c, i) => {
      if (!c.name.trim()) newErrors[`control_name_${i}`] = "Control name is required.";
      if (!c.description.trim()) newErrors[`control_description_${i}`] = "Description is required.";
    });

    threats.forEach((t, i) => {
      if (!t.category.trim()) newErrors[`threat_category_${i}`] = "Threat category is required.";
      if (!t.description.trim()) newErrors[`threat_description_${i}`] = "Threat description is required.";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await api.post("/api/v1/assess", {
        system_name: systemName,
        criticality,
        framework,
        controls,
        threats,
      });
      onResult(res.data);
    } catch (err) {
      alert("Assessment failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">System Risk Input</h2>

      <input
        type="text"
        placeholder="System Name"
        value={systemName}
        onChange={(e) => setSystemName(e.target.value)}
        className="w-full p-2 mb-1 border rounded"
      />
      {errors.systemName && <p className="text-red-500 text-sm mb-2">{errors.systemName}</p>}

      <select value={criticality} onChange={(e) => setCriticality(e.target.value)} className="w-full p-2 mb-2 border rounded">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <select value={framework} onChange={(e) => setFramework(e.target.value)} className="w-full p-2 mb-4 border rounded">
        <option value="NIST">NIST</option>
        <option value="ISO">ISO</option>
      </select>

      <h3 className="font-semibold mt-4">Controls</h3>
      {controls.map((c, i) => (
        <div key={i} className="flex flex-col gap-2 mb-2">
          <input
            type="text"
            placeholder="Name"
            value={c.name}
            onChange={(e) => {
              const newC = [...controls];
              newC[i].name = e.target.value;
              setControls(newC);
            }}
            className="border p-2 rounded"
          />
          {errors[`control_name_${i}`] && <p className="text-red-500 text-sm">{errors[`control_name_${i}`]}</p>}
          <input
            type="text"
            placeholder="Description"
            value={c.description}
            onChange={(e) => {
              const newC = [...controls];
              newC[i].description = e.target.value;
              setControls(newC);
            }}
            className="border p-2 rounded"
          />
          {errors[`control_description_${i}`] && <p className="text-red-500 text-sm">{errors[`control_description_${i}`]}</p>}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={c.implemented}
              onChange={(e) => {
                const newC = [...controls];
                newC[i].implemented = e.target.checked;
                setControls(newC);
              }}
            />
            Implemented
          </label>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setControls([...controls, { name: "", description: "", implemented: false }])}
        className="mb-4 text-sm text-blue-600"
      >
        + Add Control
      </button>

      <h3 className="font-semibold mt-4">Threats</h3>
      {threats.map((t, i) => (
        <div key={i} className="flex flex-col gap-2 mb-2">
          <input
            type="text"
            placeholder="Category"
            value={t.category}
            onChange={(e) => {
              const newT = [...threats];
              newT[i].category = e.target.value;
              setThreats(newT);
            }}
            className="border p-2 rounded"
          />
          {errors[`threat_category_${i}`] && <p className="text-red-500 text-sm">{errors[`threat_category_${i}`]}</p>}
          <input
            type="text"
            placeholder="Description"
            value={t.description}
            onChange={(e) => {
              const newT = [...threats];
              newT[i].description = e.target.value;
              setThreats(newT);
            }}
            className="border p-2 rounded"
          />
          {errors[`threat_description_${i}`] && <p className="text-red-500 text-sm">{errors[`threat_description_${i}`]}</p>}
          <label>
            Likelihood:
            <input
              type="number"
              value={t.likelihood}
              min={1}
              max={5}
              onChange={(e) => {
                const newT = [...threats];
                newT[i].likelihood = parseInt(e.target.value);
                setThreats(newT);
              }}
              className="border p-1 ml-2 w-16 rounded"
            />
          </label>
          <label>
            Impact:
            <input
              type="number"
              value={t.impact}
              min={1}
              max={5}
              onChange={(e) => {
                const newT = [...threats];
                newT[i].impact = parseInt(e.target.value);
                setThreats(newT);
              }}
              className="border p-1 ml-2 w-16 rounded"
            />
          </label>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setThreats([...threats, { category: "", description: "", likelihood: 1, impact: 1 }])}
        className="mb-4 text-sm text-blue-600"
      >
        + Add Threat
      </button>

      <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
        Submit Assessment
      </button>
    </form>
  );
}
