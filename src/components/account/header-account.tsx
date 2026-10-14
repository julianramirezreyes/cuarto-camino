"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth/auth-client";

export type HeaderAccountState = { kind: "loading" } | { kind: "visitor" } | { kind: "user"; name: string };

const linkClass = "inline-flex min-h-11 items-center rounded-full px-3 text-sm hover:bg-muted";

export function HeaderAccountView({ state }: { state: HeaderAccountState }) {
  return (
    <nav aria-label="Cuenta" className="flex min-h-11 items-center gap-1">
      {state.kind === "visitor" ? (
        <>
          <Link href="/cuenta/entrar" className={linkClass}>
            Entrar
          </Link>
          <Link href="/cuenta/registro" className={`${linkClass} border border-control`}>
            Crear cuenta
          </Link>
        </>
      ) : null}
      {state.kind === "user" ? (
        <Link href="/cuenta" className={`${linkClass} border border-control`}>
          {state.name.trim() || "Mi cuenta"}
        </Link>
      ) : null}
    </nav>
  );
}

/** Client island: the static shell stays static, the session is read in the browser. */
export function HeaderAccount() {
  const { data, isPending } = authClient.useSession();
  const state: HeaderAccountState = isPending
    ? { kind: "loading" }
    : data
      ? { kind: "user", name: data.user.name ?? "" }
      : { kind: "visitor" };
  return <HeaderAccountView state={state} />;
}
