"use client";

import { useState } from "react";
import type { LevelProfile } from "@/content/schema";
import { cn } from "@/lib/utils";
import { BulletList } from "./common";

const BAND = (n: number) =>
  n <= 3 ? "Zona de mayor flexibilidad" : n <= 6 ? "Zona de funcionamiento habitual" : "Zona de mayor rigidez o reactividad";

function Group({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-1.5">
      <h4 className="font-medium">{title}</h4>
      <BulletList items={items} />
    </div>
  );
}

export function LevelStrip({ levels }: { levels: LevelProfile[] }) {
  const sorted = [...levels].sort((a, b) => a.level - b.level);
  const [selected, setSelected] = useState<number>(sorted[0]?.level ?? 1);
  const current = sorted.find((l) => l.level === selected) ?? sorted[0];
  if (!current) return null;

  return (
    <div className="space-y-5">
      <div role="group" aria-label="Nueve niveles de desarrollo" className="grid grid-cols-9 gap-1.5">
        {sorted.map((l) => (
          <button
            key={l.level}
            type="button"
            aria-label={`Nivel ${l.level}`}
            aria-pressed={selected === l.level}
            onClick={() => setSelected(l.level)}
            className={cn(
              "flex min-h-12 items-center justify-center rounded-lg border border-border text-base font-semibold",
              selected === l.level ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted",
            )}
          >
            {l.level}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground" aria-hidden="true">
        <span>Más flexible</span>
        <span>Más rígido</span>
      </div>

      <article aria-live="polite" className="space-y-4 rounded-xl border border-border bg-card p-4">
        <p className="text-sm text-accent">
          Nivel {current.level} de 9 · {BAND(current.level)}
        </p>
        <h3 className="font-serif text-xl">{current.editorialLabel}</h3>
        <p>{current.description}</p>
        <Group title="Cómo puede expresarse" items={current.characteristicExpressions} />
        <Group title="Patrones de pensamiento" items={current.thinkingPatterns} />
        <Group title="Patrones emocionales" items={current.emotionalPatterns} />
        <p><strong className="font-medium">En las relaciones:</strong> {current.inRelationships}</p>
        <p><strong className="font-medium">Al decidir:</strong> {current.inDecisions}</p>
        <Group title="Recursos disponibles" items={current.availableStrengths} />
        <Group title="Posibles dificultades" items={current.possibleDifficulties} />
        <p><strong className="font-medium">Frente a los niveles contiguos:</strong> {current.differenceFromAdjacent}</p>
        <Group title="Ejemplos cotidianos" items={current.examples} />
        <Group title="Preguntas para reflexionar" items={current.reflectionQuestions} />
        <Group title="Oportunidades de crecimiento" items={current.growthOpportunities} />
        <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">{current.disclaimer}</p>
      </article>
    </div>
  );
}
