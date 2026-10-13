/**
 * Server-only database access.
 *
 * `server-only` is not installed, so this module guards at runtime instead. Never import
 * it from a Client Component and never read DATABASE_URL anywhere else: the env var has
 * no NEXT_PUBLIC_ prefix, so Next.js never inlines it into browser bundles.
 *
 * The client is created lazily on first use, so importing this module (for example
 * during `next build`) does not need DATABASE_URL or a network connection.
 *
 * Driver: neon-http. One HTTPS round trip per query, ideal for serverless request
 * handlers. It does NOT support interactive transactions (db.transaction() throws);
 * use createTransactionalDb() from ./transactional for scripts that need them.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { requireDatabaseUrl } from "./env";
import * as schema from "./schema";

export type Database = NeonHttpDatabase<typeof schema>;

let instance: Database | undefined;

export function getDb(): Database {
  if (typeof window !== "undefined") {
    throw new Error("getDb() is server-only and must not run in the browser.");
  }
  instance ??= drizzle({ client: neon(requireDatabaseUrl()), schema });
  return instance;
}

export { schema };
