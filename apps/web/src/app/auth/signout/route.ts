import { NextRequest, NextResponse } from "next/server";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function POST(req: NextRequest) {
  // прокидаємо кукі фронта → бекенд
  const apiRes = await fetch(`${API}/api/auth/signout`, {
    method: "POST",
    headers: { cookie: req.headers.get("cookie") || "" },
  });

  // очищаємо локальні кукі фронта (3000)
  const res = NextResponse.redirect(new URL("/auth/signin", req.url));
  res.cookies.set("access_token", "", { path: "/", maxAge: 0 });
  res.cookies.set("refresh_token", "", { path: "/", maxAge: 0 });
  return res;
}
