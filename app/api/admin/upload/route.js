import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../lib/admin-auth";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;

const MIME_TO_EXTENSION = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

export async function POST(request) {
  const { errorResponse } = await requireAdmin(request);
  if (errorResponse) {
    return errorResponse;
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file.arrayBuffer !== "function" || typeof file.type !== "string") {
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    const extension = MIME_TO_EXTENSION[file.type];
    if (!extension) {
      return NextResponse.json({ error: "Only jpg, png, webp, avif, and gif files are allowed." }, { status: 400 });
    }

    if (file.size <= 0) {
      return NextResponse.json({ error: "Uploaded file is empty." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Image is too large. Max size is 8MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "admin");
    const absolutePath = path.join(uploadDir, fileName);

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(absolutePath, buffer);

    return NextResponse.json(
      {
        message: "Image uploaded.",
        url: `/uploads/admin/${fileName}`,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Failed to upload image." }, { status: 500 });
  }
}
