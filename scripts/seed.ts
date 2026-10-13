/**
 * Idempotent seed of the structural reference tables.
 * Usage: npm run db:seed   (requires DATABASE_URL; migrations must be applied first)
 * Safe to re-run: every insert is ON CONFLICT DO NOTHING on a natural unique key,
 * and the whole run is one transaction (all or nothing).
 */
import { loadEnvOrExit } from "./_env";

loadEnvOrExit();

async function main() {
  const { createTransactionalDb } = await import("@/lib/db/transactional");
  const { buildReferenceSeed } = await import("@/lib/db/seed-data");
  const s = await import("@/lib/db/schema");
  const { inArray } = await import("drizzle-orm");

  const seed = buildReferenceSeed();
  const { db, close } = createTransactionalDb();
  try {
    await db.transaction(async (tx) => {
      await tx
        .insert(s.enneagramTypes)
        .values(seed.types)
        .onConflictDoNothing();
      const rows = await tx
        .select({ id: s.enneagramTypes.id, number: s.enneagramTypes.number })
        .from(s.enneagramTypes)
        .where(
          inArray(
            s.enneagramTypes.number,
            seed.types.map((t) => t.number),
          ),
        );
      const idOf = new Map(rows.map((r) => [r.number, r.id]));
      const id = (n: number): string => {
        const found = idOf.get(n);
        if (!found) throw new Error(`Type ${n} missing after insert`);
        return found;
      };

      await tx
        .insert(s.enneagramWings)
        .values(
          seed.wings.map((w) => ({
            typeId: id(w.type),
            wingTypeId: id(w.wing),
          })),
        )
        .onConflictDoNothing();
      await tx
        .insert(s.enneagramConnections)
        .values(
          seed.connections.map((c) => ({
            fromTypeId: id(c.from),
            toTypeId: id(c.to),
            kind: c.kind,
          })),
        )
        .onConflictDoNothing();
      await tx
        .insert(s.enneagramTriadMemberships)
        .values(
          seed.triads.map((t) => ({
            typeId: id(t.type),
            kind: t.kind,
            groupKey: t.groupKey,
          })),
        )
        .onConflictDoNothing();
      await tx
        .insert(s.instinctualSubtypes)
        .values(
          seed.subtypes.map((x) => ({
            key: x.key,
            typeId: id(x.type),
            instinct: x.instinct,
          })),
        )
        .onConflictDoNothing();
      await tx
        .insert(s.developmentLevels)
        .values(
          seed.levels.map((x) => ({
            key: x.key,
            typeId: id(x.type),
            level: x.level,
          })),
        )
        .onConflictDoNothing();
      if (seed.sources.length) {
        await tx
          .insert(s.contentSources)
          .values(seed.sources)
          .onConflictDoNothing();
      }
    });
    console.log(
      `Seed OK: ${seed.types.length} types, ${seed.wings.length} wings, ${seed.connections.length} connections, ` +
        `${seed.triads.length} triad memberships, ${seed.subtypes.length} subtypes, ${seed.levels.length} levels, ` +
        `${seed.sources.length} sources.`,
    );
  } finally {
    await close();
  }
}

main().catch((error) => {
  console.error("Seed failed (transaction rolled back):", error);
  process.exit(1);
});
