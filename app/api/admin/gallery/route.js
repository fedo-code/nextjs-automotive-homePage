import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../lib/admin-auth";
import {
  createGalleryPhoto,
  deleteAllGalleryPhotos,
  listGalleryPhotos,
} from "../../../../lib/content";

export const runtime = "nodejs";

export async function GET(request) {
  const { errorResponse } = await requireAdmin(request);
  if (errorResponse) {
    return errorResponse;
  }

  try {
    const photos = await listGalleryPhotos();
    return NextResponse.json({ photos }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to load gallery." }, { status: 500 });
  }
}

export async function POST(request) {
  const { errorResponse } = await requireAdmin(request);
  if (errorResponse) {
    return errorResponse;
  }

  try {
    const payload = await request.json();
    const result = await createGalleryPhoto(payload);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Gallery photo created.", id: result.id },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Failed to create gallery photo." }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { errorResponse } = await requireAdmin(request);
  if (errorResponse) {
    return errorResponse;
  }

  try {
    const result = await deleteAllGalleryPhotos();
    return NextResponse.json(
      { message: "All gallery photos deleted.", deletedCount: result.deletedCount },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: "Failed to delete gallery photos." }, { status: 500 });
  }
}
