import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Check for the auth token (stored in cookies)
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // 2. Logic: If logged in, don't allow access to "/"
  // Redirect them to "/chat" instead
  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  // 3. Logic: If NOT logged in, don't allow access to "/chat"
  // Redirect them back to the landing page "/"
  if (!token && pathname.startsWith("/chat")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// 4. Matcher: This tells Next.js which routes to run this code on
export const config = {
  matcher: ["/", "/chat/:path*"],
};
