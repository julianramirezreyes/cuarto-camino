import type { Metadata } from "next";
import Link from "next/link";
import { LibraryShell } from "@/components/library/library-shell";
import { DraftNotice } from "@/components/library/draft-notice";
import { SourceLinks } from "@/components/library/common";
import { RelationshipDisclaimers } from "@/components/relationships/relationship-disclaimers";
import { RELATIONSHIP_LENSES, getRelationship } from "@/content/relationships";
import { ENNEAGRAM_TYPES, TYPE_NAMES } from "@/domain/enneagram/structure";

export const metadata: Metadata = {
  title: "Relaciones en el eneagrama · Biblioteca · Cuarto Camino",
  description:
    "Cómo suele vivir cada tipo del eneagrama la amistad, la pareja, la familia y el trabajo. Una guía descriptiva, sin puntajes ni parejas ideales, que distingue la tradición de la evidencia.",
};

const EVIDENCE_SOURCES = ["enneagram-institute-combinations", "carpenter-2015", "hook-2021", "palmer-1995"] as const;

export default function RelationshipsIndexPage() {
  return (
    <LibraryShell crumbs={[{ label: "Biblioteca", href: "/biblioteca" }, { label: "Relaciones" }]}>
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-accent">Biblioteca</p>
        <h1 className="font-serif text-3xl md:text-4xl">Relaciones</h1>
        <p className="text-lg text-muted-foreground">
          Cómo suele vivir cada tipo la amistad, la pareja, la familia y el trabajo, y qué pistas dan los grupos del símbolo cuando dos personas se encuentran.
        </p>
      </header>

      <RelationshipDisclaimers disclaimers={RELATIONSHIP_LENSES.disclaimers} />

      <section aria-labelledby="que-es" className="space-y-3">
        <h2 id="que-es" className="font-serif text-2xl">Qué es y qué no es</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 rounded-xl border border-border bg-card p-4">
            <h3 className="font-medium">Qué es</h3>
            <ul className="list-disc space-y-1.5 pl-5 marker:text-accent">
              <li>Una guía por tipo y por tipo de vínculo, con lo que cada tipo suele aportar, necesitar y encontrar difícil.</li>
              <li>Una lectura de dos tipos juntos a partir de los grupos tradicionales del símbolo, siempre como tendencias.</li>
              <li>Preguntas abiertas para conversar contigo o con otra persona.</li>
            </ul>
          </div>
          <div className="space-y-2 rounded-xl border border-border bg-card p-4">
            <h3 className="font-medium">Qué no es</h3>
            <ul className="list-disc space-y-1.5 pl-5 marker:text-accent">
              <li>No es una medición, ni una prueba, ni una predicción de cómo irá una relación.</li>
              <li>No ordena ni puntúa combinaciones de tipos, y no señala parejas ideales ni a evitar.</li>
              <li>No sustituye hablar con la otra persona ni pedir apoyo profesional cuando lo necesitas.</li>
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="evidencia" className="space-y-3">
        <h2 id="evidencia" className="font-serif text-2xl">Qué dice la evidencia</h2>
        <p>
          La tradición del eneagrama sostiene que ninguna combinación de tipos está bendecida ni condenada de antemano, y que la salud y los instintos de cada persona dicen más que el tipo. Los esquemas populares de afinidad se contradicen entre sí y no encontramos estudios verificables que muestren que la combinación de tipos prediga la satisfacción en una relación.
        </p>
        <p className="text-sm text-muted-foreground">
          Más contexto en <Link href="/biblioteca/historia" className="underline underline-offset-4">historia y evidencia</Link>. <SourceLinks keys={EVIDENCE_SOURCES} />
        </p>
        <DraftNotice status={RELATIONSHIP_LENSES.status} />
      </section>

      <section aria-labelledby="tipos" className="space-y-4">
        <h2 id="tipos" className="font-serif text-2xl">Elige un tipo</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {ENNEAGRAM_TYPES.map((n) => (
            <li key={n} className="space-y-2 rounded-xl border border-border bg-card p-4">
              <h3 className="font-medium">
                <Link href={`/biblioteca/relaciones/${n}`} className="underline underline-offset-4">
                  Tipo {n} · {TYPE_NAMES[n]}
                </Link>
              </h3>
              <p className="text-sm text-muted-foreground">{getRelationship(n).summary}</p>
            </li>
          ))}
        </ul>
      </section>
    </LibraryShell>
  );
}
