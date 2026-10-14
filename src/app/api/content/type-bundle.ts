import { SOURCES } from "@/content/sources";
import { LEVEL_PROFILES } from "@/content/levels";
import { INSTINCT_STACKINGS, SUBTYPE_PROFILES } from "@/content/subtypes";
import { TYPE_PROFILES } from "@/content/types";
import { WING_PROFILES } from "@/content/wings";
import type { Claim, SourceRef, TypeProfile } from "@/content/schema";
import type { AlternativeSummary, TypeBundle } from "@/components/results/types";
import type { EnneagramType } from "@/domain/enneagram/structure";

/** Server-only: imports the full content. Never import from a Client Component. */

export function isEnneagramType(n: number): n is EnneagramType {
  return Number.isInteger(n) && n >= 1 && n <= 9;
}

function claimSources(claims: Claim[]): string[] {
  return claims.flatMap((c) => c.sources ?? []);
}

export function buildTypeBundle(type: EnneagramType): TypeBundle {
  const profile = TYPE_PROFILES[type];
  const wings = WING_PROFILES.filter((w) => w.type === type);
  const subtypes = SUBTYPE_PROFILES.filter((s) => s.type === type);
  const levels = LEVEL_PROFILES.filter((l) => l.type === type).sort((a, b) => a.level - b.level);

  const keys = new Set<string>([
    ...profile.sources,
    ...claimSources([profile.passion, profile.fixation, profile.virtue, ...profile.defenseMechanisms]),
    ...wings.flatMap((w) => w.sources),
    ...subtypes.flatMap((s) => s.sources),
    ...levels.flatMap((l) => l.sources),
  ]);
  const sources = [...keys]
    .map((k) => SOURCES[k])
    .filter((s): s is SourceRef => s !== undefined)
    .sort((a, b) => a.author.localeCompare(b.author) || (a.year ?? 0) - (b.year ?? 0));

  return {
    type,
    profile,
    wings,
    subtypes,
    levels,
    stackings: INSTINCT_STACKINGS.stackings,
    stackingsNote: INSTINCT_STACKINGS.note,
    sources,
  };
}

export function buildAlternativeSummaries(main: TypeProfile, alternatives: readonly EnneagramType[]): AlternativeSummary[] {
  return alternatives.map((type) => {
    const p = TYPE_PROFILES[type];
    return {
      type,
      name: p.name,
      summary: p.summary,
      coreMotivation: p.coreMotivation,
      difference: main.lookAlikes.find((l) => l.type === type)?.difference ?? null,
    };
  });
}
