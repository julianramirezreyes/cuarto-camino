/**
 * Server-only wiring of the /resultado loader. Resolves the principal exactly like the
 * API (src/features/assessment/http.ts): an authenticated user wins, otherwise the guest
 * cookie; nothing about identity ever comes from the URL.
 */
import { cookies, headers } from "next/headers";
import { getAssessmentApiDeps } from "@/features/assessment/container";
import type { Principal } from "@/features/assessment/service";
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

    findLatestCompletedId: (principal) => api.service.findLatestCompletedId(principal),

    // The service re-checks ownership (canAccessAssessment) on every read.
    getResult: (principal, id) => api.service.getResult(principal, id),
  };
}
