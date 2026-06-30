import { NextResponse } from "next/server";
import { getVehicleById } from "../../../../../lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    const vehicle = await getVehicleById(params.id);

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found." }, { status: 404 });
    }

    return NextResponse.json({ vehicle }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to load vehicle." }, { status: 500 });
  }
}
