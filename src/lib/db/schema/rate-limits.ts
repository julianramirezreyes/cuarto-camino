import { bigint, index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

/**
 * Shared fixed-window counters for the assessment API (see
 * src/features/assessment/rate-limit-shared.ts). `key` is `<bucket>:<sha256(ip+salt)>`:
 * raw IPs are never stored. Updated by ONE atomic upsert per request.
 */
export const rateLimits = pgTable(
  "rate_limits",
  {
    key: text("key").primaryKey(),
    windowStart: timestamp("window_start", { withTimezone: true }).defaultNow().notNull(),
    count: integer("count").notNull().default(1),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("rate_limits_window_start_idx").on(t.windowStart)],
);

/**
 * Better Auth `rateLimit` model (storage: "database"). Export name MUST stay `rateLimit`
 * (the adapter resolves the model by this key); fields: key, count, lastRequest (epoch ms).
 */
export const rateLimit = pgTable(
  "auth_rate_limit",
  {
    id: uuid("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    key: text("key").notNull().unique(),
    count: integer("count").notNull(),
    lastRequest: bigint("last_request", { mode: "number" }).notNull(),
  },
  (t) => [index("auth_rate_limit_last_request_idx").on(t.lastRequest)],
);
