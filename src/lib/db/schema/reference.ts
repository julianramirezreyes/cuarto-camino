import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  smallint,
  text,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { timestamps, uuidPk } from "./_shared";

/**
 * Structural reference tables. They hold STRUCTURE and KEYS only (which types exist,
 * how they connect). All editorial text lives in typed files under src/content, so
 * wording can be reviewed and versioned in git without migrations.
 * Rows are seeded idempotently by scripts/seed.ts from src/domain/enneagram/structure.ts.
 */

export const connectionKind = pgEnum("enneagram_connection_kind", [
  "integration",
  "stress",
]);
export const triadKind = pgEnum("enneagram_triad_kind", [
  "center",
  "hornevian",
  "harmonic",
]);
export const instinct = pgEnum("instinct", ["sp", "so", "sx"]);
export const sourceKind = pgEnum("content_source_kind", [
  "book",
  "article",
  "web",
]);

export const enneagramTypes = pgTable(
  "enneagram_types",
  {
    id: uuidPk(),
    number: smallint("number").notNull().unique(),
    ...timestamps(),
  },
  (t) => [
    check("enneagram_types_number_range", sql`${t.number} between 1 and 9`),
  ],
);

/** Adjacent types ("wings"). Both directions are stored: 1->9 and 1->2. */
export const enneagramWings = pgTable(
  "enneagram_wings",
  {
    id: uuidPk(),
    typeId: uuid("type_id")
      .notNull()
      .references(() => enneagramTypes.id, { onDelete: "cascade" }),
    wingTypeId: uuid("wing_type_id")
      .notNull()
      .references(() => enneagramTypes.id, { onDelete: "cascade" }),
    ...timestamps(),
  },
  (t) => [
    unique("enneagram_wings_type_wing_uq").on(t.typeId, t.wingTypeId),
    check("enneagram_wings_not_self", sql`${t.typeId} <> ${t.wingTypeId}`),
    index("enneagram_wings_wing_type_idx").on(t.wingTypeId),
  ],
);

/** Directed integration / stress arrows. Exactly one of each kind per source type. */
export const enneagramConnections = pgTable(
  "enneagram_connections",
  {
    id: uuidPk(),
    fromTypeId: uuid("from_type_id")
      .notNull()
      .references(() => enneagramTypes.id, { onDelete: "cascade" }),
    toTypeId: uuid("to_type_id")
      .notNull()
      .references(() => enneagramTypes.id, { onDelete: "cascade" }),
    kind: connectionKind("kind").notNull(),
    ...timestamps(),
  },
  (t) => [
    unique("enneagram_connections_from_kind_uq").on(t.fromTypeId, t.kind),
    check(
      "enneagram_connections_not_self",
      sql`${t.fromTypeId} <> ${t.toTypeId}`,
    ),
    index("enneagram_connections_to_type_idx").on(t.toTypeId),
  ],
);

/**
 * Triad membership: each type belongs to exactly one group of each kind
 * (centers, Hornevian, Harmonic). `groupKey` is e.g. "instinctive", "assertive".
 */
export const enneagramTriadMemberships = pgTable(
  "enneagram_triad_memberships",
  {
    id: uuidPk(),
    typeId: uuid("type_id")
      .notNull()
      .references(() => enneagramTypes.id, { onDelete: "cascade" }),
    kind: triadKind("kind").notNull(),
    groupKey: text("group_key").notNull(),
    ...timestamps(),
  },
  (t) => [
    unique("enneagram_triad_memberships_type_kind_uq").on(t.typeId, t.kind),
    index("enneagram_triad_memberships_group_idx").on(t.kind, t.groupKey),
  ],
);

/** 27 subtypes = 9 types x 3 instincts. `key` is the stable content key, e.g. "4-sx". */
export const instinctualSubtypes = pgTable(
  "instinctual_subtypes",
  {
    id: uuidPk(),
    key: text("key").notNull().unique(),
    typeId: uuid("type_id")
      .notNull()
      .references(() => enneagramTypes.id, { onDelete: "cascade" }),
    instinct: instinct("instinct").notNull(),
    ...timestamps(),
  },
  (t) => [
    unique("instinctual_subtypes_type_instinct_uq").on(t.typeId, t.instinct),
  ],
);

/** 81 development levels = 9 types x 9 levels. `key` is e.g. "4-L7". */
export const developmentLevels = pgTable(
  "development_levels",
  {
    id: uuidPk(),
    key: text("key").notNull().unique(),
    typeId: uuid("type_id")
      .notNull()
      .references(() => enneagramTypes.id, { onDelete: "cascade" }),
    level: smallint("level").notNull(),
    ...timestamps(),
  },
  (t) => [
    unique("development_levels_type_level_uq").on(t.typeId, t.level),
    check("development_levels_level_range", sql`${t.level} between 1 and 9`),
  ],
);

/** Bibliographic registry mirrored from src/content/sources.ts (key is the join key). */
export const contentSources = pgTable("content_sources", {
  id: uuidPk(),
  key: text("key").notNull().unique(),
  author: text("author").notNull(),
  title: text("title").notNull(),
  year: integer("year"),
  kind: sourceKind("kind").notNull(),
  note: text("note"),
  ...timestamps(),
});
