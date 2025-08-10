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

export default async function AdminUsersPage() {
  const me = await getMe();
  if (!me?.user || me.user.role !== "admin") redirect("/dashboard");

  const data = await getUsers();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Користувачі</h1>
      <table className="w-full border rounded-xl">
        <thead>
          <tr className="text-left text-sm text-gray-600">
            <th className="p-3">ID</th>
            <th className="p-3">Email</th>
            <th className="p-3">Роль</th>
            <th className="p-3">Дія</th>
          </tr>
        </thead>
        <tbody>
          {data.users.map((u: any) => (
            <tr key={u.id} className="border-t">
              <td className="p-3">{u.id}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.role}</td>
              <td className="p-3">
                <RoleForm id={u.id} current={u.role} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}