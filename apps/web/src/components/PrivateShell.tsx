"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, useEffect, useRef } from "react";

type Role = "admin" | "manager" | "affiliate";
type NavItem = { label: string; href: string; roles?: Role[] };
type NavGroup = { title: string; items: NavItem[]; roles?: Role[] };

export default function PrivateShell({
  email,
  role,
  children,
}: {
  email: string;
  role: Role;
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "/";
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [pathname]);

  const groups = useMemo<NavGroup[]>(() => {
    return [
      { title: "Робоча панель", items: [{ label: "Дашборд", href: "/dashboard" }] },
      {
        title: "Залучення",
        items: [
          { label: "Маркетплейс програм", href: "/dashboard/marketplace" },
          { label: "Заявки партнерів", href: "/dashboard/applications", roles: ["admin", "manager"] },
        ],
      },
      {
        title: "Партнери",
        items: [
          { label: "Усі партнери (вебі)", href: "/dashboard/affiliates", roles: ["admin", "manager"] },
          { label: "Мої лінки", href: "/dashboard/my-links", roles: ["affiliate"] },
        ],
      },
      {
        title: "Програми та оффери",
        items: [
          { label: "Програми", href: "/dashboard/programs", roles: ["admin", "manager"] },
          { label: "Оффери", href: "/dashboard/offers", roles: ["admin", "manager"] },
          { label: "Лінки", href: "/dashboard/links", roles: ["admin", "manager"] },
          { label: "Матеріали (Assets)", href: "/dashboard/assets", roles: ["admin", "manager"] },
        ],
      },
      {
        title: "Якість та модерація",
        items: [
          { label: "Черга рев’ю (антифрод)", href: "/dashboard/review", roles: ["admin", "manager"] },
          { label: "Правила якості", href: "/dashboard/rules", roles: ["admin"] },
        ],
      },
      { title: "Аналітика", items: [{ label: "Звіти ефективності", href: "/dashboard/reports" }] },
      {
        title: "Фінанси",
        items: [
          { label: "Виплати", href: "/dashboard/payouts" },
          { label: "Інвойси", href: "/dashboard/invoices", roles: ["admin", "manager"] },
        ],
      },
      {
        title: "Адміністрування",
        items: [
          { label: "Користувачі та ролі", href: "/admin/users", roles: ["admin"] },
          { label: "Налаштування", href: "/dashboard/settings", roles: ["admin", "manager"] },
        ],
      },
    ];
  }, []);

  return (
    // Незалежні скроли: верхній ряд — шапка; нижній — розкладка з overflow-hidden
    <div className="h-dvh grid grid-rows-[auto_1fr] bg-slate-100 text-slate-800 antialiased">
      {/* Топбар */}
      <header className="sticky top-0 z-40 border-b border-slate-300 bg-slate-200/80 backdrop-blur supports-[backdrop-filter]:bg-slate-200/70">
        <div className="mx-auto h-14 px-3 sm:px-4 lg:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden inline-flex items-center justify-center rounded-xl border border-slate-400 px-3 py-2 text-slate-800 hover:bg-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Відкрити меню"
            >
              <IconMenu />
            </button>

            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-2xl bg-indigo-600 text-white grid place-items-center font-bold shadow-sm">A</div>
              <div className="leading-tight">
                <div className="font-semibold tracking-tight">Affilion</div>
                <div className="text-[11px] text-slate-600">Affiliate CRM + Tracker</div>
              </div>
            </Link>

            <span className="hidden lg:inline-flex h-5 w-px bg-slate-400 mx-3" />
            <span className="hidden lg:block text-sm text-slate-700">
              {role === "admin" ? "Адмін-доступ" : role === "manager" ? "Менеджер" : "Партнер"}
            </span>
          </div>

          <AccountMenu email={email} role={role} />
        </div>
      </header>

      {/* Ряд контенту */}
      <div className="grid grid-cols-1 lg:grid-cols-[270px_1fr] gap-4 lg:gap-7 px-3 sm:px-4 lg:px-6 py-4 lg:py-6 overflow-hidden min-h-0">
        {/* Сайдбар: власний скрол */}
        <aside className="hidden lg:flex min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain scroll-area">
            <Sidebar groups={groups} role={role} pathname={pathname} />
          </div>
        </aside>

        {/* Контент: власний скрол */}
        <div className="min-h-0 overflow-y-auto overscroll-contain scroll-area">
          <main className="min-h-full rounded-3xl border border-slate-300 bg-slate-50 p-4 sm:p-6 lg:p-8 shadow-sm">
            {children}
          </main>
        </div>
      </div>

      {/* Мобільне меню (окрема прокрутка) */}
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <div className="p-4 border-b border-slate-300 bg-slate-200">
          <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <div className="h-8 w-8 rounded-2xl bg-indigo-600 text-white grid place-items-center font-bold">A</div>
            <div className="leading-tight">
              <div className="font-semibold">Affilion</div>
              <div className="text-[11px] text-slate-600">Affiliate CRM + Tracker</div>
            </div>
          </Link>
        </div>
        {/* Сайдбар всередині дровера теж зі своїм скролом */}
        <div className="scroll-area">
          <Sidebar groups={groups} role={role} pathname={pathname} />
        </div>
      </MobileDrawer>

      {/* Глобальний стиль для скролбарів */}
      <style jsx global>{`
        /* Базові кольори (світла тема, приглушено) */
        :root {
          --scroll-track: #e2e8f0; /* slate-200 */
          --scroll-thumb: #94a3b8; /* slate-400 */
          --scroll-thumb-hover: #6366f1; /* indigo-500 */
        }

        /* Тонкі, заокруглені скролбари */
        .scroll-area {
          scrollbar-width: thin; /* Firefox */
          scrollbar-color: var(--scroll-thumb) var(--scroll-track);
        }
        .scroll-area::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .scroll-area::-webkit-scrollbar-track {
          background: var(--scroll-track);
          border-radius: 999px;
        }
        .scroll-area::-webkit-scrollbar-thumb {
          background-color: var(--scroll-thumb);
          border-radius: 999px;
          border: 2px solid var(--scroll-track); /* створює «канал» у стилі Tailwind бордерів */
        }
        .scroll-area::-webkit-scrollbar-thumb:hover {
          background-color: var(--scroll-thumb-hover);
          border-color: var(--scroll-track);
        }
      `}</style>
    </div>
  );
}

