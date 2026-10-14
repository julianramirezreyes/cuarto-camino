"use client";

import type { RelationshipContext } from "@/content/schema";
import { cn } from "@/lib/utils";
import { CONTEXTS, CONTEXT_LABELS } from "./labels";

/** Chooses the kind of bond to read about. Toggle buttons (aria-pressed), one active at a time. */
export function ContextSelector({
  value,
  onChange,
  className,
}: {
  value: RelationshipContext;
  onChange: (context: RelationshipContext) => void;
  className?: string;
}) {
  return (
    <div role="group" aria-label="Tipo de vínculo" className={cn("flex flex-wrap gap-2", className)}>
      {CONTEXTS.map((context) => {
        const pressed = value === context;
        return (
          <button
            key={context}
            type="button"
            aria-pressed={pressed}
            onClick={() => onChange(context)}
            className={cn(
              "min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              pressed ? "border-primary bg-primary text-primary-foreground" : "border-control bg-card hover:bg-muted",
            )}
          >
            {CONTEXT_LABELS[context]}
          </button>
        );
      })}
    </div>
  );
}
