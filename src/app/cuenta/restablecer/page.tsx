import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordPanel } from "@/components/account/recovery-panels";
import { SiteHeader } from "@/components/layout/site-header";
import { WithEmail } from "../with-email";

export const metadata: Metadata = {
  title: "Nueva contraseña · Cuarto Camino",
  robots: { index: false, follow: false },
  // The URL carries a one-time token: never leak it through the Referer header.
  referrer: "no-referrer",
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-md flex-1 space-y-6 px-4 pb-16 pt-4">
        <h1 className="font-serif text-3xl md:text-4xl">Elige una contraseña nueva</h1>
        <Suspense fallback={null}>
          <WithEmail>{(emailEnabled) => <ResetPasswordPanel emailEnabled={emailEnabled} />}</WithEmail>
        </Suspense>
      </main>
    </>
  );
}
