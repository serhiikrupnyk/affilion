import Fastify from "fastify";
import { ENV } from "./env";
import { corsPlugin } from "./plugins/cors";
import { cookiePlugin } from "./plugins/cookie";
import { jwtPlugin } from "./plugins/jwt";
import { authRoutes } from "./modules/auth/auth.routes";
import { adminUsersRoutes } from "./modules/admin/users.routes";
import { linksRoutes } from "./modules/links/links.routes";
import { affiliatesRoutes } from "./modules/affiliates/affiliates.routes";

const ALLOWED_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"];

async function start() {
  const app = Fastify({ logger: true });

  // 1) CORS ПЕРШИМ
  await app.register(corsPlugin);

  // Діагностика origin (можна потім прибрати)
  app.addHook("onRequest", (req, _reply, done) => {
    app.log.info({ origin: req.headers.origin }, "Origin check");
    done();
  });

  // Додатково підставляємо CORS заголовки на всі відповіді (на всякий)
  app.addHook("onSend", (req, reply, payload, done) => {
    const origin = req.headers.origin;
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      reply.header("Access-Control-Allow-Origin", origin);
      reply.header("Access-Control-Allow-Credentials", "true");
      reply.header("Vary", "Origin");
    }
    done();
  });

  // 2) COOKIE
  //await app.register(cookiePlugin);

  // 3) JWT
  await app.register(jwtPlugin);

  // 4) РОУТИ
  await app.register(authRoutes, { prefix: "/api" });
  await app.register(adminUsersRoutes, { prefix: "/api" });
  await app.register(linksRoutes, { prefix: "/api" });
  await app.register(affiliatesRoutes, { prefix: "/api" });

  // Тестовий роут для перевірки setCookie
  app.get("/cookie-test", (req, reply) => {
    reply.setCookie("x_test", "1", { httpOnly: true, sameSite: "lax", path: "/" });
    return reply.send({ ok: true });
  });

  // health
  app.get("/health", async () => ({ ok: true, service: "api" }));

  // Вивести карту роутів у лог
  app.ready(err => {
    if (!err) console.log(app.printRoutes());
  });

  await app.listen({ port: ENV.API_PORT, host: "0.0.0.0" });
}
start();
