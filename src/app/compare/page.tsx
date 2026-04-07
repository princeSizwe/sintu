"use client";
import { useState } from "react";

interface Entry {
  id: string;
  word: string;
  definition: string;
  language: { name: string };
  morphemes: { id: string; form: string; meaning: string }[];
}

export default function ComparePage() {
  const [ids, setIds] = useState("");
  const [results, setResults] = useState<Entry[]>([]);

  async function compare() {
    const res = await fetch(`/api/compare?ids=${encodeURIComponent(ids)}`);
    const data = await res.json();
    setResults(Array.isArray(data) ? data : []);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-indigo-800 mb-4">Compare Words</h1>
      <p className="text-gray-600 mb-4">Enter comma-separated entry IDs to compare.</p>
      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 border border-gray-300 rounded px-3 py-2"
          placeholder="id1,id2,id3"
          value={ids}
          onChange={(e) => setIds(e.target.value)}
        />
        <button onClick={compare} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Compare
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((entry) => (
          <div key={entry.id} className="bg-white border rounded p-4 shadow-sm">
            <div className="text-xl font-semibold text-indigo-700">{entry.word}</div>
            <div className="text-xs text-gray-500 mb-1">{entry.language.name}</div>
            <p className="text-gray-700">{entry.definition}</p>
            {entry.morphemes.map((m) => (
              <div key={m.id} className="text-xs mt-1 text-yellow-700">
                <strong>{m.form}</strong>: {m.meaning}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
