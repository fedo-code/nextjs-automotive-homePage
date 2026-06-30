import { NextResponse } from "next/server";
import { clearSession, SESSION_COOKIE_NAME } from "../../../../lib/auth";
import { getAuthApiError } from "../../../../lib/api-errors";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (sessionToken) {
      await clearSession(sessionToken);
    }

    const response = NextResponse.json({ message: "Logged out." }, { status: 200 });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: "",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: getAuthApiError(error, "Failed to logout.") },
      { status: 500 }
    );
  }
}
