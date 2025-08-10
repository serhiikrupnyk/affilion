import { FastifyInstance } from "fastify";

export default async function apiRoutes(app: FastifyInstance) {
  app.get("/affiliates", async () => {
    return [{ id: 1, name: "Demo Affiliate", geos: "US,BR", sources: "facebook,tiktok" }];
  });

  app.post("/affiliates", async (req, res) => {
    // TODO: додамо валідацію + БД
    return res.code(201).send({ ok: true });
  });

  app.get("/offers", async () => {
    return [{ id: 1, name: "Nutra-X", payout: 35.0 }];
  });
}
