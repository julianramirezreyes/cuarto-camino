import Link from "next/link";
import type { ReactNode } from "react";
import type { Claim } from "@/content/schema";
import { SOURCES } from "@/content/sources";

export const ATTRIBUTION_LABEL: Record<string, string> = {
  naranjo: "Naranjo",
  chestnut: "Chestnut",
  "riso-hudson": "Riso y Hudson",
  ichazo: "Ichazo",
  palmer: "Palmer",
  horney: "Horney",
  gurdjieff: "Gurdjieff",
  ouspensky: "Ouspensky",
  editorial: "Interpretación editorial",
  contemporary: "Interpretaciones contemporáneas",
};

export function BulletList({ items, className }: { items: readonly ReactNode[]; className?: string }) {
  return (
    <ul className={`list-disc space-y-1.5 pl-5 ${className ?? ""}`}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function Section({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id ? `${id}-title` : undefined} className="space-y-3">
      <h2 id={id ? `${id}-title` : undefined} className="font-serif text-2xl">{title}</h2>
      {children}
    </section>
  );
}

/** Inline citations linking to the bibliography page. Unknown keys are skipped. */
export function SourceLinks({ keys }: { keys: readonly string[] }) {
  const known = keys.filter((k) => SOURCES[k]);
  if (known.length === 0) return null;
  return (
    <span className="text-xs text-muted-foreground">
      Fuentes:{" "}
      {known.map((k, i) => (
        <span key={k}>
          {i > 0 && ", "}
          <Link href={`/biblioteca/bibliografia#${k}`} className="underline underline-offset-2 hover:text-foreground">
            {SOURCES[k].author.split(" & ")[0]}
            {SOURCES[k].year ? ` (${SOURCES[k].year})` : ""}
          </Link>
        </span>
      ))}
    </span>
  );
}

export function ClaimBlock({ label, claim }: { label: string; claim: Claim }) {
  return (
    <div className="space-y-1">
      <h3 className="font-medium">{label}</h3>
      <p>{claim.text}</p>
      <p className="text-xs text-muted-foreground">
        Según: {ATTRIBUTION_LABEL[claim.attribution] ?? claim.attribution}.{" "}
        {claim.sources && <SourceLinks keys={claim.sources} />}
      </p>
    </div>
  );
}
