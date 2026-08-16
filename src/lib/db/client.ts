import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let cached: ReturnType<typeof drizzle<typeof schema>> | null = null;

/**
 * Lazy on purpose: importing this module must stay safe even when no
 * Postgres is provisioned yet (e.g. `next build`, or local dev before the
 * Vercel Postgres env vars are filled in). Only route handlers that
 * actually touch the database should call this.
 */
export function getDb() {
  if (cached) return cached;

  const connectionString = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "No database connection string set. Add POSTGRES_URL (Vercel Postgres) " +
        "or DATABASE_URL to .env.local — see docs/architecture.md#booking-database.",
    );
  }

  const sql = neon(connectionString);
  cached = drizzle(sql, { schema });
  return cached;
}
