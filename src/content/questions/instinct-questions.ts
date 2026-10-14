/**
 * Instinct module (module "instinct"): 28 questions about the three instinctual
 * domains: self-preservation (sp), social (so) and one-to-one / sexual (sx).
 *
 * - Option scores use `scores.instincts` only. `relatedTypes` is [] because these
 *   questions are type-independent; the subtype combines instinct and type later.
 * - Choice questions give the main instinct ~2 and a small spillover (0.2-0.5) to
 *   one other instinct. Scale questions put the full curve on the main instinct and a
 *   fraction on another. Every question touches all three instincts overall.
 * - Two near-duplicates are paired with equivalenceGroup (EQ_INST_SP_SECURE, EQ_INST_SX_INTENSE).
 * - Discrimination values are design hypotheses, not calibrated. Wording describes
 *   everyday attention and preferences; it never mentions a type.
 */
import type { Question, ResponseKind } from "@/domain/assessment/types";
import type { Instinct } from "@/domain/enneagram/structure";
import {
  finish,
  opts,
  round2,
  scaleOptions,
  type DraftBase,
  type InstinctScores,
} from "./builders";

type Choice = readonly [string, InstinctScores];
interface ChoiceDraft extends DraftBase {
  items: Choice[];
}
interface ScaleDraft extends DraftBase {
  main: Instinct;
  side: Instinct;
  factor: number;
}
type Draft = ChoiceDraft | ScaleDraft;

const REFS = ["chestnut-2013", "naranjo-1990"];

function c(
  code: string,
  kind: ResponseKind,
  text: string,
  dims: string[],
  d: number,
  why: string,
  items: Choice[],
): ChoiceDraft {
  return { code, kind, text, dims, d, why, refs: REFS, items };
}
function s(
  code: string,
  kind: "likert" | "frequency" | "intensity",
  text: string,
  main: Instinct,
  side: Instinct,
  factor: number,
  dims: string[],
  d: number,
  why: string,
  group?: string,
): ScaleDraft {
  const base: ScaleDraft = {
    code,
    kind,
    text,
    main,
    side,
    factor,
    dims,
    d,
    why,
    refs: REFS,
  };
  if (group) base.group = group;
  return base;
}

const sc = "scenario-choice" as const;
const mc = "motivation-comparison" as const;
const fc = "forced-choice" as const;

