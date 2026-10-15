/**
 * Type module (module "type"): 81 questions.
 *
 * Structure
 * - 36 choice questions (14 scenario-choice, 12 motivation-comparison, 10 forced-choice).
 *   Each has 4 options; every option carries a main type (~1.5-2.5) plus smaller
 *   spillover evidence on 1-2 other types (0.2-0.7), so no option = one obvious type.
 *   Main types rotate through four shuffled cycles, so each type is the main
 *   target of 16 options.
 * - 27 scale questions (9 likert, 9 frequency, 9 intensity; one of each per type),
 *   5 ordered options scored with SCALE_CURVE on the main type and a fraction on a side type.
 * - 9 near-duplicate likert statements (equivalenceGroup "EQ_TYPE_n") that re-phrase
 *   the likert item of the same type, so the engine can test answer consistency.
 *
 * `relatedTypes` = types whose maximum option score is >= 1 (the types the question
 * is designed to separate). Discrimination values are design hypotheses, not calibrated.
 * Content is original; it does not reproduce or paraphrase any proprietary questionnaire.
 */
import type { Question, ResponseKind } from "@/domain/assessment/types";
import {
  ENNEAGRAM_TYPES,
  type EnneagramType,
} from "@/domain/enneagram/structure";
import {
  finish,
  opts,
  round2,
  SCALE_CURVE,
  scaleOptions,
  type DraftBase,
  type TypeScores,
} from "./builders";

type Choice = readonly [string, TypeScores];

interface ChoiceDraft extends DraftBase {
  items: Choice[];
}
interface ScaleDraft extends DraftBase {
  main: EnneagramType;
  side: EnneagramType;
  factor: number;
  /** Agreement means LESS of the main type (option scoring is reversed). */
  reverse?: boolean;
}
type Draft = ChoiceDraft | ScaleDraft;

const REF_STYLE = ["riso-hudson-1999", "naranjo-1994"];
const REF_MOTIV = ["riso-hudson-1999", "ichazo-1982"];
const REF_HORNEY = ["horney-1945", "riso-hudson-1999"];
const REF_NARRATIVE = ["palmer-1988", "riso-hudson-1996"];

function c(
  code: string,
  kind: ResponseKind,
  text: string,
  dims: string[],
  d: number,
  why: string,
  refs: string[],
  items: Choice[],
): ChoiceDraft {
  return { code, kind, text, dims, d, why, refs, items };
}

function s(
  code: string,
  kind: "likert" | "frequency" | "intensity",
  text: string,
  main: EnneagramType,
  side: EnneagramType,
  factor: number,
  dims: string[],
  d: number,
  why: string,
  refs: string[],
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
    refs,
  };
  if (group) base.group = group;
  return base;
}

/** Reverse-keyed likert: no equivalence group, scoring reversed in the builder. */
function r(
  code: string,
  text: string,
  main: EnneagramType,
  side: EnneagramType,
  factor: number,
  dims: string[],
  d: number,
  why: string,
  refs: string[],
): ScaleDraft {
  return {
    ...s(code, "likert", text, main, side, factor, dims, d, why, refs),
    reverse: true,
  };
}

const sc = "scenario-choice" as const;
const mc = "motivation-comparison" as const;
const fc = "forced-choice" as const;

