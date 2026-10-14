import type { Metadata } from "next";
import Link from "next/link";
import { ATTRIBUTION_LABEL, SourceLinks } from "@/components/library/common";
import { LibraryShell } from "@/components/library/library-shell";
import { DraftNotice } from "@/components/library/draft-notice";
import {
  EVIDENCE_KIND_DESCRIPTION,
  EVIDENCE_KIND_LABEL,
  EVIDENCE_KINDS,
  HISTORY_INTRO,
  HISTORY_SECTIONS,
} from "@/content/history";

export const metadata: Metadata = {
  title: "Historia y orígenes del eneagrama · Biblioteca · Cuarto Camino",
  description:
    "Del símbolo de Gurdjieff y Ouspensky a Ichazo, Naranjo, Riso y Hudson, Chestnut y Palmer. Qué proponen las escuelas, qué es interpretación y qué dice la evidencia científica.",
};

export default function HistoryPage() {
  return (
    <LibraryShell crumbs={[{ label: "Biblioteca", href: "/biblioteca" }, { label: "Historia" }]}>
      <header className="space-y-3">
        <h1 className="font-serif text-3xl md:text-4xl">Historia y orígenes</h1>
        <p className="text-lg text-muted-foreground">{HISTORY_INTRO}</p>
        <DraftNotice status="draft" />
      </header>

      <section aria-labelledby="como-leer" className="space-y-3">
        <h2 id="como-leer" className="font-serif text-2xl">Cómo leer esta página</h2>
        <p className="text-muted-foreground">Cada afirmación lleva una etiqueta que indica qué tipo de afirmación es:</p>
        <dl className="space-y-1.5">
          {EVIDENCE_KINDS.map((k) => (
            <div key={k}>
              <dt className="inline font-medium">{EVIDENCE_KIND_LABEL[k]}: </dt>
              <dd className="inline text-muted-foreground">{EVIDENCE_KIND_DESCRIPTION[k]}</dd>
            </div>
          ))}
        </dl>
      </section>

      {HISTORY_SECTIONS.map((section) => (
        <section key={section.id} aria-labelledby={`${section.id}-title`} className="space-y-3">
          <h2 id={`${section.id}-title`} className="font-serif text-2xl">{section.title}</h2>
          <p className="text-muted-foreground">{section.summary}</p>
          <ul className="space-y-4">
            {section.claims.map((c, i) => (
              <li key={i} className="space-y-1.5 rounded-lg border border-border bg-card p-4">
                <p className="text-xs">
                  <span className="rounded border border-border px-1.5 py-0.5">{EVIDENCE_KIND_LABEL[c.kind]}</span>{" "}
                  <span className="text-muted-foreground">Según: {ATTRIBUTION_LABEL[c.attribution] ?? c.attribution}</span>
                </p>
                <p>{c.text}</p>
                <p><SourceLinks keys={c.sources} /></p>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="text-sm text-muted-foreground">
        Consulta todas las fuentes en la <Link href="/biblioteca/bibliografia" className="underline underline-offset-4">bibliografía</Link>.
      </p>
    </LibraryShell>
  );
}
