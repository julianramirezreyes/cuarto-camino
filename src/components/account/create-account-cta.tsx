"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth/auth-client";

export function CreateAccountCtaView({ signedIn }: { signedIn: boolean | "loading" }) {
  if (signedIn !== false) return null;
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-sm text-muted-foreground">
        Ahora tu resultado queda asociado a este navegador. Con una cuenta puedes conservarlo y volver a verlo.
      </p>
      <Link
        href="/cuenta/registro?next=/resultado"
        className="mt-3 inline-flex min-h-12 items-center justify-center rounded-full border border-border px-6 text-base font-medium hover:bg-muted"
      >
        Crear cuenta para conservar tu resultado
      </Link>
    </div>
  );
}

/** Only shown to visitors without a session. */
export function CreateAccountCta() {
  const { data, isPending } = authClient.useSession();
  return <CreateAccountCtaView signedIn={isPending ? "loading" : Boolean(data)} />;
}
