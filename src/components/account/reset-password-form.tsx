"use client";

import Link from "next/link";
import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { TextField, type SubmitResult } from "./field";
import { MIN_PASSWORD_LENGTH, validateNewPassword } from "./validation";

function InvalidLink() {
  return (
    <div className="space-y-4">
      <p role="alert" className="rounded-xl border border-accent bg-muted p-4">
        El enlace no es válido o ya venció. Los enlaces valen 1 hora y solo se pueden usar una vez.
      </p>
      <Link
        href="/cuenta/recuperar"
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-base font-medium text-primary-foreground hover:opacity-90"
      >
        Pedir un enlace nuevo
      </Link>
    </div>
  );
}

export function ResetPasswordForm({
  token,
  linkError = false,
  onSubmit,
}: {
  token: string | null;
  /** The reset link itself reported a problem (?error=…). */
  linkError?: boolean;
  onSubmit: (newPassword: string) => Promise<SubmitResult>;
}) {
  const uid = useId();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [dead, setDead] = useState(false);
  const [done, setDone] = useState(false);
  const inFlight = useRef(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  if (!token || linkError || dead) return <InvalidLink />;

  if (done) {
    return (
      <div className="space-y-4">
        <p role="status" className="text-lg">
          Tu contraseña cambió. Ya puedes entrar con la nueva.
        </p>
        <Link href="/cuenta/entrar" className="underline underline-offset-4">
          Entrar
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (inFlight.current) return;
    const found = {
      password: validateNewPassword(password),
      confirm: password === confirm ? undefined : "Las contraseñas no coinciden.",
    };
    setErrors(found);
    setFormError(null);
    if (found.password) return passwordRef.current?.focus();
    if (found.confirm) return confirmRef.current?.focus();
    inFlight.current = true;
    setPending(true);
    try {
      const result = await onSubmit(password);
      if (result.ok) setDone(true);
      else if (result.code === "invalid-token") setDead(true);
      else setFormError(result.message);
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  return (
    <form method="post" noValidate onSubmit={handleSubmit} className="space-y-5" aria-busy={pending}>
      <TextField
        id={`${uid}-password`}
        ref={passwordRef}
        label="Contraseña nueva"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        hint={`Al menos ${MIN_PASSWORD_LENGTH} caracteres. Una frase larga funciona bien.`}
        error={errors.password}
        disabled={pending}
        required
      />
      <TextField
        id={`${uid}-confirm`}
        ref={confirmRef}
        label="Repite la contraseña"
        type="password"
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={errors.confirm}
        disabled={pending}
        required
      />
      {formError ? (
        <p role="alert" className="rounded-xl border border-accent bg-muted p-3">
          {formError}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Guardando…" : "Cambiar contraseña"}
      </Button>
    </form>
  );
}
