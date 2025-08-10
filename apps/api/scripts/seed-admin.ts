import "dotenv/config";
import bcrypt from "bcrypt";
import { db } from "../src/db";           
import { users } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const email = process.env.ADMIN_EMAIL!;
  const password = process.env.ADMIN_PASSWORD!;
  if (!email || !password) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD");

  const [existing] = await db.select().from(users).where(eq(users.email, email));
  const passwordHash = await bcrypt.hash(password, 10);

  if (!existing) {
    await db.insert(users).values({ email, passwordHash, role: "admin" });
    console.log("✅ Admin created:", email);
  } else {
    await db.update(users).set({ role: "admin", passwordHash }).where(eq(users.id, existing.id));
    console.log("♻️ Admin updated:", email);
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
