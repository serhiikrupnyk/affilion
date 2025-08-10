import { NextRequest, NextResponse } from "next/server";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> } // 👈 асинхронні params
) {
  const { id } = await ctx.params;              // 👈 чекаємо params
  const res = await fetch(`${API}/api/affiliates/${id}`, {
    headers: { cookie: req.headers.get("cookie") || "" },
    cache: "no-store",
  });
  const text = await res.text();
  try { return NextResponse.json(JSON.parse(text), { status: res.status }); }
  catch { return new NextResponse(text, { status: res.status }); }
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const body = await req.text();
  const res = await fetch(`${API}/api/affiliates/${id}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      cookie: req.headers.get("cookie") || "",
    },
    body,
  });
  const text = await res.text();
  try { return NextResponse.json(JSON.parse(text), { status: res.status }); }
  catch { return new NextResponse(text, { status: res.status }); }
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const res = await fetch(`${API}/api/affiliates/${id}`, {
    method: "DELETE",
    headers: { cookie: req.headers.get("cookie") || "" },
  });
  const text = await res.text();
  try { return NextResponse.json(JSON.parse(text), { status: res.status }); }
  catch { return new NextResponse(text, { status: res.status }); }
}
