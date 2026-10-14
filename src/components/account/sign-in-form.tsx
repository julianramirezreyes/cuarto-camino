"use client";

import Link from "next/link";
import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { TextField, type SubmitResult } from "./field";
import { ResendVerification } from "./resend-verification";
import { validateEmail } from "./validation";

export interface SignInValues {
  email: string;
  password: string;
}

export function SignInForm({
  onSubmit,
  next,
  showForgotPassword = false,
  onResendVerification,
  notice,
}: {
  onSubmit: (values: SignInValues) => Promise<SubmitResult>;
  next?: string | null;
  /** Only when the server can actually send the reset mail. */
  showForgotPassword?: boolean;
  /** Resend the confirmation mail (shown when the server says the email is not verified). */
  onResendVerification?: (email: string) => Promise<SubmitResult>;
  /** Non-blocking message from the page (e.g. password changed, email confirmed). */
  notice?: string;
}) {
  const uid = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [unverified, setUnverified] = useState(false);
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (inFlight.current) return;
    const found = {
      email: validateEmail(email),
      password: password ? undefined : "Escribe tu contraseña.",
    };
    setErrors(found);
    setFormError(null);
    setUnverified(false);
    if (found.email) return emailRef.current?.focus();
    if (found.password) return passwordRef.current?.focus();
    inFlight.current = true;
    setPending(true);
    try {
      const result = await onSubmit({ email: email.trim(), password });
      if (!result.ok) {
        setFormError(result.message);
        setUnverified(result.code === "email-not-verified");
      }
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  const query = next ? `?next=${encodeURIComponent(next)}` : "";
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
        error={errors.email}
        disabled={pending}
        required
      />
      <TextField
        id={`${uid}-password`}
        ref={passwordRef}
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        disabled={pending}
        required
      />
      {notice ? (
        <p role="status" className="rounded-xl border border-border bg-card p-3">
          {notice}
        </p>
      ) : null}
      {formError ? (
        <p role="alert" className="rounded-xl border border-accent bg-muted p-3">
          {formError}
        </p>
      ) : null}
      {unverified && onResendVerification ? (
        <ResendVerification email={email.trim()} onResend={onResendVerification} />
      ) : null}
      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Entrando…" : "Entrar"}
      </Button>
      {showForgotPassword ? (
        <p className="text-sm text-muted-foreground">
          <Link href="/cuenta/recuperar" className="underline underline-offset-4">
            ¿Olvidaste tu contraseña?
          </Link>
        </p>
      ) : null}
      <p className="text-sm text-muted-foreground">
        ¿Aún no tienes cuenta?{" "}
        <Link href={`/cuenta/registro${query}`} className="underline underline-offset-4">
          Crear cuenta
        </Link>
      </p>
    </form>
  );
}
