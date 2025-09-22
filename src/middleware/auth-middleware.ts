import { NextResponse, type NextRequest } from "next/server";

export function authMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get("accessToken");
  const refreshToken = req.cookies.get("refreshToken");

  // Check if user is logged in (has either access token or refresh token)
  const isLoggedIn = accessToken ?? refreshToken;

  if (!isLoggedIn && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth/v1/login", req.url));
  }

  if (isLoggedIn && (pathname === "/auth/login" || pathname === "/auth/v1/login")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}
