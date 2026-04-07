"use client";
import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else if (Array.isArray(d)) setUsers(d);
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-indigo-800 mb-4">Admin Panel</h1>
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <table className="w-full text-sm border border-gray-200 rounded overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Role</th>
              <th className="text-left p-2">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.name || "—"}</td>
                <td className="p-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${u.role === "ADMIN" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-2">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
