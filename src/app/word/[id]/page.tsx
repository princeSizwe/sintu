import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function WordPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = await prisma.entry.findUnique({
    where: { id },
    include: { language: true, morphemes: true },
  });
  if (!entry) notFound();

  return (
    <div>
      <h1 className="text-3xl font-bold text-indigo-800 mb-2">{entry.word}</h1>
      <span className="text-sm bg-indigo-100 text-indigo-600 rounded px-2 py-1">{entry.language.name}</span>
      <p className="mt-4 text-gray-700 text-lg">{entry.definition}</p>
      {entry.morphemes.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Morphemes</h2>
          <ul className="space-y-1">
            {entry.morphemes.map((m) => (
              <li key={m.id} className="flex gap-2">
                <strong className="text-indigo-700">{m.form}</strong>
                <span className="text-gray-600">— {m.meaning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
