"use client";
import { useEffect, useState } from "react";

interface RankItem {
  entry: { id: string; word: string; definition: string; language: { name: string } };
  score: number;
}

export default function RankingsPage() {
  const [period, setPeriod] = useState("week");
  const [items, setItems] = useState<RankItem[]>([]);

  useEffect(() => {
    fetch(`/api/rankings?period=${period}`).then((r) => r.json()).then((d) => Array.isArray(d) && setItems(d));
  }, [period]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-indigo-800 mb-4">Word Rankings</h1>
      <p className="text-gray-500 text-sm mb-4">Weighted: Search×1 · View×2 · Compare×3 · Post mention×4</p>
      <div className="flex gap-2 mb-6">
        {["day", "week"].map((p) => (
          <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1 rounded text-sm ${period === p ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`}>
            {p === "day" ? "Word of the Day" : "Word of the Week"}
          </button>
        ))}
      </div>
      {items.length === 0 ? (
        <p className="text-gray-500">No data yet — start searching!</p>
      ) : (
        <ol className="space-y-3">
          {items.map((item, i) => (
            <li key={item.entry.id} className="flex items-center gap-3 bg-white border rounded p-3 shadow-sm">
              <span className="text-2xl font-bold text-indigo-300 w-8">#{i + 1}</span>
              <div className="flex-1">
                <span className="font-semibold text-indigo-700">{item.entry.word}</span>
                <span className="ml-2 text-xs text-gray-400">{item.entry.language.name}</span>
                <p className="text-gray-600 text-sm">{item.entry.definition}</p>
              </div>
              <span className="text-sm font-bold text-indigo-500">{item.score} pts</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
