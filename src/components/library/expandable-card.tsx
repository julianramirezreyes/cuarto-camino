"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}

/** Disclosure card: a real button with aria-expanded controlling a labelled region. */
export function ExpandableCard({ title, subtitle, defaultOpen = false, children, className }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const uid = useId();
  const buttonId = `${uid}-btn`;
  const panelId = `${uid}-panel`;
  return (
    <div className={cn("rounded-xl border border-border bg-card", className)}>
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-14 w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left"
        >
          <span>
            <span className="block font-medium">{title}</span>
            {subtitle && <span className="block text-sm text-muted-foreground">{subtitle}</span>}
          </span>
          <span aria-hidden="true" className={cn("text-lg transition-transform motion-reduce:transition-none", open && "rotate-180")}>
            ▾
          </span>
        </button>
      </h3>
      <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!open} className="space-y-3 border-t border-border px-4 py-4">
        {children}
      </div>
    </div>
  );
}
