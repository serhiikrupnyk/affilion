import { FastifyReply, FastifyRequest } from "fastify";
import { SignUpSchema, SignInSchema } from "./auth.schema";
import { createUser, verifyUserPassword, signAccessToken, signRefreshToken, storeRefreshToken, revokeRefreshToken, isRefreshRevoked } from "./auth.service";
import { ENV } from "../../env";
import jwt from "jsonwebtoken";
import { setCookie, clearCookie, parseCookies } from "../../utils/http";

export async function signUpHandler(req: FastifyRequest, reply: FastifyReply) {
  const body = SignUpSchema.parse(req.body);
  const user = await createUser(body.email, body.password, body.role ?? "manager");
  return reply.code(201).send({ ok: true, user: { id: user.id, email: user.email, role: user.role } });
}

export async function signInHandler(req: FastifyRequest, reply: FastifyReply) {
  const { email, password } = SignInSchema.parse(req.body);
  const user = await verifyUserPassword(email, password);
  if (!user) return reply.code(401).send({ ok: false, error: "Invalid credentials" });

  const access = signAccessToken({ id: user.id, role: user.role });
  const refresh = signRefreshToken({ id: user.id });
  const refreshDecoded = jwt.decode(refresh) as any;
  const expMs = (refreshDecoded?.exp ?? 0) * 1000;
  await storeRefreshToken(user.id, refresh, new Date(expMs));

  // httpOnly cookies
  setCookie(reply, "access_token", access, { maxAge: 60 * 15 });
  setCookie(reply, "refresh_token", refresh, { maxAge: 60 * 60 * 24 * 30 });

  return reply.send({ ok: true, user: { id: user.id, email: user.email, role: user.role } });
}

export async function meHandler(req: FastifyRequest, reply: FastifyReply) {
  // req.user проставляє jwtPlugin через req.jwtVerify (коли access_token валідний)
  return reply.send({ ok: true, user: req.user });
}

export async function refreshHandler(req: FastifyRequest, reply: FastifyReply) {
  const cookies = parseCookies(req);
  const refresh = cookies["refresh_token"];
  if (!refresh) return reply.code(401).send({ ok: false, error: "No refresh" });

  try {
    const revoked = await isRefreshRevoked(refresh);
    if (revoked) return reply.code(401).send({ ok: false, error: "Refresh revoked" });

    const payload = jwt.verify(refresh, ENV.JWT_REFRESH_SECRET) as any;
    const access = signAccessToken({ id: payload.id, role: payload.role ?? "manager" });
    setCookie(reply, "access_token", access, { maxAge: 60 * 15 });
    return reply.send({ ok: true });
  } catch {
    return reply.code(401).send({ ok: false, error: "Invalid refresh" });
  }
}

export async function signOutHandler(req: FastifyRequest, reply: FastifyReply) {
  const cookies = parseCookies(req);
  const refresh = cookies["refresh_token"];
  if (refresh) await revokeRefreshToken(refresh);
  clearCookie(reply, "access_token");
  clearCookie(reply, "refresh_token");
  return reply.send({ ok: true });
}
