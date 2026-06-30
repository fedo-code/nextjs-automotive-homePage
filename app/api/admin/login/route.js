import { NextResponse } from "next/server";
import {
  createAdminSession,
  loginAdmin,
  setAdminSessionCookie,
} from "../../../../lib/admin-auth";

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

    const result = await loginAdmin({ email, password });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    const { token, expiresAt } = await createAdminSession(result.admin);

    const response = NextResponse.json(
      {
        message: "Admin login successful.",
        admin: result.admin,
      },
      { status: 200 }
    );

    setAdminSessionCookie(response, token, expiresAt);
    return response;
  } catch {
    return NextResponse.json({ error: "Failed to login admin." }, { status: 500 });
  }
}
