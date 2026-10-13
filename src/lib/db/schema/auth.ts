import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { timestamps, uuidPk } from "./_shared";

/**
 * Better Auth core tables. Shape follows the Better Auth 1.7 core schema
 * (user / session / account / verification) with `advanced.database.generateId = "uuid"`,
 * so ids are native uuid columns. Export names MUST stay `user`, `session`, `account`,
 * `verification`: the drizzle adapter resolves models by these keys.
 *
 * Passwords: Better Auth stores a salted scrypt hash in `account.password` for the
 * credential provider. The application never reads or writes that column.
 */
export const user = pgTable("user", {
  id: uuidPk(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  ...timestamps(),
});

export const session = pgTable(
  "session",
  {
    id: uuidPk(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    ...timestamps(),
  },
  (t) => [
    index("session_user_id_idx").on(t.userId),
    index("session_expires_at_idx").on(t.expiresAt),
  ],
);

export const account = pgTable(
  "account",
  {
    id: uuidPk(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      withTimezone: true,
    }),
    scope: text("scope"),
    /** Managed exclusively by Better Auth (hash only). */
    password: text("password"),
    ...timestamps(),
  },
  (t) => [index("account_user_id_idx").on(t.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: uuidPk(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ...timestamps(),
  },
  (t) => [index("verification_identifier_idx").on(t.identifier)],
);
