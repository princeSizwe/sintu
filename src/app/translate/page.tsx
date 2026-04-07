"use client";
import { useState } from "react";

interface TranslateResult {
  source?: { word: string; definition: string; language: { name: string } };
  target?: { word: string; definition: string; language: { name: string } } | null;
  note?: string;
  message?: string;
  translation?: null;
}

export default function TranslatePage() {
  const [word, setWord] = useState("");
  const [from, setFrom] = useState("zu");
  const [to, setTo] = useState("xh");
  const [result, setResult] = useState<TranslateResult | null>(null);

  async function translate() {
    const res = await fetch(`/api/translate?word=${encodeURIComponent(word)}&from=${from}&to=${to}`);
    setResult(await res.json());
  }

  const langs = [{ code: "zu", name: "Zulu" }, { code: "st", name: "Sotho" }, { code: "xh", name: "Xhosa" }];

  return (
    <div>
      <h1 className="text-2xl font-bold text-indigo-800 mb-4">Translate</h1>
      <p className="text-gray-500 text-sm mb-4">MVP: morpheme-based cross-language lookup</p>
      <div className="flex flex-wrap gap-2 mb-6">
        <input className="border rounded px-3 py-2" placeholder="Word..." value={word} onChange={(e) => setWord(e.target.value)} />
        <select className="border rounded px-3 py-2" value={from} onChange={(e) => setFrom(e.target.value)}>
          {langs.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>
        <span className="py-2 text-gray-500">→</span>
        <select className="border rounded px-3 py-2" value={to} onChange={(e) => setTo(e.target.value)}>
          {langs.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>
        <button onClick={translate} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Translate</button>
      </div>
      {result && (
        <div className="bg-white border rounded p-4 shadow-sm">
          {result.source ? (
            <div>
              <p className="font-semibold">{result.source.word} ({result.source.language.name})</p>
              <p className="text-gray-700">{result.source.definition}</p>
              {result.target ? (
                <div className="mt-3 border-t pt-3">
                  <p className="font-semibold">{result.target.word} ({result.target.language.name})</p>
                  <p className="text-gray-700">{result.target.definition}</p>
                </div>
              ) : (
                <p className="text-gray-400 text-sm mt-2">{result.note}</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">{result.message || "Not found"}</p>
          )}
        </div>
      )}
    </div>
  );
}
