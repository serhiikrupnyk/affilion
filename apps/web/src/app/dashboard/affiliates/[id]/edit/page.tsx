import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import EditForm from "./ui/EditForm";
import { serverBaseUrl } from "@/lib/server"; // <= переконайся, що файл існує

async function getMe() {
  const base = await serverBaseUrl();
  const res = await fetch(`${base}/api/auth/me`, {
    headers: { cookie: (await cookies()).toString() },
    cache: "no-store",
  });
  if (res.status === 401) return null;
  if (!res.ok) return null;
  return res.json();
}

async function getAffiliate(id: string) {
  const base = await serverBaseUrl();
  const res = await fetch(`${base}/api/affiliates/${id}`, {
    headers: { cookie: (await cookies()).toString() },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function EditAffiliatePage(
  { params }: { params: Promise<{ id: string }> } // Next 15: params — async
) {
  const { id } = await params;

  const me = await getMe();
  if (!me?.user) redirect("/auth/signin");
  if (!["admin", "manager"].includes(me.user.role)) redirect("/dashboard");

  const data = await getAffiliate(id);
  if (!data?.affiliate) redirect("/dashboard/affiliates");

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold">Редагувати веб #{data.affiliate.id}</h1>
      <EditForm initial={data.affiliate} />
    </div>
  );
}
