"use client";
import { useState } from "react";

interface Entry {
  id: string;
  word: string;
  definition: string;
  language: { name: string; code: string };
  morphemes: { id: string; form: string; meaning: string }[];
}

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);

  async function search() {
    if (!q.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/entries/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setResults(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-indigo-800 mb-6">Sintu Dictionary</h1>
      <p className="text-gray-600 mb-4">Search Zulu, Sotho, and Xhosa words</p>
      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Search a word..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
        />
        <button
          onClick={search}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {loading ? "..." : "Search"}
        </button>
      </div>
      <div className="space-y-4">
        {results.map((entry) => (
          <div key={entry.id} className="bg-white border border-gray-200 rounded p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl font-semibold text-indigo-700">{entry.word}</span>
              <span className="text-xs bg-indigo-100 text-indigo-600 rounded px-2 py-0.5">
                {entry.language.name}
              </span>
            </div>
            <p className="text-gray-700">{entry.definition}</p>
            {entry.morphemes.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {entry.morphemes.map((m) => (
                  <span key={m.id} className="text-xs bg-yellow-50 border border-yellow-200 rounded px-2 py-0.5">
                    <strong>{m.form}</strong>: {m.meaning}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
