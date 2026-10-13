/**
 * Transaction-capable client over Neon's WebSocket driver (neon-serverless Pool).
 * Intended for scripts (seed, retention purge). Node >= 22 has a global WebSocket,
 * which @neondatabase/serverless uses automatically. Caller must `await close()`.
 */
import { Pool } from "@neondatabase/serverless";
import { drizzle, type NeonDatabase } from "drizzle-orm/neon-serverless";
import { requireDatabaseUrl } from "./env";
import * as schema from "./schema";

export type TransactionalDb = NeonDatabase<typeof schema>;

export function createTransactionalDb(
  env: Record<string, string | undefined> = process.env,
): { db: TransactionalDb; close: () => Promise<void> } {
  const pool = new Pool({ connectionString: requireDatabaseUrl(env) });
  return { db: drizzle({ client: pool, schema }), close: () => pool.end() };
}
