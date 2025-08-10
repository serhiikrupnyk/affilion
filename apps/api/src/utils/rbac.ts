import type { preHandlerHookHandler } from "fastify";

export type Role = "admin" | "manager" | "affiliate";

export function requireRole(required: Role): preHandlerHookHandler {
  return async (req: any, reply: any) => {
    const role = req.user?.role as Role | undefined;
    if (required === "admin" && role !== "admin") {
      return reply.code(403).send({ ok: false, error: "Forbidden" });
    }
  };
}

export function requireAnyRole(roles: Role[]): preHandlerHookHandler {
  return async (req: any, reply: any) => {
    const role = req.user?.role as Role | undefined;
    if (!role || !roles.includes(role)) {
      return reply.code(403).send({ ok: false, error: "Forbidden" });
    }
  };
}
