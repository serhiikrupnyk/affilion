import { NextRequest, NextResponse } from "next/server";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const apiRes = await fetch(`${API}/api/auth/signup`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await apiRes.text();
  try {
    const json = JSON.parse(text);
    return NextResponse.json(json, { status: apiRes.status });
  } catch {
    return new NextResponse(text, { status: apiRes.status });
  }
}
