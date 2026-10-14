"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { TextField, type SubmitResult } from "./field";

export interface AccountUser {
  name: string;
  email: string;
}

function DeleteDialog({
  onConfirm,
  onCancel,
}: {
  onConfirm: (password: string) => Promise<SubmitResult>;
  onCancel: () => void;
}) {
  const uid = useId();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cancelRef = useRef(onCancel);
  useEffect(() => {
    cancelRef.current = onCancel;
  });

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !inFlight.current) cancelRef.current();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus?.();
    };
  }, []);

  async function submit() {
    if (inFlight.current) return;
    setError(null);
    if (!password) {
      setFieldError("Escribe tu contraseña para confirmar.");
      inputRef.current?.focus();
      return;
    }
    setFieldError(undefined);
    inFlight.current = true;
    setPending(true);
    try {
      const result = await onConfirm(password);
      if (!result.ok) setError(result.message);
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 p-4 backdrop-blur-sm sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-title`}
        aria-describedby={`${uid}-desc`}
        className="w-full max-w-md space-y-4 rounded-2xl border border-border bg-card p-6"
      >
        <h2 id={`${uid}-title`} className="font-serif text-2xl">
          ¿Eliminar tu cuenta y tus datos?
        </h2>
        <p id={`${uid}-desc`} className="text-muted-foreground">
          Se borrarán tu cuenta, tus respuestas, tus resultados y tus consentimientos. Esta acción no se puede deshacer.
        </p>
        <form
          noValidate
          method="post"
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <TextField
            id={`${uid}-password`}
            ref={inputRef}
            label="Tu contraseña"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldError}
            disabled={pending}
            required
          />
          {error ? (
            <p role="alert" className="text-sm">
              {error}
            </p>
          ) : null}
          <div className="flex flex-col gap-3 sm:flex-row-reverse">
            <Button type="submit" disabled={pending}>
              {pending ? "Eliminando…" : "Sí, eliminar todo"}
            </Button>
            <Button variant="secondary" onClick={onCancel} disabled={pending}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/** Profile page body. Side effects (sign out, delete) are injected by the container. */
export function AccountView({
  user,
  onSignOut,
  onDelete,
}: {
  user: AccountUser;
  onSignOut: () => Promise<void>;
  onDelete: (password: string) => Promise<SubmitResult>;
}) {
  const [confirming, setConfirming] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  if (deleted) {
    return (
      <div className="space-y-4">
        <h1 className="font-serif text-3xl">Listo</h1>
        <p role="status">Eliminamos tu cuenta y tus datos.</p>
        <Link href="/" className="underline underline-offset-4">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-3xl md:text-4xl">Mi cuenta</h1>
      <dl className="space-y-3 rounded-2xl border border-border bg-card p-5">
        <div>
          <dt className="text-sm text-muted-foreground">Nombre</dt>
          <dd>{user.name}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Correo</dt>
          <dd>{user.email}</dd>
        </div>
      </dl>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/resultado"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-base font-medium text-primary-foreground hover:opacity-90"
        >
          Ver mi resultado
        </Link>
        <Button
          variant="secondary"
          disabled={signingOut}
          onClick={async () => {
            setSigningOut(true);
            try {
              await onSignOut();
            } finally {
              setSigningOut(false);
            }
          }}
        >
          Cerrar sesión
        </Button>
      </div>
      <section className="space-y-3 rounded-2xl border border-border p-5">
        <h2 className="font-medium">Eliminar mis datos</h2>
        <p className="text-muted-foreground">
          Borra tu cuenta junto con tus respuestas, resultados y consentimientos. No se puede deshacer.
        </p>
        <Button variant="secondary" onClick={() => setConfirming(true)}>
          Eliminar mi cuenta y mis datos
        </Button>
      </section>
      {confirming ? (
        <DeleteDialog
          onCancel={() => setConfirming(false)}
          onConfirm={async (password) => {
            const result = await onDelete(password);
            if (result.ok) {
              setConfirming(false);
              setDeleted(true);
            }
            return result;
          }}
        />
      ) : null}
    </div>
  );
}
