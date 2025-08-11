"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

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
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">Увійти</h1>
          <p className="text-sm text-slate-700 mt-1">
            Немає акаунта?{" "}
            <Link href="/auth/signup" className="font-medium text-indigo-700 hover:underline">
              Зареєструйтесь
            </Link>
          </p>
        </div>

        {/* Нативний POST — не вимикаємо інпути на submit */}
        <form
          action="/api/auth/signin"
          method="post"
          onSubmit={() => setLoading(true)}
          className="px-6 py-6 space-y-4"
        >
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm text-slate-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              required
              className={[
                "w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900",
                "placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                loading ? "opacity-90" : "",
              ].join(" ")}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm text-slate-700">Пароль</label>
              <Link href="/auth/forgot" className="text-xs text-indigo-700 hover:underline">
                Забули пароль?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPwd ? "text" : "password"}
                placeholder="Ваш пароль"
                minLength={6}
                autoComplete="current-password"
                required
                className={[
                  "w-full px-4 py-3 pr-24 rounded-xl border border-slate-300 bg-white text-slate-900",
                  "placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                  loading ? "opacity-90" : "",
                ].join(" ")}
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-200"
                aria-pressed={showPwd}
                tabIndex={-1}
              >
                {showPwd ? "Приховати" : "Показати"}
              </button>
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 disabled:hover:bg-indigo-600 disabled:opacity-60 transition-colors"
          >
            {loading && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                <path d="M21 12a9 9 0 0 1-9 9" stroke="currentColor" strokeWidth="3" />
              </svg>
            )}
            {loading ? "Заходимо…" : "Увійти"}
          </button>

          <p className="text-xs text-slate-600">
            Продовжуючи, ви погоджуєтесь з{" "}
            <Link href="/terms" className="underline hover:text-slate-800">Умовами</Link> та{" "}
            <Link href="/privacy" className="underline hover:text-slate-800">Політикою конфіденційності</Link>.
          </p>
        </form>
      </div>
    </div>
  );
}
