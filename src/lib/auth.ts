import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import crypto from "crypto";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET environment variable is required in production");
    }
    console.warn("[auth] JWT_SECRET is not set — using insecure fallback for development only");
  }
  return secret || "dev-secret-change-me";
}
const COOKIE_NAME = "sintu_session";

export interface SessionUser {
  id: string;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createToken(user: SessionUser): string {
  return jwt.sign(user, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): SessionUser | null {
  try {
    return jwt.verify(token, getJwtSecret()) as SessionUser;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function requireAdmin(): Promise<SessionUser> {
  const session = await requireSession();
  if (session.role !== "ADMIN") throw new Error("Forbidden");
  return session;
}

export { COOKIE_NAME };

/** Generate a high-entropy verification token and return both the raw token and its SHA-256 hash. */
export function generateVerificationToken(): { token: string; tokenHash: string } {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  return { token, tokenHash };
}

/** Hash a raw verification token for storage/lookup. */
export function hashVerificationToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/** Returns a Date that is `hours` hours from now. */
export function tokenExpiresAt(hours = 24): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

