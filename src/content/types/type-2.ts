import type { TypeProfile } from "../schema";

export const type2: TypeProfile = {
  type: 2,
  name: "Ayudador",
  summary:
    "En este modelo interpretativo, el tipo 2 describe una atención orientada hacia las necesidades de los demás: capta con rapidez qué le hace falta al otro y organiza su valor personal alrededor de ser necesitado y querido.",
  coreMotivation:
    "Ser querido y sentirse indispensable en la vida de las personas importantes, ganándose ese lugar a través del cuidado.",
  basicDesire: "Sentirse amado y bienvenido.",
  basicFear: "Ser no querido, prescindible o amado solo por lo que da.",
  psychologicalNeed:
    "Reconocer y expresar sus propias necesidades sin sentir que eso pone en riesgo el vínculo, y recibir sin cuentas pendientes.",
  passion: {
    text: "Orgullo: una autoimagen inflada de ser quien sabe lo que el otro necesita y quien da sin necesitar, que a la vez esconde una necesidad intensa de afecto.",
    attribution: "naranjo",
    sources: ["naranjo-1990", "ichazo-1982"],
  },
  fixation: {
    text: "Adulación (halago): la tendencia a ganar cercanía resaltando lo mejor del otro y adaptándose a lo que se espera de uno. Ichazo la nombra así; Naranjo la lee como una seducción afectiva.",
    attribution: "ichazo",
    sources: ["ichazo-1982", "naranjo-1990"],
  },
  virtue: {
    text: "Humildad: poder ocupar un lugar sin inflarlo ni disminuirlo, reconociendo la propia necesidad como algo humano y no como una carga.",
    attribution: "naranjo",
    sources: ["naranjo-1990"],
  },
  selfImage:
    "Se ve como una persona generosa, cálida y atenta, que está para los demás, que no pide demasiado y que conoce a los suyos mejor que ellos mismos.",
  defenseMechanisms: [
    {
      text: "Represión: en la tradición de Naranjo, las propias necesidades y los impulsos de dependencia o de enojo se mantienen fuera de la conciencia, y el afecto se canaliza en forma de servicio.",
      attribution: "naranjo",
      sources: ["naranjo-1994"],
    },
    {
      text: "Riso y Hudson también asocian la represión a este tipo, enfocándola en las propias necesidades. Es una lectura interpretativa; otras escuelas proponen conceptos distintos, como la disociación del sí mismo.",
      attribution: "riso-hudson",
      sources: ["riso-hudson-1996"],
    },
  ],
  strengths: [
    "Empatía práctica: nota el cansancio, la tristeza o la alegría del otro antes de que se diga.",
    "Calidez que hace que la gente se sienta recibida.",
    "Generosidad concreta de tiempo, atención y recursos.",
    "Habilidad para tejer redes de apoyo y reunir a las personas.",
    "Capacidad para animar a otros a creer en sus propias posibilidades.",
  ],
  limitations: [
    "Puede dar con la expectativa tácita de ser correspondido y resentirse si no ocurre.",
    "Dificultad para identificar y pedir lo que necesita, incluso a quienes quiere.",
    "Tiende a invadir con consejos o ayudas que nadie solicitó.",
    "Se ajusta tanto a lo que el otro espera que pierde contacto con su propio criterio.",
    "Puede agotarse físicamente por no poner límites.",
  ],
  habitualBehaviors: [
    "Recuerda cumpleaños, gustos y problemas de los demás y los menciona con naturalidad.",
    "Responde de inmediato a quien pide ayuda, incluso a costa de sus planes.",
    "Dice que sí y se arrepiente después.",
    "Prepara regalos, comida o gestos pequeños para ganar cercanía.",
    "Resta importancia a sus propios problemas cuando alguien le pregunta cómo está.",
  ],
  recurringThoughts: [
    "Si no ayudo yo, ¿quién lo va a hacer?",
    "No quiero molestar con lo que me pasa.",
    "Después de todo lo que he hecho por esta persona.",
    "Si soy útil, no me van a dejar.",
    "Yo no necesito nada, estoy bien.",
  ],
  emotionalResponses: [
    "Satisfacción cálida cuando alguien agradece o reconoce su ayuda.",
    "Herida y resentimiento silencioso cuando siente que su esfuerzo pasa inadvertido.",
    "Ansiedad al percibir distancia o frialdad en alguien cercano.",
    "Cansancio acumulado que se manifiesta como irritabilidad hacia las personas que más ayuda.",
    "Dificultad para notar tristeza propia mientras está ocupado con la de otros.",
  ],
  inRelationships:
    "Construye vínculos intensos basados en el cuidado y la disponibilidad. Puede ser una pareja o amistad muy presente. La tensión surge cuando el dar se vuelve una forma indirecta de pedir: el otro puede sentirse en deuda o controlado, y quien ayuda puede sentirse poco visto. Aprender a pedir de manera directa suele cambiar la calidad de la relación.",
  atWork:
    "Funciona bien en roles de cuidado, enseñanza, recursos humanos, atención al cliente, salud, trabajo comunitario y coordinación de equipos. Aporta clima y contención. Puede asumir tareas ajenas, tener dificultad para negociar su valor económico y sentirse subvalorado sin decirlo.",
  inLeadership:
    "Lidera siendo accesible, apoyando el desarrollo de las personas y recordando que detrás de las tareas hay seres humanos. El desafío es dar retroalimentación incómoda, sostener decisiones impopulares y evitar crear dependencia o favoritismos.",
  inConflict:
    "Tiende a evitar el choque directo y a buscar reconciliación pronto. Si se acumula la tensión, puede aparecer una reacción intensa y reprochante que sorprende a todos, incluso a él: la lista de cosas que dio sale a la superficie. Le cuesta aceptar que el desacuerdo no equivale a rechazo.",
  underPressure:
    "Aumenta la entrega, luego el agotamiento y después el reproche. Algunas lecturas del modelo describen, bajo estrés, un movimiento hacia rasgos del tipo 8: exigir con dureza lo que no se pidió con suavidad. Es una lectura interpretativa, no un patrón universal.",
  constructivePatterns:
    "En sus mejores momentos ayuda sin necesitar el reconocimiento, dice que no sin culpa excesiva, nombra lo que necesita y puede recibir cuidado. Su calidez se vuelve más libre y menos estratégica.",
  lookAlikes: [
    {
      type: 9,
      difference:
        "Ambos son afables y evitan el conflicto. El 2 se orienta activamente hacia el otro, nota lo que necesita y espera cercanía a cambio; el 9 se funde con el entorno para conservar la calma y suele minimizar sus propias prioridades sin tanto interés en ser necesitado. El 2 se mueve hacia las personas; el 9 tiende a quedarse quieto para no perturbar.",
    },
    {
      type: 3,
      difference:
        "Los dos cuidan su imagen y adaptan su conducta a quien tienen enfrente. El 3 lo hace para ser eficaz y admirado por sus logros; el 2 lo hace para ser querido por cuánto da. El 3 mide el valor en resultados visibles, el 2 en el vínculo con las personas. El 2 se hiere con el desamor; el 3, con el fracaso.",
    },
    {
      type: 6,
      difference:
        "Ambos son leales y se toman en serio los compromisos con otros. El 6 sirve desde el deber y la búsqueda de seguridad, y suele dudar de las intenciones ajenas; el 2 sirve desde el deseo de cercanía y tiende a confiar en que será querido si da lo suficiente. La inquietud del 6 es la duda; la del 2, el abandono emocional.",
    },
  ],
  selfObservationQuestions: [
    "¿Qué necesito yo en este momento, aparte de lo que el otro necesita de mí?",
    "¿Cuántas veces ayudé esta semana sin que me lo pidieran y qué esperaba recibir?",
    "¿Qué siento cuando alguien me ofrece ayuda a mí?",
    "¿Con quién me resulta más difícil decir que no, y qué temo que pasaría?",
    "¿Cuándo fue la última vez que hice algo solo por gusto propio, sin un destinatario?",
  ],
  everydayExamples: [
    "Una amiga cuenta que tiene un problema y le llega a medianoche un mensaje con tres posibles soluciones, aunque ella no pidió consejo.",
    "Prepara comida para todo el equipo cada viernes y se entristece en silencio cuando nadie lo menciona.",
    "Le preguntan cómo está y responde bien, y pregunta enseguida por el otro.",
    "Acepta cubrir un turno ajeno, cancela su cita médica y luego se siente cansado y poco valorado.",
    "Al recibir un regalo no sabe qué hacer con las manos y piensa de inmediato en cómo devolverlo.",
  ],
  developmentPractices: [
    "Antes de ofrecer ayuda, pregunta si la otra persona la quiere y de qué forma, y observa cómo cambia la conversación.",
    "Escribe cada día una necesidad propia, aunque sea pequeña, sin juzgarla.",
    "Practica decir una frase corta como déjame pensarlo antes de aceptar un pedido.",
    "Nota cuándo aparece un resentimiento y pregúntate qué esperabas recibir.",
    "Pide una ayuda concreta y modesta a alguien de confianza y observa lo que sientes al hacerlo.",
  ],
  authorDifferences:
    "Ichazo y Naranjo coinciden en orgullo como pasión y adulación como fijación, aunque Naranjo desarrolla la dinámica de la seducción afectiva y el subtipo contratipo. Riso y Hudson hablan del tipo en términos de necesidad de ser necesitado y de niveles de desarrollo; Palmer subraya la atención al otro y la dificultad para registrar el propio deseo. Algunas escuelas usan la etiqueta orgullo para describir la autoimagen de no necesitar nada, otras la ligan a la importancia de ser indispensable. Es un modelo interpretativo con evidencia científica limitada (Hook et al., 2021).",
  sources: ["ichazo-1982", "naranjo-1990", "naranjo-1994", "riso-hudson-1999", "palmer-1988", "hook-2021"],
  status: "draft",
};
