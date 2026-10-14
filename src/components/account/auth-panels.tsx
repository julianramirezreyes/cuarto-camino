"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { safeNextPath } from "@/lib/auth/next-param";
import { AccountView } from "./account-view";
import type { SubmitResult } from "./field";
import { isRateLimited, NETWORK_ERROR, RATE_LIMITED, signInFailure, signUpFailure } from "./auth-errors";
import { verificationCallbackURL } from "./auth-urls";
import { savePendingVerification } from "./pending-verification";
import { PostAuth } from "./post-auth";
import { resendVerification } from "./recovery-panels";
import { SignInForm } from "./sign-in-form";
import { SignUpForm } from "./sign-up-form";

/** `?next=` read in the browser (keeps page shells static) and validated as a same-origin path. */
function useNextParam(): string | null {
  return safeNextPath(useSearchParams().get("next"));
}

export function SignUpPanel({ emailEnabled = false }: { emailEnabled?: boolean }) {
  const router = useRouter();
  const next = useNextParam();
  const [done, setDone] = useState(false);
  if (done) return <PostAuth intent="sign-up" next={next} />;
  return (
    <SignUpForm
      next={next}
      emailEnabled={emailEnabled}
      onSubmit={async (values): Promise<SubmitResult> => {
        try {
          const { data, error } = await authClient.signUp.email({
            ...values,
            callbackURL: emailEnabled ? verificationCallbackURL(next) : undefined,
          });
          if (error) return signUpFailure(error);
          // No session token means the server requires a confirmed email first (the claim of the guest
          // result then happens on the first sign-in, or right after the confirmation link signs in).
          if (data?.token === null) {
            savePendingVerification({ email: values.email, next, sentAt: Date.now() });
            router.replace("/cuenta/verifica-tu-correo");
            return { ok: true };
          }
          setDone(true);
          return { ok: true };
        } catch {
          return { ok: false, message: NETWORK_ERROR };
        }
      }}
    />
  );
}

export function SignInPanel({ emailEnabled = false }: { emailEnabled?: boolean }) {
  const next = useNextParam();
  const params = useSearchParams();
  const { data: session } = authClient.useSession();
  const [done, setDone] = useState(false);

  const justVerified = params.get("verificado") === "1";
  const linkError = Boolean(params.get("error"));
  // Back from the confirmation link: Better Auth already signed the user in; claim the guest result once.
  if (done || (justVerified && !linkError && session)) {
    return <PostAuth intent={justVerified && !done ? "sign-up" : "sign-in"} next={next} />;
  }

  const notice = linkError
    ? "El enlace de confirmación no es válido o ya venció. Pide otro desde «Reenviar correo» al intentar entrar."
    : justVerified
      ? "Correo confirmado. Ya puedes entrar."
      : params.get("restablecida") === "1"
        ? "Tu contraseña cambió. Entra con la nueva."
        : undefined;

  return (
    <SignInForm
      next={next}
      notice={notice}
      showForgotPassword={emailEnabled}
      onResendVerification={emailEnabled ? resendVerification(next) : undefined}
      onSubmit={async (values): Promise<SubmitResult> => {
        try {
          const { error } = await authClient.signIn.email(values);
          if (!error) {
            setDone(true);
            return { ok: true };
          }
          return signInFailure(error);
        } catch {
          return { ok: false, message: NETWORK_ERROR };
        }
      }}
    />
  );
}

export function AccountPanel() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  if (isPending) return <p className="py-6 text-muted-foreground">Cargando tu cuenta…</p>;
  if (!data) {
    return (
      <div className="space-y-4">
        <h1 className="font-serif text-3xl">Mi cuenta</h1>
        <p className="text-muted-foreground">No has iniciado sesión.</p>
        <p>
          <a href="/cuenta/entrar?next=%2Fcuenta" className="underline underline-offset-4">
            Entrar
          </a>{" "}
          ·{" "}
          <a href="/cuenta/registro" className="underline underline-offset-4">
            Crear cuenta
          </a>
        </p>
      </div>
    );
  }

  return (
    <AccountView
      user={{ name: data.user.name, email: data.user.email }}
      onSignOut={async () => {
        await authClient.signOut();
        router.replace("/");
        router.refresh();
      }}
      onDelete={async (password): Promise<SubmitResult> => {
        try {
          const { error } = await authClient.deleteUser({ password });
          if (!error) return { ok: true };
          if (isRateLimited(error)) return { ok: false, message: RATE_LIMITED };
          return { ok: false, message: "No pudimos eliminar tu cuenta. Revisa tu contraseña e inténtalo de nuevo." };
        } catch {
          return { ok: false, message: NETWORK_ERROR };
        }
      }}
    />
  );
}
