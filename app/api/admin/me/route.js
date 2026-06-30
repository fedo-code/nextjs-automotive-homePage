import { NextResponse } from "next/server";
import { getAdminFromRequest } from "../../../../lib/admin-auth";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const admin = await getAdminFromRequest(request);

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ admin }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch admin." }, { status: 500 });
  }
}
