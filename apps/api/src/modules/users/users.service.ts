import { db } from "../../plugins/db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";

export async function getUserById(id: number) {
  const rows = await db.select().from(users).where(eq(users.id, id));
  return rows[0] || null;
}
