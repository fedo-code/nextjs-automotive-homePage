import { NextResponse } from "next/server";
import {
  createSession,
  loginUser,
  SESSION_COOKIE_NAME,
} from "../../../../lib/auth";
import { getAuthApiError } from "../../../../lib/api-errors";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!String(email || "").trim() || !String(password || "").trim()) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const result = await loginUser({ email, password });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    const { sessionToken, expiresAt } = await createSession(result.user.id);

    const response = NextResponse.json(
      {
        message: "Login successful.",
        user: result.user,
      },
      { status: 200 }
    );

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: expiresAt,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: getAuthApiError(error, "Failed to login.") },
      { status: 500 }
    );
  }
}
