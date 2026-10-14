/**
 * Wing module (module "wing"): 54 questions, 6 per main type (27 original + 27 extension).
 *
 * AGREED CONVENTION (the selector and scoring engine rely on it):
 * - `relatedTypes` is ALWAYS `[mainType, lowerWing, upperWing]`, where
 *   `[lowerWing, upperWing] === wingsOf(mainType)` (wrapping 9 <-> 1).
 * - These questions are meant to be asked only after the main type is known (or
 *   has a strong candidate). Their text is deliberately generic and never names a type.
 * - Option scores in `scores.types` target ONLY the two neighbour types
 *   (lowerWing / upperWing). The main type is never scored here. A score on
 *   a neighbour means "evidence for the wing of `relatedTypes[0]` that equals
 *   that neighbour". The engine must therefore interpret `types[k]` as
 *   "wing k of the main type in relatedTypes[0]", not as evidence for type k as a main type.
 * - Scenario and motivation questions use 3 or 2 options; the third scenario option
 *   is a neutral option that gives a small, equal score to both wings.
 * - Likert questions are bipolar: agreement supports the wing named by the statement,
 *   disagreement gives weaker evidence for the opposite wing.
 * - Wing contrasts are design hypotheses taken from the general literature
 *   (calidez/ambición/introspección/etc.), not calibrated values.
 */
import type { Question } from "@/domain/assessment/types";
import { wingsOf, type EnneagramType } from "@/domain/enneagram/structure";
import { finish, opts, scaleOptions, type DraftBase } from "./builders";

type Pair = readonly [EnneagramType, EnneagramType];

interface ChoiceWing extends DraftBase {
  main: EnneagramType;
  // [text, lowerScore, upperScore] where the two numbers are scores for [lower, upper]
  items: ReadonlyArray<readonly [string, number, number]>;
}
interface LikertWing extends DraftBase {
  main: EnneagramType;
  /** Which neighbour the statement supports: "lower" or "upper". */
  supports: "lower" | "upper";
}
type Draft = ChoiceWing | LikertWing;

const REFS = ["riso-hudson-1999", "riso-hudson-1996"];

function sc(
  main: EnneagramType,
  code: string,
  text: string,
  why: string,
  dims: string[],
  items: ReadonlyArray<readonly [string, number, number]>,
): ChoiceWing {
  return {
    main,
    code,
    kind: "scenario-choice",
    text,
    why,
    dims,
    d: 0.6,
    refs: REFS,
    items,
  };
}
function mc(
  main: EnneagramType,
  code: string,
  text: string,
  why: string,
  dims: string[],
  items: ReadonlyArray<readonly [string, number, number]>,
): ChoiceWing {
  return {
    main,
    code,
    kind: "motivation-comparison",
    text,
    why,
    dims,
    d: 0.55,
    refs: REFS,
    items,
  };
}
function lk(
  main: EnneagramType,
  code: string,
  text: string,
  why: string,
  dims: string[],
  supports: "lower" | "upper",
): LikertWing {
  return {
    main,
    code,
    kind: "likert",
    text,
    why,
    dims,
    d: 0.4,
    refs: REFS,
    supports,
  };
}

