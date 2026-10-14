import type { SourceRef } from "@/content/schema";
import { SectionShell } from "../common";

/** L · Bibliografía. Sources are resolved on the server from the keys the shown content uses. */
export function BibliographySection({ sources }: { sources: readonly SourceRef[] }) {
  const unique = [...new Map(sources.map((s) => [s.key, s])).values()];
  return (
    <SectionShell title="Bibliografía" intro="Fuentes en las que se apoya el contenido que estás viendo.">
      <p className="rounded-xl border border-border bg-muted p-4 text-sm">
        Estas citas necesitan verificación editorial (título, año y edición) antes del lanzamiento público.
      </p>
      <ul className="space-y-3">
        {unique.map((s) => (
          <li key={s.key} className="rounded-xl border border-border bg-card p-4">
            <p>
              {s.author}
              {s.year ? ` (${s.year})` : ""}. <em>{s.title}</em>.
            </p>
            {s.note ? <p className="text-sm text-muted-foreground">{s.note}</p> : null}
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
