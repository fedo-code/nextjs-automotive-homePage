import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../lib/admin-auth";
import {
  createFeaturedVehicle,
  deleteAllFeaturedVehicles,
  listFeaturedVehicles,
} from "../../../../lib/content";

export const runtime = "nodejs";

export async function GET(request) {
  const { errorResponse } = await requireAdmin(request);
  if (errorResponse) {
    return errorResponse;
  }

  try {
    const vehicles = await listFeaturedVehicles();
    return NextResponse.json({ vehicles }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to load featured vehicles." }, { status: 500 });
  }
}

export async function POST(request) {
  const { errorResponse } = await requireAdmin(request);
  if (errorResponse) {
    return errorResponse;
  }

  try {
    const payload = await request.json();
    const result = await createFeaturedVehicle(payload);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Featured vehicle created.", id: result.id },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Failed to create featured vehicle." }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { errorResponse } = await requireAdmin(request);
  if (errorResponse) {
    return errorResponse;
  }

  try {
    const result = await deleteAllFeaturedVehicles();
    return NextResponse.json(
      { message: "All featured vehicles deleted.", deletedCount: result.deletedCount },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: "Failed to delete featured vehicles." }, { status: 500 });
  }
}
