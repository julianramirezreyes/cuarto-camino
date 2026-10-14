import { createHash, timingSafeEqual } from "node:crypto";
import type { PurgeResult } from "@/lib/db/retention";

const HEADERS = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } as const;

function json(status: number, body: unknown): Response {
  return Response.json(body, { status, headers: HEADERS });
}

const digest = (v: string) => createHash("sha256").update(v).digest();

/** Constant-time `Authorization: Bearer <secret>` check (digests have equal length). */
export function isAuthorizedCron(header: string | null, secret: string): boolean {
  if (!secret || header === null) return false;
  return timingSafeEqual(digest(header), digest(`Bearer ${secret}`));
}

export interface PurgeHandlerDeps {
  /** CRON_SECRET, or undefined/empty when not configured. */
  getSecret(): string | undefined;
  run(): Promise<PurgeResult>;
}

/**
 * Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}` on GET when that env var exists.
 * Fails closed: without a configured secret the purge never runs.
 */
export function createPurgeHandler({ getSecret, run }: PurgeHandlerDeps) {
  return async function handler(request: Request): Promise<Response> {
    const secret = getSecret()?.trim();
    if (!secret) return json(500, { error: "cron_not_configured" });
    if (!isAuthorizedCron(request.headers.get("authorization"), secret)) {
      return json(401, { error: "unauthorized" });
    }
    try {
      const { assessments, guestSessions, rateLimits } = await run();
      return json(200, { assessments, guestSessions, rateLimits });
    } catch (e) {
      // Name only: driver messages can embed connection strings or parameters.
      console.error("[cron-purge] failed:", e instanceof Error ? e.name : typeof e);
      return json(500, { error: "purge_failed" });
    }
  };
}
