"use client";

import { useState } from "react";

export default function RoleForm({ id, current }: { id: number; current: string }) {
  const [role, setRole] = useState(current);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function save() {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(`/api/admin/users/${id}/role`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ role }),
        credentials: "include",
      });
      setMsg(res.ok ? "Збережено" : `Помилка ${res.status}`);
    } catch (e: any) {
      setMsg(e?.message || "Помилка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        className="border rounded-lg px-2 py-1"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        disabled={loading}
      >
        <option value="admin">admin</option>
        <option value="manager">manager</option>
        <option value="affiliate">affiliate</option>
      </select>
      <button onClick={save} disabled={loading} className="px-3 py-1 border rounded-lg">
        {loading ? "..." : "Зберегти"}
      </button>
      {msg && <span className="text-sm text-gray-500">{msg}</span>}
    </div>
  );
}
