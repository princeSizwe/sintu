"use client";
import { useEffect, useState } from "react";

interface Prediction {
  id: string;
  value: string;
  user: { name: string | null; email: string };
}

interface Round {
  id: string;
  title: string;
  description: string | null;
  endsAt: string;
  predictions: Prediction[];
}

export default function PredictionsPage() {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [value, setValue] = useState("");

  useEffect(() => {
    fetch("/api/predictions").then((r) => r.json()).then((d) => Array.isArray(d) && setRounds(d));
  }, []);

  async function submit() {
    if (!selected || !value.trim()) return;
    await fetch(`/api/predictions/${selected}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
    setValue("");
    const r = await fetch("/api/predictions");
    const d = await r.json();
    if (Array.isArray(d)) setRounds(d);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-indigo-800 mb-4">Predictions</h1>
      {rounds.length === 0 ? (
        <p className="text-gray-500">No active prediction rounds yet.</p>
      ) : (
        <div className="space-y-6">
          {rounds.map((round) => (
            <div key={round.id} className="bg-white border rounded p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-indigo-700">{round.title}</h2>
              {round.description && <p className="text-gray-600 text-sm mb-2">{round.description}</p>}
              <p className="text-xs text-gray-400 mb-3">Ends: {new Date(round.endsAt).toLocaleDateString()}</p>
              <h3 className="text-sm font-medium mb-2">All Predictions ({round.predictions.length})</h3>
              <ul className="space-y-1 mb-3">
                {round.predictions.map((p) => (
                  <li key={p.id} className="text-sm text-gray-700">
                    <strong>{p.user.name || p.user.email}</strong>: {p.value}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <button onClick={() => setSelected(round.id)} className={`text-xs px-2 py-1 rounded ${selected === round.id ? "bg-indigo-600 text-white" : "bg-gray-100"}`}>
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {selected && (
        <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded p-4">
          <h3 className="font-medium mb-2">Submit Prediction</h3>
          <div className="flex gap-2">
            <input className="flex-1 border rounded px-3 py-2 text-sm" placeholder="Your prediction..." value={value} onChange={(e) => setValue(e.target.value)} />
            <button onClick={submit} className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700">Submit</button>
          </div>
        </div>
      )}
    </div>
  );
}
