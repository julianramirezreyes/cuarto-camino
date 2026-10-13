import type { TypeProfile } from "../schema";

export const type5: TypeProfile = {
  type: 5,
  name: "Investigador",
  summary:
    "En este modelo interpretativo, el tipo 5 describe una atención orientada a comprender: observa desde cierta distancia, conserva su energía y su espacio privado, y se siente más seguro cuando sabe lo suficiente antes de implicarse.",
  coreMotivation:
    "Comprender el mundo y mantenerse competente, protegiendo su energía, su tiempo y su intimidad de las demandas ajenas.",
  basicDesire: "Ser capaz y competente, sabiendo lo suficiente para no verse desbordado.",
  basicFear: "Ser inútil, incapaz o abrumado por las demandas del entorno.",
  psychologicalNeed:
    "Experimentar que puede participar en el mundo y en las relaciones sin agotarse, y que sus recursos no son tan escasos como teme.",
  passion: {
    text: "Avaricia: una tendencia a retener tiempo, energía, afecto y conocimiento, por temor a que se agoten si se comparten o se entregan.",
    attribution: "naranjo",
    sources: ["naranjo-1990", "ichazo-1982"],
  },
  fixation: {
    text: "Avaricia (tacañería, en la tradición de Ichazo): una economía interna de escasez, donde se acumula comprensión o privacidad para evitar la dependencia. En este tipo pasión y fijación comparten nombre, y distintas escuelas las distinguen con matices.",
    attribution: "ichazo",
    sources: ["ichazo-1982", "naranjo-1990"],
  },
  virtue: {
    text: "Desapego (no-apego): poder participar y entregarse sin aferrarse ni temer quedarse vacío, confiando en que los recursos propios son suficientes.",
    attribution: "naranjo",
    sources: ["naranjo-1990"],
  },
  selfImage:
    "Se ve como alguien perceptivo, independiente y reflexivo, que no necesita mucho de los demás y que prefiere observar y entender antes que dejarse arrastrar por lo emocional o lo social.",
  defenseMechanisms: [
    {
      text: "Aislamiento: en la tradición de Naranjo, el pensamiento se separa del afecto y la emoción se mantiene lejos de la acción, de modo que el sentimiento se vive en privado o diferido.",
      attribution: "naranjo",
      sources: ["naranjo-1994"],
    },
    {
      text: "Riso y Hudson también describen el aislamiento para este tipo, con énfasis en separar ámbitos de la vida. Es una interpretación; otras escuelas utilizan términos distintos como compartimentación o desapego defensivo.",
      attribution: "riso-hudson",
      sources: ["riso-hudson-1996"],
    },
  ],
  strengths: [
    "Capacidad de concentrarse con profundidad en temas complejos durante periodos largos.",
    "Pensamiento independiente, poco influido por modas o presiones sociales.",
    "Calma y objetividad en situaciones tensas.",
    "Habilidad para sintetizar información y ver patrones de fondo.",
    "Discreción y respeto por el espacio de los demás.",
  ],
  limitations: [
    "Puede preparar tanto que posterga la acción o la participación.",
    "Tiende a minimizar sus necesidades de contacto y de afecto, incluso ante sí mismo.",
    "Su reserva puede interpretarse como frialdad o desinterés.",
    "Se agota con demandas emocionales o sociales prolongadas y se retira sin explicar.",
    "Puede mantener sus sentimientos fuera de la conversación hasta que ya es tarde para expresarlos.",
  ],
  habitualBehaviors: [
    "Se informa a fondo antes de opinar o decidir.",
    "Calcula cuánta energía le costará una reunión o evento antes de aceptar.",
    "Se reserva tiempos y espacios inviolables de soledad.",
    "Responde mensajes con demora y de forma breve.",
    "Comparte lo que sabe con quien le interesa, pero suele evitar hablar de sí mismo.",
  ],
  recurringThoughts: [
    "Necesito entender esto antes de involucrarme.",
    "No tengo energía para esto.",
    "Me llevaría demasiado tiempo explicarlo, mejor lo hago solo.",
    "Si dependo de alguien, me va a pedir más de lo que puedo dar.",
    "Después lo siento, ahora lo pienso.",
  ],
  emotionalResponses: [
    "Calma observadora que a veces oculta una emoción intensa que se procesa en privado.",
    "Sensación de invasión cuando recibe demandas de tiempo o de atención no anunciadas.",
    "Alivio y energía al estar solo después de una jornada social.",
    "Cierta torpeza o rigidez al expresar afecto en el momento.",
    "Inquietud silenciosa ante la posibilidad de quedar expuesto sin preparación.",
  ],
  inRelationships:
    "Es un compañero fiel, curioso y respetuoso del espacio. Muestra cariño con atención, información o ayuda práctica más que con palabras. La dificultad es la distancia: el otro puede sentir que no es prioritario. Los vínculos se sostienen mejor cuando se acuerdan ritmos de contacto y se explica la necesidad de soledad como cuidado propio y no como rechazo.",
  atWork:
    "Se destaca en investigación, análisis, programación, ingeniería, escritura técnica, estrategia y cualquier función que requiera pensamiento profundo. Prefiere autonomía y claridad de tareas. Le cuestan las reuniones interminables, la política interna y los cambios impuestos sin razones.",
  inLeadership:
    "Lidera con conocimiento, criterios claros y confianza en la autonomía del equipo. Su desafío es comunicar, dar contexto, hacerse presente y reconocer el aporte de otros. Puede parecer ausente cuando se concentra y delegar sin retroalimentación suficiente.",
  inConflict:
    "Se retrae, toma distancia y procura tratar el tema con calma y argumentos. Evita la confrontación emocional y puede dejar de responder para recuperar su energía. Si se siente invadido, puede cerrarse del todo. Gana cuando pide tiempo y vuelve después con una respuesta.",
  underPressure:
    "Se acentúa el retiro, la acumulación de información y el hermetismo. En algunas lecturas del modelo, bajo estrés se describen rasgos del tipo 7: dispersión, impulsividad o actividad frenética para escapar de la presión. Es una interpretación, no una regla universal.",
  constructivePatterns:
    "Cuando se siente seguro, comparte lo que sabe, se involucra con presencia y reconoce que su energía se renueva en el contacto tanto como en la soledad. Su claridad se pone al servicio de otros sin dejar de respetar sus límites.",
  lookAlikes: [
    {
      type: 4,
      difference:
        "Ambos se retiran y son introspectivos. El 5 lo hace para conservar recursos y pensar, y tiende a separar el pensamiento del sentimiento; el 4 se retira para sentir y ser comprendido, y la emoción ocupa el centro. El 5 minimiza lo que necesita; el 4 anhela intensamente lo que cree que falta.",
    },
    {
      type: 1,
      difference:
        "Ambos pueden parecer reservados, rigurosos y exigentes. El 1 se queda en el mundo para mejorarlo y se mide con un deber ser; el 5 se distancia del mundo para comprenderlo y prefiere no intervenir. La contención del 1 incluye irritación y responsabilidad; la del 5, retiro y economía de energía.",
    },
    {
      type: 9,
      difference:
        "Los dos pueden resultar tranquilos y poco demandantes. El 9 se funde con el ambiente para evitar tensión y suele perder de vista sus prioridades; el 5 mantiene separada una vida interior activa y toma distancia de forma consciente. El 9 se adapta; el 5 se reserva.",
    },
  ],
  selfObservationQuestions: [
    "¿Cuándo digo que no tengo energía y cuándo en realidad tengo miedo a exponerme?",
    "¿Qué siento en el cuerpo cuando alguien me pide más tiempo del que había previsto dar?",
    "¿Qué momentos de contacto recientes me dieron energía en lugar de quitármela?",
    "¿Qué información espero tener antes de actuar y cuánto es suficiente?",
    "¿A quién le debo una conversación que he postergado por no saber cómo empezarla?",
  ],
  everydayExamples: [
    "Le proponen una salida espontánea y, antes de decir sí, calcula mentalmente cuántas horas de soledad necesitará después.",
    "Lee tres libros sobre un tema antes de dar su opinión en una reunión donde otros hablan sin preparación.",
    "Cuando un amigo atraviesa un momento difícil, le manda un artículo útil en lugar de llamarlo.",
    "Tarda días en responder un mensaje afectuoso porque quiere redactarlo bien y se le pasa la oportunidad.",
    "Al sentir tristeza en medio de una conversación, la anota para pensarla más tarde.",
  ],
  developmentPractices: [
    "Cuando surja la excusa de no tener energía, pregúntate si es agotamiento real o anticipación, y observa la diferencia.",
    "Comparte una emoción en el momento en que aparece, en una frase corta, con alguien de confianza.",
    "Prueba actuar con 70 % de preparación en un asunto de bajo riesgo y registra lo que ocurre.",
    "Acuerda con tu entorno señales claras de cuándo necesitas espacio y cuándo vuelves.",
    "Registra tras cada encuentro social qué te dio y qué te costó, para ajustar con datos y no con suposiciones.",
  ],
  authorDifferences:
    "En este tipo pasión y fijación llevan el mismo nombre, avaricia, y las escuelas distinguen la primera como retención afectiva y la segunda como acumulación de recursos o saber. Naranjo desarrolla la idea de privación afectiva temprana, aunque otros autores no comparten esa explicación causal. Riso y Hudson hablan de la necesidad de comprender y del miedo a la invasión; Palmer, de la retención de recursos. Es un modelo interpretativo con evidencia científica limitada (Hook et al., 2021).",
  sources: ["ichazo-1982", "naranjo-1990", "naranjo-1994", "riso-hudson-1999", "palmer-1988", "hook-2021"],
  status: "draft",
};
