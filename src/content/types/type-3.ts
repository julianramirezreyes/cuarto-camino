import type { TypeProfile } from "../schema";

export const type3: TypeProfile = {
  type: 3,
  name: "Triunfador",
  summary:
    "En este modelo interpretativo, el tipo 3 describe una atención orientada al logro y a la imagen: percibe qué se valora en cada contexto y se adapta para destacar, de modo que a veces confunde lo que hace con lo que es.",
  coreMotivation:
    "Ser valioso y admirado a través de los logros, cumpliendo con lo que cada contexto considera exitoso.",
  basicDesire: "Sentirse valioso, reconocido y capaz.",
  basicFear: "No tener valor propio más allá de lo que logra; ser un fracaso.",
  psychologicalNeed:
    "Descubrir que puede ser querido sin rendimiento, y contactar con sentimientos y deseos que no encajan en la imagen exitosa.",
  passion: {
    text: "Vanidad: en la lectura de Naranjo, un interés intenso en la imagen y la valoración externa que desplaza el contacto con la experiencia interna auténtica.",
    attribution: "naranjo",
    sources: ["naranjo-1990", "ichazo-1982"],
  },
  fixation: {
    text: "Vanidad (en la tradición de Ichazo, ligada a la identificación con un papel o imagen). Es la etiqueta que menos se distingue entre pasión y fijación, y algunos autores usan engaño o autoengaño para describir el mismo proceso.",
    attribution: "ichazo",
    sources: ["ichazo-1982", "naranjo-1990"],
  },
  virtue: {
    text: "Veracidad (autenticidad): actuar y mostrarse en coherencia con lo que se siente y se piensa, sin necesidad de producir una impresión.",
    attribution: "naranjo",
    sources: ["naranjo-1990"],
  },
  selfImage:
    "Se ve como alguien capaz, eficiente y adaptable, que consigue lo que se propone y que sabe presentarse bien, con la mirada puesta siempre en el siguiente objetivo.",
  defenseMechanisms: [
    {
      text: "Identificación: en la tradición de Naranjo, la persona se funde con el papel o la imagen exitosa, hasta el punto de perder de vista lo que siente por debajo de ese rol.",
      attribution: "naranjo",
      sources: ["naranjo-1994"],
    },
    {
      text: "Riso y Hudson también emplean la identificación para este tipo, centrada en asimilar la imagen de lo que se admira. Es una interpretación; no hay una lista aceptada por todas las escuelas.",
      attribution: "riso-hudson",
      sources: ["riso-hudson-1996"],
    },
  ],
  strengths: [
    "Orientación a metas y capacidad de traducir ideas en resultados.",
    "Energía y optimismo práctico que contagia al equipo.",
    "Flexibilidad para adaptarse a distintos entornos y públicos.",
    "Habilidad para comunicar con claridad y motivar.",
    "Disciplina para sostener esfuerzo hasta cumplir objetivos.",
  ],
  limitations: [
    "Puede ajustar tanto su imagen a cada contexto que le cuesta saber qué piensa o siente realmente.",
    "Tiende a medir su valor por resultados y a pasar por alto el descanso o las relaciones.",
    "Puede atajar procesos, exagerar logros o evitar mostrar fallos.",
    "A veces trata a las personas como medios para una meta sin darse cuenta.",
    "Hay riesgo de agotamiento cuando el ritmo de rendimiento no se detiene.",
  ],
  habitualBehaviors: [
    "Se fija objetivos con fechas y los revisa con frecuencia.",
    "Cuida su presentación, su lenguaje y su perfil en redes según el contexto.",
    "Hace varias cosas a la vez para aprovechar el tiempo.",
    "Se orienta al ganador del grupo y adopta sus hábitos.",
    "Cambia de enfoque con rapidez si el camino no está dando resultado.",
  ],
  recurringThoughts: [
    "Tengo que lograr esto antes de fin de mes.",
    "¿Cómo me va a ver la gente si esto sale mal?",
    "No tengo tiempo para sentir eso ahora.",
    "Lo importante es que funcione.",
    "Si no destaco, no cuento.",
  ],
  emotionalResponses: [
    "Entusiasmo y empuje frente a metas claras con posibilidad de reconocimiento.",
    "Incomodidad intensa ante la posibilidad de verse fracasado o mediocre.",
    "Aplazamiento de la tristeza o la rabia hasta que haya un hueco, que muchas veces no llega.",
    "Vacío o desconcierto al alcanzar una meta y no saber qué viene después.",
    "Impaciencia con quienes ven lentos o poco eficaces.",
  ],
  inRelationships:
    "Es una pareja o amistad enérgica, proveedora y motivadora, que apoya los proyectos del otro. La dificultad es la disponibilidad emocional: puede estar físicamente presente y mentalmente en su agenda, y mostrar la versión pulida de sí mismo. Los vínculos más profundos suelen crecer cuando se permite mostrar dudas y cansancio.",
  atWork:
    "Se desempeña bien en ventas, emprendimiento, gestión de proyectos, consultoría, comunicación y cualquier lugar donde los resultados se midan. Se motiva con metas retadoras y reconocimiento. En ambientes sin indicadores claros o con mucho conflicto interno puede impacientarse.",
  inLeadership:
    "Lidera con visión, ritmo y capacidad de movilizar. Puede ser un gran inspirador. El desafío es no sacrificar a las personas por los resultados, aceptar que el proceso también importa y dar lugar a ideas que no le dan crédito.",
  inConflict:
    "Prefiere resolver con eficiencia y pasar a lo siguiente; puede minimizar la dimensión emocional o responder con una versión favorable de los hechos. Cuando se siente amenazado en su imagen, puede defenderse con argumentos pulidos o cambiar de tema en lugar de explorar lo ocurrido.",
  underPressure:
    "Acelera, se aísla en el trabajo o recurre a controlar la narrativa. En algunas lecturas del modelo, bajo estrés se describen rasgos del tipo 9: desconexión, apatía, postergación de lo importante por actividades menores. Es una interpretación, no una regla universal.",
  constructivePatterns:
    "Cuando se siente seguro, une su capacidad de logro con valores propios: elige metas que le importan, comparte el mérito, muestra su vulnerabilidad sin dramatizarla y puede detenerse a descansar sin culpa.",
  lookAlikes: [
    {
      type: 1,
      difference:
        "Los dos son trabajadores y exigentes, pero el 1 se guía por una norma interior de lo correcto y puede resistirse a atajos aunque funcionen; el 3 se guía por lo que es eficaz y valorado y adapta el método con soltura. El 1 se critica por hacer mal las cosas; el 3 teme más no ser visto como exitoso.",
    },
    {
      type: 7,
      difference:
        "Ambos son enérgicos, optimistas y hacen muchas cosas. El 7 busca variedad y evita el dolor y las restricciones, y suele disgregar sus metas; el 3 se concentra en un objetivo que le dé reconocimiento y sostiene un esfuerzo largo. El 7 se mueve por interés y novedad; el 3, por logro e imagen.",
    },
    {
      type: 8,
      difference:
        "Ambos pueden verse como líderes fuertes y orientados a resultados. El 8 se afirma desde el poder y la protección, y le importa poco cómo lo ven; el 3 ajusta su conducta a la audiencia y se preocupa por su imagen. El 8 confronta de manera directa; el 3 suele negociar, persuadir o seducir con eficiencia.",
    },
  ],
  selfObservationQuestions: [
    "¿Qué siento cuando nadie está mirando mi rendimiento?",
    "¿En qué situaciones cambio mi forma de hablar o de ser según quién esté presente?",
    "¿Qué dejo de lado cuando me concentro en una meta?",
    "¿Qué haría si supiera que no tengo que demostrar nada a nadie?",
    "¿Cuándo fue la última vez que me permití parar sin tener algo logrado?",
  ],
  everydayExamples: [
    "Al preguntarle cómo se siente después de un día duro, responde con lo que consiguió ese día.",
    "Revisa su perfil profesional con frecuencia y actualiza logros nuevos antes de que pase una semana.",
    "Tras alcanzar una promoción, se descubre pensando en la siguiente en lugar de disfrutar la actual.",
    "Corrige a un colaborador en público para que el resultado salga bien frente a un cliente y se da cuenta después de que no cuidó la relación.",
    "En una cena familiar, mira el teléfono para responder correos porque sentarse sin hacer nada le incomoda.",
  ],
  developmentPractices: [
    "Una vez al día, escribe una frase sobre cómo te sientes que no tenga relación con tus resultados.",
    "Reserva un bloque semanal sin metas ni productividad y observa la incomodidad que aparece.",
    "Comparte una duda o un error real con alguien de confianza y registra qué ocurre.",
    "Antes de aceptar un nuevo objetivo, pregunta si lo quieres tú o si te gustaría que te lo reconocieran.",
    "Pide una opinión sincera a alguien que te conozca sobre cómo te ven cuando no estás rindiendo.",
  ],
  authorDifferences:
    "Ichazo ubica la vanidad como fijación del tipo 3 y Naranjo la amplía como pasión; la distinción entre ambas es menos nítida que en otros tipos, y algunos autores prefieren hablar de engaño o autoengaño. Riso y Hudson subrayan la identificación con el rol y el valor ligado al rendimiento; Palmer, la adaptación a lo que el entorno admira. La virtud suele traducirse como veracidad o autenticidad según el autor. Es un modelo interpretativo con evidencia científica limitada (Hook et al., 2021).",
  sources: ["ichazo-1982", "naranjo-1990", "naranjo-1994", "riso-hudson-1999", "palmer-1988", "hook-2021"],
  status: "draft",
};
