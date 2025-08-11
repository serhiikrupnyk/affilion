import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { serverBaseUrl } from "@/lib/server";
import PrivateShell from "@/components/PrivateShell";

export const dynamic = "force-dynamic";

async function getMe() {
  const base = await serverBaseUrl();
  const res = await fetch(`${base}/api/auth/me`, {
    headers: { cookie: (await cookies()).toString() },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const me = await getMe();
  if (!me?.user) redirect("/auth/signin");
  if (me.user.role !== "admin") redirect("/dashboard");

  return (
    <PrivateShell email={me.user.email ?? `user#${me.user.id}`} role={me.user.role}>
      {children}
    </PrivateShell>
  );
}
