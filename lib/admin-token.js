import { jwtVerify, SignJWT } from "jose";

export const ADMIN_SESSION_COOKIE_NAME = "veichle_admin_session";

function getAdminSessionMaxAgeSeconds() {
  const parsedSeconds = Number(process.env.ADMIN_SESSION_TIMEOUT_SECONDS);
  const safeSeconds = Number.isFinite(parsedSeconds) && parsedSeconds > 0
    ? parsedSeconds
    : null;

  if (safeSeconds !== null) {
    return Math.floor(safeSeconds);
  }

  if (process.env.NODE_ENV !== "production") {
    return 10;
  }

  const parsedMinutes = Number(process.env.ADMIN_SESSION_TIMEOUT_MINUTES);
  const safeMinutes = Number.isFinite(parsedMinutes) && parsedMinutes > 0
    ? parsedMinutes
    : 30;

  return Math.floor(safeMinutes * 60);
}

const ADMIN_SESSION_MAX_AGE_SECONDS = getAdminSessionMaxAgeSeconds();

function getAdminJwtSecret() {
  const secret =
    process.env.ADMIN_JWT_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "change_me_admin_jwt_secret";

  return new TextEncoder().encode(secret);
}

export function getAdminSessionExpiryDate() {
  return new Date(Date.now() + ADMIN_SESSION_MAX_AGE_SECONDS * 1000);
}

export async function createAdminSessionToken(admin) {
  const sessionExpiresAtMs = Date.now() + ADMIN_SESSION_MAX_AGE_SECONDS * 1000;

  return new SignJWT({
    email: admin.email,
    name: admin.name,
    role: admin.role || "admin",
    sessionExpiresAtMs,
    
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(admin.id))
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SESSION_MAX_AGE_SECONDS}s`)
    .sign(getAdminJwtSecret());
}

export async function verifyAdminSessionToken(token) {
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getAdminJwtSecret());

    const sessionExpiresAtMs = Number(payload?.sessionExpiresAtMs);
    if (!Number.isFinite(sessionExpiresAtMs)) {
      return null;
    }

    if (Date.now() >= sessionExpiresAtMs) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
