import { NextResponse } from "next/server";
import { registerUser } from "../../../../lib/auth";
import { getAuthApiError } from "../../../../lib/api-errors";

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

    const result = await registerUser({ name, email, password });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const response = NextResponse.json(
      {
        message: "Registration successful.",
        user: result.user,
      },
      { status: 201 }
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: getAuthApiError(error, "Failed to register.") },
      { status: 500 }
    );
  }
}
