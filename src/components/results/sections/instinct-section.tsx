"use client";

import { useState } from "react";
import type { InstinctResult } from "@/domain/scoring/instinct";
import { INSTINCTS, type Instinct } from "@/domain/enneagram/structure";
import { BulletList, Card, SectionShell, ToggleButton } from "../common";
import type { TypeBundle } from "../types";

const INSTINCT_ES: Record<Instinct, string> = {
  sp: "Conservación (sp)",
  so: "Social (so)",
  sx: "Sexual / uno a uno (sx)",
};

/**
 * D · Tus instintos. All three instincts are always explorable. The data may suggest a
 * DOMINANT instinct; a full stack is never claimed (the six stackings are only educational).
 */
export function InstinctSection({ bundle, instinct, title = "Tus instintos" }: { bundle: TypeBundle; instinct?: InstinctResult; title?: string }) {
  const dominant = instinct?.dominant ?? null;
  const [selected, setSelected] = useState<Instinct | null>(dominant);
  const profile = bundle.subtypes.find((s) => s.instinct === selected) ?? null;

  return (
    <SectionShell
      title={title}
      intro="Los tres instintos están presentes en todas las personas. Explora cada subtipo de tu tipo y observa con cuál te reconoces."
    >
      {instinct ? (
        <p className="rounded-xl border border-border bg-muted p-4">
          {dominant
            ? `Tus respuestas sugieren que el instinto dominante podría ser ${INSTINCT_ES[dominant]}. Es solo una pista del instinto dominante: no se afirma un orden completo de instintos.`
            : "No hay un instinto dominante claro con las respuestas disponibles. Explora los tres sin prisa."}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Explorar instintos">
        {INSTINCTS.map((i) => (
          <ToggleButton key={i} pressed={selected === i} onClick={() => setSelected(i)}>
            {INSTINCT_ES[i]}
            {dominant === i ? " · sugerido" : ""}
          </ToggleButton>
        ))}
      </div>
      {profile ? (
        <div className="space-y-4">
          <h3 className="font-serif text-xl">{profile.name}</h3>
          <p>{profile.description}</p>
          {profile.countertype.isCountertype ? (
            <p className="text-sm text-muted-foreground">Contratipo: {profile.countertype.note}</p>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card title="Motivaciones">
              <BulletList items={profile.motivations} />
            </Card>
            <Card title="Cómo puede verse por fuera">
              <BulletList items={profile.outerManifestations} />
            </Card>
            <Card title="Lo que puede ocurrir por dentro">
              <BulletList items={profile.innerBehaviors} />
            </Card>
            <Card title="Necesidades y miedos">
              <BulletList items={[...profile.needs, ...profile.fears]} />
            </Card>
            <Card title="Fortalezas">
              <BulletList items={profile.strengths} />
            </Card>
            <Card title="Dificultades posibles">
              <BulletList items={profile.difficulties} />
            </Card>
          </div>
          <Card title="Frente a los otros dos subtipos">
            <p>{profile.differencesFromOtherSubtypes}</p>
          </Card>
        </div>
      ) : (
        <p className="text-muted-foreground">Elige un instinto para leer su subtipo.</p>
      )}
      <div className="space-y-3 border-t border-border pt-5">
        <h3 className="font-serif text-xl">Combinaciones de instintos (modelo teórico)</h3>
        <p className="text-sm text-muted-foreground">Material educativo: no es un resultado tuyo.</p>
        <ul aria-label="Combinaciones teóricas de instintos" className="grid gap-3 md:grid-cols-2">
          {bundle.stackings.map((s) => (
            <li key={s.order} className="rounded-xl border border-border bg-card p-4">
              <span className="font-semibold">{s.order}</span>
              <p className="text-sm">{s.description}</p>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">{bundle.stackingsNote}</p>
      </div>
    </SectionShell>
  );
}
