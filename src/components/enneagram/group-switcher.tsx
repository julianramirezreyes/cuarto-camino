"use client";

import { cn } from "@/lib/utils";
import { GROUP_MODES, MODE_HINTS, MODE_LABELS, type GroupMode } from "./groups";

/** Chooses which of the three classic groupings the diagram shows around the circle (or none). */
export function GroupSwitcher({
  value,
  onChange,
  className,
}: {
  value: GroupMode;
  onChange: (mode: GroupMode) => void;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div role="group" aria-label="Agrupación de los tipos" className="flex flex-wrap gap-2">
        {GROUP_MODES.map((mode) => {
          const pressed = value === mode;
          return (
            <button
              key={mode}
              type="button"
              aria-pressed={pressed}
              onClick={() => onChange(mode)}
              className={cn(
                "min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                pressed ? "border-primary bg-primary text-primary-foreground" : "border-control bg-card hover:bg-muted",
              )}
            >
              {MODE_LABELS[mode]}
            </button>
          );
        })}
      </div>
      {value !== "none" ? <p className="text-sm text-muted-foreground">{MODE_HINTS[value]}</p> : null}
    </div>
  );
}
