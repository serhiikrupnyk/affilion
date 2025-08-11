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
  const [showPwd, setShowPwd] = useState(false);

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
      setTimeout(() => router.replace("/auth/signin?registered=1"), 800);
    } catch (err: any) {
      const msg = String(err?.message || "");
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
    <div className="max-w-md mx-auto py-8">
      <div className="text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-indigo-600 text-white grid place-items-center font-bold shadow-sm">A</div>
          <span className="sr-only">На головну</span>
        </Link>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-300 bg-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-300 bg-gradient-to-b from-indigo-100 to-transparent">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
            Створити обліковий запис
          </h1>
          <p className="text-sm text-slate-700 mt-1">
            Вже маєте акаунт?{" "}
            <Link href="/auth/signin" className="font-medium text-indigo-700 hover:underline">
              Увійти
            </Link>
          </p>
        </div>

        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="px-6 py-6 space-y-4"
          noValidate
        >
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm text-slate-700">Ваше ім’я</label>
            <input
              id="name"
              name="name"
              placeholder="Ім’я та прізвище"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm text-slate-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm text-slate-700">Пароль</label>
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                className="text-xs px-2 py-1 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-200"
                aria-pressed={showPwd}
              >
                {showPwd ? "Приховати" : "Показати"}
              </button>
            </div>
            <input
              id="password"
              name="password"
              type={showPwd ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Мінімум 6 символів"
              minLength={6}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              required
              disabled={loading}
            />
            <p className="text-xs text-slate-600">
              Пароль з щонайменше 6 символів. Рекомендуємо додати цифри та символи.
            </p>
          </div>

          <button
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 disabled:hover:bg-indigo-600 disabled:opacity-60 transition-colors"
          >
            {loading && (
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                <path d="M21 12a9 9 0 0 1-9 9" stroke="currentColor" strokeWidth="3" />
              </svg>
            )}
            {loading ? "Створюємо…" : "Зареєструватися"}
          </button>

          {/* Повідомлення */}
          <div className="space-y-2" aria-live="polite" aria-atomic="true">
            {ok && (
              <div className="text-green-800 text-sm bg-green-50 border border-green-200 rounded-xl p-3">
                Акаунт створено! Зараз перенаправимо на сторінку входу…
              </div>
            )}
            {error && (
              <div className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-xl p-3">
                {error}
              </div>
            )}
          </div>

          <p className="text-xs text-slate-600">
            Реєструючись, ви погоджуєтеся з{" "}
            <Link href="/terms" className="underline hover:text-slate-800">Умовами</Link> та{" "}
            <Link href="/privacy" className="underline hover:text-slate-800">Політикою конфіденційності</Link>.
          </p>
        </form>
      </div>
    </div>
  );
}
