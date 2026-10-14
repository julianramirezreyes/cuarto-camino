import { cn } from "@/lib/utils";
import { Heading, type HeadingLevel } from "./heading";

/**
 * The honest framing of the feature. Always visible (never collapsed): the lenses' disclaimers say the
 * tradition blesses no pairing and that no verifiable study shows the pair of types predicts satisfaction.
 */
export function RelationshipDisclaimers({
  disclaimers,
  level = 2,
  className,
}: {
  disclaimers: readonly string[];
  level?: HeadingLevel;
  className?: string;
}) {
  return (
    <aside
      role="note"
      aria-labelledby="relationship-disclaimers-title"
      className={cn("space-y-3 rounded-2xl border border-accent bg-muted p-5", className)}
    >
      <Heading level={level} id="relationship-disclaimers-title" className="font-serif text-xl">
        Antes de leer esto
      </Heading>
      <ul className="list-disc space-y-1.5 pl-5 marker:text-accent">
        {disclaimers.map((text) => (
          <li key={text}>{text}</li>
        ))}
      </ul>
    </aside>
  );
}
