import type { SubtypeProfile } from "../schema";
import { sub } from "./build";

export const subtypes5: SubtypeProfile[] = [
  sub(5, "sp", {
    name: "El que protege su refugio y sus recursos",
    description:
      "La retención del Cinco se expresa en la creación de un espacio privado, con límites claros y recursos controlados. Se minimiza la necesidad de otros y se defiende el tiempo y la energía. En la literatura suele asociarse con la imagen de un refugio; aquí se usa un nombre descriptivo propio.",
    motivations: [
      "Conservar un territorio propio donde pensar y estar sin ser invadido.",
      "Contar con lo mínimo necesario para sentirse autónomo.",
      "Reducir demandas externas que agoten su energía.",
      "Preservar el tiempo para estudiar, crear y entender.",
    ],
    outerManifestations: [
      "Organiza su vida alrededor de su casa, sus horarios y sus rutinas.",
      "Es austero, selectivo y poco dado a compartir espacios o recursos.",
      "Limita las visitas, llamadas y compromisos sociales.",
      "Reúne libros, herramientas o información de manera metódica.",
    ],
    innerBehaviors: [
      "Un cálculo constante de su energía disponible frente a las demandas que llegan.",
      "Sensación de que el contacto con otros consume más de lo que da.",
      "Preferencia por observar y analizar antes de implicarse.",
      "Tensión cuando alguien invade su espacio o su tiempo.",
    ],
    needs: [
      "Un espacio garantizado de soledad sin culpa.",
      "Aprender a compartir recursos y emociones de manera gradual.",
      "Reconocer necesidades afectivas que normalmente minimiza.",
      "Experimentar que el contacto también puede recargarlo.",
    ],
    fears: [
      "Ser invadido, agotado o dependiente de otros.",
      "Quedarse sin recursos o sin tiempo para sí.",
      "Ser expuesto sin preparación.",
      "Perder su autonomía por compromisos sociales.",
    ],
    strengths: [
      "Autosuficiencia, austeridad y capacidad de concentrarse.",
      "Profundidad intelectual y orden en su entorno.",
      "Independencia emocional en situaciones difíciles.",
      "Fiabilidad dentro de sus límites explícitos.",
    ],
    difficulties: [
      "Aislamiento y dificultad para pedir o aceptar ayuda.",
      "Rigidez con el espacio y el tiempo propios.",
      "Desconexión emocional que puede percibirse como frialdad.",
      "Tacañería de tiempo, atención o recursos.",
    ],
    differencesFromOtherSubtypes:
      "Frente al Cinco social, que se acerca a otros a través de ideas, grupos o referentes, y al Cinco sexual, que busca una conexión íntima y confiada con una persona, este subtipo se repliega en su espacio y sus recursos. Es el más reservado y el más típico de la imagen de Cinco ermitaño.",
    possibleConfusions: [
      { type: 9, note: "Ambos pueden verse quietos y retirados, pero el Nueve evita el conflicto y se fusiona con lo cómodo; el Cinco se retira para conservar energía y pensar." },
      { type: 1, note: "Ambos son ordenados y cuidan sus recursos, pero el Uno actúa desde el deber y la corrección; el Cinco desde la protección de su espacio." },
      { type: 4, note: "Ambos pueden aislarse, pero el Cuatro lo vive desde el anhelo y la emoción; el Cinco desde la desvinculación y el análisis." },
    ],
    inRelationships:
      "Valora las relaciones que respeten su espacio y su ritmo, y muestra cariño con constancia más que con expresividad. Puede resultar distante y le cuesta anunciar sus necesidades. Mejora al acordar tiempos de encuentro y de soledad claros.",
    atWork:
      "Se destaca en investigación, programación, análisis, archivos, oficios técnicos y trabajo remoto. Prefiere autonomía y poca interrupción, y puede resistirse a reuniones y política interna.",
    examples: [
      "Rechaza un plan social porque necesita su tarde para recuperarse.",
      "Prepara una despensa o un taller organizado para no depender de nadie.",
      "Se incomoda cuando alguien llega sin avisar.",
      "Calcula si vale la pena asistir a un evento según la energía que le costará.",
    ],
    selfObservationPractices: [
      "Anotar qué le cuesta más: el contacto en sí o la falta de preparación para él.",
      "Programar un encuentro breve con límite de tiempo y registrar cómo se siente al terminar.",
      "Observar cuándo dice 'no tengo tiempo' y si realmente es una cuestión de energía.",
      "Compartir un recurso o un conocimiento pequeño sin esperar nada a cambio.",
    ],
  }),
  sub(5, "so", {
    name: "El que se vincula a través de ideas y referentes",
    description:
      "El Cinco se acerca al grupo a través del conocimiento, los símbolos y los referentes: pertenece a comunidades de ideas, disciplinas o líneas de pensamiento. La relación con los demás se media por el saber y por la admiración hacia ciertas figuras. En la literatura suele asociarse con el tótem; aquí se usa un nombre descriptivo propio.",
    motivations: [
      "Pertenecer a una comunidad intelectual o espiritual que le dé sentido.",
      "Ser reconocido por su dominio de un campo o de un conocimiento.",
      "Encontrar guías, maestros o referentes con los que identificarse.",
      "Participar en el mundo desde el conocimiento más que desde la emoción.",
    ],
    outerManifestations: [
      "Se interesa por sistemas, escuelas de pensamiento, tradiciones y sus principales figuras.",
      "Participa en círculos de estudio, foros o comunidades especializadas.",
      "Comparte información con generosidad en ámbitos donde se siente competente.",
      "Puede tener opiniones firmes sobre su campo y mostrar impaciencia ante la superficialidad.",
    ],
    innerBehaviors: [
      "Una admiración idealizada por ciertos referentes o ideas.",
      "Sensación de estar fuera de la vida social común, pero conectado a un grupo selecto.",
      "Necesidad de entender antes de participar.",
      "Preocupación por la competencia propia y por la mirada de los pares.",
    ],
    needs: [
      "Compartir lo que sabe sin sentirse examinado.",
      "Vínculos personales además de los intelectuales.",
      "Experimentar la emoción compartida, no solo el análisis conjunto.",
      "Aceptar que no tiene que dominar un tema para participar.",
    ],
    fears: [
      "Ser considerado incompetente o ignorante ante pares.",
      "Quedar fuera del círculo de quienes admira.",
      "Verse obligado a una intimidad emocional que no sabe manejar.",
      "Que su campo de interés sea trivializado.",
    ],
    strengths: [
      "Conocimiento profundo y capacidad de integrar información.",
      "Compromiso con las comunidades de ideas que elige.",
      "Generosidad intelectual en ámbitos afines.",
      "Capacidad de reflexión sistemática.",
    ],
    difficulties: [
      "Intelectualización de las emociones y las relaciones.",
      "Rigidez ante visiones que desafían a sus referentes.",
      "Tendencia a la erudición que desconecta del presente.",
      "Dificultad para la intimidad personal fuera de lo conceptual.",
    ],
    differencesFromOtherSubtypes:
      "Frente al Cinco de conservación, que se retira a su refugio, y al Cinco sexual, que busca confidencia y apertura con una persona específica, este subtipo gestiona la conexión por medio de ideas compartidas, escuelas y referentes. Es el más 'académico' y el que más entra en comunidades.",
    possibleConfusions: [
      { type: 1, note: "Ambos defienden ideas con firmeza, pero el Uno lo hace por convicción moral; el Cinco por el valor del conocimiento y la competencia." },
      { type: 3, note: "Ambos buscan reconocimiento por su competencia, pero el Tres persigue éxito e imagen; el Cinco el dominio de un campo y el reconocimiento de pares." },
      { type: 6, note: "Ambos se apoyan en sistemas y referentes, pero el Seis los busca por seguridad y duda; el Cinco por comprensión y autonomía." },
    ],
    inRelationships:
      "Se vincula a través de intereses comunes y conversaciones profundas. Puede tener dificultad para compartir lo personal y distanciarse en momentos de intimidad emocional. Mejora cuando expresa afecto sin pasarlo por el análisis.",
    atWork:
      "Prospera en la academia, la investigación, la docencia especializada, la consultoría técnica y la divulgación. Puede ser un referente en su campo, aunque le cuesta la política institucional.",
    examples: [
      "Dedica meses a leer toda la obra de un autor y se une a un grupo de discusión.",
      "Corrige con precisión un dato en una charla y luego se incomoda por haber intervenido.",
      "Se siente en casa en un congreso especializado y agotado en una fiesta social.",
      "Cita a su maestro con admiración y evita hablar de sí mismo.",
    ],
    selfObservationPractices: [
      "Observar cuándo recurre a una cita o referente para no decir lo que piensa o siente.",
      "Contar a un amigo una experiencia personal sin explicarla ni analizarla.",
      "Registrar cuánto de su identidad depende de su campo de conocimiento.",
      "Probar una actividad grupal no intelectual y notar lo que aparece.",
    ],
  }),
  sub(5, "sx", {
    name: "El que busca una confianza total con alguien",
    description:
      "El Cinco reserva su apertura para una persona o muy pocas, en quienes busca confianza absoluta y compartir lo más privado. La retención cede ante la intimidad intensa y selectiva. En la tradición de Naranjo es el contratipo del tipo; en la literatura suele asociarse con la confianza. Aquí se usa un nombre descriptivo propio.",
    motivations: [
      "Encontrar a alguien con quien poder ser completamente transparente.",
      "Compartir su mundo interior en un vínculo seguro y profundo.",
      "Vivir una conexión intensa que contrarreste su aislamiento.",
      "Dejar de estar en reserva en presencia de una persona de confianza.",
    ],
    outerManifestations: [
      "Se muestra reservado con la mayoría y sorprendentemente abierto con una persona concreta.",
      "Puede mostrarse más cálido, expresivo y apasionado de lo esperado de un Cinco.",
      "Pone a prueba la confianza del otro con cuidado antes de abrirse.",
      "Mantiene pocos vínculos, pero muy profundos y exclusivos.",
    ],
    innerBehaviors: [
      "Un deseo intenso de fusión que convive con el miedo a ser invadido.",
      "Evaluación continua de si el otro es digno de confianza.",
      "Sensibilidad extrema a la traición o a la indiscreción.",
      "Fantasía de un vínculo sin filtros, que contrasta con su contención habitual.",
    ],
    needs: [
      "Un vínculo que acepte su ritmo y su necesidad de espacio.",
      "Aprender a expresar su afecto sin esperar certeza total.",
      "Tolerar la vulnerabilidad sin preparación excesiva.",
      "Diferenciar intimidad de fusión.",
    ],
    fears: [
      "Ser traicionado o expuesto por quien ha confiado.",
      "Ser invadido o absorbido por la relación.",
      "No encontrar a nadie en quien confiar.",
      "Perder la persona de confianza y quedar solo con su retención.",
    ],
    strengths: [
      "Profundidad, lealtad y honestidad emocional en pocos vínculos.",
      "Capacidad de entrega intensa y de atención al otro.",
      "Sensibilidad y creatividad en la relación íntima.",
      "Capacidad de contacto auténtico cuando se siente seguro.",
    ],
    difficulties: [
      "Oscilación entre apertura total y retirada brusca.",
      "Posesividad o celos ocultos tras la reserva.",
      "Dependencia de una sola persona como único vínculo profundo.",
      "Dificultad para sostener la intimidad sin una prueba constante de confianza.",
    ],
    differencesFromOtherSubtypes:
      "Frente al Cinco de conservación, que se atrinchera, y al Cinco social, que se conecta mediante ideas, este subtipo se abre de manera intensa y selectiva a una persona. Es el que menos encaja con el estereotipo de Cinco frío y el más propenso a la pasión romántica o a la confidencia total.",
    possibleConfusions: [
      { type: 4, note: "Ambos buscan intimidad profunda y sienten intensidad, pero el Cuatro se identifica con la falta y la expresividad; el Cinco con la reserva y la confianza." },
      { type: 2, note: "El Dos sexual también se entrega, pero se orienta a las necesidades del otro; el Cinco busca un espacio seguro para sí mismo." },
      { type: 6, note: "Ambos prueban la lealtad, pero el Seis desconfía por miedo a ser dañado; el Cinco por miedo a ser invadido o expuesto." },
    ],
    inRelationships:
      "Se entrega por completo a la persona de confianza y aprecia la complicidad. Puede alternar apertura y repliegue y tener dificultad para compartir con otros círculos. Mejora al nombrar su necesidad de espacio sin interpretarla como abandono.",
    atWork:
      "Funciona en proyectos de colaboración estrecha con un socio de confianza, en investigación en pareja o en trabajos creativos y técnicos. Puede resistir las estructuras jerárquicas y los grupos grandes.",
    examples: [
      "Cuenta a una sola persona un secreto que nunca dijo y luego se asusta por la exposición.",
      "Se aleja días tras sentir que el otro le pidió demasiado.",
      "Pasa horas conversando en profundidad con un amigo y no quiere ver a nadie más.",
      "Pone a prueba a una pareja con una confidencia menor para ver cómo reacciona.",
    ],
    selfObservationPractices: [
      "Observar los momentos en que prueba la confianza de otro y qué espera encontrar.",
      "Compartir una vulnerabilidad pequeña en lugar de esperar una confianza total.",
      "Reconocer cuándo se retira por saturación y comunicarlo antes de desaparecer.",
      "Cultivar un segundo vínculo cercano para no depender de una sola persona.",
    ],
  }),
];
