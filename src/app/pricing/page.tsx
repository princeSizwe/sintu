"use client";

export default function PricingPage() {
  async function startSubscription() {
    const res = await fetch("/api/payfast/start", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      alert(`PayFast sandbox URL: ${data.url}\n\nFull integration TODO`);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-indigo-800 mb-4">Pricing</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border rounded p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Free</h2>
          <p className="text-gray-600 mb-4">Basic dictionary access, search, compare</p>
          <p className="text-2xl font-bold">R0 / month</p>
        </div>
        <div className="bg-indigo-50 border-2 border-indigo-400 rounded p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2 text-indigo-800">Pro</h2>
          <p className="text-gray-600 mb-4">Full access: feed, predictions, payouts</p>
          <p className="text-2xl font-bold text-indigo-700">R49 / month</p>
          <button onClick={startSubscription} className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
            Subscribe via PayFast (Sandbox)
          </button>
          <p className="text-xs text-gray-400 mt-2">PayFast sandbox mode active</p>
        </div>
      </div>
    </div>
  );
}