/* =================== Sidebar =================== */

function Sidebar({
  groups,
  role,
  pathname,
}: {
  groups: NavGroup[];
  role: Role;
  pathname: string;
}) {
  return (
    <nav className="rounded-3xl border border-slate-300 bg-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-300 bg-gradient-to-b from-indigo-100 to-transparent">
        <div className="text-xs uppercase tracking-wide text-indigo-700/80">Навігація</div>
      </div>

      <div className="p-3 space-y-6">
        {groups.map((group) => {
          const visible = group.items.filter((i) => !i.roles || i.roles.includes(role));
          if (!visible.length) return null;

          return (
            <div key={group.title} className="space-y-2">
              <div className="px-2 text-[11px] uppercase tracking-wide text-slate-600">{group.title}</div>
              <ul className="space-y-1.5">
                {visible.map((item) => {
                  const active =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={[
                          "group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-colors",
                          active ? "bg-indigo-100 text-indigo-800" : "text-slate-800 hover:bg-slate-300",
                        ].join(" ")}
                      >
                        <span
                          aria-hidden
                          className={[
                            "absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full",
                            active ? "bg-indigo-500" : "bg-transparent",
                          ].join(" ")}
                        />
                        <span
                          aria-hidden
                          className={[
                            "h-1.5 w-1.5 rounded-full transition-colors",
                            active ? "bg-indigo-600" : "bg-slate-500 group-hover:bg-slate-600",
                          ].join(" ")}
                        />
                        <span className={active ? "font-medium" : ""}>{item.label}</span>
                        {active && (
                          <span className="ml-auto rounded-full bg-indigo-200 text-indigo-800 text-[10px] px-2 py-0.5">
                            активний
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

/* =================== Account Menu =================== */

function AccountMenu({ email, role }: { email: string; role: Role }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-2xl border border-slate-400 px-3 py-2 text-sm text-slate-800 hover:bg-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="hidden sm:block truncate max-w-[180px]">{email}</span>
        <span className="sm:hidden">Акаунт</span>
        <span className="h-2 w-2 rounded-full bg-indigo-500" aria-hidden />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-80 overflow-hidden rounded-3xl border border-slate-300 bg-slate-100 shadow-xl"
          role="menu"
        >
          <div className="px-4 py-3 border-b border-slate-300 bg-indigo-50">
            <div className="font-medium truncate">{email}</div>
            <div className="text-xs text-slate-600">Роль: {role}</div>
          </div>

          <div className="p-1">
            <MenuLink href="/dashboard/settings">Налаштування</MenuLink>
            {role === "admin" && <MenuLink href="/admin/users">Користувачі та ролі</MenuLink>}
          </div>

          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-300 border-t border-slate-300"
              role="menuitem"
            >
              Вийти
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function MenuLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block rounded-2xl px-3 py-2 text-sm text-slate-800 hover:bg-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      role="menuitem"
    >
      {children}
    </Link>
  );
}

/* =================== Mobile Drawer =================== */

function MobileDrawer({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={["fixed inset-0 z-50 lg:hidden", open ? "" : "pointer-events-none"].join(" ")}>
      <div
        onClick={onClose}
        className={[
          "absolute inset-0 bg-black/30 transition-opacity duration-200 ease-out",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />
      <div
        className={[
          "absolute left-0 top-0 bottom-0 w-[84vw] max-w-[340px] bg-slate-100 shadow-2xl border-r border-slate-300",
          "transition-transform duration-200 ease-out will-change-transform",
          open ? "translate-x-0" : "-translate-x-full",
          "rounded-r-3xl overflow-hidden",
        ].join(" ")}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between p-3 border-b border-slate-300 bg-slate-200">
          <span className="text-sm font-medium">Меню</span>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-xl border border-slate-400 px-2.5 py-1.5 hover:bg-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Закрити меню"
          >
            <IconX />
          </button>
        </div>
        <div className="h-[calc(100dvh-56px)] overflow-y-auto scroll-area">{children}</div>
      </div>
    </div>
  );
}

/* =================== Icons =================== */

function IconMenu(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props} aria-hidden="true">
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconX(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props} aria-hidden="true">
      <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
