"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { safeNextPath } from "@/lib/auth/next-param";
import { AccountView } from "./account-view";
import type { SubmitResult } from "./field";
import { PostAuth } from "./post-auth";
import { SignInForm } from "./sign-in-form";
import { SignUpForm } from "./sign-up-form";

type AuthError = { status?: number; code?: string } | null | undefined;

const RATE_LIMITED = "Hiciste muchos intentos seguidos. Espera un minuto e inténtalo de nuevo.";
const NETWORK = "No pudimos conectar. Revisa tu conexión e inténtalo de nuevo.";

/** `?next=` read in the browser (keeps page shells static) and validated as a same-origin path. */
function useNextParam(): string | null {
  return safeNextPath(useSearchParams().get("next"));
}

function isRateLimited(error: AuthError) {
  return error?.status === 429;
}

export function SignUpPanel() {
  const next = useNextParam();
  const [done, setDone] = useState(false);
  if (done) return <PostAuth intent="sign-up" next={next} />;
  return (
    <SignUpForm
      next={next}
      onSubmit={async (values): Promise<SubmitResult> => {
        try {
          const { error } = await authClient.signUp.email(values);
          if (!error) {
            setDone(true);
            return { ok: true };
          }
          if (isRateLimited(error)) return { ok: false, message: RATE_LIMITED };
          // Deliberately generic: do not confirm whether an email is already registered.
          return {
            ok: false,
            message: "No pudimos crear la cuenta con esos datos. Si ya tienes una, entra con tu correo y contraseña.",
          };
        } catch {
          return { ok: false, message: NETWORK };
        }
      }}
    />
  );
}

export function SignInPanel() {
  const next = useNextParam();
  const [done, setDone] = useState(false);
  if (done) return <PostAuth intent="sign-in" next={next} />;
  return (
    <SignInForm
      next={next}
      onSubmit={async (values): Promise<SubmitResult> => {
        try {
          const { error } = await authClient.signIn.email(values);
          if (!error) {
            setDone(true);
            return { ok: true };
          }
          if (isRateLimited(error)) return { ok: false, message: RATE_LIMITED };
          return { ok: false, message: "Correo o contraseña incorrectos." };
        } catch {
          return { ok: false, message: NETWORK };
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
          return { ok: false, message: NETWORK };
        }
      }}
    />
  );
}
