import {
  boolean,
  check,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { exactlyOneNotNull, uuidPk } from "./_shared";
import { user } from "./auth";
import { guestSessions } from "./guest";

export const CONSENT_PURPOSES = [
  "assessment_processing",
  "result_retention",
] as const;
export const consentPurpose = pgEnum("consent_purpose", CONSENT_PURPOSES);

/**
 * Append-only consent log (proof of what was agreed, to which policy version, when).
 * Subject is a user OR a guest session. Cascades with the subject so that deleting
 * the data also removes the log. Claiming a guest moves its rows to the user.
 */
export const consentRecords = pgTable(
  "consent_records",
  {
    id: uuidPk(),
    userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
    guestSessionId: uuid("guest_session_id").references(
      () => guestSessions.id,
      {
        onDelete: "cascade",
      },
    ),
    purpose: consentPurpose("purpose").notNull(),
    granted: boolean("granted").notNull(),
    policyVersion: text("policy_version").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    check(
      "consent_records_single_subject",
      exactlyOneNotNull("user_id", "guest_session_id"),
    ),
    index("consent_records_user_idx").on(t.userId),
    index("consent_records_guest_session_idx").on(t.guestSessionId),
  ],
);
export type ConsentRecord = typeof consentRecords.$inferSelect;
