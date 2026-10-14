"use client";

import { useState } from "react";
import type { WingProfile } from "@/content/schema";
import type { ReportWing } from "@/domain/adaptive-engine";
import type { EnneagramType } from "@/domain/enneagram/structure";
import { BulletList, Card, SectionShell, ShareBar, ToggleButton } from "../common";
import type { TypeBundle } from "../types";

type Choice = EnneagramType | "open";

function WingDetail({ wing }: { wing: WingProfile }) {
  return (
    <div className="space-y-4">
      <h3 className="font-serif text-xl">{wing.label}</h3>
      <p>{wing.explanation}</p>
      <Card title="Motivaciones">
        <p>{wing.motivations}</p>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card title="Qué comparte con tu tipo">
          <BulletList items={wing.similarities} />
        </Card>
        <Card title="Qué añade o matiza">
          <BulletList items={wing.differences} />
        </Card>
        <Card title="Cómo puede manifestarse">
          <BulletList items={wing.manifestations} />
        </Card>
        <Card title="Fortalezas y dificultades posibles">
          <BulletList items={[...wing.strengths, ...wing.limitations]} />
        </Card>
      </div>
      <Card title="Frente a la otra ala">
        <p>{wing.comparisonWithOtherWing}</p>
      </Card>
    </div>
  );
}

/**
 * C · Tu ala. `wing` (the report's estimate) is optional: without it (type explorer) the
 * section starts in the open "por explorar" state. The user can always leave the wing open.
 */
export function WingSection({ bundle, wing, title = "Tu ala" }: { bundle: TypeBundle; wing?: ReportWing; title?: string }) {
  const wings = [...bundle.wings].sort((a, b) => a.wing - b.wing);
  const [choice, setChoice] = useState<Choice>(wing?.likelyWing ?? "open");
  const selected = choice === "open" ? null : wings.find((w) => w.wing === choice) ?? null;
  const showShares = wing !== undefined && wing.evidenceCount > 0 && wing.wings !== null;

  return (
    <SectionShell
      title={title}
      intro="El ala es la influencia de uno de los dos tipos vecinos. Compara ambas y elige la que te resuene, o déjala abierta."
    >
      {showShares && wing.wings ? (
        <Card title="Compatibilidad relativa entre las dos alas">
          <ShareBar label={`ala ${wing.wings[0]}`} share={wing.shares[0]} />
          <ShareBar label={`ala ${wing.wings[1]}`} share={wing.shares[1]} />
          <p className="text-sm text-muted-foreground">
            {wing.likelyWing === null
              ? "Con tus respuestas no hay una ala claramente más compatible."
              : `Tus respuestas se inclinan hacia el ala ${wing.likelyWing}, sin certeza.`}
          </p>
        </Card>
      ) : null}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Elegir ala">
        {wings.map((w) => (
          <ToggleButton key={w.wing} pressed={choice === w.wing} onClick={() => setChoice(w.wing)}>
            {w.label} · ala {w.wing}
          </ToggleButton>
        ))}
        <ToggleButton pressed={choice === "open"} onClick={() => setChoice("open")}>
          Dejar mi ala por explorar
        </ToggleButton>
      </div>
      {selected ? (
        <WingDetail wing={selected} />
      ) : (
        <div className="space-y-3">
          <p className="text-muted-foreground">Dejar el ala abierta es una opción válida. Estas son las dos posibilidades:</p>
          <div className="grid gap-4 md:grid-cols-2">
            {wings.map((w) => (
              <Card key={w.wing} title={w.label}>
                <p>{w.explanation}</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </SectionShell>
  );
}
