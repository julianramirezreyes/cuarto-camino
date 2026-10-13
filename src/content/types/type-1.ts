import type { TypeProfile } from "../schema";

export const type1: TypeProfile = {
  type: 1,
  name: "Reformador",
  summary:
    "En este modelo interpretativo, el tipo 1 describe una forma de atención muy sintonizada con lo correcto y lo mejorable: percibe con rapidez la distancia entre cómo son las cosas y cómo podrían ser, y siente la responsabilidad personal de cerrarla.",
  coreMotivation:
    "Hacer las cosas bien y vivir con integridad, de modo que nada de lo que uno haga pueda ser señalado como un error o una falta.",
  basicDesire: "Ser una persona íntegra, equilibrada y con razón moral.",
  basicFear: "Ser defectuoso, corrupto o moralmente reprochable.",
  psychologicalNeed:
    "Sentir que su valor no depende de rendir sin fallas, y poder aceptar que lo imperfecto también merece cuidado.",
  passion: {
    text: "Ira: una irritación sostenida y mayormente contenida ante lo que no está a la altura, dirigida hacia afuera y, sobre todo, hacia uno mismo.",
    attribution: "naranjo",
    sources: ["naranjo-1990", "ichazo-1982"],
  },
  fixation: {
    text: "Resentimiento: una evaluación constante de lo que falta o está mal, con una queja interna que rara vez se expresa de forma directa. Ichazo y Naranjo coinciden en el nombre; los matices de su lectura varían.",
    attribution: "ichazo",
    sources: ["ichazo-1982", "naranjo-1990"],
  },
  virtue: {
    text: "Serenidad: la posibilidad de actuar sin la tensión de corregir, aceptando lo que es mientras se sigue cuidando lo que importa.",
    attribution: "naranjo",
    sources: ["naranjo-1990"],
  },
  selfImage:
    "Se ve como alguien responsable, honesto y esforzado, que intenta hacer lo correcto incluso cuando nadie lo mira, y que carga con más trabajo del que le toca porque otros no se ocupan.",
  defenseMechanisms: [
    {
      text: "Formación reactiva: en la tradición de Naranjo, el impulso de enojo o de placer espontáneo se transforma en su opuesto, como un exceso de corrección, contención o amabilidad formal.",
      attribution: "naranjo",
      sources: ["naranjo-1994"],
    },
    {
      text: "Riso y Hudson también mencionan la formación reactiva para este tipo. Cada escuela usa los conceptos psicoanalíticos de manera libre, y no existe una lista única aceptada por todas.",
      attribution: "riso-hudson",
      sources: ["riso-hudson-1996"],
    },
  ],
  strengths: [
    "Fiabilidad: cumple lo que promete y deja los asuntos cerrados con cuidado.",
    "Ojo atento al detalle y a la calidad, útil en tareas donde un error cuesta caro.",
    "Compromiso ético sostenido; suele decir lo que piensa que es justo aunque sea incómodo.",
    "Capacidad de organizar procesos y ponerles estándares claros.",
    "Disciplina para mejorar de a poco un oficio, un hábito o un sistema.",
  ],
  limitations: [
    "Puede tratar sus propias normas como si fueran verdades universales y juzgar con dureza a quien piensa distinto.",
    "Tiende a postergar el descanso o el disfrute hasta que todo esté en orden, lo que rara vez ocurre.",
    "La autocrítica constante agota y, a veces, reduce la creatividad y la espontaneidad.",
    "Le cuesta delegar porque teme que otros no cumplan el estándar.",
    "El enojo, al no tener un cauce directo, puede salir como rigidez, sarcasmo o frialdad.",
  ],
  habitualBehaviors: [
    "Revisa un trabajo varias veces antes de entregarlo, aunque ya esté bien.",
    "Hace listas y rutinas para no depender de la improvisación.",
    "Corrige en voz baja, o mentalmente, errores de ortografía, de método o de conducta ajenos.",
    "Se pone a ordenar o arreglar algo cuando está tenso.",
    "Cumple los horarios y espera que los demás también lo hagan.",
  ],
  recurringThoughts: [
    "Esto podría estar mejor hecho.",
    "Si yo no lo hago bien, nadie lo hará.",
    "No debería sentir esto, ni mucho menos mostrarlo.",
    "Primero la obligación, después el gusto.",
    "Hay una manera correcta de hacerlo y no la estamos siguiendo.",
  ],
  emotionalResponses: [
    "Irritación contenida cuando algo se hace con descuido, que se nota en la mandíbula, la voz o el silencio.",
    "Culpa rápida después de haber hecho algo que considera impulsivo o injusto.",
    "Alivio tenso al terminar una tarea, que se disuelve en cuanto aparece la siguiente falla posible.",
    "Resentimiento hacia quienes parecen disfrutar sin cargar con responsabilidades.",
    "Vergüenza discreta cuando recibe una corrección pública.",
  ],
  inRelationships:
    "Suele ser un compañero leal que cuida los acuerdos y lo cotidiano. La dificultad aparece cuando las expectativas quedan sin decirse: puede sentirse el único que se esfuerza y expresar la queja como corrección o como silencio, en lugar de como un deseo claro. Para quienes lo rodean, la crítica constante puede sentirse como falta de aceptación, aunque su intención sea ayudar.",
  atWork:
    "Se destaca en puestos donde importan la precisión, la ética y el cumplimiento de procesos: auditoría, derecho, calidad, edición, docencia, administración pública. Se frustra con ambientes improvisados, con jefes que cambian las reglas y con colegas que reducen la exigencia sin explicarlo.",
  inLeadership:
    "Lidera con el ejemplo y con estándares claros. Su aporte es la coherencia entre lo que dice y lo que hace. El riesgo es el microcontrol y la dificultad para reconocer los logros: el equipo escucha con claridad lo que falta y poco lo que ya está bien.",
  inConflict:
    "Procura mantener la compostura y argumentar con razones. Puede mostrar un enojo frío más que explosivo. Si el conflicto toca sus valores, tiende a convertirlo en un asunto de principios y le resulta difícil ceder sin sentir que traiciona algo importante.",
  underPressure:
    "Aumenta la rigidez, la autoexigencia y el control del detalle. Las reglas se vuelven más estrictas y el humor tiende a desaparecer. En el modelo de flechas, el estrés se asocia con movimientos hacia rasgos del tipo 4; es una lectura interpretativa que no todas las escuelas comparten.",
  constructivePatterns:
    "Cuando se siente más tranquilo, puede mantener altos estándares sin hacer del error una amenaza: distingue lo importante de lo accesorio, admite lo gris, se permite jugar y escucha críticas sin leerlas como un juicio sobre su persona.",
  lookAlikes: [
    {
      type: 3,
      difference:
        "Ambos trabajan mucho y cuidan la imagen, pero el 1 se mide contra un criterio interno de lo correcto y puede estar orgulloso de un trabajo impecable que nadie vio; el 3 se orienta a lo que resulta eficaz y reconocido, y ajusta el método con flexibilidad si así llega antes a la meta. El 1 pregunta si algo está bien; el 3, si funciona y se valora.",
    },
    {
      type: 6,
      difference:
        "Los dos cumplen normas y desconfían de la improvisación. El 1 lo hace porque tiene una vara interna que considera obligatoria y se juzga a sí mismo contra ella; el 6 busca seguridad, duda de la autoridad y oscila entre obedecer y cuestionar. El 1 rara vez duda de lo que sabe que es correcto; el 6 duda con frecuencia, incluso de su propio criterio.",
    },
    {
      type: 5,
      difference:
        "Ambos pueden parecer reservados y analíticos. El 5 se retira para conservar energía y comprender, y suele ser indiferente a las normas sociales; el 1 se queda en el mundo para corregirlo y le importa mucho el deber ser. La contención del 1 está atravesada por la irritación y la responsabilidad; la del 5 por el distanciamiento.",
    },
  ],
  selfObservationQuestions: [
    "¿Qué pasa en mi cuerpo cuando alguien hace algo de una forma que yo considero incorrecta?",
    "¿Qué reglas me impongo que nadie más me pidió?",
    "¿Cuándo fue la última vez que dejé algo en estado suficientemente bueno y qué sentí?",
    "¿Qué enojo estoy guardando que quizá merece ser dicho de forma directa y tranquila?",
    "¿Quién en mi vida podría decirme algo que no quiero oír, y cómo reacciono?",
  ],
  everydayExamples: [
    "Antes de salir a un paseo, vuelve a ordenar la cocina aunque llegue tarde, porque dejarla así le genera incomodidad.",
    "En una reunión, nota que el acta tiene un dato incorrecto y siente la necesidad de corregirlo, aunque el tema sea menor.",
    "Un domingo planeaba descansar, pero termina haciendo trámites pendientes porque descansar con pendientes le parece indebido.",
    "Se molesta cuando un compañero llega tarde, no dice nada, y días después responde con un comentario seco.",
    "Recibe un elogio y piensa de inmediato en el detalle que podría haber salido mejor.",
  ],
  developmentPractices: [
    "Anota durante una semana las veces que aparece la frase interna debería y observa, sin cambiar nada, a qué se refiere.",
    "Elige una tarea de bajo riesgo y entrégala en un estado suficientemente bueno; después registra qué ocurrió realmente.",
    "Programa un rato de ocio sin utilidad, como caminar sin destino, y nota qué voces aparecen.",
    "Cuando sientas irritación, ponle nombre en una frase simple (me molesta que esto no se haya hecho así) antes de decidir si actúas.",
    "Pide a alguien de confianza que te diga una cosa que hiciste bien sin añadir un pero, y practica recibirla.",
  ],
  authorDifferences:
    "Ichazo y Naranjo nombran ira (pasión) y resentimiento (fijación), aunque Naranjo desarrolla más la dimensión psicodinámica de la ira reprimida. Riso y Hudson enfatizan la figura del perfeccionista y los niveles de desarrollo; Palmer, la voz crítica interna. Las listas de mecanismos de defensa y las direcciones de las flechas varían entre escuelas. Todo esto es un modelo interpretativo con evidencia científica limitada (Hook et al., 2021).",
  sources: ["ichazo-1982", "naranjo-1990", "naranjo-1994", "riso-hudson-1999", "palmer-1988", "hook-2021"],
  status: "draft",
};
