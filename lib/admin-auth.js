import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import Admin from "../models/Admin";
import connectMongoose from "./mongoose";
import {
  ADMIN_SESSION_COOKIE_NAME,
  createAdminSessionToken,
  getAdminSessionExpiryDate,
  verifyAdminSessionToken,
} from "./admin-token";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function mapAdmin(adminDoc) {
  return {
    id: String(adminDoc._id),
    name: adminDoc.name,
    email: adminDoc.email,
    role: adminDoc.role || "admin",
    createdAt: adminDoc.createdAt,
    updatedAt: adminDoc.updatedAt,
  };
}

export async function registerAdmin({ name, email, password }) {
  await connectMongoose();

  const normalizedEmail = normalizeEmail(email);
  const existingAdmin = await Admin.findOne({ email: normalizedEmail }).lean();

  if (existingAdmin) {
    return { error: "Admin email already registered." };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await Admin.create({
    name: String(name || "").trim(),
    email: normalizedEmail,
    passwordHash,
    role: "admin",
  });

  return { admin: mapAdmin(admin) };
}

export async function loginAdmin({ email, password }) {
  await connectMongoose();

  const normalizedEmail = normalizeEmail(email);
  const admin = await Admin.findOne({ email: normalizedEmail });

  if (!admin) {
    return { error: "Invalid admin email or password." };
  }

  const passwordOk = await bcrypt.compare(password, admin.passwordHash);

  if (!passwordOk) {
    return { error: "Invalid admin email or password." };
  }

  return { admin: mapAdmin(admin) };
}

export async function createAdminSession(admin) {
  const token = await createAdminSessionToken(admin);
  const expiresAt = getAdminSessionExpiryDate();
  return { token, expiresAt };
}

export function setAdminSessionCookie(response, token, expiresAt) {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export function clearAdminSessionCookie(response) {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
}

export async function getAdminFromRequest(request) {
  const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  return getAdminFromSessionToken(sessionToken);
}

export async function getAdminFromSessionToken(sessionToken) {
  await connectMongoose();

  const payload = await verifyAdminSessionToken(sessionToken);

  if (!payload?.sub) {
    return null;
  }

  const admin = await Admin.findById(payload.sub).lean();

  if (!admin) {
    return null;
  }

  return mapAdmin(admin);
}

export async function requireAdmin(request) {
  const admin = await getAdminFromRequest(request);

  if (!admin) {
    return {
      errorResponse: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      admin: null,
    };
  }

  return { admin, errorResponse: null };
}
