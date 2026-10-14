"use client";

import Link from "next/link";
import { useState } from "react";
import { EnneagramDiagram } from "@/components/enneagram/enneagram-diagram";
import {
  CENTERS,
  ENNEAGRAM_TYPES,
  TYPE_NAMES,
  type EnneagramType,
} from "@/domain/enneagram/structure";
import { cn } from "@/lib/utils";

const CENTER_LABEL = { instinctive: "instintivo", emotional: "emocional", mental: "mental" } as const;

function centerOf(type: EnneagramType) {
  const key = (Object.keys(CENTERS) as (keyof typeof CENTERS)[]).find((k) => (CENTERS[k] as readonly number[]).includes(type));
  return key ? CENTER_LABEL[key] : "";
}

interface Props {
  /** Optional one-line summaries per type, provided by the server page. */
  summaries?: Partial<Record<EnneagramType, string>>;
}

export function TypePicker({ summaries }: Props) {
  const [selected, setSelected] = useState<EnneagramType | null>(null);
  const [showArrows, setShowArrows] = useState(false);

  return (
    <div className="grid gap-8 md:grid-cols-2 md:items-start">
      <div className="space-y-3">
        <EnneagramDiagram selected={selected} onSelect={setSelected} arrows={showArrows ? "both" : "none"} className="mx-auto" />
        <button
          type="button"
          aria-pressed={showArrows}
          onClick={() => setShowArrows((v) => !v)}
          className={cn(
            "mx-auto flex min-h-11 items-center rounded-full border border-border px-4 text-sm",
            showArrows ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted",
          )}
        >
          Mostrar flechas tradicionales de integración y estrés
        </button>
        {showArrows && (
          <p className="text-center text-xs text-muted-foreground">
            Las flechas siguen la presentación clásica; otras escuelas las interpretan de forma distinta.
          </p>
        )}
      </div>

      <div className="space-y-4" aria-live="polite">
        {selected === null ? (
          <p className="text-muted-foreground">Elige un punto del símbolo para ver un resumen del tipo y acceder a su ficha.</p>
        ) : (
          <div className="space-y-3 rounded-xl border border-border bg-card p-4">
            <h3 className="font-serif text-2xl">Tipo {selected} · {TYPE_NAMES[selected]}</h3>
            <p className="text-sm text-muted-foreground">Centro {centerOf(selected)}</p>
            {summaries?.[selected] && <p>{summaries[selected]}</p>}
            <ul className="flex flex-col gap-2">
              <li>
                <Link href={`/biblioteca/tipos/${selected}`} className="underline underline-offset-4">
                  Ver perfil completo del tipo {selected}
                </Link>
              </li>
              <li>
                <Link href={`/biblioteca/tipos/${selected}/subtipos`} className="underline underline-offset-4">
                  Subtipos del tipo {selected}
                </Link>
              </li>
              <li>
                <Link href={`/biblioteca/tipos/${selected}/niveles`} className="underline underline-offset-4">
                  Niveles del tipo {selected}
                </Link>
              </li>
            </ul>
          </div>
        )}
        <nav aria-label="Los nueve tipos">
          <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
            {ENNEAGRAM_TYPES.map((n) => (
              <li key={n}>
                <Link href={`/biblioteca/tipos/${n}`} className="flex min-h-11 items-center rounded-lg border border-border px-3 text-sm hover:bg-muted">
                  Tipo {n} · {TYPE_NAMES[n]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
