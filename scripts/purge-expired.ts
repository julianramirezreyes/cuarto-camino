/**
 * Retention job: deletes expired guest sessions (and their assessments), expired
 * assessments and soft-deleted assessments past the grace window.
 * Usage: npx tsx scripts/purge-expired.ts   (requires DATABASE_URL)
 * Schedule daily (e.g. Vercel Cron hitting a protected route, or a GitHub Action).
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
      `Purge OK: ${result.assessments} assessments, ${result.guestSessions} guest sessions removed.`,
    );
  } finally {
    await close();
  }
}

main().catch((error) => {
  console.error("Purge failed (transaction rolled back):", error);
  process.exit(1);
});
