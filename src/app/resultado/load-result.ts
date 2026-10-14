import type { AssessmentReport } from "@/domain/adaptive-engine";
import { AssessmentError } from "@/features/assessment/errors";
import type { Principal, ResultView } from "@/features/assessment/service";
import type { ResultMeta } from "@/components/results/types";

/** Everything the loader needs from the outside world, injectable for tests. */
export interface LoaderDeps {
  /** Same resolution as the API: Better Auth session first, then the guest cookie. */
  resolvePrincipal(): Promise<Principal | null>;
  /** Id of the principal's most recent completed, non-deleted assessment. */
  findLatestCompletedId(principal: Principal): Promise<string | null>;
  /** The service call that enforces ownership (`canAccessAssessment`). */
  getResult(principal: Principal, id: string): Promise<ResultView>;
}

export type LoadedResult =
  | { status: "empty" }
  | { status: "insufficient" }
  | { status: "ready"; assessmentId: string; report: AssessmentReport; meta: ResultMeta };

/**
 * Loads the latest completed result for the CURRENT principal. No id ever comes from the
 * URL, and the id found here still goes through the service's ownership check.
 */
export async function loadLatestResult(deps: LoaderDeps): Promise<LoadedResult> {
  const principal = await deps.resolvePrincipal();
  if (!principal) return { status: "empty" };
  const assessmentId = await deps.findLatestCompletedId(principal);
  if (!assessmentId) return { status: "empty" };
  let view: ResultView;
  try {
    view = await deps.getResult(principal, assessmentId);
  } catch (e) {
    if (e instanceof AssessmentError && (e.code === "not_found" || e.code === "not_complete")) return { status: "empty" };
    throw e;
  }
  if (view.report.primaryType === null) return { status: "insufficient" };
  return {
    status: "ready",
    assessmentId,
    report: view.report,
    meta: { engineVersion: view.engineVersion, bankVersion: view.bankVersion, completedAt: view.completedAt.toISOString() },
  };
}
