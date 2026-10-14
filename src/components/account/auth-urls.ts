import { safeNextPath } from "@/lib/auth/next-param";

/** Where the verification link sends the browser. Same-origin path; Better Auth appends ?error=… on failure. */
export function verificationCallbackURL(next: string | null): string {
  const safe = safeNextPath(next);
  return `/cuenta/entrar?verificado=1${safe ? `&next=${encodeURIComponent(safe)}` : ""}`;
}

/** Where the reset link lands (Better Auth appends ?token=… or ?error=INVALID_TOKEN). */
export function passwordResetRedirect(): string {
  return "/cuenta/restablecer";
}
