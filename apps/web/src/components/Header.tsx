"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = { signedIn: boolean };

// Які маршрути вважаємо публічними (де Header може з'являтись)
const PUBLIC_PREFIXES = ["/", "/auth"]; // головна + весь /auth

export default function Header({ signedIn }: Props) {
  const pathname = usePathname();
  // 1) Якщо користувач уже залогінений — хедер не показуємо ніде
  if (signedIn) return null;

  // 2) Якщо це НЕ публічний маршрут — хедер не показуємо
  const isPublic = PUBLIC_PREFIXES.some((p) =>
    pathname === p || pathname.startsWith(p === "/" ? "/" : `${p}`)
  );
  if (!isPublic) return null;
  
  const link = (href: string, label: string) => (
    <Link
      href={href}
      className={`px-3 py-2 rounded-lg hover:bg-gray-100 ${
        pathname === href ? "text-black" : "text-gray-600"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="flex items-center justify-between py-4">
      <Link href="/" className="text-xl font-semibold">Affilion</Link>
      <nav className="flex gap-2">
        {link("/", "Головна")}
        {link("/pricing", "Ціни")}
        {link("/about", "Про нас")}
        <Link
          href="/auth/signin"
          className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700"
        >
          Увійти
        </Link>
        <Link
          href="/auth/signup"
          className="px-4 py-2 rounded-xl bg-black text-white"
        >
          Спробувати безкоштовно
        </Link>
      </nav>
    </header>
  );
}
