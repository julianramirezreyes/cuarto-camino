import { connection } from "next/server";
import { createPurgeHandler } from "./handler";

const handler = createPurgeHandler({
  getSecret: () => process.env.CRON_SECRET,
  async run() {
    const { createTransactionalDb } = await import("@/lib/db/transactional");
    const { purgeExpired } = await import("@/lib/db/retention");
    const { db, close } = createTransactionalDb();
    try {
      return await purgeExpired(db);
    } finally {
      await close();
    }
  },
});

export async function GET(request: Request) {
  await connection(); // never prerendered or cached
  return handler(request);
}
