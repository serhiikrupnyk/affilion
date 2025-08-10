"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-semibold">Увійти</h1>
      <p className="text-gray-600 mt-2">
        Немає акаунта?{" "}
        <Link href="/auth/signup" className="underline">Зареєструйтесь</Link>
      </p>

      {/* НАТИВНИЙ POST на внутрішній роут */}
      <form
        action="/api/auth/signin"
        method="post"
        onSubmit={() => setLoading(true)}
        className="mt-6 space-y-4"
      >
        <input name="email" type="email" placeholder="Email" className="w-full px-4 py-3 border rounded-xl" required />
        <input name="password" type="password" placeholder="Пароль" className="w-full px-4 py-3 border rounded-xl" required minLength={6} />
        <button disabled={loading} className="w-full px-4 py-3 rounded-xl bg-black text-white disabled:opacity-60">
          {loading ? "Заходимо..." : "Увійти"}
        </button>
      </form>
    </div>
  );
}
