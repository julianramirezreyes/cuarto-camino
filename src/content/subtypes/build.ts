import type { EnneagramType, Instinct } from "@/domain/enneagram/structure";
import type { SubtypeProfile } from "../schema";

type Body = Omit<SubtypeProfile, "type" | "instinct" | "countertype" | "attribution" | "sources" | "status">;

/**
 * Counter-type per Naranjo's tradition, only where the editor is confident.
 * Types 1, 3 and 9 are deliberately left unresolved (divergent or unverified).
 */
const COUNTERTYPE: Partial<Record<EnneagramType, Instinct>> = { 2: "sp", 4: "sp", 5: "sx", 6: "sx", 7: "so", 8: "so" };

const NAME: Record<Instinct, string> = { sp: "conservación", so: "social", sx: "sexual (uno a uno)" };

function counterNote(type: EnneagramType, instinct: Instinct): { isCountertype: boolean; note: string } {
  const ct = COUNTERTYPE[type];
  if (!ct) {
    return {
      isCountertype: false,
      note: `Pendiente de verificación editorial: las tradiciones (Naranjo, Chestnut) no son unánimes en este punto o no se pudo confirmar cuál es el contratipo del tipo ${type}, por lo que no se afirma que el subtipo ${NAME[instinct]} lo sea ni deje de serlo.`,
    };
  }
  if (ct === instinct) {
    return {
      isCountertype: true,
      note: `En la tradición de Naranjo (Ennea-type Structures) este es el contratipo del tipo ${type}: la expresión instintiva se aparta de la pasión típica y a veces se ve "al revés" de lo esperado. Es un marco interpretativo, no un hecho medido.`,
    };
  }
  return {
    isCountertype: false,
    note: `No es el contratipo. En la tradición de Naranjo el contratipo del tipo ${type} es el subtipo ${NAME[ct]}; este subtipo expresa la pasión de forma más cercana a lo esperado para el tipo.`,
  };
}

export function sub(type: EnneagramType, instinct: Instinct, body: Body): SubtypeProfile {
  return {
    type,
    instinct,
    countertype: counterNote(type, instinct),
    ...body,
    attribution: ["naranjo", "chestnut", "editorial"],
    sources: ["naranjo-1990", "naranjo-1994", "chestnut-2013"],
    status: "draft",
  };
}
