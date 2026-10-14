"use client";

import Link from "next/link";
import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { LegalNotice } from "@/components/legal/legal-notice";
import { TextField, type SubmitResult } from "./field";
import { MIN_PASSWORD_LENGTH, validateEmail, validateName, validateNewPassword } from "./validation";

export interface SignUpValues {
  name: string;
  email: string;
  password: string;
}

type Errors = Partial<Record<"name" | "email" | "password" | "consent", string>>;

export function SignUpForm({
  onSubmit,
  next,
  emailEnabled = false,
}: {
  onSubmit: (values: SignUpValues) => Promise<SubmitResult>;
  next?: string | null;
  /** The server can send mail: we confirm the address and can recover the password. */
  emailEnabled?: boolean;
}) {
  const uid = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (inFlight.current) return;
    const next: Errors = {
      name: validateName(name),
      email: validateEmail(email),
      password: validateNewPassword(password),
      consent: consent ? undefined : "Necesitamos tu autorización para crear la cuenta y conservar tu resultado.",
    };
    const firstInvalid = (["name", "email", "password", "consent"] as const).find((k) => next[k]);
    setErrors(next);
    setFormError(null);
    if (firstInvalid) {
      const target = { name: nameRef, email: emailRef, password: passwordRef, consent: consentRef }[firstInvalid];
      target.current?.focus();
      return;
    }
    inFlight.current = true;
    setPending(true);
    try {
      const result = await onSubmit({ name: name.trim(), email: email.trim(), password });
      if (!result.ok) setFormError(result.message);
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  const lengthOk = password.length >= MIN_PASSWORD_LENGTH;
  const consentId = `${uid}-consent`;
  const consentErrorId = `${consentId}-error`;
  const query = next ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <form method="post" noValidate onSubmit={handleSubmit} className="space-y-5" aria-busy={pending}>
      <TextField
        id={`${uid}-name`}
        ref={nameRef}
        label="Nombre"
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        disabled={pending}
        required
      />
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
      <div className="space-y-1.5">
        <TextField
          id={`${uid}-password`}
          ref={passwordRef}
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint={`Requisito: al menos ${MIN_PASSWORD_LENGTH} caracteres. ${lengthOk ? "Cumplido." : "Aún no se cumple."} Una frase larga funciona bien.`}
          error={errors.password}
          disabled={pending}
          required
        />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-start gap-3">
          <input
            id={consentId}
            ref={consentRef}
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            disabled={pending}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? consentErrorId : undefined}
            className="mt-1 size-6 shrink-0 accent-primary"
          />
          <label htmlFor={consentId} className="text-base">
            Autorizo crear una cuenta con estos datos y conservar mi resultado en ella.
          </label>
        </div>
        {errors.consent ? (
          <p id={consentErrorId} className="text-sm font-medium text-accent">
            {errors.consent}
          </p>
        ) : null}
      </div>
      <details className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
        <summary className="cursor-pointer font-medium text-foreground">Qué guardamos y cómo borrarlo</summary>
        <div className="mt-3 space-y-2">
          <p>
            Guardamos tu nombre, tu correo, tu contraseña (cifrada, nunca en texto legible) y, si lo pides, tu resultado
            y tus respuestas, para que puedas volver a verlos en otro momento o dispositivo.
          </p>
          <p>Puedes eliminar tu cuenta y todos esos datos cuando quieras desde «Mi cuenta». No se puede deshacer.</p>
          {emailEnabled ? (
            <p>
              Te enviaremos un correo para confirmar tu dirección antes de entrar. Si olvidas tu contraseña, podrás
              restablecerla con ese mismo correo.
            </p>
          ) : (
            <p>
              Aún no verificamos los correos ni podemos recuperar contraseñas: guarda la tuya y revisa que el correo esté
              bien escrito.
            </p>
          )}
          <LegalNotice />
        </div>
      </details>
      {formError ? (
        <p role="alert" className="rounded-xl border border-accent bg-muted p-3">
          {formError}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Creando tu cuenta…" : "Crear cuenta"}
      </Button>
      <p className="text-sm text-muted-foreground">
        <Link href={`/cuenta/entrar${query}`} className="underline underline-offset-4">
          Ya tengo cuenta
        </Link>
      </p>
    </form>
  );
}
