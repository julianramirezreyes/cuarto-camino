/**
 * Composition root of the assessment API. Everything is built lazily on the first
 * request, so importing a route (e.g. during `next build`) needs no env vars, database
 * or network. Server-only: never import from a Client Component.
 */
import { QUESTION_BANK } from "@/content/questions";
import { DEFAULT_ENGINE_CONFIG } from "@/domain/adaptive-engine";
import { getDb } from "@/lib/db/client";
import { createTransactionalDb } from "@/lib/db/transactional";
import { createDrizzleAssessmentRepository, type Db } from "./drizzle-repository";
import { createGuestService } from "./guest-service";
import { createAssessmentHandlers, type AssessmentApiDeps } from "./http";
import { createFixedWindowRateLimiter } from "./rate-limit";
import { createAssessmentService } from "./service";
import { BANK_VERSION } from "./versions";

/** Runs one real transaction over the WebSocket pool (neon-http has none). */
async function runInTransaction<T>(fn: (tx: Db) => Promise<T>): Promise<T> {
  const { db, close } = createTransactionalDb();
  try {
    return await db.transaction((tx) => fn(tx as unknown as Db));
  } finally {
    await close();
  }
}

/** Session cookie presence is a cheap pre-check: no cookie, no auth/DB round trip. */
async function getUserId(request: Request): Promise<string | null> {
  if (!(request.headers.get("cookie") ?? "").includes("session_token")) return null;
  const { getAuth } = await import("@/lib/auth/auth");
  const session = await getAuth().api.getSession({ headers: request.headers });
  return session?.user.id ?? null;
}

function configuredOrigins(): string[] {
  const out: string[] = [];
  for (const raw of [process.env.BETTER_AUTH_URL, process.env.APP_URL]) {
    try {
      if (raw) out.push(new URL(raw).origin);
    } catch {
      /* ignore malformed values */
    }
  }
  return out;
}

let cached: AssessmentApiDeps | undefined;

export function getAssessmentApiDeps(): AssessmentApiDeps {
  if (!cached) {
    const repo = createDrizzleAssessmentRepository({ db: getDb() as unknown as Db, transaction: runInTransaction });
    cached = {
      service: createAssessmentService({ repo, bank: QUESTION_BANK, config: DEFAULT_ENGINE_CONFIG, bankVersion: BANK_VERSION }),
      guests: createGuestService({ repo }),
      getUserId,
      // In-memory per instance: best effort only, see rate-limit.ts.
      limiters: {
        general: createFixedWindowRateLimiter({ limit: 120, windowMs: 60_000 }),
        start: createFixedWindowRateLimiter({ limit: 10, windowMs: 60_000 }),
      },
      allowedOrigins: configuredOrigins(),
      secureCookies: process.env.NODE_ENV === "production",
    };
  }
  return cached;
}

export const assessmentHandlers = createAssessmentHandlers(getAssessmentApiDeps);
