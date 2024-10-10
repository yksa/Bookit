import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const isAuthenticated = false;

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/bookings"],
};
