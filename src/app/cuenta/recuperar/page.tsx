import type { Metadata } from "next";
import { Suspense } from "react";
import { ForgotPasswordPanel } from "@/components/account/recovery-panels";
import { SiteHeader } from "@/components/layout/site-header";
import { WithEmail } from "../with-email";

export const metadata: Metadata = {
  title: "Recuperar contraseña · Cuarto Camino",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-md flex-1 space-y-6 px-4 pb-16 pt-4">
        <h1 className="font-serif text-3xl md:text-4xl">Recuperar contraseña</h1>
        <p className="text-muted-foreground">Escribe el correo de tu cuenta y te enviaremos un enlace para elegir una contraseña nueva.</p>
        <Suspense fallback={null}>
          <WithEmail>{(emailEnabled) => <ForgotPasswordPanel emailEnabled={emailEnabled} />}</WithEmail>
        </Suspense>
      </main>
    </>
  );
}
