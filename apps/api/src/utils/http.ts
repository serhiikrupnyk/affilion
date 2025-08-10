import { serialize } from "cookie";

export function setCookie(reply: any, name: string, value: string, opts?: any) {
  const header = serialize(name, value, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    ...opts,
  });
  const prev = reply.getHeader ? reply.getHeader("Set-Cookie") : undefined;
  if (prev) {
    const list = Array.isArray(prev) ? prev.concat(header) : [prev as string, header];
    reply.header("Set-Cookie", list);
  } else {
    reply.header("Set-Cookie", header);
  }
}

export function clearCookie(reply: any, name: string) {
  // maxAge=0 видаляє куку
  setCookie(reply, name, "", { maxAge: 0 });
}

export function parseCookies(req: any): Record<string, string> {
  const header = req.headers?.cookie;
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const [k, ...v] = part.split("=");
    if (!k) continue;
    out[k.trim()] = decodeURIComponent(v.join("=") || "");
  }
  return out;
}
