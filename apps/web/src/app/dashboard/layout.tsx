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
  if (res.status === 401) return null;
  if (!res.ok) throw new Error("ME failed");
  return res.json();
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const me = await getMe();
  if (!me?.user) redirect("/auth/signin");

  return (
    <PrivateShell
      email={me.user.email ?? `user#${me.user.id}`}
      role={me.user.role}
    >
      {children}
    </PrivateShell>
  );
}
