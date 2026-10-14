"use client";

import { useRef } from "react";
import {
  ENNEAGRAM_TYPES,
  GROUP_SYSTEMS,
  INTEGRATION,
  STRESS,
  wingsOf,
  type EnneagramType,
} from "@/domain/enneagram/structure";
import { cn } from "@/lib/utils";
import {
  GROUP_LABELS,
  SLOT_DASH,
  SLOT_STROKE_CLASS,
  groupOfType,
  groupSlot,
  spokenGroup,
  type GroupMode,
} from "./groups";

export type ArrowMode = "none" | "integration" | "stress" | "both";

interface Props {
  selected: EnneagramType | null;
  onSelect: (type: EnneagramType) => void;
  arrows?: ArrowMode;
  /** Which of the three classic groupings to show around the circle. Centers by default. */
  groups?: GroupMode;
  /** Legend under the symbol naming each group and its types. */
  showLegend?: boolean;
  className?: string;
}

const SIZE = 320;
const C = SIZE / 2;
const R = 120;
/** Radius of the group markers: just outside the nodes (node radius 20 → 140), still inside the viewBox. */
const GROUP_R = 150;

/** Type 9 at the top, then clockwise: 1, 2, ... 8. */
function angleOf(type: EnneagramType) {
  return (type % 9) * 40 - 90;
}

function position(type: EnneagramType) {
  const angle = angleOf(type) * (Math.PI / 180);
  return { x: C + R * Math.cos(angle), y: C + R * Math.sin(angle) };
}

/** SVG arc path along the group ring, `halfSpan` degrees to each side of the type's angle. */
function groupArc(type: EnneagramType, halfSpan = 20) {
  const point = (deg: number) => {
    const a = deg * (Math.PI / 180);
    return `${(C + GROUP_R * Math.cos(a)).toFixed(2)} ${(C + GROUP_R * Math.sin(a)).toFixed(2)}`;
  };
  const a = angleOf(type);
  return `M ${point(a - halfSpan)} A ${GROUP_R} ${GROUP_R} 0 0 1 ${point(a + halfSpan)}`;
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

export function EnneagramDiagram({
  selected,
  onSelect,
  arrows = "none",
  groups = "centers",
  showLegend = true,
  className,
}: Props) {
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

  const system = groups === "none" ? null : groups;
  const selectedGroup = system && selected !== null ? groupOfType(system, selected).key : null;

  return (
    <div className={cn("flex w-full max-w-md flex-col items-center gap-3", className)}>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="group"
        aria-label="Símbolo del eneagrama: nueve puntos seleccionables"
        className="h-auto w-full touch-manipulation select-none"
      >
        <circle cx={C} cy={C} r={R} fill="none" className="stroke-border" strokeWidth={1.5} />
        {system
          ? ENNEAGRAM_TYPES.map((type) => {
              const { key, slot } = groupOfType(system, type);
              const emphasis = selectedGroup === null ? undefined : key === selectedGroup ? "on" : "off";
              return (
                <path
                  key={`group-${type}`}
                  d={groupArc(type)}
                  data-group-mark={type}
                  data-group={key}
                  data-emphasis={emphasis}
                  aria-hidden="true"
                  fill="none"
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeDasharray={SLOT_DASH[slot]}
                  className={cn(
                    SLOT_STROKE_CLASS[slot],
                    "transition-opacity duration-200 motion-reduce:transition-none",
                    emphasis === "off" ? "opacity-30" : emphasis === "on" ? "opacity-100" : "opacity-70",
                  )}
                />
              );
            })
          : null}
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
          const group = system ? `, ${spokenGroup(system, groupOfType(system, type).key)}` : "";
          return (
            <g
              key={type}
              ref={(el) => { refs.current[type] = el; }}
              role="button"
              tabIndex={0}
              aria-pressed={selected === type}
              aria-label={`Eneatipo ${type}${rel ? LABEL[rel] : ""}${group}`}
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
      {system && showLegend ? <GroupLegend system={system} /> : null}
    </div>
  );
}

/** Names each group of the active system with the types it holds. Same stroke pattern as the markers. */
function GroupLegend({ system }: { system: Exclude<GroupMode, "none"> }) {
  const entries = Object.entries(GROUP_SYSTEMS[system]) as [string, readonly EnneagramType[]][];
  return (
    <ul
      aria-label="Leyenda de grupos"
      className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground"
    >
      {entries.map(([key, types]) => {
        const slot = groupSlot(system, key);
        return (
          <li key={key} className="flex items-center gap-1.5">
            <svg width="22" height="6" viewBox="0 0 22 6" aria-hidden="true">
              <line
                x1="2" y1="3" x2="20" y2="3"
                strokeWidth={4} strokeLinecap="round" strokeDasharray={SLOT_DASH[slot]}
                className={SLOT_STROKE_CLASS[slot]}
              />
            </svg>
            <span>
              {GROUP_LABELS[system][key]} · {types.join(", ")}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
