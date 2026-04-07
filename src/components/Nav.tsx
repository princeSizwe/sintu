import Link from "next/link";

export default function Nav() {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-4xl mx-auto flex flex-wrap gap-4 items-center">
        <Link href="/" className="font-bold text-lg text-indigo-700">
          Sintu
        </Link>
        <Link href="/compare" className="text-sm text-gray-600 hover:text-indigo-600">Compare</Link>
        <Link href="/feed" className="text-sm text-gray-600 hover:text-indigo-600">Feed</Link>
        <Link href="/rankings" className="text-sm text-gray-600 hover:text-indigo-600">Rankings</Link>
        <Link href="/predictions" className="text-sm text-gray-600 hover:text-indigo-600">Predictions</Link>
        <Link href="/pricing" className="text-sm text-gray-600 hover:text-indigo-600">Pricing</Link>
        <Link href="/translate" className="text-sm text-gray-600 hover:text-indigo-600">Translate</Link>
        <Link href="/me/payouts" className="text-sm text-gray-600 hover:text-indigo-600">Payouts</Link>
        <Link href="/admin" className="text-sm text-gray-600 hover:text-indigo-600">Admin</Link>
      </div>
    </nav>
  );
}
