"use client";

import { useState } from "react";
import type { FunctioningResult } from "@/domain/scoring/functioning";
import { cn } from "@/lib/utils";
import { BulletList, Card, SectionShell, pct } from "../common";
import { BAND_LABEL, bandOfLevel, hasFunctioningSignal, plausibleLevels } from "../levels-logic";
import type { TypeBundle } from "../types";

const BAND_STYLE = {
  flexible: "border-accent",
  intermediate: "border-violet",
  maladaptive: "border-border",
} as const;

/**
 * E · Tu estado actual. Shows the band (with its uncertainty) and at most two plausible
 * levels; the user can select any of the nine levels to read its profile.
 */
export function LevelsSection({ bundle, functioning, title = "Tu estado actual" }: { bundle: TypeBundle; functioning?: FunctioningResult; title?: string }) {
  const plausible = functioning ? plausibleLevels(functioning) : [];
  const [selected, setSelected] = useState<number | null>(plausible[0] ?? null);
  const level = bundle.levels.find((l) => l.level === selected) ?? null;

  return (
    <SectionShell
      title={title}
      intro="Un mismo tipo puede vivirse de maneras muy distintas según el momento. Los niveles describen ese rango; no son una nota ni un diagnóstico."
    >
      {functioning && functioning.band && hasFunctioningSignal(functioning) ? (
        <div className="space-y-1 rounded-xl border border-border bg-muted p-4">
          <p>
            Banda más compatible (últimas 4 semanas): <strong>{BAND_LABEL[functioning.band]}</strong>.
          </p>
          <p className="text-sm text-muted-foreground">
            Incertidumbre: {pct(functioning.uncertainty)}.{" "}
            {plausible.length > 0
              ? `Niveles plausibles: ${plausible.slice().sort((a, b) => a - b).join(" y ")}. Es una pista, no una medición.`
              : null}
          </p>
        </div>
      ) : functioning ? (
        <p className="rounded-xl border border-border bg-muted p-4">
          Con tus respuestas no hay evidencia suficiente para situar una banda de funcionamiento.
        </p>
      ) : null}
      <div role="group" aria-label="Los nueve niveles del tipo" className="grid grid-cols-9 gap-1.5 sm:gap-2">
        {bundle.levels.map((l) => {
          const isSelected = selected === l.level;
          const isPlausible = plausible.includes(l.level);
          return (
            <button
              key={l.level}
              type="button"
              aria-pressed={isSelected}
              aria-label={`Nivel ${l.level}${isPlausible ? " (plausible)" : ""}: ${l.editorialLabel}`}
              onClick={() => setSelected(l.level)}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center rounded-xl border-2 text-sm font-semibold transition-colors",
                BAND_STYLE[bandOfLevel(l.level)],
                isSelected ? "bg-primary text-primary-foreground" : isPlausible ? "bg-muted" : "bg-card hover:bg-muted",
              )}
            >
              {l.level}
              {isPlausible ? <span aria-hidden="true" className="text-xs">●</span> : null}
            </button>
          );
        })}
      </div>
      <p className="flex justify-between text-xs text-muted-foreground" aria-hidden="true">
        <span>Más flexible</span>
        <span>Más rígido</span>
      </p>
      {level ? (
        <div className="space-y-4">
          <h3 className="font-serif text-xl">
            Nivel {level.level} · {level.editorialLabel}
          </h3>
          <p>{level.description}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card title="Expresiones características">
              <BulletList items={level.characteristicExpressions} />
            </Card>
            <Card title="Pensamiento">
              <BulletList items={level.thinkingPatterns} />
            </Card>
            <Card title="Emociones">
              <BulletList items={level.emotionalPatterns} />
            </Card>
            <Card title="Recursos disponibles">
              <BulletList items={level.availableStrengths} />
            </Card>
            <Card title="Dificultades posibles">
              <BulletList items={level.possibleDifficulties} />
            </Card>
            <Card title="Preguntas para reflexionar">
              <BulletList items={level.reflectionQuestions} />
            </Card>
          </div>
          <p className="text-sm text-muted-foreground">{level.disclaimer}</p>
        </div>
      ) : (
        <p className="text-muted-foreground">Elige un nivel para leer su perfil.</p>
      )}
      <p className="text-sm text-muted-foreground">
        Este apartado es un modelo interpretativo: no es una medida clínica ni sustituye la mirada de un profesional.
      </p>
    </SectionShell>
  );
}
