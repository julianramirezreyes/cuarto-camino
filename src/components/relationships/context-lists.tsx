import { useId } from "react";
import type { RelationshipContextGuide } from "@/content/schema";
import { Heading, type HeadingLevel } from "./heading";

const BLOCKS = [
  ["brings", "Qué suele aportar"],
  ["needs", "Qué suele necesitar"],
  ["frictions", "Fricciones posibles"],
  ["tips", "Sugerencias"],
] as const;

/** The four labelled lists of one type in one kind of bond. Descriptive tendencies, never predictions. */
export function ContextLists({ guide, level }: { guide: RelationshipContextGuide; level: HeadingLevel }) {
  const uid = useId();
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {BLOCKS.map(([key, label]) => (
        <div key={key} className="space-y-2 rounded-2xl border border-border bg-card p-5">
          <Heading level={level} id={`${uid}-${key}`} className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </Heading>
          <ul aria-labelledby={`${uid}-${key}`} className="list-disc space-y-1.5 pl-5 marker:text-accent">
            {guide[key].map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
