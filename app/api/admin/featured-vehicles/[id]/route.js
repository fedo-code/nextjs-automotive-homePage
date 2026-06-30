import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../../lib/admin-auth";
import { deleteFeaturedVehicle, updateFeaturedVehicle } from "../../../../../lib/content";

export const runtime = "nodejs";

async function getRouteId(context) {
  const params = await context?.params;
  return String(params?.id || "").trim();
}

export async function PATCH(request, context) {
  const { errorResponse } = await requireAdmin(request);
  if (errorResponse) {
    return errorResponse;
  }

  try {
    const id = await getRouteId(context);
    if (!id) {
      return NextResponse.json({ error: "Invalid vehicle id." }, { status: 400 });
    }

    const payload = await request.json();
    const result = await updateFeaturedVehicle(id, payload);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({ message: "Featured vehicle updated." }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to update featured vehicle." }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  const { errorResponse } = await requireAdmin(request);
  if (errorResponse) {
    return errorResponse;
  }

  try {
    const id = await getRouteId(context);
    if (!id) {
      return NextResponse.json({ error: "Invalid vehicle id." }, { status: 400 });
    }

    const result = await deleteFeaturedVehicle(id);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({ message: "Featured vehicle deleted." }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to delete featured vehicle." }, { status: 500 });
  }
}
