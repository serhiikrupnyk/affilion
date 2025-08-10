import { FastifyInstance } from "fastify";
import { nanoid } from "nanoid";

export default async function trackerRoutes(app: FastifyInstance) {
  // Click endpoint
  app.get("/c", async (req, res) => {
    const q = req.query as any;
    const cid = q.cid || nanoid(12);
    const target = process.env.TRACKER_DEFAULT_REDIRECT || "https://example.com";

    app.log.info({ type: "click", cid, q });

    const url = new URL(target);
    url.searchParams.set("cid", cid);
    return res.redirect(url.toString(), 302);
  });

  // Postback endpoint
  app.get("/postback", async (req, res) => {
    const q = req.query as any;
    const { cid, payout = 0, status = "approved" } = q;
    if (!cid) return res.code(400).send({ ok: false, error: "cid required" });

    app.log.info({ type: "postback", cid, payout: Number(payout), status });

    return { ok: true };
  });
}
