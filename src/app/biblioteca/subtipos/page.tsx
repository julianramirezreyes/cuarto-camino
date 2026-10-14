import type { Metadata } from "next";
import Link from "next/link";
import { LibraryShell } from "@/components/library/library-shell";
import { INSTINCT_STACKINGS } from "@/content/subtypes";
import { ENNEAGRAM_TYPES, TYPE_NAMES } from "@/domain/enneagram/structure";

export const metadata: Metadata = {
  title: "Subtipos instintivos · Biblioteca · Cuarto Camino",
  description: "Qué son los 27 subtipos del eneagrama, los tres instintos y cómo explorar el subtipo de cada tipo.",
};

const INSTINCTS = [
  ["Conservación", "Atención a la seguridad, los recursos, la salud y el refugio."],
  ["Social", "Atención a los grupos, el lugar que se ocupa en ellos y la contribución."],
  ["Sexual (uno a uno)", "Atención a la intensidad, la atracción y los vínculos cercanos. No se reduce a lo sexual en sentido estricto."],
] as const;

export default function SubtypesIndexPage() {
  return (
    <LibraryShell crumbs={[{ label: "Biblioteca", href: "/biblioteca" }, { label: "Subtipos" }]}>
      <header className="space-y-3">
        <h1 className="font-serif text-3xl md:text-4xl">Subtipos instintivos</h1>
        <p className="text-lg text-muted-foreground">
          Cada tipo se describe en tres variantes según el instinto que más lo colorea; de ahí los 27 subtipos que sistematizó Chestnut a partir de Naranjo. Son descripciones de escuela para explorar.
        </p>
      </header>

      <section aria-labelledby="instintos" className="space-y-3">
        <h2 id="instintos" className="font-serif text-2xl">Los tres instintos</h2>
        <dl className="space-y-2">
          {INSTINCTS.map(([term, text]) => (
            <div key={term}>
              <dt className="font-medium">{term}</dt>
              <dd className="text-muted-foreground">{text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="ordenes" className="space-y-3">
        <h2 id="ordenes" className="font-serif text-2xl">Órdenes entre instintos</h2>
        <p className="text-muted-foreground">{INSTINCT_STACKINGS.note}</p>
        <ul className="space-y-2">
          {INSTINCT_STACKINGS.stackings.map((s) => (
            <li key={s.order}>
              <strong className="font-medium">{s.order}:</strong> {s.description}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="por-tipo" className="space-y-3">
        <h2 id="por-tipo" className="font-serif text-2xl">Subtipos de cada tipo</h2>
        <ul className="grid gap-2 sm:grid-cols-3">
          {ENNEAGRAM_TYPES.map((n) => (
            <li key={n}>
              <Link href={`/biblioteca/tipos/${n}/subtipos`} className="flex min-h-11 items-center rounded-lg border border-border px-3 hover:bg-muted">
                Subtipos del {n} · {TYPE_NAMES[n]}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </LibraryShell>
  );
}
