import { NextRequest, NextResponse } from "next/server";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// читаємо кукі фронта і передаємо їх у бекенд
export async function GET(req: NextRequest) {
  const apiRes = await fetch(`${API}/api/auth/me`, {
    headers: { cookie: req.headers.get("cookie") || "" },
    cache: "no-store",
  });

  const text = await apiRes.text();
  try {
    const json = JSON.parse(text);
    return NextResponse.json(json, { status: apiRes.status });
  } catch {
    return new NextResponse(text, { status: apiRes.status });
  }
}
