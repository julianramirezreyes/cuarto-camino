import type { EnneagramType } from "@/domain/enneagram/structure";
import type { TypeProfile } from "../schema";
import { type1 } from "./type-1";
import { type2 } from "./type-2";
import { type3 } from "./type-3";
import { type4 } from "./type-4";
import { type5 } from "./type-5";
import { type6 } from "./type-6";
import { type7 } from "./type-7";
import { type8 } from "./type-8";
import { type9 } from "./type-9";

export const TYPE_PROFILES: Record<EnneagramType, TypeProfile> = {
  1: type1,
  2: type2,
  3: type3,
  4: type4,
  5: type5,
  6: type6,
  7: type7,
  8: type8,
  9: type9,
};
