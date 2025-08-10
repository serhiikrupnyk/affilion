import { db } from "../../plugins/db";
import { users, refreshTokens } from "../../db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword } from "../../utils/password";
import { ENV } from "../../env";
import { sign, verify, decode, type JwtPayload, type Secret, type SignOptions } from "jsonwebtoken";

const ACCESS_SECRET: Secret = ENV.JWT_ACCESS_SECRET;           // string сумісний із Secret
const REFRESH_SECRET: Secret = ENV.JWT_REFRESH_SECRET;

const ACCESS_EXPIRES: SignOptions["expiresIn"] = ENV.JWT_ACCESS_EXPIRES as any;   // string | number
const REFRESH_EXPIRES: SignOptions["expiresIn"] = ENV.JWT_REFRESH_EXPIRES as any;

export async function createUser(email: string, password: string, role = "manager") {
  const passwordHash = await hashPassword(password);
  const [u] = await db.insert(users).values({ email, passwordHash, role }).returning();
  return u;
}

export async function findUserByEmail(email: string) {
  const rows = await db.select().from(users).where(eq(users.email, email));
  return rows[0] || null;
}

export function signAccessToken(payload: any) {
  return sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}

export function signRefreshToken(payload: any) {
  return sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}

export async function storeRefreshToken(userId: number, token: string, expiresAt: Date) {
  await db.insert(refreshTokens).values({ userId, token, expiresAt });
}

export async function revokeRefreshToken(token: string) {
  await db.update(refreshTokens).set({ isRevoked: true }).where(eq(refreshTokens.token, token));
}

export async function isRefreshRevoked(token: string) {
  const rows = await db.select().from(refreshTokens).where(eq(refreshTokens.token, token));
  return rows[0]?.isRevoked ?? true;
}

export async function verifyUserPassword(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const ok = await verifyPassword(password, user.passwordHash);
  return ok ? user : null;
}
