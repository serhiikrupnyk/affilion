import { headers } from "next/headers";

export async function serverBaseUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  if (!host) throw new Error("No host header");
  return `${proto}://${host}`;
}
