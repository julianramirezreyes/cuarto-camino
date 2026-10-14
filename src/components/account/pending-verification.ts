import { safeNextPath } from "@/lib/auth/next-param";

const KEY = "cc:pending-verification";
export const RESEND_COOLDOWN_SECONDS = 60;

export interface PendingVerification {
  email: string;
  next: string | null;
  /** Epoch ms of the last send; lets the cooldown survive a reload. */
  sentAt: number;
}

/**
 * Remembers, for this tab only, which address is waiting for confirmation (keeps the address out of the
 * URL). sessionStorage can be blocked: every access is guarded and the UI works without it.
 */
export function savePendingVerification(value: PendingVerification): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function loadPendingVerification(): PendingVerification | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<PendingVerification>;
    if (typeof v.email !== "string" || !v.email || typeof v.sentAt !== "number") return null;
    return { email: v.email, next: safeNextPath(v.next), sentAt: v.sentAt };
  } catch {
    return null;
  }
}

export function clearPendingVerification(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/** Whole seconds left of the resend cooldown (0 when over). */
export function cooldownRemaining(sentAt: number, now: number = Date.now()): number {
  const elapsed = Math.max(0, now - sentAt);
  return Math.max(0, Math.ceil((RESEND_COOLDOWN_SECONDS * 1000 - elapsed) / 1000));
}
