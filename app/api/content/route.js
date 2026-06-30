import { NextResponse } from "next/server";
import { getHomeContent } from "../../../lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const content = await getHomeContent();
    return NextResponse.json(content, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to load home content." }, { status: 500 });
  }
}
