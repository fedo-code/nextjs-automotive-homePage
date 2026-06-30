import { NextResponse } from "next/server";
import { registerUser, getAuthorizedEmails, addAuthorizedEmail } from "../../../../lib/auth";
import { getAuthApiError } from "../../../../lib/api-errors";
import { requireAdmin } from "../../../../lib/admin-auth";

export const runtime = "nodejs";

export async function GET(request) {
  const { errorResponse } = await requireAdmin(request);
  if (errorResponse) {
    return errorResponse;
  }

  try {
    const emails = await getAuthorizedEmails();
    return NextResponse.json({ emails }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: getAuthApiError(error, "Failed to fetch users.") },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const { errorResponse } = await requireAdmin(request);
  if (errorResponse) {
    return errorResponse;
  }

  try {
    const { name, email, password } = await request.json();

    if (!String(name || "").trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    if (!String(email || "").trim()) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    if (!String(password || "").trim() || String(password).length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const result = await registerUser({ name, email, password });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    await addAuthorizedEmail(email);

    return NextResponse.json(
      {
        message: "User created successfully.",
        user: result.user,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: getAuthApiError(error, "Failed to create user.") },
      { status: 500 }
    );
  }
}
