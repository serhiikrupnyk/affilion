import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isSignedIn = req.cookies.has("access_token");
  const method = req.method;

  const isAuthSignin = pathname === "/auth/signin";
  const isAuthSignup = pathname === "/auth/signup";
  const isMainPage = pathname === "/";
  const isAuthPage   = isAuthSignin || isAuthSignup;

  // 1) Якщо юзер уже залогінений — НЕ пускаємо на публічні auth-сторінки (тільки GET)
  if (isSignedIn && isAuthPage && method === "GET") {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // 2) Якщо юзер НЕ залогінений — не пускаємо в приватні розділи
  if (!isSignedIn && pathname.startsWith("/dashboard")) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/signin";
    return NextResponse.redirect(url);
  }

  // 3) Усі інші запити (включно з POST /auth/signout) пропускаємо
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/signin",
    "/auth/signup",
    "/dashboard/:path*",
  ],
};
