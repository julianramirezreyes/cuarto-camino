import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmailPanel } from "@/components/account/recovery-panels";
import { SiteHeader } from "@/components/layout/site-header";
import { WithEmail } from "../with-email";

export const metadata: Metadata = {
  title: "Confirma tu correo · Cuarto Camino",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-md flex-1 space-y-6 px-4 pb-16 pt-4">
        <h1 className="font-serif text-3xl md:text-4xl">Confirma tu correo</h1>
        <Suspense fallback={null}>
          <WithEmail>{(emailEnabled) => <VerifyEmailPanel emailEnabled={emailEnabled} />}</WithEmail>
        </Suspense>
      </main>
    </>
  );
}
