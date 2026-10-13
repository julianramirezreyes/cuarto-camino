import type { EnneagramType } from "@/domain/enneagram/structure";
import type { WingProfile } from "../schema";
import { wings1 } from "./wings-1";
import { wings2 } from "./wings-2";
import { wings3 } from "./wings-3";
import { wings4 } from "./wings-4";
import { wings5 } from "./wings-5";
import { wings6 } from "./wings-6";
import { wings7 } from "./wings-7";
import { wings8 } from "./wings-8";
import { wings9 } from "./wings-9";

export const WING_PROFILES: WingProfile[] = [
  ...wings1, ...wings2, ...wings3, ...wings4, ...wings5, ...wings6, ...wings7, ...wings8, ...wings9,
];

/** Returns the profile for a type and one of its two adjacent wings, or undefined. */
export function getWing(type: EnneagramType, wing: EnneagramType): WingProfile | undefined {
  return WING_PROFILES.find((w) => w.type === type && w.wing === wing);
}
