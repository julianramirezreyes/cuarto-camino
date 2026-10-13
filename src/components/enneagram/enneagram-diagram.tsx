"use client";

import { useRef } from "react";
import {
  ENNEAGRAM_TYPES,
  INTEGRATION,
  STRESS,
  wingsOf,
  type EnneagramType,
} from "@/domain/enneagram/structure";
import { cn } from "@/lib/utils";

export type ArrowMode = "none" | "integration" | "stress" | "both";

interface Props {
  selected: EnneagramType | null;
  onSelect: (type: EnneagramType) => void;
  arrows?: ArrowMode;
  className?: string;
}

const SIZE = 320;
const C = SIZE / 2;
const R = 120;

/** Type 9 at the top, then clockwise: 1, 2, ... 8. */
function position(type: EnneagramType) {
  const angle = ((type % 9) * 40 - 90) * (Math.PI / 180);
  return { x: C + R * Math.cos(angle), y: C + R * Math.sin(angle) };
}

const INNER_LINES: [EnneagramType, EnneagramType][] = [
  [1, 4], [4, 2], [2, 8], [8, 5], [5, 7], [7, 1], // hexad
  [3, 6], [6, 9], [9, 3], // triangle
];

function relation(type: EnneagramType, selected: EnneagramType | null, arrows: ArrowMode) {
  if (selected === null) return null;
  if (type === selected) return "selected";
  if (wingsOf(selected).includes(type)) return "wing";
  if ((arrows === "integration" || arrows === "both") && INTEGRATION[selected] === type) return "integration";
  if ((arrows === "stress" || arrows === "both") && STRESS[selected] === type) return "stress";
  return null;
}

const LABEL: Record<string, string> = {
  selected: ", seleccionado",
  wing: ", ala posible",
  integration: ", dirección de integración tradicional",
  stress: ", dirección de estrés tradicional",
};

export function EnneagramDiagram({ selected, onSelect, arrows = "none", className }: Props) {
  const refs = useRef<Partial<Record<EnneagramType, SVGGElement | null>>>({});

  const RING: EnneagramType[] = [9, 1, 2, 3, 4, 5, 6, 7, 8];

  function move(from: EnneagramType, delta: 1 | -1) {
    const target = RING[(RING.indexOf(from) + delta + 9) % 9];
    refs.current[target]?.focus();
  }

  const arrowTargets: { from: EnneagramType; to: EnneagramType; kind: "integration" | "stress" }[] = [];
  if (selected !== null) {
    if (arrows === "integration" || arrows === "both") arrowTargets.push({ from: selected, to: INTEGRATION[selected], kind: "integration" });
    if (arrows === "stress" || arrows === "both") arrowTargets.push({ from: selected, to: STRESS[selected], kind: "stress" });
  }

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="group"
      aria-label="Símbolo del eneagrama: nueve puntos seleccionables"
      className={cn("h-auto w-full max-w-md touch-manipulation select-none", className)}
    >
      <circle cx={C} cy={C} r={R} fill="none" className="stroke-border" strokeWidth={1.5} />
      {INNER_LINES.map(([a, b]) => (
        <line
          key={`${a}-${b}`}
          x1={position(a).x} y1={position(a).y} x2={position(b).x} y2={position(b).y}
          className="stroke-border" strokeWidth={1.25} aria-hidden="true"
        />
      ))}
      {arrowTargets.map(({ from, to, kind }) => (
        <line
          key={kind}
          x1={position(from).x} y1={position(from).y} x2={position(to).x} y2={position(to).y}
          className={kind === "integration" ? "stroke-accent" : "stroke-violet"}
          strokeWidth={2.5} strokeDasharray={kind === "stress" ? "6 5" : undefined}
          aria-hidden="true"
        />
      ))}
      {ENNEAGRAM_TYPES.map((type) => {
        const { x, y } = position(type);
        const rel = relation(type, selected, arrows);
        return (
          <g
            key={type}
            ref={(el) => { refs.current[type] = el; }}
            role="button"
            tabIndex={0}
            aria-pressed={selected === type}
            aria-label={`Eneatipo ${type}${rel ? LABEL[rel] : ""}`}
            className="cursor-pointer outline-none [&:focus-visible>circle]:stroke-accent [&:focus-visible>circle]:stroke-[3]"
            onClick={() => onSelect(type)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(type); }
              else if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); move(type, 1); }
              else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); move(type, -1); }
            }}
          >
            <circle
              cx={x} cy={y} r={20}
              className={cn(
                "transition-colors duration-200 motion-reduce:transition-none stroke-border",
                rel === "selected" ? "fill-primary" : rel === "wing" ? "fill-primary/40" : "fill-card",
                rel === "integration" && "stroke-accent",
                rel === "stress" && "stroke-violet",
              )}
              strokeWidth={2}
            />
            <text
              x={x} y={y} textAnchor="middle" dominantBaseline="central"
              className={cn("pointer-events-none text-base font-semibold", rel === "selected" ? "fill-primary-foreground" : "fill-foreground")}
            >
              {type}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
