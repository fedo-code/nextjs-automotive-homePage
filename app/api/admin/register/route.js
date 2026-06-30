import { NextResponse } from "next/server";
import {
  createAdminSession,
  registerAdmin,
  setAdminSessionCookie,
} from "../../../../lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!String(name || "").trim() || !String(email || "").trim() || !String(password || "").trim()) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    const result = await registerAdmin({ name, email, password });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const { token, expiresAt } = await createAdminSession(result.admin);
    const response = NextResponse.json(
      {
        message: "Admin registration successful.",
        admin: result.admin,
      },
      { status: 201 }
    );

    setAdminSessionCookie(response, token, expiresAt);
    return response;
  } catch {
    return NextResponse.json({ error: "Failed to register admin." }, { status: 500 });
  }
}
