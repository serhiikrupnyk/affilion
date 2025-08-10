"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function NewAffiliatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (loading) return;
    setErr(""); setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name")||""),
      email: String(fd.get("email")||""),
      status: String(fd.get("status")||"active"),
      geos: String(fd.get("geos")||""),
      sources: String(fd.get("sources")||""),
    };
    const res = await fetch("/api/affiliates", {
      method: "POST", headers: { "content-type":"application/json" },
      body: JSON.stringify(payload), credentials: "include",
    });
    if (!res.ok) {
      setErr(await res.text()); setLoading(false); return;
    }
    router.replace("/dashboard/affiliates");
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold">Новий веб</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input name="name" className="w-full border rounded-xl px-3 py-2" placeholder="Name" required />
        <input name="email" type="email" className="w-full border rounded-xl px-3 py-2" placeholder="Email" required />
        <input name="geos" className="w-full border rounded-xl px-3 py-2" placeholder="GEOs (UA,PL,...)" />
        <input name="sources" className="w-full border rounded-xl px-3 py-2" placeholder="Sources (FB,TT,...)" />
        <select name="status" className="w-full border rounded-xl px-3 py-2">
          <option value="active">active</option>
          <option value="paused">paused</option>
          <option value="banned">banned</option>
          <option value="pending">pending</option>
        </select>
        <button disabled={loading} className="px-4 py-2 rounded-xl border">
          {loading ? "Створюємо..." : "Створити"}
        </button>
        {err && <div className="text-red-600">{err}</div>}
      </form>
    </div>
  );
}
