"use client";

import { useState } from "react";
import {
  CENTERS,
  HARMONIC_GROUPS,
  HORNEVIAN_GROUPS,
  INTEGRATION,
  STRESS,
  TYPE_NAMES,
  type EnneagramType,
} from "@/domain/enneagram/structure";
import { EnneagramDiagram, type ArrowMode } from "@/components/enneagram/enneagram-diagram";
import { SectionShell, ToggleButton } from "../common";
import type { TypeBundle } from "../types";

const CENTER_ES = { instinctive: "instintivo (visceral)", emotional: "emocional", mental: "mental" } as const;
const HORNEVIAN_ES = { assertive: "asertivo", compliant: "complaciente", withdrawn: "retraído" } as const;
const HARMONIC_ES = { competency: "competencia", positiveOutlook: "perspectiva positiva", reactive: "reactivo" } as const;

function groupOf<K extends string>(groups: Record<K, readonly EnneagramType[]>, type: EnneagramType): K {
  return (Object.keys(groups) as K[]).find((k) => groups[k].includes(type))!;
}

/** I · Conexiones. Selecting a point on the diagram asks the parent to explore that type. */
export function ConnectionsSection({
  bundle,
  onSelectType,
  title = "Conexiones",
}: {
  bundle: TypeBundle;
  onSelectType: (type: EnneagramType) => void;
  title?: string;
}) {
  const [integration, setIntegration] = useState(true);
  const [stress, setStress] = useState(true);
  const mode: ArrowMode = integration && stress ? "both" : integration ? "integration" : stress ? "stress" : "none";
  const t = bundle.type;
  const center = groupOf(CENTERS, t);
  const horn = groupOf(HORNEVIAN_GROUPS, t);
  const harm = groupOf(HARMONIC_GROUPS, t);

  return (
    <SectionShell
      title={title}
      intro="El símbolo muestra cómo se relacionan los nueve tipos. Toca un punto para explorar ese eneatipo."
    >
      <div className="grid items-center gap-6 md:grid-cols-2">
        <EnneagramDiagram selected={t} onSelect={onSelectType} arrows={mode} className="mx-auto" />
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Flechas del diagrama">
            <ToggleButton pressed={integration} onClick={() => setIntegration((v) => !v)}>
              Mostrar integración
            </ToggleButton>
            <ToggleButton pressed={stress} onClick={() => setStress((v) => !v)}>
              Mostrar estrés
            </ToggleButton>
          </div>
          <ul className="space-y-2">
            <li>
              Dirección de integración (línea continua): tipo {INTEGRATION[t]} · {TYPE_NAMES[INTEGRATION[t]]}.
            </li>
            <li>
              Dirección de estrés (línea punteada): tipo {STRESS[t]} · {TYPE_NAMES[STRESS[t]]}.
            </li>
          </ul>
          <ul className="space-y-2 rounded-xl border border-border bg-card p-4" aria-label="Grupos del tipo">
            <li>Centro {CENTER_ES[center]}: tipos {CENTERS[center].join(", ")}.</li>
            <li>Estilo hornevian {HORNEVIAN_ES[horn]}: tipos {HORNEVIAN_GROUPS[horn].join(", ")}.</li>
            <li>Grupo armónico {HARMONIC_ES[harm]}: tipos {HARMONIC_GROUPS[harm].join(", ")}.</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Las flechas y los grupos son un modelo tradicional; las interpretaciones varían según la escuela y no describen cómo vas a comportarte.
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
