import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  if (!host) throw new Error("No host header");
  return `${proto}://${host}`;
}

async function getMe() {
  const base = await getBaseUrl();
  const cookieHeader = (await cookies()).toString();
  const res = await fetch(`${base}/api/auth/me`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`ME failed: ${res.status}`);
  return res.json();
}

export default async function DashboardPage() {
  const me = await getMe();
  if (!me?.user) redirect("/auth/signin");

  const { id, role } = me.user as { id: number; role: string };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Дашборд</h1>
        <form action="/auth/signout" method="post">
          <button className="px-4 py-2 rounded-xl border hover:bg-gray-50">Вийти</button>
        </form>
      </header>

      <section className="rounded-2xl border p-5">
        <div className="text-gray-700">
          Ви увійшли як <b>#{id}</b> · роль: <b>{role}</b>
        </div>
      </section>
    </div>
  );
}
