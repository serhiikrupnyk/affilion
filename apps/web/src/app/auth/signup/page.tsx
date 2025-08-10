"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { postJSON } from "@/lib/api";

export default function SignUpPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [ok, setOk]           = useState(false);

  useEffect(() => {
    formRef.current?.querySelector<HTMLInputElement>('input[name="name"]')?.focus();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setOk(false);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    if (!name || !email || !password) {
      setError("Заповніть усі поля");
      setLoading(false);
      return;
    }

    try {
      await postJSON("/api/auth/signup", { name, email, password });
      setOk(true);
      // варіант 1: показати підтвердження і дати перейти вручну
      // варіант 2 (зручніше): одразу на логін
      setTimeout(() => router.replace("/auth/signin?registered=1"), 800);
    } catch (err: any) {
      const msg = String(err?.message || "");
      // дружній текст для 409
      if (msg.toLowerCase().includes("already")) {
        setError("Цей email вже використовується. Спробуйте увійти або оберіть інший.");
      } else {
        setError(msg || "Помилка реєстрації");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-semibold">Створити обліковий запис</h1>
      <p className="text-gray-600 mt-2">
        Вже маєте акаунт?{" "}
        <Link href="/auth/signin" className="underline">Увійти</Link>
      </p>

      <form ref={formRef} onSubmit={onSubmit} className="mt-6 space-y-4">
        <input
          name="name"
          placeholder="Ваше ім'я"
          className="w-full px-4 py-3 border rounded-xl"
          required
          disabled={loading}
        />
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Email"
          className="w-full px-4 py-3 border rounded-xl"
          required
          disabled={loading}
        />
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Пароль"
          className="w-full px-4 py-3 border rounded-xl"
          required
          minLength={6}
          disabled={loading}
        />
        <button
          disabled={loading}
          className="w-full px-4 py-3 rounded-xl bg-black text-white disabled:opacity-60"
        >
          {loading ? "Створюємо..." : "Зареєструватися"}
        </button>

        {ok && (
          <div className="text-green-700 text-sm bg-green-50 border border-green-200 rounded-lg p-3">
            Акаунт створено! Зараз перенесемо на сторінку входу…
          </div>
        )}
        {error && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
