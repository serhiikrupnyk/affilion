import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { serverBaseUrl } from "@/lib/server";

async function getMe() {
  const base = await serverBaseUrl();
  const res = await fetch(`${base}/api/auth/me`, {
    headers: { cookie: (await cookies()).toString() },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

async function getAffiliates() {
  const base = await serverBaseUrl();
  const res = await fetch(`${base}/api/affiliates`, {
    headers: { cookie: (await cookies()).toString() },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load");
  return res.json();
}

export default async function AffiliatesPage() {
  const me = await getMe();
  if (!me?.user) redirect("/auth/signin");
  if (!["admin", "manager"].includes(me.user.role)) redirect("/dashboard");

  const data = await getAffiliates();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Вебі</h1>
        <Link href="/dashboard/affiliates/new" className="px-3 py-2 rounded-lg border">
          Додати
        </Link>
      </div>

      <table className="w-full border rounded-xl">
        <thead>
          <tr className="text-left text-sm text-gray-600">
            <th className="p-3">ID</th>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Status</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {data.affiliates.map((a: any) => (
            <tr key={a.id} className="border-t">
              <td className="p-3">{a.id}</td>
              <td className="p-3">{a.name}</td>
              <td className="p-3">{a.email}</td>
              <td className="p-3">{a.status}</td>
              <td className="p-3">
                <Link href={`/dashboard/affiliates/${a.id}/edit`} className="underline">
                  Редагувати
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
