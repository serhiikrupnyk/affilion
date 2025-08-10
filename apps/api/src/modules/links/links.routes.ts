import { FastifyInstance } from "fastify";
import { db } from "../../db";
import { links } from "../../db/schema";
import { randomBytes } from "crypto";
import { requireAnyRole } from "../../utils/rbac";
import { authGuard } from "../auth/auth.guard";

function genUid() { return randomBytes(4).toString("hex"); }

export async function linksRoutes(app: FastifyInstance) {
  app.post("/links", { preHandler: [authGuard, requireAnyRole(["admin","manager"])] }, async (req) => {
    const body = req.body as any;
    const uid = genUid();
    const [row] = await db.insert(links).values({
      affiliateId: body.affiliateId,
      offerId: body.offerId,
      linkUid: uid,
      split: body.split ?? "100",
      utmTemplate: body.utmTemplate ?? "",
    }).returning();
    return { ok: true, link: row, trackUrl: `${process.env.PUBLIC_TRACK_URL || "http://localhost:4000"}/c?l=${uid}` };
  });
}
