import { GROUP_SYSTEMS, groupKeyOf, type EnneagramType, type GroupSystem } from "@/domain/enneagram/structure";

export type GroupMode = GroupSystem | "none";

export const GROUP_MODES: readonly GroupMode[] = ["centers", "hornevian", "harmonic", "none"];

/** Short labels for the switcher. */
export const MODE_LABELS: Record<GroupMode, string> = {
  centers: "Centros",
  hornevian: "Estilos",
  harmonic: "Armónicos",
  none: "Sin grupos",
};

/** What each system is about, in one plain sentence. */
export const MODE_HINTS: Record<GroupSystem, string> = {
  centers: "Centros: desde dónde se procesa la experiencia (cuerpo, emociones o mente).",
  hornevian: "Estilos hornevianos: cómo se actúa ante las necesidades propias y ajenas.",
  harmonic: "Grupos armónicos: cómo se reacciona ante los problemas y los conflictos.",
};

export const GROUP_LABELS: Record<GroupSystem, Record<string, string>> = {
  centers: { instinctive: "Instintivo", emotional: "Emocional", mental: "Mental" },
  hornevian: { assertive: "Asertivo", compliant: "Complaciente", withdrawn: "Retraído" },
  harmonic: { competency: "Competencia", positiveOutlook: "Perspectiva positiva", reactive: "Reactivo" },
};

/** Spoken form used inside the accessible name of each type ("Eneatipo 4, centro emocional"). */
export function spokenGroup(system: GroupSystem, key: string): string {
  const label = GROUP_LABELS[system][key].toLowerCase();
  return system === "centers" ? `centro ${label}` : system === "hornevian" ? `estilo ${label}` : `grupo ${label}`;
}

/** Position of a group inside its system (0..2): picks the color token and the stroke pattern. */
export function groupSlot(system: GroupSystem, key: string): 0 | 1 | 2 {
  return Object.keys(GROUP_SYSTEMS[system]).indexOf(key) as 0 | 1 | 2;
}

/** Color is never the only cue: each slot also has its own stroke pattern. */
export const SLOT_DASH: Record<0 | 1 | 2, string | undefined> = { 0: undefined, 1: "9 5", 2: "1.5 6" };
export const SLOT_STROKE_CLASS: Record<0 | 1 | 2, string> = {
  0: "stroke-group-1",
  1: "stroke-group-2",
  2: "stroke-group-3",
};

export function groupOfType(system: GroupSystem, type: EnneagramType) {
  const key = groupKeyOf(system, type);
  return { key, slot: groupSlot(system, key) };
}
