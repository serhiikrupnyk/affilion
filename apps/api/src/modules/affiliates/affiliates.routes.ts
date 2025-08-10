import { FastifyInstance } from "fastify";
import { db } from "../../db";
import { affiliates } from "../../db/schema";
import { eq } from "drizzle-orm";
import { authGuard } from "../auth/auth.guard";
import { requireAnyRole } from "../../utils/rbac";

export async function affiliatesRoutes(app: FastifyInstance) {
  app.get("/affiliates", { preHandler: [authGuard, requireAnyRole(["admin","manager"])] }, async () => {
    const rows = await db.select().from(affiliates).orderBy(affiliates.id);
    return { ok: true, affiliates: rows };
  });

  app.post("/affiliates", { preHandler: [authGuard, requireAnyRole(["admin","manager"])] }, async (req) => {
    const b = req.body as any;
    const [row] = await db.insert(affiliates).values({
      name: b.name, email: b.email, status: b.status ?? "active",
      geos: b.geos ?? "", sources: b.sources ?? "", managerId: req.user.id,
    }).returning();
    return { ok: true, affiliate: row };
  });

  app.get("/affiliates/:id", { preHandler: [authGuard, requireAnyRole(["admin","manager"])] }, async (req, reply) => {
    const { id } = req.params as any;
    const [row] = await db.select().from(affiliates).where(eq(affiliates.id, Number(id)));
    if (!row) return reply.code(404).send({ ok:false, error:"Not found" });
    return { ok:true, affiliate: row };
  });

  app.patch("/affiliates/:id", { preHandler: [authGuard, requireAnyRole(["admin","manager"])] }, async (req, reply) => {
    const { id } = req.params as any; const b = req.body as any;
    const [row] = await db.update(affiliates).set({
      name: b.name, email: b.email, status: b.status, geos: b.geos, sources: b.sources, updatedAt: new Date(),
    }).where(eq(affiliates.id, Number(id))).returning();
    if (!row) return reply.code(404).send({ ok:false, error:"Not found" });
    return { ok:true, affiliate: row };
  });

  app.delete("/affiliates/:id", { preHandler: [authGuard, requireAnyRole(["admin","manager"])] }, async (req) => {
    const { id } = req.params as any;
    await db.delete(affiliates).where(eq(affiliates.id, Number(id)));
    return { ok:true };
  });
}
