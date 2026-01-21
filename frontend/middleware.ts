import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Allow all routes - authentication is handled client-side via /api/auth/me
  return NextResponse.next();
}

// Keep matcher minimal or remove entirely
export const config = {
  matcher: [],
};
