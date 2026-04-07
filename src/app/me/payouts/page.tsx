"use client";
import { useEffect, useState } from "react";

interface Payout {
  id: string;
  amount: number;
  description: string;
  createdAt: string;
}

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/me/payouts")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else if (Array.isArray(d)) setPayouts(d);
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-indigo-800 mb-4">My Payouts</h1>
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : payouts.length === 0 ? (
        <p className="text-gray-500">No payouts yet.</p>
      ) : (
        <table className="w-full text-sm border border-gray-200 rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Description</th>
              <th className="text-right p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="p-2">{p.description}</td>
                <td className="p-2 text-right font-semibold text-green-700">R{p.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
