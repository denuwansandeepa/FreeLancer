import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("skilllanka_token")?.value;
  const { pathname } = request.nextUrl;

  // 1. If user is NOT logged in, restrict access to dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 2. If user IS logged in, restrict access to login/register pages
  if (pathname === "/login" || pathname === "/register") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// Specify the paths where this proxy should run
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
