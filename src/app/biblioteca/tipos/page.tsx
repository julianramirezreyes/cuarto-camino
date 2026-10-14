import type { Metadata } from "next";
import Link from "next/link";
import { LibraryShell } from "@/components/library/library-shell";
import { TYPE_PROFILES } from "@/content/types";
import { ENNEAGRAM_TYPES, TYPE_NAMES } from "@/domain/enneagram/structure";

export const metadata: Metadata = {
  title: "Los nueve tipos del eneagrama · Biblioteca · Cuarto Camino",
  description: "Índice de los nueve tipos del eneagrama con un resumen de cada uno y acceso a su perfil, subtipos y niveles.",
};

export default function TypesIndexPage() {
  return (
    <LibraryShell crumbs={[{ label: "Biblioteca", href: "/biblioteca" }, { label: "Tipos" }]}>
      <header className="space-y-3">
        <h1 className="font-serif text-3xl md:text-4xl">Los nueve tipos</h1>
        <p className="text-lg text-muted-foreground">
          Nueve patrones de motivación y atención descritos por distintas escuelas. Ningún tipo es mejor que otro y ninguna descripción te define por completo.
        </p>
      </header>
      <ul className="grid gap-3 sm:grid-cols-2">
        {ENNEAGRAM_TYPES.map((n) => (
          <li key={n} className="space-y-2 rounded-xl border border-border bg-card p-4">
            <h2 className="font-medium">
              <Link href={`/biblioteca/tipos/${n}`} className="underline underline-offset-4">
                Tipo {n} · {TYPE_NAMES[n]}
              </Link>
            </h2>
            <p className="text-sm text-muted-foreground">{TYPE_PROFILES[n].summary}</p>
          </li>
        ))}
      </ul>
    </LibraryShell>
  );
}
