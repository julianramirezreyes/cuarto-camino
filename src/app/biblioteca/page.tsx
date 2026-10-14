import type { Metadata } from "next";
import Link from "next/link";
import { LibraryShell } from "@/components/library/library-shell";
import { TypePicker } from "@/components/library/type-picker";
import { TYPE_PROFILES } from "@/content/types";
import { ENNEAGRAM_TYPES, type EnneagramType } from "@/domain/enneagram/structure";

export const metadata: Metadata = {
  title: "Biblioteca del eneagrama · Cuarto Camino",
  description:
    "Consulta abierta sobre el eneagrama: historia y orígenes, los nueve tipos, subtipos, niveles, clasificaciones y bibliografía. Un modelo interpretativo con evidencia científica limitada.",
};

const SECTIONS = [
  ["Historia y orígenes", "/biblioteca/historia", "De Gurdjieff y Ouspensky a Ichazo, Naranjo, Riso y Hudson, Chestnut y Palmer, y qué dice la evidencia."],
  ["Los nueve tipos", "/biblioteca/tipos", "Perfiles completos con motivaciones, pasiones, alas y preguntas de autoobservación."],
  ["Subtipos", "/biblioteca/subtipos", "Las tres variantes instintivas de cada tipo y cómo se diferencian."],
  ["Niveles de desarrollo", "/biblioteca/niveles", "Nueve niveles por tipo, de un funcionamiento más flexible a uno más rígido."],
  ["Clasificaciones", "/biblioteca/clasificaciones", "Centros, grupos horneviano y armónico, flechas y una nota sobre tritipos."],
  ["Bibliografía", "/biblioteca/bibliografia", "Todas las fuentes citadas en la biblioteca."],
] as const;

export default function LibraryHome() {
  const summaries = Object.fromEntries(
    ENNEAGRAM_TYPES.map((n) => [n, TYPE_PROFILES[n].summary]),
  ) as Record<EnneagramType, string>;

  return (
    <LibraryShell crumbs={[{ label: "Biblioteca" }]}>
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-accent">Biblioteca</p>
        <h1 className="font-serif text-3xl md:text-4xl">Biblioteca del eneagrama</h1>
        <p className="text-lg text-muted-foreground">
          Una guía abierta, sin cuenta ni evaluación, para explorar el eneagrama con cuidado. Distingue lo que cada escuela propone de lo que está comprobado, que es poco: es un modelo interpretativo, no un diagnóstico. Parte del contenido está marcado como borrador editorial mientras espera revisión de especialistas.
        </p>
      </header>

      <section aria-labelledby="elegir-tipo" className="space-y-4">
        <h2 id="elegir-tipo" className="font-serif text-2xl">Elige un tipo en el símbolo</h2>
        <TypePicker summaries={summaries} />
      </section>

      <section aria-labelledby="explorar" className="space-y-4">
        <h2 id="explorar" className="font-serif text-2xl">Explora por secciones</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {SECTIONS.map(([title, href, text]) => (
            <li key={href} className="rounded-xl border border-border bg-card p-4">
              <h3 className="font-medium">
                <Link href={href} className="underline underline-offset-4">{title}</Link>
              </h3>
              <p className="text-sm text-muted-foreground">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-sm text-muted-foreground">
        ¿Prefieres descubrir tus propios patrones?{" "}
        <Link href="/introduccion" className="underline underline-offset-4">Haz la evaluación guiada</Link>.
      </p>
    </LibraryShell>
  );
}
