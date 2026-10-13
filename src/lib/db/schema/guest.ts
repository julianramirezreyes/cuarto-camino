import {
  check,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { timestamps, uuidPk } from "./_shared";
import { user } from "./auth";

/**
 * Anonymous (guest) sessions. The browser holds a random 32-byte token in an httpOnly
 * cookie; the database stores ONLY its SHA-256 hash (hex, 64 chars), so a database leak
 * cannot be replayed as a cookie. `claimedByUserId` records the one-time claim into an
 * account; after that the guest token no longer grants anything.
 */
export const guestSessions = pgTable(
  "guest_sessions",
  {
    id: uuidPk(),
    tokenHash: text("token_hash").notNull().unique(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    claimedByUserId: uuid("claimed_by_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    claimedAt: timestamp("claimed_at", { withTimezone: true }),
    ...timestamps(),
  },
  (t) => [
    index("guest_sessions_expires_at_idx").on(t.expiresAt),
    index("guest_sessions_claimed_by_user_idx").on(t.claimedByUserId),
    check(
      "guest_sessions_token_hash_sha256_hex",
      sql`${t.tokenHash} ~ '^[0-9a-f]{64}$'`,
    ),
    check(
      "guest_sessions_claim_consistent",
      sql`${t.claimedByUserId} is null or ${t.claimedAt} is not null`,
    ),
  ],
);
export type GuestSession = typeof guestSessions.$inferSelect;
