import bcrypt from "bcryptjs";
import crypto from "crypto";
import { ObjectId } from "mongodb";
import getMongoClient from "./mongodb";

export const SESSION_COOKIE_NAME = "veichle_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

let indexesReady = false;

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

export function hashSessionToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function createSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

async function getDb() {
  const client = await getMongoClient();
  const dbName = process.env.MONGODB_DB || "veichle_homepage";
  return client.db(dbName);
}

async function ensureIndexes(db) {
  if (indexesReady) {
    return;
  }

  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  await db.collection("sessions").createIndex({ tokenHash: 1 }, { unique: true });
  await db.collection("sessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  await db.collection("authorizedEmails").createIndex({ email: 1 }, { unique: true });

  indexesReady = true;
}

function getConfiguredAdminEmails() {
  const raw = [process.env.ADMIN_EMAIL, process.env.ADMIN_EMAILS]
    .filter(Boolean)
    .join(",");

  return raw
    .split(",")
    .map((email) => normalizeEmail(email))
    .filter(Boolean);
}

async function hasAdminUser(db) {
  const admin = await db
    .collection("users")
    .findOne({ role: "admin" }, { projection: { _id: 1 } });

  return Boolean(admin);
}

async function resolveRoleForEmail(db, normalizedEmail, currentRole = "user") {
  const configuredAdminEmails = getConfiguredAdminEmails();

  if (configuredAdminEmails.includes(normalizedEmail)) {
    return "admin";
  }

  if (currentRole === "admin") {
    return "admin";
  }

  // Development-safe bootstrap: if no admin is configured and none exists, promote first account.
  if (configuredAdminEmails.length === 0) {
    const adminExists = await hasAdminUser(db);
    if (!adminExists) {
      return "admin";
    }
  }

  return currentRole || "user";
}

export async function registerUser({ name, email, password }) {
  const db = await getDb();
  await ensureIndexes(db);

  const normalizedEmail = normalizeEmail(email);
  const existingUser = await db.collection("users").findOne({ email: normalizedEmail });

  if (existingUser) {
    return { error: "Email already registered." };
  }

  const passwordHash = await hashPassword(password);
  const now = new Date();
  const role = await resolveRoleForEmail(db, normalizedEmail, "user");

  const result = await db.collection("users").insertOne({
    name: String(name || "").trim(),
    email: normalizedEmail,
    passwordHash,
    role,
    createdAt: now,
    updatedAt: now,
  });

  return {
    user: {
      id: result.insertedId.toString(),
      name: String(name || "").trim(),
      email: normalizedEmail,
      role,
    },
  };
}

export async function loginUser({ email, password }) {
  const db = await getDb();
  await ensureIndexes(db);

  const normalizedEmail = normalizeEmail(email);
  const user = await db.collection("users").findOne({ email: normalizedEmail });

  if (!user) {
    return { error: "Invalid email or password." };
  }

  const passwordOk = await verifyPassword(password, user.passwordHash);

  if (!passwordOk) {
    return { error: "Invalid email or password." };
  }

  const role = await resolveRoleForEmail(db, normalizedEmail, user.role || "user");

  if (role !== (user.role || "user")) {
    await db.collection("users").updateOne(
      { _id: user._id },
      { $set: { role, updatedAt: new Date() } }
    );
  }

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role,
    },
  };
}

export async function createSession(userId) {
  const db = await getDb();
  await ensureIndexes(db);

  const sessionToken = createSessionToken();
  const tokenHash = hashSessionToken(sessionToken);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await db.collection("sessions").insertOne({
    userId: new ObjectId(userId),
    tokenHash,
    createdAt: new Date(),
    expiresAt,
  });

  return { sessionToken, expiresAt };
}

export async function clearSession(sessionToken) {
  if (!sessionToken) {
    return;
  }

  const db = await getDb();
  await db.collection("sessions").deleteOne({ tokenHash: hashSessionToken(sessionToken) });
}

export async function getUserFromSessionToken(sessionToken) {
  if (!sessionToken) {
    return null;
  }

  const db = await getDb();
  await ensureIndexes(db);

  const session = await db.collection("sessions").findOne({
    tokenHash: hashSessionToken(sessionToken),
    expiresAt: { $gt: new Date() },
  });

  if (!session) {
    return null;
  }

  const user = await db.collection("users").findOne({ _id: session.userId });

  if (!user) {
    return null;
  }

  const role = await resolveRoleForEmail(
    db,
    normalizeEmail(user.email),
    user.role || "user"
  );

  if (role !== (user.role || "user")) {
    await db.collection("users").updateOne(
      { _id: user._id },
      { $set: { role, updatedAt: new Date() } }
    );
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role,
  };
}

export async function isEmailAuthorized(email) {
  const db = await getDb();
  await ensureIndexes(db);

  const normalizedEmail = normalizeEmail(email);
  const authorized = await db.collection("authorizedEmails").findOne({ email: normalizedEmail });

  return !!authorized;
}

export async function addAuthorizedEmail(email) {
  const db = await getDb();
  await ensureIndexes(db);

  const normalizedEmail = normalizeEmail(email);
  const now = new Date();

  const result = await db.collection("authorizedEmails").updateOne(
    { email: normalizedEmail },
    { $set: { email: normalizedEmail, createdAt: now, addedBy: "admin" } },
    { upsert: true }
  );

  return result;
}

export async function getAuthorizedEmails() {
  const db = await getDb();
  await ensureIndexes(db);

  const emails = await db.collection("authorizedEmails").find({}).toArray();

  return emails.map((doc) => ({ email: doc.email, createdAt: doc.createdAt }));
}

export async function syncGoogleUser({ email, name, image }) {
  const db = await getDb();
  await ensureIndexes(db);

  const normalizedEmail = normalizeEmail(email);

  const existingUser = await db.collection("users").findOne({ email: normalizedEmail });

  if (existingUser) {
    const role = await resolveRoleForEmail(db, normalizedEmail, existingUser.role || "user");

    if (role !== (existingUser.role || "user")) {
      await db.collection("users").updateOne(
        { _id: existingUser._id },
        { $set: { role, updatedAt: new Date() } }
      );
    }

    return {
      user: {
        id: existingUser._id.toString(),
        name: existingUser.name,
        email: existingUser.email,
        role,
      },
    };
  }

  return { error: "User not found. Please contact the administrator to create your account." };
}

export async function getCurrentUserFromRequest(request) {
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  return getUserFromSessionToken(sessionToken);
}

export function isAdminUser(user) {
  return Boolean(user && user.role === "admin");
}
