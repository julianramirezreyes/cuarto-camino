import { createOutboxTransport, DEFAULT_OUTBOX_FILE } from "./outbox";
import { createSmtpTransport } from "./smtp";
import type { EmailTransport } from "./types";

export type { EmailMessage, EmailTransport } from "./types";

type Env = Record<string, string | undefined>;

const SMTP_VARS = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "EMAIL_FROM"] as const;

const present = (env: Env, key: string) => Boolean(env[key]?.trim());
const hasAllSmtp = (env: Env) => SMTP_VARS.every((k) => present(env, k));

type Kind = "smtp" | "outbox" | null;

/** Pure: which transport the environment selects, or null when email is off. */
function selectKind(env: Env): Kind {
  const explicit = env.EMAIL_TRANSPORT?.trim().toLowerCase();
  if (explicit === "outbox") return env.NODE_ENV === "production" ? null : "outbox";
  if (explicit === "smtp") return hasAllSmtp(env) ? "smtp" : null;
  if (explicit) return null; // unknown value: stay off rather than guess
  return hasAllSmtp(env) ? "smtp" : null;
}

/**
 * Whether verification / password-reset mail can be sent. When false the app behaves as before
 * (no verification required, no reset flow) so a deployment without SMTP never locks users out.
 * The outbox in production counts as "off" here; getEmailTransport() still refuses it loudly.
 */
export function isEmailEnabled(env: Env = process.env): boolean {
  return selectKind(env) !== null;
}

/** Builds the configured transport, or null when email is disabled. Throws on a bad config. */
export function getEmailTransport(env: Env = process.env): EmailTransport | null {
  if (env.EMAIL_TRANSPORT?.trim().toLowerCase() === "outbox") {
    return createOutboxTransport({ file: env.EMAIL_OUTBOX_FILE?.trim() || DEFAULT_OUTBOX_FILE, env });
  }
  if (selectKind(env) !== "smtp") return null;
  const port = Number(env.SMTP_PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("SMTP_PORT must be a valid port number.");
  }
  return createSmtpTransport({
    host: env.SMTP_HOST!.trim(),
    port,
    user: env.SMTP_USER!,
    pass: env.SMTP_PASS!,
    from: env.EMAIL_FROM!.trim(),
  });
}
