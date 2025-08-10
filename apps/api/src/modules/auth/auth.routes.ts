// apps/api/src/modules/auth/auth.routes.ts
import { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken";
import { ENV } from "../../env";
import { parseCookies } from "../../utils/http";
import {
  signInHandler, signUpHandler, meHandler,
  refreshHandler, signOutHandler
} from "./auth.controller";

export async function authRoutes(app: FastifyInstance) {
  // читаємо токен з cookie header і верифікуємо вручну
  const guard = async (req: any, reply: any) => {
    try {
      const cookies = parseCookies(req);
      const token = cookies["access_token"];
      if (!token) return reply.code(401).send({ ok: false, error: "Unauthorized" });
      const payload = jwt.verify(token, ENV.JWT_ACCESS_SECRET) as any;
      // прокинемо користувача в req.user
      req.user = { id: payload.id, role: payload.role ?? "manager" };
    } catch {
      return reply.code(401).send({ ok: false, error: "Unauthorized" });
    }
  };

  app.post("/auth/signup",  signUpHandler);
  app.post("/auth/signin",  signInHandler);
  app.post("/auth/refresh", refreshHandler);
  app.post("/auth/signout", signOutHandler);

  app.get("/auth/me", { preHandler: [guard] }, meHandler);
}
