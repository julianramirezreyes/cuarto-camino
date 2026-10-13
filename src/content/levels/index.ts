import type { EnneagramType } from "@/domain/enneagram/structure";
import type { LevelProfile } from "../schema";
import { levels1 } from "./levels-1";
import { levels2 } from "./levels-2";
import { levels3 } from "./levels-3";
import { levels4 } from "./levels-4";
import { levels5 } from "./levels-5";
import { levels6 } from "./levels-6";
import { levels7 } from "./levels-7";
import { levels8 } from "./levels-8";
import { levels9 } from "./levels-9";

export const LEVEL_PROFILES: LevelProfile[] = [
  ...levels1, ...levels2, ...levels3, ...levels4, ...levels5,
  ...levels6, ...levels7, ...levels8, ...levels9,
];

export function getLevel(type: EnneagramType, level: LevelProfile["level"]): LevelProfile | undefined {
  return LEVEL_PROFILES.find((l) => l.type === type && l.level === level);
}
