"use client";

import { useRef, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TabDef {
  id: string;
  label: string;
}

/**
 * Accessible tabs (WAI-ARIA tabs pattern, automatic activation): roving tabindex,
 * ArrowLeft/ArrowRight (wrapping), Home and End. The list is sticky and horizontally
 * scrollable so it stays usable on narrow screens. Only the active panel renders its
 * content, which also defers the heavy sections until they are opened.
 */
export function SectionTabs({
  tabs,
  active,
  onChange,
  renderPanel,
}: {
  tabs: readonly TabDef[];
  active: string;
  onChange: (id: string) => void;
  renderPanel: (id: string) => ReactNode;
}) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  function go(index: number) {
    const target = tabs[(index + tabs.length) % tabs.length];
    onChange(target.id);
    refs.current[target.id]?.focus();
  }

  function onKeyDown(e: KeyboardEvent, index: number) {
    if (e.key === "ArrowRight") go(index + 1);
    else if (e.key === "ArrowLeft") go(index - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(tabs.length - 1);
    else return;
    e.preventDefault();
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-20 -mx-4 overflow-x-auto border-b border-border bg-background/95 px-4 backdrop-blur [scrollbar-width:thin]">
        <div role="tablist" aria-label="Secciones del resultado" className="flex min-w-max gap-1 py-2">
          {tabs.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[t.id] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={active === t.id}
              aria-controls={`panel-${t.id}`}
              tabIndex={active === t.id ? 0 : -1}
              onClick={() => onChange(t.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "min-h-11 whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors",
                active === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`panel-${t.id}`}
          aria-labelledby={`tab-${t.id}`}
          hidden={active !== t.id}
          tabIndex={active === t.id ? 0 : undefined}
          className="outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {active === t.id ? renderPanel(t.id) : null}
        </div>
      ))}
    </div>
  );
}
