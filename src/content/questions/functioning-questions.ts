/**
 * Functioning module (module "functioning"): 22 questions.
 *
 * - Every question text states its window ("Durante las últimas cuatro semanas, ...")
 *   and sets timeWindow "last-4-weeks". They describe RECENT STATE, never a lasting trait.
 * - Option scores use `scores.bands` (flexible / intermediate / maladaptive). The model is
 *   interpretive only: it is not a clinical measure, and the questions deliberately avoid
 *   symptoms, diagnoses, substance use and self-harm. They ask about everyday flexibility,
 *   recovery, listening and self-observation.
 * - "positive" statements: agreement raises `flexible`; "negative" statements: agreement raises
 *   `maladaptive`. Ordered scales use a fixed 5-step curve.
 * - Two near-duplicates are paired with equivalenceGroup (EQ_FUNC_ADAPT, EQ_FUNC_LISTEN).
 * - relatedTypes is [] (functioning is type-independent in this module).
 */
import type { Question, ResponseKind } from "@/domain/assessment/types";
import {
  finish,
  opts,
  scaleOptions,
  type BandScores,
  type DraftBase,
} from "./builders";

type Polarity = "positive" | "negative";

interface ScaleDraft extends DraftBase {
  polarity: Polarity;
}
interface ChoiceDraft extends DraftBase {
  items: ReadonlyArray<readonly [string, BandScores]>;
}
type Draft = ScaleDraft | ChoiceDraft;

const REFS = ["riso-hudson-1999", "hook-2021"];
const W = "Durante las últimas cuatro semanas, ";

/** Position 0 = lowest end of the scale (e.g. "Casi nunca"), 4 = highest end. */
const POSITIVE: BandScores[] = [
  { maladaptive: 2, intermediate: 0.3, flexible: 0 },
  { maladaptive: 1, intermediate: 0.8, flexible: 0 },
  { maladaptive: 0.2, intermediate: 1.5, flexible: 0.2 },
  { maladaptive: 0, intermediate: 0.8, flexible: 1 },
  { maladaptive: 0, intermediate: 0.3, flexible: 2 },
];
const NEGATIVE: BandScores[] = [...POSITIVE].reverse();

function sc(
  code: string,
  kind: "likert" | "frequency" | "intensity",
  polarity: Polarity,
  text: string,
  dims: string[],
  d: number,
  why: string,
  group?: string,
): ScaleDraft {
  const base: ScaleDraft = {
    code,
    kind,
    polarity,
    text: W + text,
    dims,
    d,
    why,
    refs: REFS,
  };
  if (group) base.group = group;
  return base;
}
function ch(
  code: string,
  text: string,
  dims: string[],
  d: number,
  why: string,
  items: ReadonlyArray<readonly [string, BandScores]>,
): ChoiceDraft {
  return {
    code,
    kind: "scenario-choice" satisfies ResponseKind,
    text: W + text,
    dims,
    d,
    why,
    refs: REFS,
    items,
  };
}

