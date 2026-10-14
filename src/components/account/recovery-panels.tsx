"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { safeNextPath } from "@/lib/auth/next-param";
import { isRateLimited, NETWORK_ERROR, RATE_LIMITED } from "./auth-errors";
import { passwordResetRedirect, verificationCallbackURL } from "./auth-urls";
import type { SubmitResult } from "./field";
import { ForgotPasswordForm } from "./forgot-password-form";
import {
  cooldownRemaining,
  loadPendingVerification,
  savePendingVerification,
  type PendingVerification,
} from "./pending-verification";
import { ResendVerification } from "./resend-verification";
import { ResetPasswordForm } from "./reset-password-form";

function Unavailable({ children }: { children: string }) {
  return (
    <div className="space-y-4">
      <p className="rounded-xl border border-border bg-card p-4">{children}</p>
      <Link href="/cuenta/entrar" className="underline underline-offset-4">
        Volver a entrar
      </Link>
    </div>
  );
}

/** Asks for a reset mail. The answer is the same whether or not the address has an account. */
export function ForgotPasswordPanel({ emailEnabled }: { emailEnabled: boolean }) {
  if (!emailEnabled) {
    return <Unavailable>La recuperación de contraseña por correo no está disponible por ahora.</Unavailable>;
  }
  return (
    <ForgotPasswordForm
      onSubmit={async (email): Promise<SubmitResult> => {
        try {
          const { error } = await authClient.requestPasswordReset({ email, redirectTo: passwordResetRedirect() });
          if (isRateLimited(error)) return { ok: false, message: RATE_LIMITED };
          // Any other outcome looks identical to the user (never reveal account existence).
          return { ok: true };
        } catch {
          return { ok: false, message: NETWORK_ERROR };
        }
      }}
    />
  );
}

/** `?token=` / `?error=` come from the Better Auth redirect of the mailed link. */
export function ResetPasswordPanel({ emailEnabled }: { emailEnabled: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  if (!emailEnabled) {
    return <Unavailable>La recuperación de contraseña por correo no está disponible por ahora.</Unavailable>;
  }
  const token = params.get("token");
  return (
    <ResetPasswordForm
      token={token}
      linkError={Boolean(params.get("error"))}
      onSubmit={async (newPassword): Promise<SubmitResult> => {
        if (!token) return { ok: false, code: "invalid-token", message: "" };
        try {
          const { error } = await authClient.resetPassword({ newPassword, token });
          if (!error) {
            router.replace("/cuenta/entrar?restablecida=1");
            return { ok: true };
          }
          if (isRateLimited(error)) return { ok: false, message: RATE_LIMITED };
          if (error.code === "INVALID_TOKEN") return { ok: false, code: "invalid-token", message: "" };
          return { ok: false, message: "No pudimos cambiar la contraseña. Revisa que cumpla los requisitos e inténtalo de nuevo." };
        } catch {
          return { ok: false, message: NETWORK_ERROR };
        }
      }}
    />
  );
}

/** Resend action shared by the verification page and the sign-in form. */
export function resendVerification(next: string | null) {
  return async (email: string): Promise<SubmitResult> => {
    try {
      const { error } = await authClient.sendVerificationEmail({ email, callbackURL: verificationCallbackURL(next) });
      if (isRateLimited(error)) return { ok: false, message: RATE_LIMITED };
      // Generic on purpose: same answer for unknown, verified and pending addresses.
      return { ok: true };
    } catch {
      return { ok: false, message: NETWORK_ERROR };
    }
  };
}

/** Shown after sign-up when the server requires a confirmed email before the first sign-in. */
export function VerifyEmailPanel({ emailEnabled }: { emailEnabled: boolean }) {
  const params = useSearchParams();
  const [loaded, setLoaded] = useState<{ pending: PendingVerification | null; cooldown: number } | undefined>();

  useEffect(() => {
    // sessionStorage only exists in the browser: read after mount to keep the shell static.
    const pending = loadPendingVerification();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoaded({ pending, cooldown: pending ? cooldownRemaining(pending.sentAt) : 0 });
  }, []);

  if (!emailEnabled) {
    return <Unavailable>En este momento no necesitas confirmar tu correo: puedes entrar directamente.</Unavailable>;
  }
  if (!loaded) return null;

  const { pending, cooldown } = loaded;
  const next = pending?.next ?? safeNextPath(params.get("next"));
  const resend = resendVerification(next);
  return (
    <div className="space-y-5">
      <p>
        <strong>Revisa tu bandeja de entrada.</strong>{" "}
        {pending ? (
          <>
            Te enviamos un enlace a <span className="font-medium">{pending.email}</span> para confirmar tu correo.
          </>
        ) : (
          "Te enviamos un enlace para confirmar tu correo."
        )}{" "}
        El enlace vale 1 hora. Al abrirlo, entras a tu cuenta.
      </p>
      <p className="text-sm text-muted-foreground">
        Si no lo ves, mira la carpeta de spam. Si escribiste mal tu correo,{" "}
        <Link href="/cuenta/registro" className="underline underline-offset-4">
          crea la cuenta de nuevo
        </Link>
        .
      </p>
      <ResendVerification
        email={pending?.email}
        onResend={async (email) => {
          const result = await resend(email);
          if (result.ok) savePendingVerification({ email, next, sentAt: Date.now() });
          return result;
        }}
        initialCooldown={cooldown}
      />
      <p className="text-sm text-muted-foreground">
        <Link href="/cuenta/entrar" className="underline underline-offset-4">
          Ya confirmé mi correo
        </Link>
      </p>
    </div>
  );
}
