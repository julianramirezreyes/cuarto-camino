import type { EnneagramType, Instinct } from "@/domain/enneagram/structure";
import type { SubtypeProfile } from "../schema";
import { subtypes1 } from "./subtypes-1";
import { subtypes2 } from "./subtypes-2";
import { subtypes3 } from "./subtypes-3";
import { subtypes4 } from "./subtypes-4";
import { subtypes5 } from "./subtypes-5";
import { subtypes6 } from "./subtypes-6";
import { subtypes7 } from "./subtypes-7";
import { subtypes8 } from "./subtypes-8";
import { subtypes9 } from "./subtypes-9";

export const SUBTYPE_PROFILES: SubtypeProfile[] = [
  ...subtypes1, ...subtypes2, ...subtypes3, ...subtypes4, ...subtypes5,
  ...subtypes6, ...subtypes7, ...subtypes8, ...subtypes9,
];

export function getSubtype(type: EnneagramType, instinct: Instinct): SubtypeProfile | undefined {
  return SUBTYPE_PROFILES.find((p) => p.type === type && p.instinct === instinct);
}

export interface InstinctStacking {
  order: string;
  description: string;
}

/** Theoretical orderings of the three instincts (dominant/secondary; the third is the remaining one). */
export const INSTINCT_STACKINGS: { stackings: InstinctStacking[]; note: string } = {
  stackings: [
    { order: "sp/so", description: "Conservación dominante, social secundario; el tercer lugar queda para lo sexual (uno a uno). Suele describirse como un estilo que cuida lo práctico y lo estable y que se acerca a grupos con cautela, con menor foco en la intensidad de pareja." },
    { order: "sp/sx", description: "Conservación dominante, sexual secundario; el tercer lugar queda para lo social. Suele describirse como un estilo que prioriza seguridad y bienestar propio y concentra la intimidad en pocos vínculos, con menor foco en la vida de grupo." },
    { order: "so/sp", description: "Social dominante, conservación secundaria; el tercer lugar queda para lo sexual. Suele describirse como un estilo orientado a pertenecer y aportar a comunidades, apoyado en una base práctica ordenada, con menos énfasis en la intensidad personal." },
    { order: "so/sx", description: "Social dominante, sexual secundario; el tercer lugar queda para la conservación. Suele describirse como un estilo orientado a causas, redes y vínculos con sentido, que puede descuidar rutinas de cuidado material." },
    { order: "sx/sp", description: "Sexual dominante, conservación secundaria; el tercer lugar queda para lo social. Suele describirse como un estilo de intensidad y enfoque en pocas personas o intereses, sostenido por una base práctica, con menor interés en la vida grupal." },
    { order: "sx/so", description: "Sexual dominante, social secundario; el tercer lugar queda para la conservación. Suele describirse como un estilo de intensidad y de búsqueda de conexión que se proyecta también en círculos y causas, con descuido posible de lo cotidiano." },
  ],
  note: "Estas seis combinaciones son un modelo teórico de la literatura. Un orden completo no puede inferirse con fiabilidad a partir de evidencia limitada (unas pocas respuestas de un cuestionario, por ejemplo): conviene tratarlo como hipótesis para explorar, nunca como resultado ni diagnóstico.",
};
