"use client";

import { useState } from "react";
import { EnneagramDiagram } from "@/components/enneagram/enneagram-diagram";
import { GroupSwitcher } from "@/components/enneagram/group-switcher";
import type { GroupMode } from "@/components/enneagram/groups";
import type { AssessmentReport } from "@/domain/adaptive-engine";
import { INTEGRATION, STRESS, TYPE_NAMES, type EnneagramType } from "@/domain/enneagram/structure";
import { INSTINCT_ES } from "./labels";
import { BAND_LABEL, hasFunctioningSignal } from "./levels-logic";

/**
 * The whole symbol at the top of the report, as a summary: the type being read (yours, or one of your closest
 * types), its wings, its traditional arrows, the groupings and chips for what the test suggests about YOU.
 * Instinct and recent state belong to the person, not to the drawing, so they are chips beside it.
 */
export function OverviewDiagram({
  viewed,
  primaryType,
  report,
  onSelectType,
}: {
  viewed: EnneagramType;
  primaryType: EnneagramType;
  report: AssessmentReport;
  onSelectType: (type: EnneagramType) => void;
}) {
  const [groups, setGroups] = useState<GroupMode>("centers");
  const { wing, instinct, functioning } = report;
  // The wing estimate belongs to your own type: it is not offered for another type you are reading about.
  const wingChip = viewed === primaryType && wing.likelyWing ? `Ala probable · ${wing.likelyWing}` : null;
  const instinctChip = instinct.dominant ? `Instinto sugerido · ${INSTINCT_ES[instinct.dominant]}` : "Instinto · sin predominio claro";
  const stateChip = hasFunctioningSignal(functioning) && functioning.band ? `Momento reciente · ${BAND_LABEL[functioning.band]}` : null;

  return (
    <section aria-label="Tu lugar en el eneagrama" className="space-y-4 rounded-2xl border border-border bg-card p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Tu lugar en el eneagrama</h2>
      <EnneagramDiagram selected={viewed} onSelect={onSelectType} arrows="both" groups={groups} className="mx-auto" />
      <GroupSwitcher value={groups} onChange={setGroups} />
      <ul className="space-y-1 text-sm">
        <li>
          Integración (línea continua): tipo {INTEGRATION[viewed]} · {TYPE_NAMES[INTEGRATION[viewed]]}
        </li>
        <li>
          Estrés (línea punteada): tipo {STRESS[viewed]} · {TYPE_NAMES[STRESS[viewed]]}
        </li>
      </ul>
      <ul aria-label="Lo que sugiere tu resultado" className="flex flex-wrap gap-2 text-sm">
        {[wingChip, instinctChip, stateChip]
          .filter((c): c is string => c !== null)
          .map((c) => (
            <li key={c} className="rounded-full border border-control bg-muted px-3 py-1">
              {c}
            </li>
          ))}
      </ul>
      <p className="text-xs text-muted-foreground">
        Toca un número para leer sobre ese tipo. Las flechas y los grupos son un modelo tradicional; las lecturas varían según la escuela.
      </p>
    </section>
  );
}
