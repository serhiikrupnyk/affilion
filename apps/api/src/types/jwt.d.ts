// apps/api/src/types/jwt.d.ts
import "@fastify/jwt";

declare module "@fastify/jwt" {
  // Що ми підписуємо в токені
  interface FastifyJWT {
    payload: { id: number; role: "admin" | "manager" | "viewer" };
    // Що отримаємо у req.user після verify()
    user: { id: number; role: "admin" | "manager" | "viewer" };
  }
}
