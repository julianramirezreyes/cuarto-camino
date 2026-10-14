/**
 * Retention job: deletes expired guest sessions (and their assessments), soft-deleted
 * assessments past the grace window and stale rate-limit rows. Same function as the
 * protected cron route GET /api/cron/purge (src/lib/db/retention.ts).
 * Usage: npx tsx scripts/purge-expired.ts   (requires DATABASE_URL)
 * In production Vercel Cron runs it daily through /api/cron/purge (vercel.json).
 */
import { loadEnvOrExit } from "./_env";

loadEnvOrExit();

async function main() {
  const { createTransactionalDb } = await import("@/lib/db/transactional");
  const { purgeExpired } = await import("@/lib/db/retention");
  const { db, close } = createTransactionalDb();
  try {
    const result = await purgeExpired(db);
    console.log(
      `Purge OK: ${result.assessments} assessments, ${result.guestSessions} guest sessions, ${result.rateLimits} rate-limit rows removed.`,
    );
  } finally {
    await close();
  }
}

main().catch((error) => {
  console.error("Purge failed (transaction rolled back):", error);
  process.exit(1);
});