const DRAFTS: Draft[] = [
  // ----- Main 1: wings 9 (lower) vs 2 (upper) -----
  sc(
    1,
    "WING_1_COMMUNITY_LEAD",
    "Te piden dirigir una iniciativa en tu comunidad. ¿Cuál es tu estilo más natural?",
    "Contrasta un estilo sereno y gradual (vecino 9) frente a uno cercano y de implicación personal (vecino 2) al exigir orden y mejora.",
    ["serenidad vs. calidez", "estilo de liderazgo"],
    [
      [
        "Escucho a todos, voy con calma y busco que el cambio sea gradual y sin choques.",
        1.8,
        0,
      ],
      [
        "Me acerco personalmente a la gente, me involucro y motivo con cercanía y ejemplo.",
        0,
        1.8,
      ],
      ["Defino reglas claras y las hago cumplir.", 0.3, 0.3],
    ],
  ),
  mc(
    1,
    "WING_1_CORRECT_AND_CARE",
    "Al corregir algo que te molesta, ¿qué te importa además de que quede bien?",
    "Distingue el deseo de preservar la armonía retirándose (9) del deseo de que el otro sienta cuidado y compromiso (2).",
    ["armonía vs. cercanía", "forma de corregir"],
    [
      [
        "Mantener la armonía y no generar tensión; prefiero retirarme antes que forzar.",
        1.8,
        0,
      ],
      [
        "Que la persona sienta que lo hago por su bien y que cuenta conmigo.",
        0,
        1.8,
      ],
    ],
  ),
  lk(
    1,
    "WING_1_WARM_WHEN_DEMANDING",
    "Cuando me exijo mucho, me vuelvo más cálido/a y servicial con los demás en lugar de más reservado/a.",
    "Agrado = calidez interpersonal (2); desacuerdo = reserva y paciencia (9).",
    ["serenidad vs. calidez"],
    "upper",
  ),

  // ----- Main 2: wings 1 (lower) vs 3 (upper) -----
  sc(
    2,
    "WING_2_FRIEND_AND_WORKLOAD",
    "Un amigo está pasando por un mal momento y también tienes mucho trabajo. ¿Cómo lo resuelves?",
    "Contrasta el cumplimiento disciplinado de ambos deberes (1) frente a la resolución rápida y eficaz con proyección de capacidad (3).",
    ["deber vs. imagen", "organización del tiempo"],
    [
      [
        "Organizo mi tiempo con disciplina para cumplir con ambas cosas, porque es mi deber.",
        1.8,
        0,
      ],
      [
        "Hago que funcione: me muevo rápido, lo ayudo y de paso muestro lo capaz que soy.",
        0,
        1.8,
      ],
      ["Dejo todo y me dedico por completo a mi amigo.", 0.3, 0.3],
    ],
  ),
  mc(
    2,
    "WING_2_HOW_TO_HELP",
    "Cuando ayudas a alguien, ¿qué cuidas más de cómo lo haces?",
    "Contrasta la ayuda moderada por criterio de lo correcto (1) con la ayuda eficaz y reconocida (3).",
    ["criterio moral vs. reconocimiento"],
    [
      ["Que sea lo correcto y lo útil, sin exagerar ni invadir.", 1.8, 0],
      [
        "Que sea eficaz, se vea bien y me reconozcan por lo que aporto.",
        0,
        1.8,
      ],
    ],
  ),
  lk(
    2,
    "WING_2_HELP_WITH_IMAGE",
    "Me resulta importante que mi ayuda tenga buena imagen y sea reconocida socialmente.",
    "Acuerdo = orientación a imagen y reconocimiento (3); desacuerdo = sobriedad y criterio interno (1).",
    ["criterio moral vs. reconocimiento"],
    "upper",
  ),

  // ----- Main 3: wings 2 (lower) vs 4 (upper) -----
  sc(
    3,
    "WING_3_DISCOURAGED_COLLEAGUE",
    "Un compañero se siente desanimado por un proyecto que va mal. ¿Cómo respondes?",
    "Contrasta el apoyo práctico y cálido (2) con la escucha profunda y privada de lo que le ocurre (4).",
    ["calidez vs. introspección", "apoyo emocional"],
    [
      [
        "Me ofrezco a apoyarlo y trabajo con él, preocupándome de cómo se siente.",
        1.8,
        0,
      ],
      [
        "Hablo con él en privado, le pido que me cuente qué le pasa de verdad y lo escucho sin apuro.",
        0,
        1.8,
      ],
      ["Le sugiero un plan de acción para recuperar el ritmo.", 0.3, 0.3],
    ],
  ),
  mc(
    3,
    "WING_3_AFTER_ACHIEVEMENT",
    "Cuando logras algo importante, ¿qué más te gustaría sentir?",
    "Contrasta el deseo de compartir el logro y sentir cercanía (2) con el deseo de que tenga un sello original (4).",
    ["afiliación vs. originalidad"],
    [
      [
        "Que quienes me importan se alegren conmigo y me sienta cercano a ellos.",
        1.8,
        0,
      ],
      [
        "Que se note algo original mío, que no sea un logro cualquiera.",
        0,
        1.8,
      ],
    ],
  ),
  lk(
    3,
    "WING_3_RETREAT_WHEN_FAILING",
    "Cuando fracaso, tiendo a encerrarme en mis pensamientos y sentimientos más que a buscar compañía.",
    "Acuerdo = introspección y repliegue (4); desacuerdo = búsqueda de contacto y apoyo (2).",
    ["calidez vs. introspección"],
    "upper",
  ),

  // ----- Main 4: wings 3 (lower) vs 5 (upper) -----
  sc(
    4,
    "WING_4_BIG_PARTY",
    "Te invitan a una fiesta grande donde conoces a pocas personas. ¿Qué haces?",
    "Contrasta la sociabilidad estratégica y cuidada (3) con la observación desde la distancia y la retirada pronta (5).",
    ["extroversión vs. retraimiento", "contexto social"],
    [
      ["Voy, me arreglo bien y me aseguro de hacer buenas conexiones.", 1.8, 0],
      [
        "Voy un rato, observo desde un rincón y me retiro pronto si me desgasto.",
        0,
        1.8,
      ],
      ["Decido según cómo me sienta ese día.", 0.3, 0.3],
    ],
  ),
  mc(
    4,
    "WING_4_SHARING_CREATIVITY",
    "Cuando expresas tu creatividad, ¿qué prefieres?",
    "Contrasta la expresión orientada a alcance y reconocimiento (3) con la orientada a profundidad y privacidad (5).",
    ["alcance vs. profundidad"],
    [
      ["Que llegue a mucha gente y sea reconocida.", 1.8, 0],
      [
        "Que sea algo profundo, que pocos entiendan, y poder mantenerlo en privado.",
        0,
        1.8,
      ],
    ],
  ),
  lk(
    4,
    "WING_4_COLD_HEAD_EMOTIONS",
    "Me siento más cómodo/a analizando mis emociones con la cabeza fría que compartiéndolas con otros.",
    "Acuerdo = análisis distanciado e intelectualización (5); desacuerdo = expresión orientada a otros (3).",
    ["intelectualización vs. expresión"],
    "upper",
  ),

  // ----- Main 5: wings 4 (lower) vs 6 (upper) -----
  sc(
    5,
    "WING_5_GROUP_PROJECT",
    "Un grupo te propone colaborar en un proyecto. ¿Qué te atrae o te frena?",
    "Contrasta el atractivo de aportar algo creativo y personal (4) con la necesidad de claridad de roles y expectativas (6).",
    ["creatividad vs. estructura", "colaboración"],
    [
      [
        "Me atrae si puedo aportar algo creativo y personal; me frena si es muy rutinario.",
        1.8,
        0,
      ],
      [
        "Me atrae si sé qué se espera de mí y tengo claro quién es quién; me frena la incertidumbre.",
        0,
        1.8,
      ],
      ["Me atrae si puedo trabajar solo/a una parte.", 0.3, 0.3],
    ],
  ),
  mc(
    5,
    "WING_5_INVESTIGATE_WHY",
    "Cuando investigas un tema, ¿qué buscas además de entenderlo?",
    "Contrasta la búsqueda de una visión personal sensible (4) con la búsqueda de certeza práctica y protección ante el error (6).",
    ["sensibilidad vs. certeza"],
    [
      ["Una forma original de verlo, que refleje mi sensibilidad.", 1.8, 0],
      [
        "Certeza y herramientas prácticas para no equivocarme o ser engañado.",
        0,
        1.8,
      ],
    ],
  ),
  lk(
    5,
    "WING_5_LOYAL_TO_TRUSTED",
    "Tiendo a comprometerme con personas o causas en las que confío y a mantenerme fiel a ellas.",
    "Acuerdo = lealtad y compromiso con el grupo de confianza (6); desacuerdo = independencia expresiva (4).",
    ["lealtad vs. independencia"],
    "upper",
  ),

  // ----- Main 6: wings 5 (lower) vs 7 (upper) -----
  sc(
    6,
    "WING_6_PLAN_CHANGE",
    "Un cambio inesperado altera tus planes. ¿Cómo lo manejas?",
    "Contrasta el repliegue analítico (5) con el reencuadre positivo y la búsqueda de estímulo (7).",
    ["análisis vs. optimismo", "afrontamiento del cambio"],
    [
      [
        "Me retiro un momento, analizo la información disponible y decido con calma.",
        1.8,
        0,
      ],
      [
        "Intento verle el lado positivo, bromeo y busco algo estimulante que hacer con el cambio.",
        0,
        1.8,
      ],
      ["Pido consejo a alguien de confianza antes de hacer nada.", 0.3, 0.3],
    ],
  ),
  mc(
    6,
    "WING_6_SOOTHING_INSECURITY",
    "Cuando sientes inseguridad, ¿qué suele ayudarte más?",
    "Contrasta el consuelo por comprensión e información (5) con el consuelo por distracción y compañía alegre (7).",
    ["comprensión vs. distracción"],
    [
      ["Entender el problema a fondo y tener información clara.", 1.8, 0],
      [
        "Distraerme con planes, amigos o ideas que me levanten el ánimo.",
        0,
        1.8,
      ],
    ],
  ),
  lk(
    6,
    "WING_6_CHEERFUL_COMPANY",
    "Cuando estoy nervioso/a, pasar tiempo con gente alegre me ayuda más que estar a solas pensando.",
    "Acuerdo = regulación social y optimista (7); desacuerdo = regulación solitaria y cognitiva (5).",
    ["análisis vs. optimismo"],
    "upper",
  ),

  // ----- Main 7: wings 6 (lower) vs 8 (upper) -----
  sc(
    7,
    "WING_7_FRIEND_SERIOUS_PROBLEM",
    "Un amigo te cuenta un problema serio y no sabes qué hacer. ¿Cuál es tu tendencia?",
    "Contrasta la preocupación leal y cautelosa (6) con el impulso a la acción directa (8).",
    ["cautela vs. asertividad", "apoyo a otros"],
    [
      [
        "Me preocupo, pienso en las consecuencias y me comprometo a estar disponible para él.",
        1.8,
        0,
      ],
      [
        "Le digo que lo enfrente y me ofrezco a ayudarlo a resolverlo de forma directa.",
        0,
        1.8,
      ],
      ["Intento animarlo con humor y buenos planes.", 0.3, 0.3],
    ],
  ),
  mc(
    7,
    "WING_7_LIVING_ENTHUSIASM",
    "Cuando algo te entusiasma, ¿cómo quieres vivirlo?",
    "Contrasta el entusiasmo acompañado y prudente (6) con el entusiasmo intenso, de iniciativa y riesgo (8).",
    ["prudencia vs. intensidad"],
    [
      [
        "Con personas de confianza, con cierto plan y sin riesgos innecesarios.",
        1.8,
        0,
      ],
      [
        "Al máximo, con intensidad, tomando la iniciativa aunque implique riesgos.",
        0,
        1.8,
      ],
    ],
  ),
  lk(
    7,
    "WING_7_DISLIKE_BEING_TOLD",
    "Me desagrada que me digan lo que debo hacer; prefiero ser quien decida.",
    "Acuerdo = autonomía asertiva (8); desacuerdo = mayor apertura a la guía de figuras de confianza (6).",
    ["prudencia vs. intensidad"],
    "upper",
  ),

  // ----- Main 8: wings 7 (lower) vs 9 (upper) -----
  sc(
    8,
    "WING_8_RECOVER_AFTER_HEAVY_WEEK",
    "Después de una semana intensa, ¿cómo sueles recuperarte?",
    "Contrasta la recuperación expansiva y social (7) con la recuperación quieta y silenciosa (9).",
    ["expansividad vs. serenidad", "recuperación"],
    [
      ["Salgo, comparto con amigos y busco comida, música o aventura.", 1.8, 0],
      [
        "Me quedo en casa, descanso en silencio y desconecto del mundo.",
        0,
        1.8,
      ],
      ["Trabajo en un proyecto que me apasione.", 0.3, 0.3],
    ],
  ),
  mc(
    8,
    "WING_8_PROTECTING_STYLE",
    "Cuando proteges a alguien, ¿qué estilo te sale más?",
    "Contrasta el apoyo entusiasta y expansivo (7) con el apoyo estable y silencioso (9).",
    ["expansividad vs. serenidad"],
    [
      [
        "Con ánimo y expansivo: lo animo, lo saco adelante y celebramos.",
        1.8,
        0,
      ],
      ["Tranquilo y estable: soy un apoyo firme sin hacer ruido.", 0, 1.8],
    ],
  ),
  lk(
    8,
    "WING_8_CALM_STRENGTH",
    "Soy una persona de pocas palabras que actúa con calma, aunque por dentro tenga mucha fuerza.",
    "Acuerdo = serenidad y contención (9); desacuerdo = expresividad enérgica (7).",
    ["expansividad vs. serenidad"],
    "upper",
  ),

  // ----- Main 9: wings 8 (lower) vs 1 (upper) -----
  sc(
    9,
    "WING_9_BEING_TAKEN_ADVANTAGE",
    "Alguien se aprovecha de ti en una situación cotidiana. ¿Qué haces?",
    "Contrasta poner un límite directo y firme (8) con razonar desde lo justo y lo correcto (1).",
    ["firmeza vs. criterio", "defensa de límites"],
    [
      ["Termino poniéndole un límite claro, aunque me cueste.", 1.8, 0],
      [
        "Reflexiono sobre qué es justo y le planteo, con argumentos, por qué eso no es correcto.",
        0,
        1.8,
      ],
      ["Lo dejo pasar para no hacer drama.", 0.3, 0.3],
    ],
  ),
  mc(
    9,
    "WING_9_WHAT_TRIGGERS_ACTION",
    "Cuando por fin te decides a actuar, ¿qué te impulsa?",
    "Contrasta la energía protectora y vital (8) con el sentido de que algo debe hacerse bien (1).",
    ["energía protectora vs. sentido del deber"],
    [
      ["La energía de proteger lo mío y a la gente que quiero.", 1.8, 0],
      ["Un sentido de lo correcto: algo debe hacerse bien.", 0, 1.8],
    ],
  ),
  lk(
    9,
    "WING_9_RARE_FIRM_OUTBURST",
    "Cuando algo me molesta mucho, puedo reaccionar con una firmeza que sorprende, aunque normalmente soy tranquilo/a.",
    "Acuerdo = estallido de firmeza y energía (8); desacuerdo = molestia canalizada por crítica y normas (1).",
    ["firmeza vs. criterio"],
    "lower",
  ),

  // ----- Extension (ids 28-54): three more questions per main type. Order of the first option is
  // balanced per main type: the two earlier choice questions put the lower wing first, the two
  // added here put the upper wing first. Added likerts support the wing the earlier likert did not.

  // ----- Main 1 (extension): 9 (lower) vs 2 (upper) -----
  sc(
    1,
    "WING_1_COWORKER_MISTAKE",
    "Un compañero de trabajo comete un error que te afecta. ¿Qué haces en general?",
    "Contrasta la corrección cercana e inmediata, con ganas de que el otro mejore (vecino 2), frente a la crítica que se guarda y se procesa a distancia (vecino 9), según las manifestaciones de cada ala.",
    ["calidez vs. serenidad", "forma de corregir"],
    [
      [
        "Hablo con él enseguida, con buena disposición, y le explico cómo podría hacerlo mejor.",
        0,
        1.8,
      ],
      [
        "Reviso qué pasó y dejo constancia por escrito de lo sucedido.",
        0.3,
        0.3,
      ],
      [
        "Dejo pasar un tiempo, lo pienso con calma y lo converso solo si de verdad hace falta.",
        1.8,
        0,
      ],
    ],
  ),
  mc(
    1,
    "WING_1_SATISFACTION_IMPROVING",
    "Cuando te dedicas a mejorar algo, ¿qué te deja más satisfecho/a?",
    "Contrasta la satisfacción de servir a personas concretas y ser valorado (2) con la de haber hecho lo correcto y quedar en paz, aunque nadie lo note (9).",
    ["reconocimiento relacional vs. paz interior"],
    [
      [
        "Ver que mi esfuerzo ayudó a personas concretas y que lo agradecen.",
        0,
        1.8,
      ],
      [
        "Sentir que hice lo correcto y quedar tranquilo/a, aunque nadie se entere.",
        1.8,
        0,
      ],
    ],
  ),
  lk(
    1,
    "WING_1_APART_TO_THINK",
    "Cuando algo me parece mal hecho, prefiero apartarme un rato a solas para ordenar mis ideas antes de decir algo.",
    "Acuerdo = retirada y crítica contenida (9); desacuerdo = tendencia a intervenir de inmediato con implicación personal (2).",
    ["serenidad vs. calidez"],
    "lower",
  ),

  // ----- Main 2 (extension): 1 (lower) vs 3 (upper) -----
  sc(
    2,
    "WING_2_NEIGHBORHOOD_EVENT",
    "Te piden organizar la ayuda para un evento solidario del barrio. ¿Cómo lo encaras?",
    "Contrasta la organización metódica con tareas repartidas y verificadas (1) frente a la movilización de contactos y búsqueda de visibilidad (3).",
    ["deber vs. imagen", "estilo de organización"],
    [
      [
        "Armo un equipo animado, muevo mis contactos y busco que el evento tenga buena asistencia y se note.",
        0,
        1.8,
      ],
      [
        "Pregunto primero qué necesitan las familias y a partir de eso decido.",
        0.3,
        0.3,
      ],
      [
        "Preparo una lista de tareas, reparto responsabilidades y reviso que todo se cumpla como corresponde.",
        1.8,
        0,
      ],
    ],
  ),
  mc(
    2,
    "WING_2_AFTER_THANKS",
    "Cuando alguien te agradece una ayuda, ¿qué te importa más de ese momento?",
    "Contrasta la necesidad de que el servicio sea irreprochable y honesto (1) con la de que se note la eficacia y que lo recuerden (3).",
    ["integridad vs. reconocimiento"],
    [
      [
        "Que se note lo bien que lo resolví y que me tengan presente para otras ocasiones.",
        0,
        1.8,
      ],
      [
        "Que quede claro que actué con honestidad y que me porté como se debe.",
        1.8,
        0,
      ],
    ],
  ),
  lk(
    2,
    "WING_2_SOBER_AFFECTION",
    "Prefiero demostrar mi cariño con hechos constantes y sobrios más que con gestos llamativos.",
    "Acuerdo = afecto sobrio y regido por el deber (1); desacuerdo = expresión más visible y social (3).",
    ["sobriedad vs. expresividad"],
    "lower",
  ),

  // ----- Main 3 (extension): 2 (lower) vs 4 (upper) -----
  sc(
    3,
    "WING_3_AFTER_PROJECT",
    "Terminas un proyecto importante con buen resultado. ¿Qué haces después?",
    "Contrasta el cierre compartido y agradecido con el equipo (2) con el repaso íntimo de lo que el logro significó (4).",
    ["afiliación vs. introspección", "cierre de logros"],
    [
      [
        "Me tomo un tiempo a solas para repasar qué significó para mí y qué habría querido hacer distinto.",
        0,
        1.8,
      ],
      ["Paso enseguida al siguiente pendiente de mi lista.", 0.3, 0.3],
      [
        "Organizo algo para agradecer y celebrar con quienes me ayudaron.",
        1.8,
        0,
      ],
    ],
  ),
  mc(
    3,
    "WING_3_FIRST_IMPRESSION",
    "Al presentarte ante personas nuevas, ¿qué te gustaría transmitir?",
    "Contrasta la imagen agradable y servicial (2) con la de singularidad y autenticidad (4).",
    ["agrado vs. autenticidad"],
    [
      [
        "Que soy distinto/a y auténtico/a, aunque no le caiga bien a todo el mundo.",
        0,
        1.8,
      ],
      [
        "Que soy alguien cálido y confiable con quien da gusto trabajar.",
        1.8,
        0,
      ],
    ],
  ),
  lk(
    3,
    "WING_3_CHEERING_OTHERS",
    "Me resulta natural animar a los demás y hacerlos sentir bien recibidos, incluso cuando yo estoy cansado/a.",
    "Acuerdo = energía afable y de apoyo hacia otros (2); desacuerdo = mayor reserva y foco en el mundo interno (4).",
    ["calidez vs. introspección"],
    "lower",
  ),

  // ----- Main 4 (extension): 3 (lower) vs 5 (upper) -----
  sc(
    4,
    "WING_4_CREATIVE_IDEA",
    "Tienes una idea creativa que te ilusiona mucho. ¿Cómo la desarrollas?",
    "Contrasta la presentación temprana buscando impulso y ajuste según la acogida (3) con el trabajo en solitario hasta que esté lista (5).",
    ["exposición vs. privacidad", "proceso creativo"],
    [
      [
        "La trabajo a solas hasta tenerla bien pensada y solo la muestro cuando siento que está lista.",
        0,
        1.8,
      ],
      ["La comento con una persona cercana para ver qué opina.", 0.3, 0.3],
      [
        "La presento pronto a gente que pueda impulsarla y la ajusto según cómo la reciban.",
        1.8,
        0,
      ],
    ],
  ),
  mc(
    4,
    "WING_4_WHEN_FEELING_DOWN",
    "Cuando te sientes decaído/a, ¿qué prefieres hacer?",
    "Contrasta el repliegue en lecturas o intereses propios hasta recuperar energía (5) con mantenerse activo en proyectos con resultados visibles (3).",
    ["retiro vs. actividad visible"],
    [
      [
        "Alejarme un tiempo y sumergirme en algo que me interese hasta recuperar fuerzas.",
        0,
        1.8,
      ],
      [
        "Mantenerme ocupado/a con proyectos que den resultados que se puedan ver.",
        1.8,
        0,
      ],
    ],
  ),
  lk(
    4,
    "WING_4_ENERGY_FROM_SHOWING",
    "Me da energía mostrar lo que hago y recibir comentarios de otras personas.",
    "Acuerdo = orientación a visibilidad y respuesta del público (3); desacuerdo = preferencia por la reserva y la autosuficiencia (5).",
    ["alcance vs. profundidad"],
    "lower",
  ),

  // ----- Main 5 (extension): 4 (lower) vs 6 (upper) -----
  sc(
    5,
    "WING_5_GIVING_A_TALK",
    "Te piden dar una charla sobre un tema que dominas. ¿Cómo te preparas?",
    "Contrasta la preparación escéptica y cautelosa, anticipando fallas (6), con la búsqueda de una forma personal y expresiva de contarlo (4).",
    ["certeza vs. expresión personal", "preparación"],
    [
      [
        "Anticipo las preguntas posibles, reviso las fuentes dos veces y pienso en qué podría salir mal.",
        0,
        1.8,
      ],
      ["Ensayo una vez y confío en lo que sé.", 0.3, 0.3],
      [
        "Busco una forma personal de contarlo, con ejemplos e imágenes que reflejen cómo lo vivo yo.",
        1.8,
        0,
      ],
    ],
  ),
  mc(
    5,
    "WING_5_NEW_PERSON_CIRCLE",
    "Cuando una persona nueva se acerca a tu círculo, ¿qué te interesa saber?",
    "Contrasta la cautela sobre la fiabilidad e intenciones del otro (6) con el interés por su sensibilidad y mirada del mundo (4).",
    ["confianza vs. afinidad sensible"],
    [
      ["Si es de fiar y qué intenciones tiene, antes de abrirme.", 0, 1.8],
      [
        "Si tiene una sensibilidad o una forma de ver el mundo que me resulte interesante.",
        1.8,
        0,
      ],
    ],
  ),
  lk(
    5,
    "WING_5_ART_OVER_TECHNICAL",
    "Me atrae más lo artístico o simbólico que lo técnico y bien definido.",
    "Acuerdo = inclinación estética e imaginativa (4); desacuerdo = preferencia por lo analítico y sistemático (6).",
    ["sensibilidad vs. certeza"],
    "lower",
  ),

  // ----- Main 6 (extension): 5 (lower) vs 7 (upper) -----
  sc(
    6,
    "WING_6_UNCERTAIN_DECISION",
    "Debes tomar una decisión importante y hay mucha incertidumbre. ¿Qué haces?",
    "Contrasta la investigación en solitario antes de decidir (5) con la consulta social y el foco en las oportunidades (7).",
    ["análisis vs. optimismo", "toma de decisiones"],
    [
      [
        "Lo converso con varias personas, lo tomo con ánimo y pienso en qué oportunidades puede abrir.",
        0,
        1.8,
      ],
      ["Pido más tiempo para decidir.", 0.3, 0.3],
      [
        "Reúno datos por mi cuenta, comparo posibilidades en silencio y decido cuando entiendo bien el panorama.",
        1.8,
        0,
      ],
    ],
  ),
  mc(
    6,
    "WING_6_WEEKEND_PLAN",
    "Al planear un fin de semana, ¿qué te atrae más?",
    "Contrasta la preferencia por lo tranquilo y reservado (5) con la búsqueda de variedad y compañía (7).",
    ["reserva vs. variedad"],
    [
      [
        "Variedad: varias actividades y gente, aunque el plan quede abierto.",
        0,
        1.8,
      ],
      ["Algo tranquilo y conocido, con tiempo para mis propias cosas.", 1.8, 0],
    ],
  ),
  lk(
    6,
    "WING_6_LISTEN_FIRST",
    "En una reunión prefiero escuchar y observar primero, y hablo cuando ya me hice una idea clara.",
    "Acuerdo = perfil bajo y reserva analítica (5); desacuerdo = expresividad social y conversadora (7).",
    ["análisis vs. optimismo"],
    "lower",
  ),

  // ----- Main 7 (extension): 6 (lower) vs 8 (upper) -----
  sc(
    7,
    "WING_7_STALLED_GROUP_PLAN",
    "Un plan en grupo se complica porque nadie se decide. ¿Qué haces?",
    "Contrasta la búsqueda de un plan que deje cómodos a todos (6) con tomar la delantera y arrancar (8).",
    ["cooperación vs. iniciativa", "liderazgo en grupo"],
    [
      [
        "Tomo la delantera: propongo algo concreto y empiezo, aunque no todos estén convencidos.",
        0,
        1.8,
      ],
      ["Propongo que cada quien aporte una idea y vemos cuál queda.", 0.3, 0.3],
      [
        "Pregunto a cada persona qué prefiere y busco un plan con el que todos se sientan cómodos.",
        1.8,
        0,
      ],
    ],
  ),
  mc(
    7,
    "WING_7_WHEN_PLAN_FAILS",
    "Cuando algo sale mal en un proyecto tuyo, ¿cuál es tu primera reacción?",
    "Contrasta enfrentar el problema de forma directa e inmediata (8) con revisar con gente de confianza qué falló y prevenir (6).",
    ["asertividad vs. cautela"],
    [
      [
        "Enfrentarlo de frente, decirlo en voz alta y buscar una salida enseguida.",
        0,
        1.8,
      ],
      [
        "Revisar con alguien de confianza qué falló y asegurarme de que no se repita.",
        1.8,
        0,
      ],
    ],
  ),
  lk(
    7,
    "WING_7_THINK_WHAT_COULD_FAIL",
    "Antes de lanzarme a algo emocionante, suelo pensar en qué podría salir mal para ir preparado/a.",
    "Acuerdo = prudencia y anticipación de riesgos (6); desacuerdo = salto directo a la acción con más audacia (8).",
    ["prudencia vs. intensidad"],
    "lower",
  ),

  // ----- Main 8 (extension): 7 (lower) vs 9 (upper) -----
  sc(
    8,
    "WING_8_RISKY_OFFER",
    "Alguien te propone una aventura o un negocio arriesgado y tienes poco tiempo para decidir. ¿Qué haces?",
    "Contrasta el salto rápido buscando estímulo (7) con la decisión pausada y estable (9).",
    ["impulsividad vs. estabilidad", "toma de riesgos"],
    [
      [
        "Pido unos días para pensarlo con calma y no dejo que me apuren.",
        0,
        1.8,
      ],
      ["Pregunto por los detalles y los números antes de opinar.", 0.3, 0.3],
      ["Si me atrae, me lanzo y voy resolviendo sobre la marcha.", 1.8, 0],
    ],
  ),
  mc(
    8,
    "WING_8_DISAGREEMENT_CLOSE",
    "Cuando tienes un desacuerdo con alguien cercano, ¿cómo prefieres resolverlo?",
    "Contrasta la resolución paciente, dejando enfriar el tema (9), con hablarlo de inmediato y con energía (7).",
    ["paciencia vs. inmediatez"],
    [
      [
        "Con paciencia: dejo que se enfríe y vuelvo al tema sin levantar la voz.",
        0,
        1.8,
      ],
      [
        "Hablándolo ya, con energía y hasta con humor, para dejarlo atrás rápido.",
        1.8,
        0,
      ],
    ],
  ),
  lk(
    8,
    "WING_8_BORED_BY_ROUTINE",
    "Me aburro con facilidad si todo es rutina y necesito cambios o planes nuevos.",
    "Acuerdo = búsqueda de estímulo y cambio (7); desacuerdo = comodidad con la rutina y los espacios estables (9).",
    ["expansividad vs. serenidad"],
    "lower",
  ),

  // ----- Main 9 (extension): 8 (lower) vs 1 (upper) -----
  sc(
    9,
    "WING_9_SHARED_SPACE_ORDER",
    "Te toca poner orden en un espacio compartido, como la casa o la oficina, que está muy desordenado. ¿Cómo lo haces?",
    "Contrasta la acción directa y enérgica repartiendo tareas (8) con la creación de un sistema ordenado de reglas (1).",
    ["firmeza vs. criterio", "organización del entorno"],
    [
      [
        "Armo un sistema con reglas claras y cuido que cada cosa tenga su lugar.",
        0,
        1.8,
      ],
      ["Pregunto qué prefiere cada quien antes de mover nada.", 0.3, 0.3],
      [
        "Me pongo manos a la obra con energía, muevo cosas y asigno tareas sin tanto trámite.",
        1.8,
        0,
      ],
    ],
  ),
  mc(
    9,
    "WING_9_HANDLING_ANNOYANCE",
    "Cuando algo de otra persona te molesta, ¿qué haces con esa molestia?",
    "Contrasta la crítica interior que se guarda y se analiza (1) con la descarga franca y breve (8).",
    ["contención crítica vs. descarga directa"],
    [
      [
        "La guardo y la voy analizando, a veces con una crítica interior que no digo.",
        0,
        1.8,
      ],
      [
        "La suelto de golpe cuando ya no aguanto, con franqueza, y luego se me pasa.",
        1.8,
        0,
      ],
    ],
  ),
  lk(
    9,
    "WING_9_NOTICE_SMALL_ERRORS",
    "Suelo fijarme en los pequeños errores o detalles fuera de lugar, aunque no diga nada.",
    "Acuerdo = ojo crítico y perfeccionismo silencioso (1); desacuerdo = menor atención al detalle y más desinterés por la norma (8).",
    ["contención crítica vs. descarga directa"],
    "upper",
  ),
];

