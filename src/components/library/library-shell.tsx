import Link from "next/link";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";

const SECTIONS = [
  ["Historia", "/biblioteca/historia"],
  ["Tipos", "/biblioteca/tipos"],
  ["Subtipos", "/biblioteca/subtipos"],
  ["Niveles", "/biblioteca/niveles"],
  ["Clasificaciones", "/biblioteca/clasificaciones"],
  ["Bibliografía", "/biblioteca/bibliografia"],
] as const;

export function LibraryShell({ crumbs, children }: { crumbs: Crumb[]; children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <nav aria-label="Secciones de la biblioteca" className="mx-auto w-full max-w-5xl px-4">
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {SECTIONS.map(([label, href]) => (
            <li key={href}>
              <Link href={href} className="inline-flex min-h-8 items-center text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <main className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-4 pb-16 pt-4">
        <Breadcrumbs items={crumbs} />
        {children}
      </main>
    </>
  );
}
