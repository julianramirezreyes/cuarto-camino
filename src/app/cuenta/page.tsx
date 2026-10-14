import type { Metadata } from "next";
import { AccountPanel } from "@/components/account/auth-panels";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = { title: "Mi cuenta · Cuarto Camino", robots: { index: false, follow: false } };

export default function AccountPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-md flex-1 px-4 pb-16 pt-4">
        <AccountPanel />
      </main>
    </>
  );
}