const DRAFTS: Draft[] = [
  // ---- Scenario choices ----
  c(
    "INST_SCENARIO_EXTRA_MONEY",
    sc,
    "Recibes un dinero extra inesperado. ¿Qué piensas hacer primero?",
    ["seguridad material", "pertenencia", "intensidad"],
    0.75,
    "El destino espontáneo de un recurso extra contrasta resguardo y comodidad, inversión en lo comunitario o inversión en una vivencia intensa de a dos.",
    [
      [
        "Guardarlo o invertirlo en tener más tranquilidad y comodidad en casa.",
        { sp: 2.2, so: 0.2 },
      ],
      [
        "Usarlo en un encuentro o evento que reúna a mis amigos o a mi comunidad.",
        { so: 2.2, sx: 0.3 },
      ],
      [
        "Invertir en un viaje o experiencia intensa con alguien con quien quiero profundizar.",
        { sx: 2.2, so: 0.3 },
      ],
    ],
  ),
  c(
    "INST_SCENARIO_PARTY_FOCUS",
    sc,
    "Estás en una fiesta. ¿En qué terminas más metido/a?",
    ["comodidad", "circulación social", "conversación a fondo"],
    0.8,
    "En un evento social, la atención se dirige a la comodidad física, al tejido de grupos o a la conexión uno a uno.",
    [
      [
        "Atento a la comodidad: la comida, la silla, la hora de irme.",
        { sp: 2.2, sx: 0.2 },
      ],
      [
        "Circulando entre grupos, conectando y enterándome de lo que pasa.",
        { so: 2.3, sx: 0.3 },
      ],
      [
        "En una conversación intensa, uno a uno, con alguien que me llame la atención.",
        { sx: 2.3, so: 0.3 },
      ],
    ],
  ),
  c(
    "INST_SCENARIO_LONG_WEEKEND",
    sc,
    "Se acerca un fin de semana largo. ¿Qué te llama más?",
    ["descanso", "vida comunitaria", "pasión"],
    0.7,
    "El plan preferido de tiempo libre diferencia el refugio doméstico, la participación grupal y la experiencia apasionada compartida.",
    [
      [
        "Descansar en casa, cocinar rico y ordenar mi espacio.",
        { sp: 2.3, so: 0.2 },
      ],
      [
        "Organizar una reunión con varias personas o participar en un grupo.",
        { so: 2.2, sp: 0.3 },
      ],
      [
        "Escaparme con una persona y vivir algo apasionante.",
        { sx: 2.3, sp: 0.2 },
      ],
    ],
  ),
  c(
    "INST_SCENARIO_NEW_CITY",
    sc,
    "Te mudas a una ciudad nueva. ¿Qué te preocupa resolver primero?",
    ["seguridad", "integración", "conexión especial"],
    0.8,
    "Ante un cambio de entorno, la prioridad inicial revela el área de vida que ocupa más atención: base material, red social o vínculo intenso.",
    [
      [
        "Un lugar cómodo, seguro y con lo básico bien cubierto.",
        { sp: 2.3, so: 0.2 },
      ],
      [
        "Encontrar un grupo de personas, una comunidad o un ambiente social donde pertenecer.",
        { so: 2.3, sx: 0.2 },
      ],
      [
        "Conocer a alguien con quien haya una conexión fuerte y especial.",
        { sx: 2.3, so: 0.3 },
      ],
    ],
  ),
  c(
    "INST_SCENARIO_JOB_OPPORTUNITY",
    sc,
    "En el trabajo surge una oportunidad. ¿Qué te atrae más?",
    ["estabilidad", "reconocimiento grupal", "química"],
    0.65,
    "Las oportunidades laborales se valoran según estabilidad y condiciones, prestigio entre colegas o química intensa con un compañero.",
    [
      ["Estabilidad, buen horario y buenas condiciones.", { sp: 2.2, so: 0.3 }],
      [
        "Ser parte de un equipo con prestigio y reconocimiento entre colegas.",
        { so: 2.3, sp: 0.2 },
      ],
      [
        "Trabajar mano a mano con alguien con quien haya mucha química e intensidad.",
        { sx: 2.2, so: 0.3 },
      ],
    ],
  ),
  c(
    "INST_SCENARIO_FRIEND_PROBLEM",
    sc,
    "Un amigo te cuenta que tiene un problema. ¿Qué haces?",
    ["ayuda práctica", "red de contactos", "presencia profunda"],
    0.7,
    "El modo de ayudar (recursos concretos, conectar con otros, estar presente en profundidad) diferencia el dominio instintivo dominante.",
    [
      [
        "Le ofrezco ayuda práctica: comida, tiempo, recursos.",
        { sp: 2.2, sx: 0.2 },
      ],
      [
        "Lo conecto con otras personas que podrían ayudarlo y mantengo informado al grupo.",
        { so: 2.2, sp: 0.2 },
      ],
      [
        "Me quedo con él, conversamos a fondo y absorbo lo que siente.",
        { sx: 2.3, so: 0.2 },
      ],
    ],
  ),

  // ---- Motivation comparisons and forced choices ----
  c(
    "INST_MOTIV_WHAT_YOU_MISS",
    mc,
    "¿Qué es lo que más echas de menos cuando te falta?",
    ["bienestar físico", "contacto social", "conexión intensa"],
    0.75,
    "Lo que más se extraña ante la carencia indica qué dominio ocupa más atención de forma constante.",
    [
      [
        "Sentirme cómodo/a, descansado/a y con lo necesario cubierto.",
        { sp: 2.2, so: 0.2 },
      ],
      [
        "Tener contacto con mi gente y saber qué pasa en mi entorno.",
        { so: 2.2, sp: 0.2 },
      ],
      ["Sentir una conexión intensa con alguien.", { sx: 2.3, so: 0.2 }],
    ],
  ),
  c(
    "INST_FORCED_HARD_TO_NEGLECT",
    fc,
    "¿Qué te resulta más difícil de descuidar?",
    ["salud y recursos", "reputación", "vínculo principal"],
    0.8,
    "Elección forzada entre tres áreas que cuestan descuidar: la base práctica, la posición social o la intensidad de un vínculo.",
    [
      ["Mi salud, mi casa y mis finanzas.", { sp: 2.3, so: 0.2 }],
      ["Mi reputación y mis amistades en mis círculos.", { so: 2.3, sx: 0.2 }],
      [
        "La intensidad de mi relación con una persona especial.",
        { sx: 2.3, so: 0.2 },
      ],
    ],
  ),
  c(
    "INST_MOTIV_WHAT_CALMS_WORRY",
    mc,
    "Cuando algo te preocupa, ¿qué te tranquiliza más?",
    ["regulación", "respaldo social", "intimidad"],
    0.7,
    "El recurso de calma preferido (ordenar lo propio, apoyarse en el grupo, abrirse a una persona) refleja estrategias instintivas distintas.",
    [
      ["Revisar que tengo todo en orden y resguardado.", { sp: 2.2, sx: 0.2 }],
      [
        "Hablar con personas de mi grupo y sentir su respaldo.",
        { so: 2.2, sp: 0.2 },
      ],
      [
        "Compartirlo a solas con alguien que me entienda profundamente.",
        { sx: 2.3, so: 0.2 },
      ],
    ],
  ),
  c(
    "INST_FORCED_SELF_DESCRIPTION",
    fc,
    "¿Con cuál afirmación te identificas más?",
    ["cuerpo y entorno", "posición social", "magnetismo"],
    0.8,
    "Tres autodescripciones breves, cada una centrada en un dominio instintivo, sin mencionar rasgos de personalidad.",
    [
      [
        "Me incomoda mucho el frío, el hambre o el desorden; necesito estar bien físicamente.",
        { sp: 2.3, sx: 0.2 },
      ],
      [
        "Me importa mucho cómo me ven y qué lugar ocupo dentro de un grupo.",
        { so: 2.3, sp: 0.2 },
      ],
      [
        "Me atrae la gente con la que siento magnetismo; puedo obsesionarme con alguien.",
        { sx: 2.3, so: 0.2 },
      ],
    ],
  ),
  c(
    "INST_MOTIV_IMPROVE_ONE_THING",
    mc,
    "Si pudieras mejorar una sola cosa de tu vida, ¿cuál elegirías?",
    ["bienestar material", "red social", "vínculos cercanos"],
    0.65,
    "La mejora deseada dirige la atención al dominio vivido como más carente o importante.",
    [
      [
        "Mi tranquilidad económica y el bienestar de mi cuerpo.",
        { sp: 2.2, so: 0.2 },
      ],
      [
        "Mi posición y mis contactos en mi comunidad o trabajo.",
        { so: 2.2, sp: 0.2 },
      ],
      ["La profundidad de mis vínculos más cercanos.", { sx: 2.2, so: 0.3 }],
    ],
  ),
  c(
    "INST_FORCED_HARDEST_TO_TOLERATE",
    fc,
    "¿Qué te cuesta más tolerar?",
    ["carencia material", "exclusión", "enfriamiento afectivo"],
    0.8,
    "Los tres temores cotidianos (quedarse sin base, ser excluido, que un vínculo se enfríe) se alinean con los tres dominios.",
    [
      [
        "Quedarme sin recursos o sin un lugar propio y seguro.",
        { sp: 2.3, sx: 0.2 },
      ],
      ["Sentirme excluido/a o ignorado/a por el grupo.", { so: 2.3, sx: 0.2 }],
      [
        "Sentir que una relación importante se ha vuelto tibia.",
        { sx: 2.3, so: 0.2 },
      ],
    ],
  ),

  // ---- Frequency and intensity ----
  s(
    "INST_FREQ_PLAN_FOR_SECURITY",
    "frequency",
    "¿Con qué frecuencia calculas gastos, planificas comidas o cuidas tu descanso para sentirte seguro/a?",
    "sp",
    "so",
    0.15,
    ["planificación del bienestar"],
    0.7,
    "Frecuencia de conductas de resguardo cotidiano de recursos y salud.",
  ),
  s(
    "INST_FREQ_CHECK_COMFORT",
    "frequency",
    "¿Con qué frecuencia te fijas en cómo está tu casa o tu cuerpo (temperatura, sueño, orden) antes de hacer planes?",
    "sp",
    "sx",
    0.1,
    ["atención al entorno físico"],
    0.6,
    "Frecuencia de la monitorización de comodidad física como paso previo a actuar.",
  ),
  s(
    "INST_FREQ_WHO_KNOWS_WHO",
    "frequency",
    "¿Con qué frecuencia piensas en quién conoce a quién y cómo se relaciona la gente de tu entorno?",
    "so",
    "sp",
    0.1,
    ["lectura del tejido social"],
    0.7,
    "Frecuencia del seguimiento de redes y dinámicas de grupo.",
  ),
  s(
    "INST_INT_PART_OF_GROUP",
    "intensity",
    "¿Qué tanto te importa ser parte de un grupo o causa y que reconozcan tu aporte?",
    "so",
    "sx",
    0.15,
    ["pertenencia", "aporte reconocido"],
    0.7,
    "Intensidad de la importancia dada a la pertenencia y al reconocimiento grupal.",
  ),
  s(
    "INST_FREQ_INTENSE_ATTRACTION",
    "frequency",
    "¿Con qué frecuencia sientes una atracción o curiosidad muy intensa por una persona en particular?",
    "sx",
    "so",
    0.15,
    ["intensidad hacia una persona"],
    0.65,
    "Frecuencia de la atención intensa y focalizada en una persona.",
  ),
  s(
    "INST_INT_DEEP_CONVERSATION",
    "intensity",
    "¿Qué tanto prefieres una conversación a fondo con una persona antes que charlar con muchas?",
    "sx",
    "sp",
    0.1,
    ["profundidad vs. amplitud"],
    0.65,
    "Intensidad de la preferencia por el contacto profundo uno a uno.",
  ),

  // ---- Likert ----
  s(
    "INST_LIKERT_SAVINGS_AND_SPACE",
    "likert",
    "Me siento más tranquilo/a cuando tengo ahorros, provisiones y mi espacio bajo control.",
    "sp",
    "so",
    0.15,
    ["resguardo"],
    0.7,
    "Acuerdo con la tranquilidad derivada de contar con recursos y espacio propios.",
    "EQ_INST_SP_SECURE",
  ),
  s(
    "INST_LIKERT_AWARE_OF_COMMUNITY",
    "likert",
    "Suelo estar al tanto de lo que ocurre en mi comunidad, trabajo o círculo de amigos y me gusta aportar.",
    "so",
    "sp",
    0.1,
    ["conciencia comunitaria"],
    0.65,
    "Acuerdo con la atención sostenida al entorno social propio y el deseo de aportar.",
  ),
  s(
    "INST_LIKERT_INTENSITY_WITH_PERSON",
    "likert",
    "Cuando algo me interesa de verdad en una persona, lo siento con una intensidad que no me deja indiferente.",
    "sx",
    "so",
    0.15,
    ["intensidad"],
    0.65,
    "Acuerdo con una vivencia intensa y focalizada hacia una persona.",
  ),
  s(
    "INST_LIKERT_COMFORT_OVER_PLANS",
    "likert",
    "Cuido mi comodidad física incluso cuando eso significa no ir a un plan que otros disfrutan.",
    "sp",
    "sx",
    0.1,
    ["comodidad vs. plan social"],
    0.65,
    "Acuerdo con priorizar la comodidad propia sobre planes sociales.",
  ),
  s(
    "INST_LIKERT_HOW_OTHERS_SEE_ME",
    "likert",
    "Me importa mucho cómo me perciben los demás y qué lugar tengo entre ellos.",
    "so",
    "sx",
    0.15,
    ["posición social"],
    0.65,
    "Acuerdo con la importancia concedida a la percepción social y al lugar en el grupo.",
  ),
  s(
    "INST_LIKERT_FEW_INTENSE_BONDS",
    "likert",
    "Prefiero pocas relaciones muy intensas que muchas amistades más superficiales.",
    "sx",
    "sp",
    0.1,
    ["profundidad vs. amplitud"],
    0.65,
    "Acuerdo con una preferencia por pocos vínculos de alta intensidad.",
    "EQ_INST_SX_INTENSE",
  ),

  // ---- Near-duplicates ----
  s(
    "INST_LIKERT_HOME_MONEY_HEALTH_SAFE",
    "likert",
    "Me tranquiliza saber que tengo mi casa, mi dinero y mi salud bien resguardados.",
    "sp",
    "so",
    0.15,
    ["resguardo"],
    0.7,
    "Reformulación de INST_LIKERT_SAVINGS_AND_SPACE para contrastar consistencia.",
    "EQ_INST_SP_SECURE",
  ),
  s(
    "INST_LIKERT_INTENSITY_OVER_QUANTITY",
    "likert",
    "Me atrae más la intensidad en la relación con una persona que la cantidad de amistades.",
    "sx",
    "sp",
    0.1,
    ["profundidad vs. amplitud"],
    0.65,
    "Reformulación de INST_LIKERT_FEW_INTENSE_BONDS para contrastar consistencia.",
    "EQ_INST_SX_INTENSE",
  ),
  s(
    "INST_FREQ_SEEK_ONE_ON_ONE",
    "frequency",
    "¿Con qué frecuencia prefieres buscar un momento a solas con una persona antes que quedarte en el grupo?",
    "sx",
    "sp",
    0.1,
    ["profundidad vs. amplitud"],
    0.6,
    "Frecuencia de elegir lo uno a uno frente a lo grupal.",
  ),
  s(
    "INST_FREQ_ORGANISE_GATHERINGS",
    "frequency",
    "¿Con qué frecuencia organizas o impulsas encuentros que reúnen a distintas personas de tu entorno?",
    "so",
    "sx",
    0.1,
    ["iniciativa comunitaria"],
    0.6,
    "Frecuencia de impulsar encuentros que conectan a varias personas.",
  ),
];

function isScale(d: Draft): d is ScaleDraft {
  return "main" in d;
}

const ALL: Instinct[] = ["sp", "so", "sx"];

/**
 * Choice drafts are written sp / so / sx. Showing them that way would put the
 * same instinct first in every question, and people lean toward the first
 * option, so each choice question rotates its options by a fixed offset.
 */
function rotated<T>(items: readonly T[], offset: number): T[] {
  const k = offset % items.length;
  return [...items.slice(k), ...items.slice(0, k)];
}

let choiceIndex = 0;

export const INSTINCT_QUESTIONS: Question[] = DRAFTS.map((draft, index) => {
  if (!isScale(draft)) {
    const options = opts(
      rotated(draft.items, choiceIndex++).map(
        ([text, instincts]) => [text, { instincts }] as const,
      ),
    );
    return finish("instinct", index, draft, { options, related: [] });
  }
  const third = ALL.find(
    (i) => i !== draft.main && i !== draft.side,
  ) as Instinct;
  const options = scaleOptions(draft.kind, (_i, v) => ({
    instincts: {
      [draft.main]: round2(v),
      [draft.side]: round2(v * draft.factor),
      [third]: 0,
    },
  }));
  return finish("instinct", index, draft, { options, related: [] });
});