const DRAFTS: Draft[] = [
  sc(
    "FUNC_LIKERT_ADAPT_PLANS",
    "likert",
    "positive",
    "cuando algo salió distinto a lo planeado, pude adaptarme sin que me tomara demasiado tiempo recuperar la calma.",
    ["flexibilidad", "recuperación"],
    0.7,
    "Estado reciente de adaptación a imprevistos; polo flexible = recuperación rápida.",
    "EQ_FUNC_ADAPT",
  ),
  sc(
    "FUNC_FREQ_AUTOMATIC_REACTION_REGRET",
    "frequency",
    "negative",
    "¿con qué frecuencia reaccionaste de forma automática (levantar la voz, callarte de golpe, huir) y después te arrepentiste?",
    ["reactividad", "autorregulación"],
    0.7,
    "Frecuencia reciente de reacciones automáticas seguidas de arrepentimiento; mayor frecuencia = polo menos flexible.",
  ),
  sc(
    "FUNC_LIKERT_HEAR_OTHER_VIEW",
    "likert",
    "positive",
    "pude escuchar una opinión distinta a la mía sin sentirme atacado/a.",
    ["apertura", "tolerancia a la diferencia"],
    0.7,
    "Estado reciente de escucha ante opiniones contrarias.",
    "EQ_FUNC_LISTEN",
  ),
  sc(
    "FUNC_INT_RUMINATION",
    "intensity",
    "negative",
    "¿qué tanto te costó dejar de darle vueltas a algo que te molestó?",
    ["rumiación", "recuperación"],
    0.65,
    "Intensidad reciente de la dificultad para soltar un malestar cotidiano.",
  ),
  sc(
    "FUNC_FREQ_NOTICE_BEFORE_ACT",
    "frequency",
    "positive",
    "¿con qué frecuencia lograste notar lo que sentías antes de actuar?",
    ["autoobservación", "autorregulación"],
    0.7,
    "Frecuencia reciente de registrar el propio estado antes de actuar.",
  ),
  sc(
    "FUNC_LIKERT_REST_WITHOUT_GUILT",
    "likert",
    "positive",
    "me di permiso para descansar sin sentirme culpable.",
    ["autocuidado", "flexibilidad"],
    0.6,
    "Estado reciente de descanso sin culpa; contraste con la sobreexigencia.",
  ),
  sc(
    "FUNC_FREQ_HABITS_TAKE_OVER",
    "frequency",
    "negative",
    "¿con qué frecuencia sentiste que tus hábitos de siempre (exigirte, complacer, evitar o controlar) te dominaron en vez de elegirlos tú?",
    ["automatismos", "libertad de elección"],
    0.75,
    "Frecuencia reciente de actuar por costumbre sin elegir; formulado sin atribuir ningún patrón concreto.",
  ),
  ch(
    "FUNC_SCENARIO_HURTFUL_COMMENT",
    "una persona cercana te hizo un comentario que te dolió. ¿Qué describe mejor lo que hiciste con más frecuencia?",
    ["manejo del conflicto", "recuperación"],
    0.75,
    "Respuesta reciente ante un comentario doloroso: aclarar con respeto, tardar pero conversar o sostener la tensión.",
    [
      [
        "Respiré, entendí mejor qué quiso decir y le respondí con claridad y respeto.",
        { flexible: 2, intermediate: 0.4, maladaptive: 0 },
      ],
      [
        "Me molesté un rato, pero luego pude conversarlo.",
        { flexible: 0.4, intermediate: 1.8, maladaptive: 0.3 },
      ],
      [
        "Me cerré o ataqué, y mantuve la tensión varios días.",
        { flexible: 0, intermediate: 0.4, maladaptive: 2 },
      ],
    ],
  ),
  sc(
    "FUNC_LIKERT_ASK_FOR_HELP",
    "likert",
    "positive",
    "pude pedir ayuda o apoyo cuando lo necesité.",
    ["vulnerabilidad", "apoyo social"],
    0.6,
    "Estado reciente de pedir apoyo cuando fue necesario.",
  ),
  sc(
    "FUNC_INT_DEFEND_IMAGE",
    "intensity",
    "negative",
    "¿qué tanto sentiste que tenías que defender tu imagen o tu postura a toda costa?",
    ["rigidez", "defensividad"],
    0.7,
    "Intensidad reciente de la necesidad de defender la propia imagen o postura.",
  ),
  sc(
    "FUNC_FREQ_ACT_ON_VALUES",
    "frequency",
    "positive",
    "¿con qué frecuencia hiciste algo que realmente te importaba aunque no fuera lo más cómodo?",
    ["acción orientada a valores"],
    0.6,
    "Frecuencia reciente de actuar conforme a lo importante pese a la incomodidad.",
  ),
  sc(
    "FUNC_LIKERT_DISPROPORTIONATE_REACTIONS",
    "likert",
    "negative",
    "sentí que mis reacciones eran más intensas de lo que la situación merecía.",
    ["reactividad", "proporcionalidad"],
    0.7,
    "Estado reciente de desproporción entre reacción y situación.",
  ),
  ch(
    "FUNC_SCENARIO_OWN_MISTAKE",
    "cometiste un error en algo que importaba. ¿Qué hiciste más a menudo?",
    ["responsabilidad", "autocompasión", "aprendizaje"],
    0.75,
    "Respuesta reciente a un error propio: asumir y aprender, asumir con demora o minimizar/castigarse.",
    [
      [
        "Lo reconocí, aprendí algo y seguí adelante.",
        { flexible: 2, intermediate: 0.4, maladaptive: 0 },
      ],
      [
        "Me costó, pero lo asumí después de un tiempo.",
        { flexible: 0.4, intermediate: 1.8, maladaptive: 0.3 },
      ],
      [
        "Lo minimicé, culpé a otros o me castigué por días.",
        { flexible: 0, intermediate: 0.4, maladaptive: 2 },
      ],
    ],
  ),
  sc(
    "FUNC_INT_PRESENT_MOMENT",
    "intensity",
    "positive",
    "¿qué tanto pudiste disfrutar el momento presente sin estar ocupado/a solo en lo que viene o lo que pasó?",
    ["presencia", "disfrute"],
    0.6,
    "Intensidad reciente de la presencia en el momento actual.",
  ),
  sc(
    "FUNC_LIKERT_OTHER_PERSPECTIVE",
    "likert",
    "positive",
    "tuve en cuenta el punto de vista de la otra persona cuando tuvimos un desacuerdo.",
    ["empatía", "toma de perspectiva"],
    0.65,
    "Estado reciente de toma de perspectiva en desacuerdos.",
  ),
  sc(
    "FUNC_FREQ_AVOID_HARD_TALKS",
    "frequency",
    "negative",
    "¿con qué frecuencia evitaste conversaciones o decisiones importantes porque te generaban incomodidad?",
    ["evitación", "afrontamiento"],
    0.7,
    "Frecuencia reciente de evitar conversaciones o decisiones difíciles.",
  ),
  sc(
    "FUNC_LIKERT_KIND_TO_SELF",
    "likert",
    "positive",
    "me traté con amabilidad cuando las cosas no salieron como quería.",
    ["autocompasión"],
    0.65,
    "Estado reciente de trato amable hacia sí mismo ante los contratiempos.",
  ),
  sc(
    "FUNC_INT_RELATIONSHIPS_CONDITIONAL",
    "intensity",
    "negative",
    "¿qué tanto sentiste que tus relaciones dependían de que te comportaras de una manera específica?",
    ["condicionalidad percibida", "autenticidad relacional"],
    0.7,
    "Intensidad reciente de la sensación de que los vínculos exigen un comportamiento determinado.",
  ),
  ch(
    "FUNC_SCENARIO_PRESSURE_WEEK",
    "tuviste una semana con mucha presión. ¿Cómo describirías lo que hiciste con tu energía?",
    ["gestión de la presión", "descanso", "apoyo"],
    0.75,
    "Gestión reciente de una semana exigente: priorizar y descansar, aguantar y recuperarse después, o llegar al límite o desconectarse.",
    [
      [
        "Prioricé, descansé lo necesario y pedí ayuda.",
        { flexible: 2, intermediate: 0.4, maladaptive: 0 },
      ],
      [
        "Aguanté y me fui desgastando, aunque pude recuperarme al terminar.",
        { flexible: 0.3, intermediate: 1.8, maladaptive: 0.4 },
      ],
      [
        "Me exigí hasta el límite o me desconecté por completo, y me costó volver al ritmo.",
        { flexible: 0, intermediate: 0.4, maladaptive: 2 },
      ],
    ],
  ),
  sc(
    "FUNC_LIKERT_NOTICE_HABIT_CHOOSE_OTHER",
    "likert",
    "positive",
    "noté con claridad cuándo estaba actuando por costumbre y pude elegir otra respuesta.",
    ["autoobservación", "libertad de elección"],
    0.75,
    "Estado reciente de detectar y variar un patrón habitual.",
  ),

  // ---- Near-duplicates ----
  sc(
    "FUNC_LIKERT_RECOVER_FROM_SURPRISES",
    "likert",
    "positive",
    "ante imprevistos, me recuperé rápido y ajusté mis planes sin demasiado esfuerzo.",
    ["flexibilidad", "recuperación"],
    0.7,
    "Reformulación de FUNC_LIKERT_ADAPT_PLANS para contrastar consistencia.",
    "EQ_FUNC_ADAPT",
  ),
  sc(
    "FUNC_LIKERT_HEAR_CRITICISM_NO_DEFENSE",
    "likert",
    "positive",
    "aunque no estuviera de acuerdo, pude oír críticas o puntos de vista contrarios sin ponerme a la defensiva.",
    ["apertura", "tolerancia a la diferencia"],
    0.7,
    "Reformulación de FUNC_LIKERT_HEAR_OTHER_VIEW para contrastar consistencia.",
    "EQ_FUNC_LISTEN",
  ),
];

function isChoice(d: Draft): d is ChoiceDraft {
  return "items" in d;
}

export const FUNCTIONING_QUESTIONS: Question[] = DRAFTS.map((draft, index) => {
  const options = isChoice(draft)
    ? opts(draft.items.map(([text, bands]) => [text, { bands }] as const))
    : scaleOptions(draft.kind, (i) => ({
        bands: { ...(draft.polarity === "positive" ? POSITIVE : NEGATIVE)[i] },
      }));
  return finish("functioning", index, draft, {
    options,
    related: [],
    timeWindow: "last-4-weeks",
  });
});
