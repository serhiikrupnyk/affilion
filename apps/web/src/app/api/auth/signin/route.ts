import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function POST(req: NextRequest) {
  // Підтримуємо як form-encoded, так і JSON
  let email = "", password = "";
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await req.json();
    email = String(body.email || "");
    password = String(body.password || "");
  } else {
    const form = await req.formData();
    email = String(form.get("email") || "");
    password = String(form.get("password") || "");
  }

  const apiRes = await fetch(`${API}/api/auth/signin`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  // якщо невдало — повернемо на логін із query-помилкою
  if (!apiRes.ok) {
    const errText = await apiRes.text().catch(() => "");
    const url = new URL("/auth/signin", req.url);
    if (errText) url.searchParams.set("error", errText.slice(0, 140));
    return NextResponse.redirect(url, { status: 303 });
  }

  // забираємо Set-Cookie з бекенда та ставимо на 3000
  const anyHeaders = apiRes.headers as any;
  const list: string[] =
    (typeof anyHeaders.getSetCookie === "function" && anyHeaders.getSetCookie()) ||
    (apiRes.headers.get("set-cookie") ? [apiRes.headers.get("set-cookie") as string] : []);

  const res = NextResponse.redirect(new URL("/dashboard", req.url), { status: 303 });
  for (const c of list) res.headers.append("set-cookie", c);

  return res;
}
