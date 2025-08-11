// apps/web/src/app/admin/users/page.tsx
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import RoleForm from "./RoleForm";

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
  if (!res.ok) return null;
  return res.json();
}

async function getUsers() {
  const base = await getBaseUrl();
  const cookieHeader = (await cookies()).toString();
  const res = await fetch(`${base}/api/admin/users`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load users");
  return res.json();
}

function roleBadgeClasses(role: string) {
  switch (role) {
    case "admin":
      return "bg-indigo-100 text-indigo-800";
    case "manager":
      return "bg-emerald-100 text-emerald-800";
    case "affiliate":
      return "bg-slate-200 text-slate-800";
    default:
      return "bg-slate-200 text-slate-800";
  }
}

export default async function AdminUsersPage() {
  const me = await getMe();
  if (!me?.user || me.user.role !== "admin") redirect("/dashboard");

  const data = await getUsers();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Користувачі</h1>
          <p className="text-sm text-slate-600 mt-1">
            Керуйте ролями та доступами. Усі зміни застосовуються відразу.
          </p>
        </div>
        {Array.isArray(data?.users) && (
          <div className="rounded-xl border border-slate-300 bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
            Разом: <span className="font-medium">{data.users.length}</span>
          </div>
        )}
      </div>

      {/* Table Card */}
      <div className="rounded-3xl border border-slate-300 bg-white shadow-sm overflow-hidden">
        {/* Scroll container to avoid page scroll explosion */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr className="border-b border-slate-300">
                <th className="p-3 text-left font-medium">ID</th>
                <th className="p-3 text-left font-medium">Email</th>
                <th className="p-3 text-left font-medium">Роль</th>
                <th className="p-3 text-left font-medium">Дія</th>
              </tr>
            </thead>
            <tbody>
              {data.users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-slate-600">
                    Користувачів поки немає.
                  </td>
                </tr>
              ) : (
                data.users.map((u: any, idx: number) => (
                  <tr
                    key={u.id}
                    className={[
                      "border-t border-slate-200",
                      "hover:bg-slate-50 transition-colors",
                      idx % 2 === 1 ? "bg-slate-50/40" : "bg-white",
                    ].join(" ")}
                  >
                    <td className="p-3 text-slate-900">{u.id}</td>
                    <td className="p-3">
                      <div className="text-slate-900">{u.email}</div>
                      {u.name ? (
                        <div className="text-xs text-slate-500">{u.name}</div>
                      ) : null}
                    </td>
                    <td className="p-3">
                      <span
                        className={[
                          "inline-flex items-center rounded-full px-2 py-0.5 text-xs",
                          roleBadgeClasses(u.role),
                        ].join(" ")}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="inline-flex items-center gap-2">
                        <RoleForm id={u.id} current={u.role} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
