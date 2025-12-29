// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  // protect factory routes
  if (
    pathname.startsWith("/factory") &&
    !pathname.startsWith("/factory/login") &&
    !pathname.startsWith("/factory/register")
  ) {
    if (!token) {
      return NextResponse.redirect(
        new URL("/factory/login", req.url)
      );
    }
  }
}
