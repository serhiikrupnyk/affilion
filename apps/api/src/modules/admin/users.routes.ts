import { FastifyInstance } from "fastify";
import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { requireRole } from "../../utils/rbac";
import { guard } from "../auth/guard"; // 👈 ДОДАВ

export async function adminUsersRoutes(app: FastifyInstance) {
  app.get("/admin/users", { preHandler: [guard, requireRole("admin")] }, async () => {
    const rows = await db.select({
      id: users.id, email: users.email, role: users.role, createdAt: users.createdAt,
    }).from(users).orderBy(users.id);
    return { ok: true, users: rows };
  });

  app.patch("/admin/users/:id/role", { preHandler: [guard, requireRole("admin")] }, async (req, reply) => {
    const { id } = req.params as any;
    const { role } = req.body as any;
    if (!["admin","manager","affiliate"].includes(role)) {
      return reply.code(400).send({ ok: false, error: "Invalid role" });
    }
    await db.update(users).set({ role }).where(eq(users.id, Number(id)));
    return { ok: true };
  });
}
