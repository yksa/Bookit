import { NextRequest, NextResponse } from "next/server";
import checkAuth from "./app/actions/checkAuth";

export async function middleware(req: NextRequest) {
  const { isAuthenticated } = await checkAuth();

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/bookings", "/rooms/add", "/rooms/my"],
};
