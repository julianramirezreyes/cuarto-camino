export type ClaimOutcome =
  | { status: "claimed"; claimed: number }
  | { status: "nothing" }
  | { status: "failed" };

export type AuthIntent = "sign-up" | "sign-in";

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

/**
 * Moves the guest's assessment(s) to the signed-in account (idempotent on the server:
 * no cookie / already claimed -> claimed: 0). Never throws: a failed claim must not block the account.
 */
export async function claimGuestAssessment(fetchImpl: FetchLike = fetch): Promise<ClaimOutcome> {
  try {
    const res = await fetchImpl("/api/assessments/claim", { method: "POST", credentials: "same-origin" });
    if (!res.ok) return { status: "failed" };
    const body = (await res.json()) as { claimed?: unknown };
    if (typeof body?.claimed !== "number" || !Number.isFinite(body.claimed) || body.claimed < 0) {
      return { status: "failed" };
    }
    return body.claimed > 0 ? { status: "claimed", claimed: body.claimed } : { status: "nothing" };
  } catch {
    return { status: "failed" };
  }
}

/**
 * Where to go after sign-up/sign-in. A validated `next` always wins. Otherwise: if something
 * was just claimed, resume an unfinished assessment or show the result; a brand-new account
 * with nothing to claim starts the assessment; a returning user lands on the result page
 * (which has its own empty state with a link to the assessment).
 */
export async function resolveDestination(args: {
  next: string | null;
  intent: AuthIntent;
  outcome: ClaimOutcome;
  fetchImpl?: FetchLike;
}): Promise<string> {
  const { next, intent, outcome, fetchImpl = fetch } = args;
  if (next) return next;
  if (outcome.status === "claimed") {
    try {
      const res = await fetchImpl("/api/assessments/current", { credentials: "same-origin" });
      return res.ok ? "/evaluacion" : "/resultado";
    } catch {
      return "/resultado";
    }
  }
  return intent === "sign-up" ? "/evaluacion" : "/resultado";
}
