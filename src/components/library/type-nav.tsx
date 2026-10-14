import Link from "next/link";
import { TYPE_NAMES, type EnneagramType } from "@/domain/enneagram/structure";

/** Previous / next type navigation (wraps 9 -> 1). `section` is "", "/subtipos" or "/niveles". */
export function TypeNav({ type, section }: { type: EnneagramType; section: "" | "/subtipos" | "/niveles" }) {
  const prev = (type === 1 ? 9 : type - 1) as EnneagramType;
  const next = (type === 9 ? 1 : type + 1) as EnneagramType;
  const cls = "flex min-h-12 flex-1 flex-col justify-center rounded-lg border border-border bg-card px-4 py-2 hover:bg-muted";
  return (
    <nav aria-label="Navegación entre tipos" className="flex flex-col gap-3 sm:flex-row">
      <Link href={`/biblioteca/tipos/${prev}${section}`} rel="prev" className={cls}>
        <span className="text-xs text-muted-foreground">Anterior</span>
        <span>← Tipo {prev} · {TYPE_NAMES[prev]}</span>
      </Link>
      <Link href={`/biblioteca/tipos/${next}${section}`} rel="next" className={`${cls} sm:text-right`}>
        <span className="text-xs text-muted-foreground">Siguiente</span>
        <span>Tipo {next} · {TYPE_NAMES[next]} →</span>
      </Link>
    </nav>
  );
}
