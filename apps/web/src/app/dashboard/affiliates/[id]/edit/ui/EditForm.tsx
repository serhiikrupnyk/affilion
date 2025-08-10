"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function EditForm({ initial }: { initial: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    name: initial.name || "",
    email: initial.email || "",
    geos: initial.geos || "",
    sources: initial.sources || "",
    status: initial.status || "active",
  });

  function upd<K extends keyof typeof form>(k: K, v: string) { setForm(p => ({ ...p, [k]: v })); }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (loading) return;
    setErr(""); setLoading(true);
    const res = await fetch(`/api/affiliates/${initial.id}`, {
      method: "PATCH",
      headers: { "content-type":"application/json" },
      body: JSON.stringify(form),
      credentials: "include",
    });
    if (!res.ok) { setErr(await res.text()); setLoading(false); return; }
    router.replace("/dashboard/affiliates");
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <input value={form.name} onChange={e=>upd("name", e.target.value)} className="w-full border rounded-xl px-3 py-2" />
      <input value={form.email} onChange={e=>upd("email", e.target.value)} className="w-full border rounded-xl px-3 py-2" />
      <input value={form.geos} onChange={e=>upd("geos", e.target.value)} className="w-full border rounded-xl px-3 py-2" />
      <input value={form.sources} onChange={e=>upd("sources", e.target.value)} className="w-full border rounded-xl px-3 py-2" />
      <select value={form.status} onChange={e=>upd("status", e.target.value)} className="w-full border rounded-xl px-3 py-2">
        <option value="active">active</option>
        <option value="paused">paused</option>
        <option value="banned">banned</option>
        <option value="pending">pending</option>
      </select>
      <div className="flex gap-3">
        <button disabled={loading} className="px-4 py-2 rounded-xl border">Зберегти</button>
        <button type="button" onClick={()=>router.back()} className="px-4 py-2 rounded-xl border">Скасувати</button>
      </div>
      {err && <div className="text-red-600">{err}</div>}
    </form>
  );
}
