"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { TextField, type SubmitResult } from "./field";
import { RESEND_COOLDOWN_SECONDS } from "./pending-verification";
import { validateEmail } from "./validation";

/**
 * "Reenviar correo" with a cooldown. The success message is deliberately generic (it never says whether
 * the address exists). Asks for the address only when it is not known.
 */
export function ResendVerification({
  email: knownEmail,
  onResend,
  initialCooldown = 0,
}: {
  email?: string;
  onResend: (email: string) => Promise<SubmitResult>;
  /** Seconds of cooldown to start with (mail just sent). */
  initialCooldown?: number;
}) {
  const uid = useId();
  const [typed, setTyped] = useState("");
  const [emailError, setEmailError] = useState<string>();
  const [remaining, setRemaining] = useState(initialCooldown);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);
  const emailRef = useRef<HTMLInputElement>(null);

  const cooling = remaining > 0;
  useEffect(() => {
    if (!cooling) return;
    const t = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(t);
  }, [cooling]);

  async function handleClick() {
    if (inFlight.current || remaining > 0) return;
    const email = (knownEmail ?? typed).trim();
    if (!knownEmail) {
      const problem = validateEmail(email);
      setEmailError(problem);
      if (problem) return emailRef.current?.focus();
    }
    inFlight.current = true;
    setPending(true);
    setError(null);
    try {
      const result = await onResend(email);
      if (result.ok) {
        setSent(true);
        setRemaining(RESEND_COOLDOWN_SECONDS);
      } else {
        setSent(false);
        setError(result.message);
      }
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  return (
    <div className="space-y-3">
      {!knownEmail ? (
        <TextField
          id={`${uid}-email`}
          ref={emailRef}
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          error={emailError}
          disabled={pending}
        />
      ) : null}
      <Button variant="secondary" onClick={() => void handleClick()} disabled={pending || cooling}>
        {pending ? "Enviando…" : cooling ? `Reenviar correo (${remaining} s)` : "Reenviar correo"}
      </Button>
      {sent ? (
        <p role="status" className="text-sm text-muted-foreground">
          Si el correo está registrado y aún sin confirmar, te enviamos un enlace nuevo. Revisa también la carpeta de spam.
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="rounded-xl border border-accent bg-muted p-3">
          {error}
        </p>
      ) : null}
    </div>
  );
}
