import { NextResponse } from "next/server";
import { addAuthorizedEmail, getAuthorizedEmails } from "../../../../lib/auth";
import { getAuthApiError } from "../../../../lib/api-errors";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const emails = await getAuthorizedEmails();
    return NextResponse.json({ emails }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: getAuthApiError(error, "Failed to fetch authorized emails.") },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!String(email || "").trim()) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    await addAuthorizedEmail(email);

    return NextResponse.json(
      { message: "Email authorized successfully." },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: getAuthApiError(error, "Failed to authorize email.") },
      { status: 500 }
    );
  }
}
