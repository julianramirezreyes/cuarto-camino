import type { Metadata } from "next";
import { Suspense } from "react";
import { SignUpPanel } from "@/components/account/auth-panels";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = { title: "Crear cuenta · Cuarto Camino", robots: { index: false, follow: false } };

export default function SignUpPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-md flex-1 space-y-6 px-4 pb-16 pt-4">
        <h1 className="font-serif text-3xl md:text-4xl">Crear cuenta</h1>
        <p className="text-muted-foreground">
          Con una cuenta conservas tu resultado y puedes volver a verlo cuando quieras. Es opcional: puedes seguir sin
          cuenta.
        </p>
        <Suspense fallback={null}>
          <SignUpPanel />
        </Suspense>
      </main>
    </>
  );
}
