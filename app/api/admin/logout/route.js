import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "../../../../lib/admin-auth";

export const runtime = "nodejs";

export async function POST() {
  try {
    const response = NextResponse.json({ message: "Admin logout successful." }, { status: 200 });
    clearAdminSessionCookie(response);
    return response;
  } catch {
    return NextResponse.json({ error: "Failed to logout admin." }, { status: 500 });
  }
}
