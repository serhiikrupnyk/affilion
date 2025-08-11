"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

type Props = { signedIn: boolean };

// Публічні маршрути, де показуємо хедер
const PUBLIC_PREFIXES = ["/", "/auth", "/pricing", "/about"] as const;

export default function Header({ signedIn }: Props) {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // 1) Якщо користувач уже залогінений — хедер не показуємо
  if (signedIn) return null;

  // 2) Показуємо тільки на публічних
  const isPublic = PUBLIC_PREFIXES.some((p) =>
    p === "/"
      ? pathname === "/"
      : pathname === p || pathname.startsWith(`${p}/`)
  );
  if (!isPublic) return null;

  // закриття моб.меню по кліку поза/ESC
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const active = isActive(href);
    return (
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={[
          "px-3 py-2 rounded-xl text-sm transition-colors",
          active
            ? "bg-indigo-100 text-indigo-800"
            : "text-slate-700 hover:bg-slate-200",
        ].join(" ")}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-300 bg-slate-200/80 backdrop-blur supports-[backdrop-filter]:bg-slate-200/70">
      <div className="mx-auto max-w-7xl h-16 px-3 sm:px-4 lg:px-6 flex items-center justify-between">
        {/* Лого + бургер */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center rounded-xl border border-slate-400 px-3 py-2 text-slate-800 hover:bg-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Відкрити меню"
            aria-expanded={open}
            aria-controls="public-nav"
          >
            <IconMenu />
          </button>

          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-indigo-600 text-white grid place-items-center font-bold shadow-sm">
              A
            </div>
            <div className="leading-tight">
              <div className="font-semibold tracking-tight text-slate-900">
                Affilion
              </div>
              <div className="text-[11px] text-slate-600">
                Affiliate CRM + Tracker
              </div>
            </div>
          </Link>
        </div>

        {/* Навігація (desktop) */}
        <nav className="hidden lg:flex items-center gap-2">
          <NavLink href="/" label="Головна" />
          <NavLink href="/pricing" label="Ціни" />
          <NavLink href="/about" label="Про нас" />

          <div className="mx-2 h-5 w-px bg-slate-300" />

          <Link
            href="/auth/signin"
            className="px-4 py-2 rounded-xl border border-slate-400 text-slate-800 hover:bg-slate-300 text-sm transition-colors"
          >
            Увійти
          </Link>
          <Link
            href="/auth/signup"
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm shadow-sm hover:bg-indigo-700 transition-colors"
          >
            Спробувати безкоштовно
          </Link>
        </nav>

        {/* Порожній плейсхолдер для вирівнювання на мобайл */}
        <div className="lg:hidden w-9" />
      </div>

      {/* Мобільне меню */}
      {open && (
        <div
          ref={menuRef}
          id="public-nav"
          className="lg:hidden border-t border-slate-300 bg-slate-100"
        >
          <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-3">
            <div className="grid gap-2">
              <NavLink href="/" label="Головна" />
              <NavLink href="/pricing" label="Ціни" />
              <NavLink href="/about" label="Про нас" />
              <div className="h-2" />
              <Link
                href="/auth/signin"
                className="px-4 py-2 rounded-xl border border-slate-400 text-slate-800 hover:bg-slate-300 text-sm transition-colors"
                onClick={() => setOpen(false)}
              >
                Увійти
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm shadow-sm hover:bg-indigo-700 transition-colors"
                onClick={() => setOpen(false)}
              >
                Спробувати безкоштовно
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* ====== Іконка меню (inline) ====== */
function IconMenu(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props} aria-hidden="true">
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
