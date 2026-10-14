import type { Metadata } from "next";
import { LibraryShell } from "@/components/library/library-shell";
import { SOURCES } from "@/content/sources";

export const metadata: Metadata = {
  title: "Bibliografía · Biblioteca · Cuarto Camino",
  description: "Fuentes citadas en la biblioteca del eneagrama, con la advertencia de que las citas requieren verificación editorial.",
};

const KIND_LABEL = { book: "Libro", article: "Artículo", web: "Web" } as const;

export default function BibliographyPage() {
  const sources = Object.values(SOURCES).sort((a, b) => a.author.localeCompare(b.author) || (a.year ?? 0) - (b.year ?? 0));
  return (
    <LibraryShell crumbs={[{ label: "Biblioteca", href: "/biblioteca" }, { label: "Bibliografía" }]}>
      <header className="space-y-3">
        <h1 className="font-serif text-3xl md:text-4xl">Bibliografía</h1>
        <p className="rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground">
          Las citas están pendientes de verificación editorial: título, año y edición deben confirmarse antes del lanzamiento público.
        </p>
      </header>
      <ul className="space-y-4">
        {sources.map((s) => (
          <li key={s.key} id={s.key} className="scroll-mt-4 space-y-1">
            <p>
              <span className="font-medium">{s.author}</span>
              {s.year ? ` (${s.year})` : ""}. <cite>{s.title}</cite>
            </p>
            <p className="text-xs text-muted-foreground">{KIND_LABEL[s.kind]}</p>
            {s.note && <p className="text-sm text-muted-foreground">{s.note}</p>}
          </li>
        ))}
      </ul>
    </LibraryShell>
  );
}
