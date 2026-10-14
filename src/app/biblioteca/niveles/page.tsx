import type { Metadata } from "next";
import Link from "next/link";
import { LibraryShell } from "@/components/library/library-shell";
import { ENNEAGRAM_TYPES, TYPE_NAMES } from "@/domain/enneagram/structure";

export const metadata: Metadata = {
  title: "Niveles de desarrollo · Biblioteca · Cuarto Camino",
  description: "Qué son los nueve niveles de desarrollo del eneagrama, cómo leerlos con cuidado y dónde ver los de cada tipo.",
};

export default function LevelsIndexPage() {
  return (
    <LibraryShell crumbs={[{ label: "Biblioteca", href: "/biblioteca" }, { label: "Niveles" }]}>
      <header className="space-y-3">
        <h1 className="font-serif text-3xl md:text-4xl">Niveles de desarrollo</h1>
        <p className="text-lg text-muted-foreground">
          La escuela de Riso y Hudson describe nueve niveles dentro de cada tipo: los primeros reflejan un funcionamiento más flexible, los intermedios uno habitual y los últimos uno más rígido o reactivo.
        </p>
      </header>
      <section aria-labelledby="como-leer" className="space-y-2">
        <h2 id="como-leer" className="font-serif text-2xl">Cómo leerlos</h2>
        <ul className="list-disc space-y-1.5 pl-5 text-muted-foreground">
          <li>Describen tendencias que cambian con el momento, el entorno y el cuidado; no son un lugar fijo.</li>
          <li>No son una escala clínica ni miden salud mental. Su validación científica es limitada.</li>
          <li>Las etiquetas que verás son redacciones editoriales prudentes, no los nombres originales de la escuela.</li>
          <li>Si algo de lo que lees te resulta doloroso, hablarlo con un profesional es una buena decisión.</li>
        </ul>
      </section>
      <section aria-labelledby="por-tipo" className="space-y-3">
        <h2 id="por-tipo" className="font-serif text-2xl">Niveles de cada tipo</h2>
        <ul className="grid gap-2 sm:grid-cols-3">
          {ENNEAGRAM_TYPES.map((n) => (
            <li key={n}>
              <Link href={`/biblioteca/tipos/${n}/niveles`} className="flex min-h-11 items-center rounded-lg border border-border px-3 hover:bg-muted">
                Niveles del {n} · {TYPE_NAMES[n]}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </LibraryShell>
  );
}
