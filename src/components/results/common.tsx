import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import type { Attribution } from "@/content/schema";
import { cn } from "@/lib/utils";

export const pct = (x: number) => `${Math.round(x * 100)}%`;

export const ATTRIBUTION_ES: Record<Attribution, string> = {
  naranjo: "Claudio Naranjo",
  chestnut: "Beatrice Chestnut",
  "riso-hudson": "Riso y Hudson",
  ichazo: "Oscar Ichazo",
  palmer: "Helen Palmer",
  horney: "Karen Horney",
  editorial: "síntesis editorial",
  contemporary: "enfoques contemporáneos",
};

export function SectionShell({ title, intro, children }: { title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section className="space-y-5" aria-label={title}>
      <header className="space-y-2">
        <h2 className="font-serif text-2xl sm:text-3xl">{title}</h2>
        {intro ? <p className="text-muted-foreground">{intro}</p> : null}
      </header>
      {children}
    </section>
  );
}

export function Card({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-2 rounded-2xl border border-border bg-card p-5", className)}>
      {title ? <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3> : null}
      {children}
    </div>
  );
}

export function BulletList({ items, label }: { items: readonly string[]; label?: string }) {
  return (
    <ul aria-label={label} className="list-disc space-y-1.5 pl-5 marker:text-accent">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

/** Relative-affinity bar. `role="meter"`: it is a static measure, not a task progress. */
export function ShareBar({
  label,
  share,
  strong,
  onSelect,
  selected,
}: {
  label: string;
  share: number;
  strong?: boolean;
  /** When given, the label becomes a button (selector); `selected` marks the one being viewed. */
  onSelect?: () => void;
  selected?: boolean;
}) {
  const value = Math.round(share * 100);
  const selector = onSelect !== undefined;
  return (
    <div
      className={cn(
        "space-y-1",
        // Selector: a real card. The button stretches over the whole card, so any tap on it counts; the meter stays outside the button.
        selector &&
          cn(
            "relative space-y-2 rounded-xl border p-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent",
            selected ? "border-primary bg-primary/10" : "border-control bg-card hover:border-primary hover:bg-muted",
          ),
      )}
    >
      <div className={cn("flex justify-between gap-3 text-sm", selector ? "items-center" : "items-baseline")}>
        {onSelect ? (
          <button
            type="button"
            aria-pressed={selected === true}
            onClick={onSelect}
            className="flex min-h-9 items-center gap-2 text-left font-medium outline-none after:absolute after:inset-0 after:rounded-xl after:content-['']"
          >
            {label}
            {selected ? <span className="rounded-full border border-primary px-2 py-0.5 text-xs">Viendo</span> : null}
            <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          </button>
        ) : (
          <span>{label}</span>
        )}
        <span className="font-semibold tabular-nums">{pct(share)}</span>
      </div>
      <div
        role="meter"
        aria-label={`Afinidad relativa de ${label}: ${value}%`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        className="h-2.5 overflow-hidden rounded-full bg-muted"
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none", strong ? "bg-primary" : "bg-accent")}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

/** Pill-style toggle button (aria-pressed). */
export function ToggleButton({
  pressed,
  onClick,
  children,
  className,
}: {
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "min-h-11 rounded-full border px-4 py-2 text-left text-sm font-medium transition-colors",
        pressed ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted",
        className,
      )}
    >
      {children}
    </button>
  );
}
