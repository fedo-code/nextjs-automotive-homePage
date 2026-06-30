import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE_NAME,
  verifyAdminSessionToken,
} from "./lib/admin-token";

async function hasValidAdminSession(token) {
  const payload = await verifyAdminSessionToken(token);
  return Boolean(payload?.sub);
}

export async function middleware(request) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  const isValid = await hasValidAdminSession(token);

  if (!isValid) {
    const redirectUrl = new URL(
      token ? "/admin?session=expired" : "/admin",
      request.url
    );

    const response = NextResponse.redirect(redirectUrl);

    if (token) {
      response.cookies.set({
        name: ADMIN_SESSION_COOKIE_NAME,
        value: "",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: new Date(0),
      });
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/admin/vehicles/:path*", "/admin/gallery/:path*"],
};
