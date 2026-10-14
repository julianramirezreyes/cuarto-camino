import Link from "next/link";
import type { EnneagramType } from "@/domain/enneagram/structure";
import { cn } from "@/lib/utils";

const ITEMS = [
  { section: "", label: "Perfil" },
  { section: "/subtipos", label: "Subtipos" },
  { section: "/niveles", label: "Niveles" },
] as const;

export function TypeSubnav({ type, current }: { type: EnneagramType; current: "" | "/subtipos" | "/niveles" }) {
  return (
    <nav aria-label={`Secciones del tipo ${type}`}>
      <ul className="flex flex-wrap gap-2">
        {ITEMS.map(({ section, label }) => (
          <li key={label}>
            <Link
              href={`/biblioteca/tipos/${type}${section}`}
              aria-current={current === section ? "page" : undefined}
              className={cn(
                "inline-flex min-h-11 items-center rounded-full border border-border px-4 text-sm",
                current === section ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted",
              )}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
