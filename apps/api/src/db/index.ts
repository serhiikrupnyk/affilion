import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema"; // твій schema.ts поруч

// .env -> DATABASE_URL=postgres://user:pass@localhost:5432/affilion
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // optional:
  // ssl: { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema });
export type DB = typeof db;
