import { FastifyInstance } from "fastify";
import fastifyJwt from "@fastify/jwt";
import { ENV } from "../env";

export async function jwtPlugin(app: FastifyInstance) {
  await app.register(fastifyJwt, {
    secret: {
      private: ENV.JWT_ACCESS_SECRET,
      public: ENV.JWT_ACCESS_SECRET,
    },
    cookie: {
      cookieName: "access_token",
      signed: false,
    },
    sign: { expiresIn: ENV.JWT_ACCESS_EXPIRES },
  });

  // Робочий гард
  const authGuard = async (req: any, reply: any) => {
    try {
      await req.jwtVerify();
    } catch {
      return reply.code(401).send({ ok: false, error: "Unauthorized" });
    }
  };

  // Можна й далі декорувати, якщо треба
  app.decorate("authenticate", authGuard);
  // А ще — зручно зберегти у інстансі для імпорту з роутів:
  (app as any).authGuard = authGuard;
}

// (опційно) додай тип, якщо хочеш:
declare module "fastify" {
  interface FastifyInstance {
    authenticate: (req: any, reply: any) => Promise<void>;
    authGuard?: (req: any, reply: any) => Promise<void>;
  }
  interface FastifyRequest {
    user?: { id: number; role: string };
  }
}
