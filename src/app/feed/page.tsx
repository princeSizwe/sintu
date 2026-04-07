"use client";
import { useEffect, useState } from "react";

interface Post {
  id: string;
  content: string;
  createdAt: string;
  author: { name: string | null; email: string };
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/api/feed").then((r) => r.json()).then((d) => Array.isArray(d) && setPosts(d));
  }, []);

  async function submit() {
    if (!content.trim()) return;
    await fetch("/api/feed", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content }) });
    setContent("");
    const r = await fetch("/api/feed");
    const d = await r.json();
    if (Array.isArray(d)) setPosts(d);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-indigo-800 mb-4">Community Feed</h1>
      <div className="flex gap-2 mb-6">
        <input className="flex-1 border rounded px-3 py-2" placeholder="Share a thought..." value={content} onChange={(e) => setContent(e.target.value)} />
        <button onClick={submit} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Post</button>
      </div>
      <div className="space-y-4">
        {posts.map((p) => (
          <div key={p.id} className="bg-white border rounded p-4 shadow-sm">
            <p className="text-gray-800">{p.content}</p>
            <p className="text-xs text-gray-400 mt-1">by {p.author.name || p.author.email} · {new Date(p.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
