import type { RelationshipLenses } from "../schema";

/**
 * Structural lenses for reading two people through the traditional grouping systems.
 * Editorial stance: tendencies, never verdicts; valid for any kind of relationship
 * (friendship, partner, family, work). The groupings are traditional interpretive frameworks.
 * `different` keys are exactly what `groupPairKey` produces (groups ordered as in their system).
 */
export const RELATIONSHIP_LENSES: RelationshipLenses = {
  shared: {
    centers: {
      instinctive:
        "Dos personas del centro instintivo suelen reconocerse en la forma directa de sentir lo que está en juego: el cuerpo avisa antes que las palabras. También pueden compartir un punto ciego: dar por hecho que el otro percibe lo mismo y dejar sin decir lo que ambos creen evidente.",
      emotional:
        "Dos personas del centro emocional pueden reconocerse en la sensibilidad a cómo se ven y cómo son vistas por los demás. Un punto ciego posible es que ambas lean el vínculo sobre todo por el tono afectivo y pasen por alto lo concreto que tampoco se está hablando.",
      mental:
        "Dos personas del centro mental pueden reconocerse en la necesidad de entender, anticipar y tener claro el panorama antes de actuar. Un punto ciego posible es que ambas analicen mucho y lo que sienten quede sin nombrarse, o que la conversación se quede en las ideas.",
    },
    hornevian: {
      assertive:
        "Dos personas del estilo asertivo pueden reconocerse en la iniciativa y en ir por lo que quieren sin esperar permiso. Un punto ciego posible es que ambas empujen a la vez, y que la necesidad de ceder o de pedir ayuda quede fuera de la conversación.",
      compliant:
        "Dos personas del estilo complaciente pueden reconocerse en el sentido del deber y en el cuidado por cumplir con lo que otros esperan. Un punto ciego posible es que ambas se adapten tanto que nadie diga abiertamente lo que quiere, y que el resentimiento crezca en silencio.",
      withdrawn:
        "Dos personas del estilo retraído pueden reconocerse en la necesidad de espacio propio y en procesar las cosas por dentro antes de compartirlas. Un punto ciego posible es que ambas den tanto espacio que el contacto se espace sin que ninguna lo note.",
    },
    harmonic: {
      competency:
        "Dos personas del grupo de competencia pueden reconocerse en resolver los problemas con objetividad, orden y eficacia. Un punto ciego posible es que ambas dejen las emociones en segundo plano, y que lo que sienten quede sin atender mientras la tarea avanza.",
      positiveOutlook:
        "Dos personas del grupo de perspectiva positiva pueden reconocerse en buscar el lado favorable y en mantener ligera la convivencia. Un punto ciego posible es que ambas eviten los temas pesados y que lo difícil se aplace más de lo conveniente.",
      reactive:
        "Dos personas del grupo reactivo pueden reconocerse en responder con intensidad y de forma muy genuina ante lo que ocurre. Un punto ciego posible es que ambas se contagien la intensidad, y que un desacuerdo escale antes de que alguien baje el ritmo.",
    },
  },
  different: {
    centers: {
      "instinctive|emotional":
        "Una persona tiende a procesar desde el cuerpo y la acción, y la otra desde lo que siente y cómo se relaciona. Cada una puede valorar en la otra lo que le cuesta: firmeza y presencia por un lado, calidez y sensibilidad por el otro. Un malentendido posible es leer la calma de una como frialdad; una forma de tender el puente es decir en voz alta qué se necesita en ese momento.",
      "instinctive|mental":
        "Una persona tiende a responder desde el cuerpo y el instinto, y la otra desde el análisis y la anticipación. Cada una puede valorar la capacidad de la otra: acción decidida y claridad de pensamiento. Un malentendido posible es que una vea lentitud donde la otra ve prudencia; una forma de tender el puente es acordar cuánto tiempo hay para pensar antes de decidir.",
      "emotional|mental":
        "Una persona tiende a procesar lo que ocurre mediante lo que siente y la otra mediante lo que piensa. Pueden valorar mutuamente la empatía y la perspectiva ordenada. Un malentendido posible es tomar la reflexión de una como falta de interés, o la emoción de la otra como falta de razón; ayuda preguntar qué espera el otro: ser escuchado o resolver.",
    },
    hornevian: {
      "assertive|compliant":
        "Una persona tiende a actuar afirmando lo que quiere, y la otra a ajustarse a lo que se espera en cada situación. Pueden valorar la iniciativa de una y la atención a los demás de la otra. Un malentendido posible es que el empuje se tome como presión, o la adaptación como falta de opinión; una forma de tender el puente es invitar de manera explícita a decir qué se prefiere.",
      "assertive|withdrawn":
        "Una persona tiende a ir hacia las cosas y la otra a tomar distancia para reflexionar. Pueden valorar la energía de una y la profundidad serena de la otra. Un malentendido posible es leer el retiro como desinterés, o el avance como invasión; una forma de tender el puente es pactar un momento para volver a hablar, en lugar de forzar o esperar indefinidamente.",
      "compliant|withdrawn":
        "Una persona tiende a acercarse cumpliendo y cuidando, y la otra a resguardarse en su mundo interior. Pueden valorar la constancia de una y el espacio que da la otra. Un malentendido posible es que una espere reciprocidad que la otra no sabe que se le pide; una forma de tender el puente es nombrar de manera sencilla lo que cada una necesita.",
    },
    harmonic: {
      "competency|positiveOutlook":
        "Una persona tiende a abordar los problemas con método y objetividad, y la otra con optimismo y buscando alternativas agradables. Pueden valorar la fiabilidad de una y el ánimo de la otra. Un malentendido posible es que el rigor parezca pesimismo, o el optimismo parezca ligereza; una forma de tender el puente es separar un rato para los hechos y otro para las posibilidades.",
      "competency|reactive":
        "Una persona tiende a manejar los problemas con distancia y orden, y la otra con una respuesta emocional intensa y directa. Pueden valorar la serenidad de una y la autenticidad de la otra. Un malentendido posible es que la calma se lea como indiferencia y la intensidad como descontrol; una forma de tender el puente es acordar una pausa breve y retomar el tema después.",
      "positiveOutlook|reactive":
        "Una persona tiende a suavizar los problemas buscando el lado favorable, y la otra a reaccionar con intensidad ante estos. Pueden valorar la ligereza de una y la franqueza de la otra. Un malentendido posible es que el optimismo parezca no tomar en serio lo que importa; una forma de tender el puente es reconocer primero lo que preocupa y recién después buscar salidas.",
    },
  },
  arrows: {
    integration:
      "En la tradición, cada tipo se mueve hacia otro cuando crece; si el tipo de la otra persona es ese, podría reconocerse en esa persona cualidades hacia las que uno mismo se encamina. Es una lectura de una tradición con poco respaldo empírico, y no permite predecir cómo se comportará nadie.",
    stress:
      "En la tradición, cada tipo toma rasgos de otro bajo presión; si el tipo de la otra persona es ese, podría resultar conocida su manera de reaccionar en momentos difíciles. Es una lectura de una tradición con poco respaldo empírico, y no permite anticipar conducta alguna.",
  },
  adjacent:
    "Entre tipos vecinos en el círculo se plantea que pueden compartir algunos rasgos, como en la idea tradicional de las alas. Esta idea tiene respaldo empírico limitado: úsala como pista para conversar sobre lo que se parece y lo que no, no como explicación de la relación.",
  sameType:
    "Dos personas del mismo tipo suelen reconocerse con rapidez en motivaciones y miedos de fondo, lo que puede dar mucha comprensión mutua. También pueden compartir los mismos puntos ciegos y reforzarlos sin querer; la salud personal, la historia y los instintos de cada una marcan diferencias importantes.",
  disclaimers: [
    "Esto es un marco interpretativo, no una medición ni una prueba.",
    "La propia tradición del Eneagrama afirma que ninguna combinación de tipos es buena ni mala de antemano.",
    "No encontramos estudios verificables que muestren que la combinación de tipos prediga la satisfacción: en una investigación con parejas (Carpenter, 2015), la satisfacción no difirió según el tipo.",
    "La salud emocional, el apego, la comunicación y la historia de cada persona pesan mucho más que el tipo.",
    "Los esquemas populares de afinidad se contradicen entre sí; por eso esta herramienta no hace un ranking ni puntúa parejas.",
    "Úsalo para abrir una conversación, no para decidir si empezar o terminar una relación. Ante una situación que te preocupe, busca apoyo humano de confianza o profesional.",
  ],
  status: "draft",
};
