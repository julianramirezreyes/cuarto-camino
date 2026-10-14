"use client";

import Link from "next/link";
import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { TextField, type SubmitResult } from "./field";
import { validateEmail } from "./validation";

export function ForgotPasswordForm({ onSubmit }: { onSubmit: (email: string) => Promise<SubmitResult> }) {
  const uid = useId();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string>();
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const inFlight = useRef(false);
  const emailRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (inFlight.current) return;
    const problem = validateEmail(email);
    setEmailError(problem);
    setFormError(null);
    if (problem) return emailRef.current?.focus();
    inFlight.current = true;
    setPending(true);
    try {
      const result = await onSubmit(email.trim());
      if (result.ok) setDone(true);
      else setFormError(result.message);
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="space-y-4">
        <p role="status" className="rounded-xl border border-border bg-card p-4">
          Si existe una cuenta con ese correo, te enviamos instrucciones. El enlace vale 1 hora; revisa también la
          carpeta de spam.
        </p>
        <p className="text-sm text-muted-foreground">
          <Link href="/cuenta/entrar" className="underline underline-offset-4">
            Volver a entrar
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form method="post" noValidate onSubmit={handleSubmit} className="space-y-5" aria-busy={pending}>
      <TextField
        id={`${uid}-email`}
        ref={emailRef}
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        inputMode="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={emailError}
        disabled={pending}
        required
      />
      {formError ? (
        <p role="alert" className="rounded-xl border border-accent bg-muted p-3">
          {formError}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Enviando…" : "Enviar instrucciones"}
      </Button>
      <p className="text-sm text-muted-foreground">
        <Link href="/cuenta/entrar" className="underline underline-offset-4">
          Volver a entrar
        </Link>
      </p>
    </form>
  );
}
