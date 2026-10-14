"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { claimGuestAssessment, resolveDestination, type AuthIntent, type ClaimOutcome } from "./claim";

type Phase = { kind: "working" } | { kind: "done"; outcome: ClaimOutcome; destination: string };

/**
 * Shown right after a successful sign-up / sign-in. Claims the guest's result exactly once,
 * confirms calmly and moves on. A failed claim never blocks the account: it offers a retry.
 */
export function PostAuth({
  intent,
  next,
  claim = claimGuestAssessment,
  resolve = (outcome, nextPath, i) => resolveDestination({ next: nextPath, intent: i, outcome }),
  redirectDelayMs = 1800,
}: {
  intent: AuthIntent;
  next: string | null;
  claim?: () => Promise<ClaimOutcome>;
  resolve?: (outcome: ClaimOutcome, next: string | null, intent: AuthIntent) => Promise<string> | string;
  redirectDelayMs?: number;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>({ kind: "working" });
  const started = useRef(false);

  const run = useCallback(async () => {
    setPhase({ kind: "working" });
    const outcome = await claim();
    const destination = await resolve(outcome, next, intent);
    setPhase({ kind: "done", outcome, destination });
  }, [claim, resolve, next, intent]);

  useEffect(() => {
    // Ref guard: StrictMode re-runs effects, but the claim must happen once per sign-in.
    if (started.current) return;
    started.current = true;
    void run();
  }, [run]);

  const done = phase.kind === "done" ? phase : null;
  const failed = done?.outcome.status === "failed";

  useEffect(() => {
    if (!done || failed) return;
    const t = setTimeout(() => router.replace(done.destination), redirectDelayMs);
    return () => clearTimeout(t);
  }, [done, failed, router, redirectDelayMs]);

  if (!done) {
    return (
      <p role="status" className="py-6 text-muted-foreground">
        Preparando tu cuenta…
      </p>
    );
  }

  const link = (
    <Link
      href={done.destination}
      className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-base font-medium text-primary-foreground hover:opacity-90"
    >
      Continuar
    </Link>
  );

  if (failed) {
    return (
      <div className="space-y-4">
        <p role="status" className="rounded-xl border border-accent bg-muted p-4">
          Tu cuenta está lista, pero no pudimos guardar tu resultado ahora mismo. No perdiste nada: puedes reintentarlo
          o continuar y hacerlo más tarde.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => void run()}>Reintentar</Button>
          {link}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p role="status" className="text-lg">
        {done.outcome.status === "claimed" ? "Guardamos tu resultado en tu cuenta." : "Tu cuenta está lista."}
      </p>
      {link}
    </div>
  );
}
