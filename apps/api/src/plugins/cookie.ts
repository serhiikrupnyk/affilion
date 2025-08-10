import { FastifyInstance } from "fastify";
import cookie from "@fastify/cookie";
import { ENV } from "../env";

export async function cookiePlugin(app: FastifyInstance) {
  await app.register(cookie, {
    parseOptions: {
      domain: ENV.COOKIE_DOMAIN,
      secure: ENV.COOKIE_SECURE,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    }
  });
}