function scoresFor(pair: Pair, lower: number, upper: number) {
  const types: Partial<Record<EnneagramType, number>> = {};
  if (lower > 0) types[pair[0]] = lower;
  if (upper > 0) types[pair[1]] = upper;
  return { types };
}

export const WING_QUESTIONS: Question[] = DRAFTS.map((draft, index) => {
  const pair = wingsOf(draft.main);
  const related: EnneagramType[] = [draft.main, pair[0], pair[1]];
  if ("items" in draft) {
    const options = opts(
      draft.items.map(
        ([text, lo, up]) => [text, scoresFor(pair, lo, up)] as const,
      ),
    );
    return finish("wing", index, draft, { options, related });
  }
  // Bipolar likert: agreement -> supported wing (full curve); disagreement -> opposite wing (weaker).
  const supported = draft.supports === "upper" ? pair[1] : pair[0];
  const opposite = draft.supports === "upper" ? pair[0] : pair[1];
  const agree = [0, 0, 0, 0.7, 1.5];
  const disagree = [1.5, 0.7, 0, 0, 0];
  const options = scaleOptions("likert", (i) => {
    const types: Partial<Record<EnneagramType, number>> = {};
    if ((agree[i] as number) > 0) types[supported] = agree[i] as number;
    if ((disagree[i] as number) > 0) types[opposite] = disagree[i] as number;
    return { types };
  });
  return finish("wing", index, draft, { options, related });
});
