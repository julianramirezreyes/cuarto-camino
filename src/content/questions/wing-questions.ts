/**
 * Wing module (module "wing"): 27 questions, 3 per main type.
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
