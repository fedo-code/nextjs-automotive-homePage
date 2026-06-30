import { NextResponse } from "next/server";
import {
  getUserFromSessionToken,
  isAdminUser,
  SESSION_COOKIE_NAME,
} from "../../../../lib/auth";
import { getAuthApiError } from "../../../../lib/api-errors";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const user = await getUserFromSessionToken(sessionToken);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      {
        user: {
          ...user,
          role: user.role || "user",
          isAdmin: isAdminUser(user),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: getAuthApiError(error, "Failed to fetch user.") },
      { status: 500 }
    );
  }
}
