/**
 * Server-only wiring of the /resultado loader. Resolves the principal exactly like the
 * API (src/features/assessment/http.ts): an authenticated user wins, otherwise the guest
 * cookie; nothing about identity ever comes from the URL.
 */
import { and, desc, eq, isNull } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { getAssessmentApiDeps } from "@/features/assessment/container";
import type { Principal } from "@/features/assessment/service";
import { getDb } from "@/lib/db/client";
import { assessments } from "@/lib/db/schema";
import { guestCookieName } from "@/lib/guest";
import type { LoaderDeps } from "./load-result";

export function createServerLoaderDeps(): LoaderDeps {
  const api = getAssessmentApiDeps();
  return {
    async resolvePrincipal() {
      const h = await headers();
      const userId = await api.getUserId(new Request("http://internal.invalid/", { headers: [...h.entries()] }));
      if (userId) return { kind: "user", userId } satisfies Principal;
      const token = (await cookies()).get(guestCookieName(api.secureCookies))?.value;
      // A Server Component cannot set cookies, so the sliding-expiry refresh is not re-sent here.
      const guest = await api.guests.resolve(token);
      return guest ? ({ kind: "guest", guestSessionId: guest.guestSessionId } satisfies Principal) : null;
    },

    // TODO(repository): move this query to AssessmentRepository (e.g. findLatestCompletedByOwner)
    // so the Drizzle and in-memory adapters stay in sync. It lives here only because the repository
    // had no "latest completed" lookup when the report page was built.
    async findLatestCompletedId(principal) {
      const owner =
        principal.kind === "user" ? eq(assessments.userId, principal.userId) : eq(assessments.guestSessionId, principal.guestSessionId);
      const [row] = await getDb()
        .select({ id: assessments.id })
        .from(assessments)
        .where(and(owner, eq(assessments.status, "completed"), isNull(assessments.deletedAt)))
        .orderBy(desc(assessments.completedAt))
        .limit(1);
      return row?.id ?? null;
    },

    // The service re-checks ownership (canAccessAssessment) on every read.
    getResult: (principal, id) => api.service.getResult(principal, id),
  };
}