const CHOICE_AND_SCALE: Draft[] = [
  // ---------- Scenario choices (cycle 1 and 2 of the type rotation) ----------
  c(
    "TYPE_SCENARIO_WEAK_PLAN",
    sc,
    "Estás en una reunión de trabajo y el plan que propone el grupo te parece flojo. ¿Qué haces con más probabilidad?",
    ["respuesta ante el desacuerdo", "asertividad", "estándar interno"],
    0.7,
    "Contrasta corregir desde un estándar interno, retirarse a analizar, confrontar con fuerza y cuidar a los inseguros; el desacuerdo laboral es un contexto cotidiano que activa estilos de afrontamiento distintos.",
    REF_HORNEY,
    [
      [
        "Señalo con calma lo que está mal y propongo cómo hacerlo correctamente.",
        { 1: 2.2, 8: 0.5, 3: 0.3 },
      ],
      [
        "Me callo por ahora, analizo los datos y, si hace falta, aporto una opinión sólida después.",
        { 5: 2.2, 1: 0.4, 9: 0.4 },
      ],
      [
        "Digo sin rodeos que así no va a funcionar y empujo para cambiar el rumbo.",
        { 8: 2.2, 1: 0.5, 3: 0.4 },
      ],
      [
        "Busco primero a quienes se sienten inseguros y les ayudo a expresar sus ideas, para construir algo entre todos.",
        { 2: 2, 9: 0.6, 6: 0.3 },
      ],
    ],
  ),
  c(
    "TYPE_SCENARIO_JOB_OFFER",
    sc,
    "Te ofrecen un trabajo nuevo con mejor sueldo pero con menos estabilidad. ¿Cuál es tu primera reacción?",
    ["toma de decisiones", "seguridad", "imagen y logro"],
    0.65,
    "Una decisión con trade-off entre ganancia y seguridad hace visible la anticipación del riesgo, la postergación, la orientación al éxito y la búsqueda de novedad.",
    REF_STYLE,
    [
      [
        "Pregunto todo lo que pueda salir mal y busco garantías antes de decidir.",
        { 6: 2.3, 5: 0.5, 1: 0.3 },
      ],
      [
        "Me cuesta decidir; dejo pasar los días hasta que la situación se resuelva sola.",
        { 9: 2.2, 6: 0.6, 2: 0.2 },
      ],
      [
        "Evalúo cómo esto impulsa mi carrera y qué imagen proyectará frente a los demás.",
        { 3: 2.2, 7: 0.4, 8: 0.3 },
      ],
      [
        "Me entusiasma la novedad y me imagino ya las posibilidades que se abren.",
        { 7: 2.3, 3: 0.5, 8: 0.3 },
      ],
    ],
  ),
  c(
    "TYPE_SCENARIO_FRIEND_HARD_TIME",
    sc,
    "Un amigo cercano te cuenta que está pasando un momento muy difícil. ¿Cómo sueles reaccionar?",
    ["empatía", "forma de apoyar", "manejo del dolor ajeno"],
    0.65,
    "El modo de acompañar el sufrimiento ajeno (identificación emocional, consejo correctivo, distancia reflexiva o impulso a la acción) discrimina estilos afectivos y de afrontamiento.",
    REF_NARRATIVE,
    [
      [
        "Me conecto con su dolor y me quedo a su lado, aunque no sepa qué decir, porque sé lo que se siente estar así.",
        { 4: 2.3, 2: 0.6, 9: 0.2 },
      ],
      [
        "Le doy consejos concretos sobre lo que debería hacer para resolverlo de la forma correcta.",
        { 1: 2.2, 8: 0.4, 3: 0.3 },
      ],
      [
        "Lo escucho con atención y luego me retiro a pensar cómo ayudarle de forma útil, sin invadirlo.",
        { 5: 2.2, 4: 0.4, 9: 0.4 },
      ],
      [
        "Le digo que se levante, que lo enfrente, y me ofrezco a ayudar a mover lo que haga falta.",
        { 8: 2.3, 3: 0.5, 1: 0.3 },
      ],
    ],
  ),
  c(
    "TYPE_SCENARIO_FAMILY_TENSION",
    sc,
    "Llegas a una reunión familiar en la que hay tensión entre dos personas. ¿Qué haces?",
    ["manejo del conflicto", "búsqueda de armonía", "vigilancia"],
    0.65,
    "Ante tensión interpersonal, distintas estrategias (mediar con calidez, vigilar, evitar o redirigir con energía positiva) separan estilos orientados a la relación, la evitación y la anticipación.",
    REF_HORNEY,
    [
      [
        "Me acerco a cada uno para suavizar las cosas y asegurarme de que todos se sientan queridos.",
        { 2: 2.2, 9: 0.7, 6: 0.2 },
      ],
      [
        "Observo con cautela de qué lado viene el problema y me quedo atento por si escala.",
        { 6: 2.2, 5: 0.5, 1: 0.3 },
      ],
      [
        "Cambio de tema o me voy a otra habitación; prefiero que se calme solo.",
        { 9: 2.3, 5: 0.5, 6: 0.3 },
      ],
      [
        "Tomo la iniciativa de organizar algo (comida, juego) que redirija la atención y levante el ánimo.",
        { 3: 2, 7: 0.7, 2: 0.5 },
      ],
    ],
  ),
  c(
    "TYPE_SCENARIO_FREE_WEEK",
    sc,
    "Tienes una semana libre sin obligaciones. ¿Qué eliges?",
    ["uso del tiempo libre", "fuente de satisfacción", "orden vs. exploración"],
    0.6,
    "El uso espontáneo del tiempo libre expresa preferencias motivacionales: variedad, autoexpresión, orden y deber, o profundización intelectual.",
    REF_STYLE,
    [
      [
        "Planear varias actividades distintas para aprovechar cada día al máximo.",
        { 7: 2.3, 3: 0.5, 8: 0.3 },
      ],
      [
        "Dedicarla a algo creativo o reflexivo que me conecte con lo que realmente siento.",
        { 4: 2.2, 5: 0.5, 9: 0.3 },
      ],
      [
        "Poner en orden pendientes, arreglar cosas de la casa y avanzar en lo que tengo atrasado.",
        { 1: 2.2, 3: 0.5, 6: 0.3 },
      ],
      [
        "Sumergirme en un tema que me interesa: leer, investigar, aprender con calma.",
        { 5: 2.3, 4: 0.4, 9: 0.4 },
      ],
    ],
  ),
  c(
    "TYPE_SCENARIO_GROUP_PLAN_DISLIKE",
    sc,
    "En un grupo de amigos, deciden un plan que a ti no te convence. ¿Cómo reaccionas?",
    ["asertividad", "acomodación", "necesidad de previsibilidad"],
    0.7,
    "Un desacuerdo con el plan colectivo separa la defensa franca de la preferencia, la adaptación para mantener el vínculo, la búsqueda de previsibilidad y la fusión con el grupo.",
    REF_HORNEY,
    [
      [
        "Digo claramente que no me gusta y propongo otro; si es necesario, hago valer mi opinión.",
        { 8: 2.3, 1: 0.4, 3: 0.3 },
      ],
      [
        "Me adapto, pero me fijo en quién necesita más apoyo para que todos la pasen bien.",
        { 2: 2, 9: 0.7, 6: 0.3 },
      ],
      [
        "Pregunto detalles para sentirme seguro/a: horarios, lugar, quién va; y me preparo por si algo falla.",
        { 6: 2.2, 1: 0.4, 5: 0.4 },
      ],
      [
        "Digo que está bien; lo que importa es que no haya tensión, y me acomodo.",
        { 9: 2.3, 2: 0.5, 6: 0.3 },
      ],
    ],
  ),
  c(
    "TYPE_SCENARIO_PRESENTATION",
    sc,
    "Te piden presentar tu trabajo ante personas importantes. ¿Qué te mueve más a prepararte?",
    ["motivación de logro", "imagen", "exigencia"],
    0.65,
    "Presentar ante figuras relevantes activa tanto la preocupación por la imagen y el reconocimiento como la búsqueda de autenticidad, el disfrute espontáneo o la meticulosidad.",
    REF_MOTIV,
    [
      [
        "Quiero que se vea impecable y que quienes me vean reconozcan mi valor.",
        { 3: 2.3, 1: 0.5, 7: 0.2 },
      ],
      [
        "Lo veo como una oportunidad emocionante; improviso un poco y disfruto el momento.",
        { 7: 2.2, 3: 0.7, 8: 0.3 },
      ],
      [
        "Me importa que se note mi estilo propio, no hacer una presentación genérica como la de todos.",
        { 4: 2.2, 3: 0.5, 5: 0.2 },
      ],
      [
        "Reviso cada detalle y practico hasta estar seguro/a de que no hay errores.",
        { 1: 2.3, 6: 0.5, 3: 0.4 },
      ],
    ],
  ),
  c(
    "TYPE_SCENARIO_BIG_FAVOR",
    sc,
    "Un conocido te pide un favor grande que te consumiría varias tardes. ¿Qué haces?",
    ["límites personales", "disponibilidad", "necesidad de ser útil"],
    0.7,
    "Responder a una petición costosa muestra cómo se gestionan los límites: proteger la energía, juzgar con criterio de justicia, ceder por necesidad de ayudar o pedir claridad.",
    REF_NARRATIVE,
    [
      [
        "Calculo mi energía y mi tiempo; si no me alcanzan, lo rechazo y me protejo.",
        { 5: 2.2, 9: 0.4, 1: 0.3 },
      ],
      [
        "Si me parece justo y puedo, lo hago a mi manera; si no, digo que no sin dar muchas vueltas.",
        { 8: 2.2, 3: 0.3, 1: 0.3 },
      ],
      [
        "Acepto casi seguro; me cuesta decir que no cuando alguien me necesita.",
        { 2: 2.3, 9: 0.6, 6: 0.3 },
      ],
      [
        "Pregunto con exactitud qué implica y qué se espera de mí, antes de comprometerme.",
        { 6: 2.2, 5: 0.6, 1: 0.3 },
      ],
    ],
  ),
  c(
    "TYPE_SCENARIO_CANCELLED_PLAN",
    sc,
    "Se cancela un plan importante a última hora. ¿Qué haces?",
    [
      "flexibilidad ante imprevistos",
      "afrontamiento de la frustración",
      "búsqueda de estímulo",
    ],
    0.6,
    "Un imprevisto frustrante revela estrategias distintas: tomar la pausa con calma, redirigir a lo productivo, buscar un reemplazo placentero o procesar la decepción internamente.",
    REF_STYLE,
    [
      [
        "Lo tomo con calma; igual me quedo en casa tranquilo/a y hago lo que se vaya dando.",
        { 9: 2.2, 5: 0.4, 7: 0.4 },
      ],
      [
        "Reorganizo rápido para aprovechar el tiempo en algo productivo o que me dé visibilidad.",
        { 3: 2.2, 7: 0.5, 8: 0.3 },
      ],
      [
        "Busco enseguida un plan alternativo más divertido; no me quedo con las ganas.",
        { 7: 2.3, 3: 0.4, 9: 0.2 },
      ],
      [
        "Siento una decepción profunda y necesito un rato para entender qué me pasa antes de hacer otra cosa.",
        { 4: 2.2, 5: 0.4, 6: 0.3 },
      ],
    ],
  ),
  c(
    "TYPE_SCENARIO_NEW_COLLEAGUE_LUNCH",
    sc,
    "Un compañero nuevo parece estar solo en el almuerzo. ¿Qué haces?",
    [
      "iniciativa social",
      "cuidado de otros",
      "identificación con la exclusión",
    ],
    0.55,
    "Acercarse a quien está aislado puede nacer de la atención activa a los demás, de la sociabilidad entusiasta, de la identificación con el sentirse fuera o de la prudencia para no presionar.",
    REF_NARRATIVE,
    [
      [
        "Lo invito a mi mesa y procuro que se sienta bienvenido, aunque no lo conozca.",
        { 2: 2.2, 7: 0.5, 9: 0.3 },
      ],
      [
        "Lo invito y de paso propongo algo divertido para el grupo; me encanta conocer gente nueva.",
        { 7: 2.1, 2: 0.6, 3: 0.4 },
      ],
      [
        "Me identifico con esa sensación de no encajar y pienso en acercarme, aunque me cuesta dar el primer paso.",
        { 4: 2.2, 5: 0.5, 2: 0.4 },
      ],
      [
        "Si se da la ocasión, converso; no quiero presionar a nadie ni incomodar.",
        { 9: 2.1, 5: 0.5, 2: 0.4 },
      ],
    ],
  ),
  c(
    "TYPE_SCENARIO_COLLEAGUE_ERROR",
    sc,
    "Descubres que un colega entregó un informe con un error que nadie ha notado. ¿Qué haces?",
    ["criterio moral", "cautela social", "asertividad"],
    0.7,
    "Ante un error ajeno no detectado se contrastan el impulso a corregir lo incorrecto, la duda por las consecuencias, la confrontación directa y el cuidado de la imagen del equipo.",
    REF_STYLE,
    [
      [
        "Lo corrijo o aviso de inmediato; no puedo dejar pasar algo incorrecto.",
        { 1: 2.3, 6: 0.4, 8: 0.3 },
      ],
      [
        "Dudo si decirlo: pienso en las consecuencias y en quién podría molestarse, y consulto con alguien de confianza.",
        { 6: 2.2, 9: 0.5, 5: 0.3 },
      ],
      [
        "Voy directo a quien corresponda y exijo que se arregle, sin suavizar el mensaje.",
        { 8: 2.2, 1: 0.6, 3: 0.2 },
      ],
      [
        "Evalúo cómo manejarlo para que el equipo salga bien parado y se vea nuestro buen desempeño.",
        { 3: 2.2, 2: 0.4, 1: 0.3 },
      ],
    ],
  ),
  c(
    "TYPE_SCENARIO_PROJECT_DONE",
    sc,
    "Terminas un proyecto largo y alguien te pregunta cómo te sientes. ¿Cuál es tu respuesta interna más probable?",
    ["cierre de ciclos", "fuente de satisfacción", "vínculo con otros"],
    0.55,
    "Cómo se vive el final de un proyecto expresa dónde se ubica la gratificación: espacio propio, utilidad para otros, continuidad hacia lo nuevo o un vacío de significado.",
    REF_MOTIV,
    [
      [
        "Siento alivio de poder retirarme y volver a mis cosas sin tener que dar explicaciones.",
        { 5: 2.2, 9: 0.5, 4: 0.3 },
      ],
      [
        "Me alegra que haya servido a otros; ahora quiero saber cómo están todos.",
        { 2: 2.2, 3: 0.4, 9: 0.3 },
      ],
      [
        "Estoy listo/a para lo siguiente; ya estoy pensando en nuevas ideas.",
        { 7: 2.2, 3: 0.6, 8: 0.3 },
      ],
      [
        "Siento una mezcla rara de logro y vacío; quisiera que significara más de lo que significa.",
        { 4: 2.3, 5: 0.3, 6: 0.3 },
      ],
    ],
  ),
  c(
    "TYPE_SCENARIO_MOVING_DAY",
    sc,
    "Hay que repartir tareas de una mudanza entre varias personas. ¿Cuál sería tu papel natural?",
    ["rol en el grupo", "organización", "previsión de riesgos"],
    0.6,
    "El rol espontáneo en una tarea colectiva (adaptarse, ordenar, anticipar fallos o tomar el mando físico) separa estilos de contribución sin mencionar rasgos de personalidad.",
    REF_HORNEY,
    [
      [
        "El que se adapta a lo que falte y mantiene la buena onda del grupo.",
        { 9: 2.1, 2: 0.6, 7: 0.2 },
      ],
      [
        "El que propone un orden y verifica que todo quede bien embalado y etiquetado.",
        { 1: 2.3, 6: 0.5, 3: 0.3 },
      ],
      [
        "El que pregunta qué puede salir mal (escaleras, fragilidad, horarios) y prevé soluciones.",
        { 6: 2.2, 1: 0.5, 5: 0.3 },
      ],
      [
        "El que da instrucciones, levanta lo más pesado y resuelve imprevistos sobre la marcha.",
        { 8: 2.3, 3: 0.5, 7: 0.2 },
      ],
    ],
  ),

  c(
    "TYPE_SCENARIO_FIFTEEN_MINUTES",
    sc,
    "Te quedan solo 15 minutos libres antes de una cita. ¿Qué haces?",
    ["uso de pausas", "regulación de energía", "preparación"],
    0.55,
    "El uso espontáneo de una pausa breve (prepararse, aislarse, cuidar a alguien, buscar un estímulo agradable) refleja estrategias distintas de regulación y de atención.",
    REF_STYLE,
    [
      [
        "Reviso mi aspecto, mensajes y agenda para llegar preparado/a y dar buena impresión.",
        { 3: 2.1, 1: 0.5, 6: 0.2 },
      ],
      [
        "Me aíslo un momento para despejar mi cabeza; necesito silencio antes de socializar.",
        { 5: 2.2, 4: 0.4, 9: 0.5 },
      ],
      [
        "Aprovecho para escribirle a alguien que sé que lo está pasando mal y preguntarle cómo está.",
        { 2: 2.2, 6: 0.3, 9: 0.3 },
      ],
      [
        "Pienso en lo que haremos después y busco algo para picar o ver que me anime.",
        { 7: 2.4, 3: 0.4, 9: 0.3 },
      ],
    ],
  ),

  // ---------- Motivation comparisons ----------
  c(
    "TYPE_MOTIV_EFFORT_GOAL",
    mc,
    "Cuando te esfuerzas mucho por algo, ¿qué es lo que más deseas conseguir al final?",
    ["deseo básico", "motivación"],
    0.8,
    "Pregunta directa por el deseo de fondo tras el esfuerzo (autoexpresión, paz, corrección, seguridad), formulada sin términos técnicos.",
    REF_MOTIV,
    [
      [
        "Que lo que hice exprese de verdad quién soy.",
        { 4: 2.3, 3: 0.3, 5: 0.3 },
      ],
      [
        "Que todo siga en paz, sin conflictos nuevos.",
        { 9: 2.2, 2: 0.4, 6: 0.3 },
      ],
      [
        "Haber hecho lo correcto, de la mejor manera posible.",
        { 1: 2.3, 6: 0.4, 3: 0.3 },
      ],
      [
        "Sentir que quedo a salvo y que puedo contar con algo firme.",
        { 6: 2.3, 9: 0.5, 1: 0.2 },
      ],
    ],
  ),
  c(
    "TYPE_MOTIV_WHAT_MATTERS_DAILY",
    mc,
    "¿Qué te resulta más importante en la vida cotidiana?",
    ["valores", "necesidad central"],
    0.75,
    "Compara necesidades centrales distintas (autonomía y control, logro reconocido, comprensión y espacio, afecto recibido) como motor del día a día.",
    REF_MOTIV,
    [
      [
        "Tener control sobre mis decisiones y no depender de nadie.",
        { 8: 2.3, 5: 0.5, 3: 0.3 },
      ],
      [
        "Lograr cosas visibles y que me reconozcan por ellas.",
        { 3: 2.3, 8: 0.4, 1: 0.2 },
      ],
      [
        "Entender cómo funcionan las cosas y tener suficiente espacio y recursos propios.",
        { 5: 2.3, 4: 0.3, 6: 0.3 },
      ],
      [
        "Sentirme necesitado/a y querido/a por las personas que me importan.",
        { 2: 2.3, 4: 0.4, 9: 0.3 },
      ],
    ],
  ),
  c(
    "TYPE_MOTIV_IDEAL_WEEK",
    mc,
    "Si pudieras elegir una sola cosa para tu semana ideal, ¿cuál sería?",
    ["deseo básico", "relación con el placer", "paz interior"],
    0.65,
    "La semana ideal imaginada condensa el deseo dominante: variedad sin límites, intensidad emocional, tranquilidad sin presión o ausencia de deudas y errores.",
    REF_MOTIV,
    [
      [
        "Tener muchas experiencias nuevas y disfrutar sin sentirme limitado/a.",
        { 7: 2.3, 3: 0.4, 8: 0.3 },
      ],
      [
        "Tener momentos profundos que me hagan sentir intensamente vivo/a.",
        { 4: 2.3, 7: 0.3, 2: 0.2 },
      ],
      [
        "Tener una rutina tranquila donde nadie me apure ni me exija.",
        { 9: 2.3, 5: 0.5, 6: 0.2 },
      ],
      [
        "Haber cumplido con todo lo que debía, sin deudas pendientes ni errores.",
        { 1: 2.3, 6: 0.5, 3: 0.3 },
      ],
    ],
  ),
  c(
    "TYPE_MOTIV_HIDDEN_FEAR",
    mc,
    "¿Qué temes más, aunque no lo digas?",
    ["miedo básico", "vulnerabilidad"],
    0.75,
    "Contrasta miedos de fondo (desamparo, ser controlado, ser considerado un fracaso, ser desbordado) como indicador motivacional complementario al deseo.",
    REF_MOTIV,
    [
      [
        "Quedarme sin apoyo o sin saber qué hacer cuando algo salga mal.",
        { 6: 2.3, 5: 0.5, 9: 0.3 },
      ],
      [
        "Que alguien me controle o se aproveche de mi debilidad.",
        { 8: 2.3, 6: 0.4, 5: 0.2 },
      ],
      [
        "Que me vean como alguien que fracasó o que no vale.",
        { 3: 2.3, 4: 0.4, 1: 0.2 },
      ],
      [
        "Que me desborden con exigencias y me dejen sin energía ni recursos.",
        { 5: 2.3, 9: 0.4, 6: 0.3 },
      ],
    ],
  ),
  c(
    "TYPE_MOTIV_BIG_DECISION",
    mc,
    "Cuando tomas una decisión importante, ¿qué pesa más en tu cabeza?",
    ["criterio de decisión", "riesgo", "poder personal"],
    0.7,
    "El criterio dominante en decisiones relevantes (metas y destaque, riesgos y plan B, deber ser, poder de acción) distingue estilos cognitivos y motivacionales.",
    REF_STYLE,
    [
      [
        "Qué me acerca más a mis metas y me hace destacar.",
        { 3: 2.2, 7: 0.4, 8: 0.3 },
      ],
      [
        "Qué riesgos hay y qué plan alternativo tendría si sale mal.",
        { 6: 2.3, 5: 0.4, 1: 0.3 },
      ],
      [
        "Qué es lo correcto y responsable, aunque no sea lo más cómodo.",
        { 1: 2.3, 6: 0.4, 3: 0.2 },
      ],
      [
        "Qué me da más poder de acción y menos dependencia de otros.",
        { 8: 2.2, 3: 0.5, 5: 0.3 },
      ],
    ],
  ),
  c(
    "TYPE_MOTIV_FEEL_VALUABLE",
    mc,
    "¿Qué te hace sentir más valioso/a?",
    ["autoimagen", "fuente de valía"],
    0.75,
    "La fuente de valía personal (singularidad, ser buscado y apreciado, ser fuente de calma, competencia) expresa la imagen de sí característica de cada patrón.",
    REF_MOTIV,
    [
      [
        "Ser alguien único, con una mirada propia que no se parece a las demás.",
        { 4: 2.3, 5: 0.4, 3: 0.2 },
      ],
      [
        "Ser alguien a quien los demás buscan y aprecian por su apoyo.",
        { 2: 2.3, 9: 0.4, 3: 0.3 },
      ],
      [
        "Ser alguien con quien todos se sienten tranquilos y a gusto.",
        { 9: 2.2, 2: 0.6, 6: 0.2 },
      ],
      [
        "Ser alguien competente, que sabe y que no necesita que le expliquen todo.",
        { 5: 2.3, 1: 0.4, 3: 0.3 },
      ],
    ],
  ),
  c(
    "TYPE_MOTIV_CONVERSATION_ROLE",
    mc,
    "En una conversación con amigos, ¿qué prefieres aportar?",
    ["estilo comunicativo", "rol social"],
    0.55,
    "El tipo de aporte conversacional preferido (humor y ligereza, logros, previsión de fallos, opinión fundamentada) refleja motivaciones sociales diferentes.",
    REF_STYLE,
    [
      [
        "Ideas, anécdotas y humor para que el ambiente sea ligero.",
        { 7: 2.3, 3: 0.4, 2: 0.2 },
      ],
      [
        "Mis logros o proyectos, para inspirar y dejar buena impresión.",
        { 3: 2.2, 7: 0.4, 8: 0.2 },
      ],
      [
        "Preguntas y advertencias; me gusta asegurarme de que no falte nada y no haya sorpresas.",
        { 6: 2.2, 5: 0.4, 1: 0.3 },
      ],
      [
        "Opiniones fundamentadas sobre lo que está bien o mal en el asunto.",
        { 1: 2.2, 8: 0.5, 5: 0.3 },
      ],
    ],
  ),
  c(
    "TYPE_MOTIV_INJUSTICE_DRIVER",
    mc,
    "Ante una injusticia que afecta a alguien cercano, ¿qué te mueve a actuar?",
    ["motor de la acción", "intensidad emocional", "conciliación"],
    0.65,
    "Distingue el impulso de proteger con fuerza, la resonancia emocional intensa, el cuidado presente y la conciliación como motores de la acción ante lo injusto.",
    REF_HORNEY,
    [
      [
        "Las ganas de proteger y de que se imponga lo justo, aunque haya pelea.",
        { 8: 2.3, 1: 0.5, 2: 0.3 },
      ],
      [
        "Una emoción muy fuerte, como si fuera propia; necesito expresarla de algún modo.",
        { 4: 2.2, 2: 0.4, 8: 0.3 },
      ],
      [
        "El deseo de acompañar y cuidar a esa persona, estando presente.",
        { 2: 2.3, 9: 0.4, 4: 0.3 },
      ],
      [
        "Quiero que se resuelva sin más conflicto; busco conciliar a las partes.",
        { 9: 2.2, 2: 0.5, 6: 0.3 },
      ],
    ],
  ),
  c(
    "TYPE_MOTIV_INTEREST_RESPONSE",
    mc,
    "Cuando algo te interesa de verdad, ¿qué haces?",
    ["curiosidad", "estilo de aprendizaje", "búsqueda de respaldo"],
    0.65,
    "El modo de acercarse a un interés (estudio profundo, experimentación inmediata, conversión en logro, consulta y verificación) diferencia estilos mentales.",
    REF_STYLE,
    [
      [
        "Lo estudio a fondo, reúno información y construyo mi propio criterio.",
        { 5: 2.3, 1: 0.4, 4: 0.2 },
      ],
      [
        "Lo pruebo ya mismo y lo combino con otras cosas que también me atraen.",
        { 7: 2.3, 3: 0.4, 8: 0.2 },
      ],
      [
        "Pienso cómo convertirlo en logros o en algo que me posicione.",
        { 3: 2.2, 7: 0.4, 1: 0.2 },
      ],
      [
        "Busco la opinión de personas confiables y reviso riesgos antes de meterme del todo.",
        { 6: 2.3, 5: 0.5, 1: 0.2 },
      ],
    ],
  ),
  c(
    "TYPE_MOTIV_CRITICISM_REACTION",
    mc,
    "Cuando alguien te critica, ¿qué pasa dentro de ti?",
    ["reacción a la crítica", "autocrítica", "defensa"],
    0.75,
    "La reacción interna ante la crítica (autoexamen estricto, defensa con fuerza, herida por la identidad o temor a perder el vínculo) distingue patrones defensivos y afectivos.",
    REF_NARRATIVE,
    [
      [
        "Me cuesta aceptarlo, pero reviso si tienen razón; ya me critico yo bastante.",
        { 1: 2.2, 6: 0.5, 3: 0.2 },
      ],
      [
        "Me pongo a la defensiva y respondo con fuerza; no dejo que me pisen.",
        { 8: 2.2, 1: 0.4, 3: 0.3 },
      ],
      [
        "Me hiere profundamente y me quedo rumiando lo que sintió esa crítica sobre quién soy.",
        { 4: 2.3, 2: 0.4, 6: 0.3 },
      ],
      [
        "Me preocupa que la relación se dañe y trato de recuperar la cercanía cuanto antes.",
        { 2: 2.2, 9: 0.5, 6: 0.3 },
      ],
    ],
  ),
  c(
    "TYPE_MOTIV_END_OF_DAY",
    mc,
    "Al final del día, ¿qué es lo que más disfrutas?",
    ["fuente de satisfacción", "descanso", "logro"],
    0.5,
    "Lo que se disfruta al cerrar el día (descanso simple, reflexión a solas, vivencias divertidas, avance visible) expresa gratificaciones características de cada patrón.",
    REF_STYLE,
    [
      [
        "Descansar sin presión, con cosas simples y conocidas.",
        { 9: 2.3, 5: 0.4, 2: 0.2 },
      ],
      [
        "Poder reflexionar solo/a sobre lo que aprendí.",
        { 5: 2.2, 4: 0.4, 9: 0.4 },
      ],
      ["Haber vivido algo divertido o inesperado.", { 7: 2.3, 3: 0.3, 9: 0.2 }],
      [
        "Ver que avancé en mis metas y que otros lo notaron.",
        { 3: 2.3, 1: 0.4, 7: 0.2 },
      ],
    ],
  ),
  c(
    "TYPE_MOTIV_RECOGNISED_QUALITY",
    mc,
    "Si tuvieras que elegir una cualidad que otros reconozcan en ti, ¿cuál sería?",
    ["autoimagen", "valores"],
    0.6,
    "La cualidad ideal que se desea ver reconocida (lealtad, integridad, fuerza, profundidad) condensa la autoimagen idealizada de distintos patrones.",
    REF_MOTIV,
    [
      [
        "Lealtad y compromiso en los momentos difíciles.",
        { 6: 2.3, 2: 0.5, 1: 0.3 },
      ],
      ["Integridad y sentido del deber.", { 1: 2.3, 6: 0.5, 3: 0.2 }],
      ["Fuerza y capacidad de protección.", { 8: 2.3, 3: 0.4, 2: 0.2 }],
      ["Profundidad y autenticidad emocional.", { 4: 2.3, 5: 0.3, 2: 0.3 }],
    ],
  ),

  // ---------- Forced choices ----------
  c(
    "TYPE_FORCED_SELF_NEGLECT",
    fc,
    "Elige la frase que más se parezca a ti, aunque ninguna te describa del todo.",
    ["relación con las propias necesidades", "evitación", "retención"],
    0.7,
    "Frases de autodescripción cotidianas sobre olvidarse de sí por los demás, ceder para mantener la calma, guardarse hacia adentro o huir de lo incómodo.",
    REF_NARRATIVE,
    [
      [
        "Estoy muy atento/a a lo que sienten los demás, hasta el punto de olvidarme de mí.",
        { 2: 2.3, 9: 0.5, 4: 0.3 },
      ],
      [
        "Con frecuencia me dejo llevar por lo que otros quieren para mantener la calma.",
        { 9: 2.3, 2: 0.5, 6: 0.3 },
      ],
      [
        "Prefiero observar y guardarme mis cosas antes que exponerme por completo.",
        { 5: 2.3, 4: 0.4, 9: 0.3 },
      ],
      [
        "Cuando algo me incomoda, me muevo hacia algo más agradable.",
        { 7: 2.3, 9: 0.4, 3: 0.3 },
      ],
    ],
  ),
  c(
    "TYPE_FORCED_INNER_WORLD",
    fc,
    "Elige la frase que más se parezca a ti, aunque ninguna te describa del todo.",
    ["vida interior", "imagen", "anticipación"],
    0.7,
    "Contrasta intensidad del mundo interior, desdibujamiento de prioridades, anticipación del peor escenario y gestión de la imagen social.",
    REF_STYLE,
    [
      [
        "Siento que mi mundo interior es más intenso que el de la mayoría.",
        { 4: 2.3, 5: 0.4, 2: 0.2 },
      ],
      [
        "Me cuesta saber cuál es mi prioridad y suelo dejarme absorber por lo secundario.",
        { 9: 2.3, 7: 0.3, 2: 0.3 },
      ],
      [
        "Siempre pienso en el peor escenario para estar preparado/a.",
        { 6: 2.3, 5: 0.4, 1: 0.2 },
      ],
      [
        "Soy muy consciente de la imagen que proyecto y la ajusto según la ocasión.",
        { 3: 2.3, 2: 0.4, 7: 0.2 },
      ],
    ],
  ),
  c(
    "TYPE_FORCED_VULNERABILITY",
    fc,
    "Elige la frase que más se parezca a ti, aunque ninguna te describa del todo.",
    ["vulnerabilidad", "autoexigencia", "distancia emocional"],
    0.7,
    "Frases sobre cómo se maneja mostrarse vulnerable: reaccionar con fuerza, exigirse sin descanso, preferir las ideas a las emociones intensas, o validarse ayudando.",
    REF_HORNEY,
    [
      [
        "Si me provocan, respondo: no soporto sentirme vulnerable ante otros.",
        { 8: 2.3, 6: 0.3, 1: 0.3 },
      ],
      [
        "Me exijo mucho y me cuesta relajarme mientras haya algo por mejorar.",
        { 1: 2.3, 3: 0.4, 6: 0.3 },
      ],
      [
        "Me siento más cómodo/a con ideas que con emociones intensas de los demás.",
        { 5: 2.3, 1: 0.3, 4: 0.3 },
      ],
      [
        "Me nace ayudar; cuando alguien me necesita, siento que valgo.",
        { 2: 2.3, 9: 0.3, 3: 0.3 },
      ],
    ],
  ),
  c(
    "TYPE_FORCED_WHAT_DRIVES_ME",
    fc,
    "Elige la frase que más se parezca a ti, aunque ninguna te describa del todo.",
    ["motivación", "autonomía", "orden"],
    0.65,
    "Frases de motivación cotidiana: ganar y que se note, decidir por uno mismo, ordenar y cumplir acuerdos, o preservar la energía.",
    REF_MOTIV,
    [
      [
        "Me motiva ganar y que se note que lo hice bien.",
        { 3: 2.3, 8: 0.4, 1: 0.2 },
      ],
      [
        "Me gusta decidir por mí mismo/a y no sentir que alguien manda sobre mí.",
        { 8: 2.3, 5: 0.4, 3: 0.2 },
      ],
      [
        "Me gusta que las cosas estén en su lugar y que se sigan los acuerdos.",
        { 1: 2.3, 6: 0.5, 3: 0.2 },
      ],
      [
        "Me gusta ahorrar mi energía y mi tiempo para lo que realmente me importa.",
        { 5: 2.2, 9: 0.4, 1: 0.2 },
      ],
    ],
  ),
  c(
    "TYPE_FORCED_BRIGHT_SIDE",
    fc,
    "Elige la frase que más se parezca a ti, aunque ninguna te describa del todo.",
    ["manejo del malestar", "atención a lo que falta", "desconfianza"],
    0.7,
    "Frases sobre cómo se gestiona el malestar y la duda: rescatar lo luminoso, notar lo que falta, postergar lo importante o verificar la confianza.",
    REF_STYLE,
    [
      [
        "Me cuesta quedarme con lo malo; enseguida busco el lado luminoso o un plan nuevo.",
        { 7: 2.3, 9: 0.4, 3: 0.3 },
      ],
      [
        "Noto con facilidad lo que falta, incluso cuando todo parece estar bien.",
        { 4: 2.3, 1: 0.4, 6: 0.2 },
      ],
      [
        "Me cuesta ponerme en marcha y pongo en pausa lo que me importa.",
        { 9: 2.3, 5: 0.3, 7: 0.3 },
      ],
      [
        "Me cuesta confiar de inmediato; necesito ver que alguien cumple antes de relajarme.",
        { 6: 2.3, 8: 0.3, 5: 0.3 },
      ],
    ],
  ),
  c(
    "TYPE_FORCED_GIVING_AND_LACKING",
    fc,
    "Elige la frase que más se parezca a ti, aunque ninguna te describa del todo.",
    ["dar y recibir", "compromiso", "tristeza elaborada"],
    0.65,
    "Frases sobre dar sin que lo pidan, temor a cerrar opciones, nostalgia elaborada y adaptación excesiva.",
    REF_NARRATIVE,
    [
      [
        "Doy sin que me lo pidan, y me duele cuando no lo valoran.",
        { 2: 2.3, 4: 0.4, 9: 0.3 },
      ],
      [
        "Me cuesta comprometerme con una sola cosa porque temo perderme otras opciones.",
        { 7: 2.3, 6: 0.3, 3: 0.3 },
      ],
      [
        "A veces siento nostalgia o tristeza que me resulta casi hermosa.",
        { 4: 2.3, 5: 0.3, 2: 0.2 },
      ],
      [
        "Me adapto tanto que a veces no sé qué quiero yo.",
        { 9: 2.3, 2: 0.5, 6: 0.3 },
      ],
    ],
  ),
  c(
    "TYPE_FORCED_RULES_AND_FRANKNESS",
    fc,
    "Elige la frase que más se parezca a ti, aunque ninguna te describa del todo.",
    ["relación con las normas", "franqueza", "pragmatismo"],
    0.65,
    "Frases sobre cumplir lo esperado con desconfianza hacia las promesas, pragmatismo orientado a resultados, franqueza directa y respeto por las normas.",
    REF_HORNEY,
    [
      [
        "Hago lo que se espera de mí y desconfío de quien promete mucho.",
        { 6: 2.2, 1: 0.5, 5: 0.3 },
      ],
      [
        "Me adapto rápido a lo que funciona y dejo atrás lo que no da resultados.",
        { 3: 2.3, 7: 0.4, 8: 0.3 },
      ],
      [
        "Prefiero decir las cosas de frente aunque incomode.",
        { 8: 2.3, 1: 0.4, 3: 0.3 },
      ],
      [
        "Me molesta la gente que se salta las normas y yo no lo haría.",
        { 1: 2.3, 6: 0.4, 8: 0.3 },
      ],
    ],
  ),
  c(
    "TYPE_FORCED_EXPOSURE_AND_ROUTINE",
    fc,
    "Elige la frase que más se parezca a ti, aunque ninguna te describa del todo.",
    ["exposición", "pedir ayuda", "aburrimiento", "ser comprendido"],
    0.7,
    "Frases sobre incomodidad con opinar sin preparación, dificultad para pedir ayuda, aburrimiento ante la rutina y sentirse incomprendido en el sufrimiento.",
    REF_STYLE,
    [
      [
        "Me incomoda que me pidan opinar sin haberlo pensado.",
        { 5: 2.3, 6: 0.4, 9: 0.3 },
      ],
      [
        "Me cuesta pedir ayuda; me resulta más fácil darla.",
        { 2: 2.3, 8: 0.4, 9: 0.2 },
      ],
      [
        "Me aburro con la rutina y busco algo que la rompa.",
        { 7: 2.3, 3: 0.3, 8: 0.3 },
      ],
      [
        "Cuando sufro, siento que nadie me entiende del todo.",
        { 4: 2.3, 5: 0.4, 6: 0.2 },
      ],
    ],
  ),
  c(
    "TYPE_FORCED_CONFLICT_AND_FORCE",
    fc,
    "Elige la frase que más se parezca a ti, aunque ninguna te describa del todo.",
    ["agotamiento por conflicto", "sospecha", "metas", "intensidad"],
    0.7,
    "Frases sobre agotamiento ante el conflicto, cuestionamiento de las intenciones ajenas, orientación a metas y defensa vehemente de lo importante.",
    REF_HORNEY,
    [
      [
        "Cuando hay un conflicto, siento un cansancio enorme y quiero que termine.",
        { 9: 2.3, 2: 0.4, 5: 0.3 },
      ],
      [
        "Suelo cuestionar si lo que me dicen es verdad o si hay otra intención.",
        { 6: 2.3, 5: 0.4, 8: 0.3 },
      ],
      [
        "Tengo siempre en mente una lista de metas y cómo avanzar en ellas.",
        { 3: 2.3, 1: 0.5, 7: 0.3 },
      ],
      [
        "Cuando algo me importa, lo defiendo con toda mi fuerza.",
        { 8: 2.3, 1: 0.4, 2: 0.3 },
      ],
    ],
  ),
  c(
    "TYPE_FORCED_INNER_RULES",
    fc,
    "Elige la frase que más se parezca a ti, aunque ninguna te describa del todo.",
    ["deber ser", "retraimiento", "indispensabilidad", "miedo a perderse algo"],
    0.7,
    "Frases sobre sentirse modelo y corregirse, temor a gastar los propios recursos al exponerse, hacerse indispensable y evitar quedarse quieto.",
    REF_MOTIV,
    [
      [
        "Siento que debo ser ejemplo y me corrijo si me desvío.",
        { 1: 2.3, 6: 0.4, 3: 0.3 },
      ],
      [
        "Siento que si me expongo demasiado, gastaré lo poco que tengo.",
        { 5: 2.3, 4: 0.3, 9: 0.3 },
      ],
      [
        "Siento que si me hago indispensable, no me dejarán de lado.",
        { 2: 2.3, 6: 0.3, 3: 0.3 },
      ],
      [
        "Siento que si me quedo quieto/a, me pierdo de algo mejor.",
        { 7: 2.3, 3: 0.4, 8: 0.2 },
      ],
    ],
  ),

  // ---------- Scale questions: 9 likert ----------
  s(
    "TYPE_LIKERT_MORE_OR_LESS",
    "likert",
    "Cuando algo queda hecho «más o menos», me incomoda hasta que lo corrijo, aunque nadie más lo note.",
    1,
    4,
    0.3,
    ["perfeccionismo", "estándar interno"],
    0.7,
    "Ítem de acuerdo sobre la incomodidad con lo imperfecto aun sin testigos; señal parcial en el sentido de responsabilidad de otros patrones.",
    REF_STYLE,
    "EQ_TYPE_1_POLISH",
  ),
  s(
    "TYPE_LIKERT_ANTICIPATE_NEEDS",
    "likert",
    "Me cuesta dejar de atender lo que otros necesitan, aunque no me lo pidan.",
    2,
    3,
    0.3,
    ["atención al otro", "necesidad de ser útil"],
    0.7,
    "Ítem sobre la dificultad para soltar la atención a las necesidades ajenas, formulado como costo y con una sola idea.",
    REF_NARRATIVE,
    "EQ_TYPE_2_ANTICIPATE",
  ),
  s(
    "TYPE_LIKERT_VISIBLE_RESULTS",
    "likert",
    "Me siento mejor conmigo cuando puedo mostrar resultados concretos de lo que hago.",
    3,
    7,
    0.3,
    ["autoestima ligada al logro", "imagen"],
    0.7,
    "Ítem sobre la valía vinculada a resultados visibles; el sentido del deber aporta señal parcial.",
    REF_MOTIV,
    "EQ_TYPE_3_RESULTS",
  ),
  s(
    "TYPE_LIKERT_MISSING_PIECE",
    "likert",
    "A menudo siento que me falta algo que otros parecen tener y que yo no logro nombrar.",
    4,
    2,
    0.3,
    ["sentimiento de carencia", "comparación"],
    0.75,
    "Ítem sobre la sensación de carencia indefinida y la comparación con los demás, formulado sin etiquetas clínicas.",
    REF_NARRATIVE,
    "EQ_TYPE_4_MISSING",
  ),
  s(
    "TYPE_LIKERT_ALONE_TO_RECHARGE",
    "likert",
    "Necesito tiempo a solas para ordenar mis ideas antes de poder participar con energía en algo social.",
    5,
    9,
    0.3,
    ["conservación de energía", "retraimiento"],
    0.6,
    "Ítem sobre la necesidad de espacio propio antes de socializar; comparte señal parcial con la evitación del desgaste.",
    REF_HORNEY,
    "EQ_TYPE_5_ALONE",
  ),
  s(
    "TYPE_LIKERT_WHAT_COULD_FAIL",
    "likert",
    "Antes de decidir, suelo imaginar qué podría salir mal y prepararme para ello.",
    6,
    8,
    0.3,
    ["anticipación del riesgo", "duda"],
    0.7,
    "Ítem sobre la anticipación sistemática de problemas antes de decidir.",
    REF_STYLE,
    "EQ_TYPE_6_BACKUP",
  ),
  s(
    "TYPE_LIKERT_BORING_PLAN_ESCAPE",
    "likert",
    "Si un plan me aburre o me pesa, enseguida pienso en otras opciones más atractivas.",
    7,
    5,
    0.3,
    ["búsqueda de estímulo", "evitación de lo pesado"],
    0.65,
    "Ítem sobre el desplazamiento rápido de la atención hacia opciones agradables ante lo tedioso.",
    REF_STYLE,
    "EQ_TYPE_7_SWITCH",
  ),
  s(
    "TYPE_LIKERT_UNFAIR_FACE_IT",
    "likert",
    "Cuando algo me parece injusto, me cuesta quedarme callado/a: prefiero enfrentarlo de frente.",
    8,
    1,
    0.3,
    ["confrontación", "sentido de justicia"],
    0.65,
    "Ítem sobre la tendencia a enfrentar directamente lo percibido como injusto; el idealismo moral aporta señal parcial.",
    REF_HORNEY,
    "EQ_TYPE_8_FACE",
  ),
  s(
    "TYPE_LIKERT_DOWNPLAY_WANTS",
    "likert",
    "Suelo restar importancia a lo que quiero para evitar tensiones con los demás.",
    9,
    2,
    0.3,
    ["autoborramiento", "evitación del conflicto"],
    0.7,
    "Ítem sobre la minimización de las propias preferencias para preservar la armonía.",
    REF_NARRATIVE,
    "EQ_TYPE_9_DOWNPLAY",
  ),

  // ---------- 9 frequency ----------
  s(
    "TYPE_FREQ_INNER_VOICE_SHOULD",
    "frequency",
    "¿Con qué frecuencia sientes una voz interior que te dice cómo deberías haber hecho mejor lo que hiciste?",
    1,
    6,
    0.4,
    ["autocrítica", "deber ser"],
    0.7,
    "Frecuencia de la autocrítica interna sobre el propio desempeño.",
    REF_STYLE,
  ),
  s(
    "TYPE_FREQ_DROP_PLANS_TO_HELP",
    "frequency",
    "¿Con qué frecuencia terminas dejando tus propios planes por ayudar a alguien cercano?",
    2,
    8,
    0.4,
    ["postergación de sí", "ayuda"],
    0.65,
    "Frecuencia de sacrificar planes propios por atender a un cercano.",
    REF_NARRATIVE,
  ),
  s(
    "TYPE_FREQ_ADAPT_PRESENTATION",
    "frequency",
    "¿Con qué frecuencia ajustas tu forma de presentarte según lo que convenga para quedar bien en cada contexto?",
    3,
    4,
    0.4,
    ["adaptación de imagen", "sensibilidad al contexto"],
    0.6,
    "Frecuencia del ajuste de imagen según el contexto social.",
    REF_MOTIV,
  ),
  s(
    "TYPE_FREQ_DIFFERENT_FROM_OTHERS",
    "frequency",
    "¿Con qué frecuencia te sientes diferente al resto, como si no encajaras del todo?",
    4,
    5,
    0.5,
    ["sentimiento de diferencia", "pertenencia"],
    0.7,
    "Frecuencia de la vivencia de no encajar; el retraimiento intelectual comparte parte de la señal.",
    REF_NARRATIVE,
  ),
  s(
    "TYPE_FREQ_UNDERSTAND_BEFORE_OPINING",
    "frequency",
    "¿Con qué frecuencia prefieres entender un tema a fondo antes de opinar o actuar?",
    5,
    1,
    0.3,
    ["necesidad de dominio", "cautela"],
    0.6,
    "Frecuencia de posponer la opinión hasta comprender con profundidad.",
    REF_STYLE,
  ),
  s(
    "TYPE_FREQ_DOUBT_INTENTIONS",
    "frequency",
    "¿Con qué frecuencia dudas de las intenciones de alguien hasta que lo comprueba con hechos?",
    6,
    5,
    0.3,
    ["desconfianza", "verificación"],
    0.7,
    "Frecuencia de la verificación por hechos antes de confiar.",
    REF_STYLE,
  ),
  s(
    "TYPE_FREQ_MANY_EXCITING_PLANS",
    "frequency",
    "¿Con qué frecuencia tienes varios proyectos o planes a la vez que te entusiasman?",
    7,
    3,
    0.4,
    ["multiplicidad de intereses", "entusiasmo"],
    0.55,
    "Frecuencia de mantener varios planes entusiasmantes en paralelo.",
    REF_STYLE,
  ),
  s(
    "TYPE_FREQ_TAKE_CHARGE",
    "frequency",
    "¿Con qué frecuencia tomas el mando cuando notas que nadie más lo hace?",
    8,
    7,
    0.4,
    ["liderazgo", "control"],
    0.6,
    "Frecuencia de asumir el mando ante un vacío de liderazgo.",
    REF_HORNEY,
  ),
  s(
    "TYPE_FREQ_POSTPONE_COMFORT_TASKS",
    "frequency",
    "¿Con qué frecuencia te das cuenta de que has postergado algo importante y te has entretenido con tareas cómodas?",
    9,
    3,
    0.2,
    ["postergación", "narcotización"],
    0.55,
    "Frecuencia de sustituir lo importante por actividades cómodas.",
    REF_NARRATIVE,
  ),

  // ---------- 9 intensity ----------
  s(
    "TYPE_INT_OTHERS_BREAK_RULES",
    "intensity",
    "¿Qué tanto te molesta ver que otros no cumplen las reglas o los acuerdos que todos conocen?",
    1,
    8,
    0.4,
    ["irritación por incumplimiento", "justicia"],
    0.65,
    "Intensidad de la molestia ante el incumplimiento de normas compartidas.",
    REF_STYLE,
  ),
  s(
    "TYPE_INT_UNACKNOWLEDGED_GIVING",
    "intensity",
    "¿Qué tanto te duele que alguien a quien le diste mucho no lo reconozca?",
    2,
    4,
    0.4,
    ["necesidad de reconocimiento afectivo", "dolor relacional"],
    0.7,
    "Intensidad del dolor ante la falta de reconocimiento de lo dado.",
    REF_NARRATIVE,
  ),
  s(
    "TYPE_INT_STILLNESS_WITHOUT_GOAL",
    "intensity",
    "¿Qué tanto te incomoda quedarte quieto/a sin un objetivo claro por cumplir?",
    3,
    7,
    0.4,
    ["inquietud", "orientación a metas"],
    0.6,
    "Intensidad de la incomodidad ante la quietud sin meta.",
    REF_MOTIV,
  ),
  s(
    "TYPE_INT_AUTHENTIC_OWN_STAMP",
    "intensity",
    "¿Qué tanto te incomoda hacer algo que se parece demasiado a lo que ya hizo otra persona?",
    4,
    1,
    0.3,
    ["autenticidad", "singularidad"],
    0.6,
    "Intensidad de la incomodidad ante lo que se percibe como poco propio u original; una sola idea y sin la carga positiva de «ser auténtico».",
    REF_MOTIV,
  ),
  s(
    "TYPE_INT_DRAINED_BY_AVAILABILITY",
    "intensity",
    "¿Qué tanto te agota que te pidan una respuesta inmediata, sin darte tiempo de pensar?",
    5,
    6,
    0.3,
    ["energía limitada", "demanda externa"],
    0.65,
    "Intensidad del desgaste ante la presión de responder de inmediato; se retiró la mención a la disponibilidad para tener una sola idea.",
    REF_HORNEY,
  ),
  s(
    "TYPE_INT_NEED_BACKING",
    "intensity",
    "¿Qué tanto te cuesta empezar algo nuevo si no tienes claro con qué apoyo contarás si sale mal?",
    6,
    9,
    0.3,
    ["necesidad de seguridad", "apoyo"],
    0.7,
    "Intensidad de la necesidad de respaldo previo para actuar, planteada como dificultad y con una sola idea.",
    REF_MOTIV,
  ),
  s(
    "TYPE_INT_AVOID_DISCOMFORT_BY_DISTRACTION",
    "intensity",
    "¿Qué tanto evitas quedarte con sensaciones incómodas, distrayéndote con algo agradable?",
    7,
    9,
    0.4,
    ["evitación del malestar", "distracción"],
    0.6,
    "Intensidad de la evitación del malestar mediante la distracción placentera.",
    REF_NARRATIVE,
  ),
  s(
    "TYPE_INT_BEING_CONTROLLED",
    "intensity",
    "¿Qué tanto te incomoda depender de otros o sentir que alguien controla lo que haces?",
    8,
    6,
    0.2,
    ["autonomía", "control"],
    0.65,
    "Intensidad de la incomodidad por la dependencia o el control ajeno.",
    REF_HORNEY,
  ),
  s(
    "TYPE_INT_SAY_PREFERENCE_DISAGREEMENT",
    "intensity",
    "¿Qué tanto te cuesta decir qué prefieres cuando eso puede generar desacuerdo?",
    9,
    6,
    0.3,
    ["asertividad", "evitación del desacuerdo"],
    0.7,
    "Intensidad de la dificultad para expresar preferencias cuando hay riesgo de desacuerdo.",
    REF_NARRATIVE,
  ),

  // ---------- Near-duplicate likert statements (equivalence groups) ----------
  s(
    "TYPE_LIKERT_UNPOLISHED_WORK",
    "likert",
    "Me cuesta dejar un trabajo sin pulir, aunque ya sea suficientemente bueno para los demás.",
    1,
    4,
    0.3,
    ["perfeccionismo", "estándar interno"],
    0.7,
    "Reformulación de TYPE_LIKERT_MORE_OR_LESS para contrastar consistencia.",
    REF_STYLE,
    "EQ_TYPE_1_POLISH",
  ),
  s(
    "TYPE_LIKERT_THINK_OF_OTHERS_FIRST",
    "likert",
    "Antes de pensar en lo que yo necesito, suelo pensar en cómo estará la gente que me rodea.",
    2,
    3,
    0.3,
    ["atención al otro", "necesidad de ser útil"],
    0.7,
    "Reformulación de TYPE_LIKERT_ANTICIPATE_NEEDS para contrastar consistencia.",
    REF_NARRATIVE,
    "EQ_TYPE_2_ANTICIPATE",
  ),
  s(
    "TYPE_LIKERT_VALUE_THROUGH_ACHIEVEMENT",
    "likert",
    "Mi valor lo siento más claro cuando alcanzo logros que otros pueden ver.",
    3,
    7,
    0.3,
    ["autoestima ligada al logro", "imagen"],
    0.7,
    "Reformulación de TYPE_LIKERT_VISIBLE_RESULTS para contrastar consistencia.",
    REF_MOTIV,
    "EQ_TYPE_3_RESULTS",
  ),
  s(
    "TYPE_LIKERT_OTHERS_HAVE_SOMETHING",
    "likert",
    "Con frecuencia tengo la impresión de que los demás tienen algo que a mí me falta.",
    4,
    2,
    0.3,
    ["sentimiento de carencia", "comparación"],
    0.75,
    "Reformulación de TYPE_LIKERT_MISSING_PIECE para contrastar consistencia.",
    REF_NARRATIVE,
    "EQ_TYPE_4_MISSING",
  ),
  s(
    "TYPE_LIKERT_RECOVER_ALONE_AFTER_PEOPLE",
    "likert",
    "Después de socializar mucho, necesito quedarme solo/a un buen rato para recuperar energía.",
    5,
    9,
    0.3,
    ["conservación de energía", "retraimiento"],
    0.6,
    "Reformulación de TYPE_LIKERT_ALONE_TO_RECHARGE para contrastar consistencia.",
    REF_HORNEY,
    "EQ_TYPE_5_ALONE",
  ),
  s(
    "TYPE_LIKERT_BACKUP_PLAN_CALMS",
    "likert",
    "Me tranquiliza tener un plan de respaldo para cuando las cosas no salgan como espero.",
    6,
    8,
    0.3,
    ["anticipación del riesgo", "duda"],
    0.7,
    "Reformulación de TYPE_LIKERT_WHAT_COULD_FAIL para contrastar consistencia.",
    REF_STYLE,
    "EQ_TYPE_6_BACKUP",
  ),
  s(
    "TYPE_LIKERT_MIND_JUMPS_TO_STIMULUS",
    "likert",
    "Cuando algo se vuelve pesado o monótono, mi mente salta a otra cosa más estimulante.",
    7,
    5,
    0.3,
    ["búsqueda de estímulo", "evitación de lo pesado"],
    0.65,
    "Reformulación de TYPE_LIKERT_BORING_PLAN_ESCAPE para contrastar consistencia.",
    REF_STYLE,
    "EQ_TYPE_7_SWITCH",
  ),
  s(
    "TYPE_LIKERT_INTERVENE_AGAINST_ABUSE",
    "likert",
    "Cuando veo una injusticia, me cuesta no reaccionar, aunque después me arrepienta de cómo lo hice.",
    8,
    1,
    0.3,
    ["confrontación", "sentido de justicia"],
    0.65,
    "Ítem sobre la reacción impulsiva ante la injusticia, redactado de modo que describa un costo y no solo una virtud, para reducir la deseabilidad social.",
    REF_HORNEY,
    "EQ_TYPE_8_FACE",
  ),
  s(
    "TYPE_LIKERT_YIELD_TO_AVOID_ARGUING",
    "likert",
    "Con tal de no discutir, muchas veces cedo aunque yo hubiera preferido otra cosa.",
    9,
    2,
    0.3,
    ["autoborramiento", "evitación del conflicto"],
    0.7,
    "Reformulación de TYPE_LIKERT_DOWNPLAY_WANTS para contrastar consistencia.",
    REF_NARRATIVE,
    "EQ_TYPE_9_DOWNPLAY",
  ),
  // ---------- Reverse-keyed likert (agreement = less of the type; offsets acquiescence) ----------
  r(
    "TYPE_LIKERT_REV_GOOD_ENOUGH",
    "Puedo dar un trabajo por terminado cuando está suficientemente bien, aunque sepa que podría quedar mejor.",
    1,
    7,
    0.2,
    ["perfeccionismo", "estándar interno"],
    0.6,
    "Ítem invertido: estar de acuerdo indica menos presión por pulir; contrarresta el sesgo de asentimiento.",
    REF_STYLE,
  ),
  r(
    "TYPE_LIKERT_REV_NOT_OFFER_HELP",
    "Me resulta fácil no ofrecer ayuda cuando nadie me la ha pedido.",
    2,
    4,
    0.3,
    ["atención al otro", "necesidad de ser útil"],
    0.6,
    "Ítem invertido: estar de acuerdo indica menos impulso de ayudar sin que se lo pidan; contrarresta el sesgo de asentimiento.",
    REF_NARRATIVE,
  ),
  r(
    "TYPE_LIKERT_REV_VALUE_WITHOUT_RESULTS",
    "Me siento valioso/a aunque en este momento no tenga nada que mostrar de lo que hago.",
    3,
    4,
    0.3,
    ["valor propio", "imagen y logro"],
    0.6,
    "Ítem invertido: estar de acuerdo indica un valor propio menos ligado a los logros visibles; contrarresta el sesgo de asentimiento.",
    REF_STYLE,
  ),
  r(
    "TYPE_LIKERT_REV_FIT_IN",
    "Casi siempre siento que encajo con las personas que me rodean.",
    4,
    2,
    0.3,
    ["pertenencia", "sentirse diferente"],
    0.6,
    "Ítem invertido: estar de acuerdo indica menos sensación de ser distinto; contrarresta el sesgo de asentimiento.",
    REF_NARRATIVE,
  ),
  r(
    "TYPE_LIKERT_REV_ENERGY_AMONG_PEOPLE",
    "Aunque haya mucha gente alrededor, me mantengo con energía sin necesitar un rato a solas.",
    5,
    4,
    0.3,
    ["energía social", "retirada para recuperar"],
    0.6,
    "Ítem invertido: estar de acuerdo indica menos necesidad de retirarse para recuperar energía; contrarresta el sesgo de asentimiento.",
    REF_STYLE,
  ),
  r(
    "TYPE_LIKERT_REV_TRUST_NO_BACKUP",
    "Cuando tengo que decidir, confío en que las cosas saldrán bien sin necesidad de preparar planes de respaldo.",
    6,
    7,
    0.3,
    ["anticipación del riesgo", "seguridad"],
    0.6,
    "Ítem invertido: estar de acuerdo indica menos anticipación de lo que podría fallar; contrarresta el sesgo de asentimiento.",
    REF_HORNEY,
  ),
  r(
    "TYPE_LIKERT_REV_STAY_WITH_ONE",
    "Puedo quedarme con una sola actividad hasta el final aunque se vuelva monótona.",
    7,
    8,
    0.3,
    ["variedad y novedad", "tolerancia al aburrimiento"],
    0.6,
    "Ítem invertido: estar de acuerdo indica menos salto hacia opciones nuevas; contrarresta el sesgo de asentimiento.",
    REF_MOTIV,
  ),
  r(
    "TYPE_LIKERT_REV_LET_INJUSTICE_PASS",
    "Cuando algo me parece injusto, puedo dejarlo pasar sin sentir la necesidad de enfrentarlo.",
    8,
    7,
    0.2,
    ["respuesta ante la injusticia", "asertividad"],
    0.6,
    "Ítem invertido: estar de acuerdo indica menos impulso de confrontar; contrarresta el sesgo de asentimiento.",
    REF_HORNEY,
  ),
  r(
    "TYPE_LIKERT_REV_SAY_WANTS",
    "Digo con facilidad lo que quiero, aunque eso pueda generar un desacuerdo.",
    9,
    8,
    0.2,
    ["asertividad", "evitación del desacuerdo"],
    0.6,
    "Ítem invertido: estar de acuerdo indica menos evitación del desacuerdo; contrarresta el sesgo de asentimiento.",
    REF_NARRATIVE,
  ),
];

function isScale(d: Draft): d is ScaleDraft {
  return "main" in d;
}

function relatedFrom(options: Question["options"]): EnneagramType[] {
  return ENNEAGRAM_TYPES.filter((t) =>
    options.some((o) => (o.scores.types?.[t] ?? 0) >= 1),
  );
}

export const TYPE_QUESTIONS: Question[] = CHOICE_AND_SCALE.map(
  (draft, index) => {
    const options = isScale(draft)
      ? scaleOptions(draft.kind, (i, curve) => {
          const v = draft.reverse
            ? (SCALE_CURVE[SCALE_CURVE.length - 1 - i] as number)
            : curve;
          return {
            types: {
              [draft.main]: round2(v),
              [draft.side]: round2(v * draft.factor),
            },
          };
        })
      : opts(draft.items.map(([text, types]) => [text, { types }] as const));
    return finish("type", index, draft, {
      options,
      related: relatedFrom(options),
    });
  },
);
