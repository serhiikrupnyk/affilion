import { FastifyInstance } from "fastify";
import cors from "@fastify/cors";

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

export async function corsPlugin(app: FastifyInstance) {
  await app.register(cors, {
    origin(origin, cb) {
      if (!origin) return cb(null, true); // curl/сервери без Origin
      if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
    methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    strictPreflight: false, // не валити, якщо щось нестандартне у preflight
  });

  // ДІАГНОСТИКА: подивимось, який Origin реально приходить
  app.addHook("onRequest", (req, _reply, done) => {
    app.log.info({ origin: req.headers.origin }, "Origin check");
    done();
  });

  // ЗАЛІЗОБЕТОН: додатково виставляємо заголовки на будь-яку відповідь
  app.addHook("onSend", (req, reply, payload, done) => {
    const origin = req.headers.origin;
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      reply.header("Access-Control-Allow-Origin", origin);
      reply.header("Vary", "Origin"); // важливо для кешів
      reply.header("Access-Control-Allow-Credentials", "true");
    }
    done();
  });
}
