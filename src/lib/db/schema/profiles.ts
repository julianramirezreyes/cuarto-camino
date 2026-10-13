import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps, uuidPk } from "./_shared";
import { user } from "./auth";

/**
 * Application profile, 1:1 with a Better Auth user. Kept separate so the auth tables
 * stay exactly as Better Auth expects. Deliberately minimal (data minimisation):
 * no birth date, gender, location or free-text biography.
 */
export const profiles = pgTable("profiles", {
  id: uuidPk(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  displayName: text("display_name"),
  locale: text("locale").notNull().default("es"),
  ...timestamps(),
});
export type Profile = typeof profiles.$inferSelect;
