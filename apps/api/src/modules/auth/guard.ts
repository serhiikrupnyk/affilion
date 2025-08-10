import jwt from "jsonwebtoken";
import { ENV } from "../../env";
import { parseCookies } from "../../utils/http";

export const guard = async (req: any, reply: any) => {
  try {
    const cookies = parseCookies(req);
    const token = cookies["access_token"];
    if (!token) return reply.code(401).send({ ok: false, error: "Unauthorized" });
    const payload = jwt.verify(token, ENV.JWT_ACCESS_SECRET) as any;
    req.user = { id: payload.id, role: payload.role ?? "manager" };
  } catch {
    return reply.code(401).send({ ok: false, error: "Unauthorized" });
  }
};
