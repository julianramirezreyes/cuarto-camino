import type { SubtypeProfile } from "../schema";
import { sub } from "./build";

export const subtypes9: SubtypeProfile[] = [
  sub(9, "sp", {
    name: "El que se distrae con la comodidad y la rutina",
    description:
      "La pereza del Nueve, entendida como olvido de sí, se expresa en el apego a la comodidad, los hábitos y las pequeñas actividades que llenan el día. Se evita la atención a lo importante mediante tareas, comida, pasatiempos o rutinas. En la literatura suele asociarse con el apetito; aquí se usa un nombre descriptivo propio.",
    motivations: [
      "Mantener la paz interior con rutinas y comodidades estables.",
      "Evitar el malestar de lo desconocido y de las decisiones importantes.",
      "Sentirse seguro en un entorno predecible y tranquilo.",
      "Llenar el vacío o la inquietud con actividades que no demandan mucho.",
    ],
    outerManifestations: [
      "Se entrega a hábitos de confort: comida, televisión, jardinería, coleccionismo, quehaceres.",
      "Se muestra tranquilo, amable y poco reactivo.",
      "Se ocupa de muchas tareas menores y posterga las importantes.",
      "Se resiste a cambios en la rutina con pasividad más que con confrontación.",
    ],
    innerBehaviors: [
      "Un adormecimiento de los propios deseos y prioridades.",
      "Distracción con lo trivial para no sentir tensión o conflicto.",
      "Resistencia pasiva ante demandas externas.",
      "Una sensación sorda de insatisfacción que no se nombra.",
    ],
    needs: [
      "Identificar sus prioridades reales entre las cosas que ocupa su tiempo.",
      "Experimentar el malestar de un cambio sin sustituirlo por una rutina.",
      "Dar pasos pequeños y sostenidos hacia lo que realmente importa.",
      "Expresar sus preferencias antes de que el enojo se acumule.",
    ],
    fears: [
      "Perder la calma y la estabilidad de su entorno.",
      "Verse forzado a decidir o a afrontar un conflicto.",
      "Descubrir que ha postergado lo esencial.",
      "Ser molestado o presionado.",
    ],
    strengths: [
      "Serenidad, constancia y capacidad de disfrutar lo sencillo.",
      "Paciencia y estabilidad en la vida cotidiana.",
      "Aceptación de las personas sin juzgarlas.",
      "Habilidad para crear un ambiente cómodo.",
    ],
    difficulties: [
      "Procrastinación y desvío hacia tareas secundarias.",
      "Estancamiento y apego a lo conocido.",
      "Dificultad para reconocer su ira o su deseo.",
      "Sustitutos de comodidad (comida, pantallas) que adormecen.",
    ],
    differencesFromOtherSubtypes:
      "Frente al Nueve social, que se funde con el grupo y pierde su voz en la participación, y al Nueve sexual, que se funde con una persona, este subtipo se disuelve en lo cotidiano: comodidad, hábitos y entretenimientos. Es el más casero y el más cercano a la imagen de pereza tranquila.",
    possibleConfusions: [
      { type: 5, note: "Ambos son reservados y valoran su espacio, pero el Cinco se retira para pensar y conservar energía; el Nueve se acomoda para evitar la tensión." },
      { type: 1, note: "El Uno de conservación también ama las rutinas, pero las vive como control y deber; el Nueve como comodidad y distracción." },
      { type: 6, note: "Ambos pueden postergar decisiones, pero el Seis lo hace por duda y miedo; el Nueve por inercia y evitación del conflicto." },
    ],
    inRelationships:
      "Es amable, estable y fácil de convivir, aunque puede resultar pasivo ante los desacuerdos. Su enojo aparece como resistencia silenciosa. Mejora al expresar preferencias concretas y al nombrar el malestar a tiempo.",
    atWork:
      "Funciona en tareas rutinarias, cuidado, administración tranquila, artesanía y trabajos con ritmo estable. Puede evitar decisiones, postergar y resistirse a cambios organizacionales.",
    examples: [
      "Ordena la despensa en vez de empezar un trámite que lleva semanas pendiente.",
      "Dice 'me da igual' ante una decisión y luego se siente insatisfecho con el resultado.",
      "Se queda en casa un fin de semana sin decidirlo realmente.",
      "Sustituye una conversación pendiente por una tarea doméstica.",
    ],
    selfObservationPractices: [
      "Anotar a qué dedica la primera hora tras pensar en una tarea importante.",
      "Elegir una preferencia propia al día y expresarla en voz alta.",
      "Notar cuándo come o mira pantallas para no sentir algo y qué es ese algo.",
      "Dar un paso de cinco minutos hacia algo postergado y observar la resistencia.",
    ],
  }),
  sub(9, "so", {
    name: "El que se funde con el grupo y pierde su voz",
    description:
      "El olvido de sí se da a través de la participación: el Nueve se une al grupo con entusiasmo, trabaja por él y se siente parte, aunque a costa de diluir sus propias prioridades. Es el subtipo más activo y sociable del tipo. En la literatura suele asociarse con la participación; aquí se usa un nombre descriptivo propio.",
    motivations: [
      "Pertenecer a un grupo y sentirse integrado y aceptado.",
      "Contribuir al bienestar colectivo y sostener la armonía.",
      "Sentir que forma parte de algo más grande.",
      "Evitar el conflicto y la soledad dentro de una comunidad.",
    ],
    outerManifestations: [
      "Participa activamente en grupos, comunidades y tareas colectivas.",
      "Es amable, conciliador y se muestra disponible para todos.",
      "Trabaja con constancia por el grupo sin pedir protagonismo.",
      "Dice sí con facilidad y deja sus propios asuntos para después.",
    ],
    innerBehaviors: [
      "Un esfuerzo por adaptarse a lo que el grupo desea.",
      "Desconexión de sus prioridades personales mientras atiende lo colectivo.",
      "Resentimiento sordo cuando se siente invisible o pasado por alto.",
      "Dificultad para distinguir su opinión de la del grupo.",
    ],
    needs: [
      "Expresar sus ideas y deseos sin esperar a que el consenso lo confirme.",
      "Reservar tiempo para actividades personales dentro de una vida muy social.",
      "Tolerar el desacuerdo sin sentir que rompe el grupo.",
      "Sentirse valioso sin ser siempre útil o complaciente.",
    ],
    fears: [
      "Ser excluido del grupo por tener una opinión distinta.",
      "Generar conflicto o incomodar.",
      "Quedar solo o ser invisible.",
      "Descubrir que el grupo no lo valora como creía.",
    ],
    strengths: [
      "Habilidad para mediar, integrar y crear cohesión.",
      "Constancia en el trabajo colectivo.",
      "Receptividad y apertura a diferentes puntos de vista.",
      "Calidez social sin pretensiones.",
    ],
    difficulties: [
      "Pérdida de la propia voz y de las prioridades personales.",
      "Resentimiento acumulado y estallidos pasivo-agresivos.",
      "Dificultad para tomar posición en discusiones.",
      "Activismo que sirve para evitar la propia vida interior.",
    ],
    differencesFromOtherSubtypes:
      "A diferencia del Nueve de conservación, que se distrae con rutinas, y del Nueve sexual, que se funde con otra persona, este subtipo se disuelve en el grupo: trabaja, ayuda y se adapta en lo colectivo. Es el más enérgico, sociable y el que menos parece un Nueve.",
    possibleConfusions: [
      { type: 2, note: "Ambos son serviciales y sociables, pero el Dos busca ser querido y reconocido; el Nueve busca pertenencia y paz sin buscar protagonismo." },
      { type: 6, note: "Ambos se comprometen con grupos, pero el Seis lo hace por seguridad y lealtad; el Nueve por pertenencia y armonía." },
      { type: 3, note: "Ambos son activos en lo colectivo, pero el Tres persigue éxito y reconocimiento; el Nueve evita sobresalir." },
    ],
    inRelationships:
      "Es amable, receptivo y comprometido con su círculo, con una tendencia a adaptarse. Puede callar su opinión y luego mostrar distancia o terquedad pasiva. Mejora al decir 'yo prefiero' con claridad.",
    atWork:
      "Funciona como mediador, coordinador, trabajador social, docente, mano derecha o integrante clave de un equipo. Puede dificultarse la toma de postura y la defensa de sus intereses.",
    examples: [
      "Acepta una tarea más del comité aunque ya estaba saturado.",
      "Asiente en una reunión mientras internamente no está de acuerdo.",
      "Se siente invisible tras horas de trabajo voluntario sin que nadie lo mencione.",
      "Se vuelve terco de repente en un asunto menor tras haber cedido en muchos.",
    ],
    selfObservationPractices: [
      "Antes de responder 'como quieran', identificar qué preferiría y decirlo.",
      "Anotar cuántos compromisos aceptó esta semana y cuáles realmente quería.",
      "Pasar un rato solo para reconocer qué piensa sin influencia del grupo.",
      "Expresar un desacuerdo leve en un ambiente seguro y observar el efecto.",
    ],
  }),
  sub(9, "sx", {
    name: "El que se funde con otra persona",
    description:
      "El olvido de sí se da a través de la unión con otra persona: se adopta el mundo, los gustos y las prioridades del otro y se siente completitud en esa fusión. En la literatura suele asociarse con la unión; aquí se usa un nombre descriptivo propio.",
    motivations: [
      "Sentirse completo y seguro en la unión con una persona importante.",
      "Evitar la soledad y el vacío mediante la fusión.",
      "Encontrar un sentido de dirección en los deseos del otro.",
      "Vivir una conexión profunda y estable.",
    ],
    outerManifestations: [
      "Se adapta a los intereses, ritmos y opiniones de su pareja o persona cercana.",
      "Dedica tiempo y atención a la relación, a menudo en detrimento de sus propios intereses.",
      "Se muestra afable, receptivo y acogedor en lo íntimo.",
      "Puede reaccionar con terquedad pasiva si siente que su espacio se invade.",
    ],
    innerBehaviors: [
      "Una confusión entre lo que desea él o ella y lo que desea el otro.",
      "Miedo a la separación como pérdida de la propia identidad.",
      "Idealización del vínculo como fuente de plenitud.",
      "Resentimiento silencioso por haber cedido demasiado.",
    ],
    needs: [
      "Cultivar intereses y una identidad propia fuera de la relación.",
      "Identificar y expresar sus deseos aunque difieran de los del otro.",
      "Tolerar la separación sin sentirse aniquilado.",
      "Distinguir la cercanía de la fusión.",
    ],
    fears: [
      "Ser abandonado o separado de la persona que le da sentido.",
      "Perderse a sí mismo en el otro.",
      "Causar un conflicto que dañe la unión.",
      "Quedarse sin un vínculo que lo oriente.",
    ],
    strengths: [
      "Ternura, receptividad y capacidad de sostener la intimidad.",
      "Lealtad y constancia en los vínculos.",
      "Disposición a acompañar y apoyar sin competir.",
      "Aceptación calma del otro tal como es.",
    ],
    difficulties: [
      "Pérdida de la identidad propia en la relación.",
      "Dependencia emocional y dificultad para tolerar la distancia.",
      "Evitación del conflicto que acumula resentimiento.",
      "Dificultad para tomar decisiones sin consultar al otro.",
    ],
    differencesFromOtherSubtypes:
      "Frente al Nueve de conservación, que se dispersa en lo cotidiano, y al Nueve social, que se funde con el grupo, este subtipo busca la unión con una persona y adopta su mundo como propio. Es el más afectivo, dependiente y vulnerable a la pérdida de identidad en pareja.",
    possibleConfusions: [
      { type: 2, note: "Ambos se orientan hacia el otro, pero el Dos da para ser necesitado; el Nueve se funde para no sentirse solo ni separado." },
      { type: 4, note: "Ambos anhelan unión profunda, pero el Cuatro vive la falta con intensidad; el Nueve la busca con calma y adaptación." },
      { type: 6, note: "Ambos pueden depender de una figura cercana, pero el Seis lo hace por seguridad y duda; el Nueve por fusión y pérdida de sí." },
    ],
    inRelationships:
      "Es afectuoso, receptivo y entregado, pero tiende a diluirse en el otro y a callar sus deseos. Puede mostrar resistencia pasiva ante demandas. Mejora al sostener actividades propias y nombrar lo que quiere.",
    atWork:
      "Funciona en roles de apoyo, trabajo en pareja o en equipos pequeños, cuidado, arte colaborativo. Puede subordinar sus metas a las de un socio o jefe y evitar la iniciativa propia.",
    examples: [
      "Cambia sus aficiones por las de su pareja sin que nadie se lo pida.",
      "Dice 'lo que tú quieras' y luego siente un malestar sordo.",
      "Se desorienta durante unos días tras una separación breve.",
      "Evita contar un desacuerdo para no alterar la armonía de la relación.",
    ],
    selfObservationPractices: [
      "Anotar tres preferencias personales al día que no dependan de nadie más.",
      "Pasar una tarde sin contacto con su pareja o persona cercana y registrar qué siente.",
      "Notar cuando asume una opinión ajena como propia y cuestionarla.",
      "Practicar decir 'no' en algo pequeño y observar la reacción real del otro.",
    ],
  }),
];
