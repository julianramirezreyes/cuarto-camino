import type { LevelProfile } from "../schema";

type Body = Omit<LevelProfile, "type" | "level" | "sourceLevelName" | "disclaimer" | "sources" | "status">;

const DISCLAIMER =
  "Este perfil es un modelo interpretativo sin validación clínica. Describe tendencias posibles, no es un resultado de evaluación y no sustituye la mirada de un profesional.";

const lvl = (level: LevelProfile["level"], body: Body): LevelProfile => ({
  type: 1,
  level,
  sourceLevelName: null,
  ...body,
  disclaimer: DISCLAIMER,
  sources: ["riso-hudson-1999", "riso-hudson-1996", "hook-2021"],
  status: "draft",
});

const SUPPORT =
  "Si vivir así resulta doloroso o agotador, buscar apoyo profesional (psicología o psicoterapia) y acompañamiento de personas de confianza es una decisión valiosa; no implica que este sea tu caso.";

export const levels1: LevelProfile[] = [
  lvl(1, {
    editorialLabel: "Funcionamiento muy flexible y sereno",
    description:
      "El deseo de hacer las cosas bien se vive como orientación y no como exigencia. La persona acepta que la realidad es imperfecta y actúa con criterio, sin necesitar tener la razón para sentirse en paz.",
    characteristicExpressions: [
      "Actúa según sus valores sin convertirlos en sermones.",
      "Reconoce sus errores con naturalidad y los corrige sin dramatismo.",
      "Disfruta de lo bueno que ya existe antes de buscar lo que falta mejorar.",
    ],
    thinkingPatterns: [
      "Distingue lo importante de lo meramente correcto.",
      "Admite que existen varias formas válidas de hacer algo.",
      "Su voz interior es firme pero amable.",
    ],
    emotionalPatterns: [
      "La rabia aparece, se nombra y pasa sin acumularse.",
      "Hay una calma de fondo que no depende de que todo salga bien.",
      "Siente compasión hacia sí misma y hacia los demás.",
    ],
    inRelationships:
      "Ofrece honestidad con calidez; se puede discrepar con ella sin que la relación peligre.",
    inDecisions:
      "Decide con base en valores y hechos, tolera cierta incertidumbre y acepta una solución suficientemente buena.",
    availableStrengths: [
      "Integridad coherente y no rígida.",
      "Criterio claro con humildad.",
      "Capacidad de inspirar sin imponer.",
    ],
    possibleDifficulties: [
      "Puede costarle ver con claridad cuánto esfuerzo invierte en sostener su coherencia.",
      "En contextos muy cínicos puede sentirse fuera de lugar.",
      "Aun aquí aparecen días de cansancio e impaciencia, como en cualquiera.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 2, aquí la ética no necesita vigilancia interna: se vive sin esfuerzo y sin sensación de deber. En el nivel 2 todavía hay una voz que ordena y verifica, aunque amable.",
    examples: [
      "Se equivoca en una entrega, lo dice sin rodeos y propone cómo repararlo, sin castigarse.",
      "Ante una opinión opuesta, escucha con curiosidad genuina.",
      "Deja una tarea en un 90 % razonable porque ve que ya cumple su propósito.",
    ],
    reflectionQuestions: [
      "¿En qué momentos siento que hacer lo correcto me resulta ligero?",
      "¿Qué me ayuda a aceptar lo imperfecto sin renunciar a mis valores?",
      "¿Cómo trato a otros cuando no coinciden con mi manera de hacer las cosas?",
    ],
    growthOpportunities: [
      "Seguir cultivando el descanso y el juego como parte de una vida ética.",
      "Compartir su criterio como invitación, no como norma.",
      "Mantener vínculos con personas que piensan distinto para no perder flexibilidad.",
    ],
  }),
  lvl(2, {
    editorialLabel: "Funcionamiento integrado con conciencia ética",
    description:
      "Hay una voz interior que cuida la responsabilidad y la honestidad, y la persona sabe escucharla sin que se vuelva implacable. Busca mejorar las cosas con realismo, aceptando límites propios y ajenos.",
    characteristicExpressions: [
      "Cumple lo que promete y espera lo mismo de forma razonable.",
      "Señala lo que no funciona con propuestas concretas.",
      "Procura ser justa aunque no la vean.",
    ],
    thinkingPatterns: [
      "Evalúa con criterios claros, pero admite excepciones.",
      "Se pregunta qué sería lo más justo para todos.",
      "Acepta correcciones si son bien argumentadas.",
    ],
    emotionalPatterns: [
      "Siente indignación ante la injusticia y la canaliza hacia acciones útiles.",
      "Tiene tensión interna leve cuando algo queda a medias.",
      "Puede relajarse tras dar lo mejor de sí.",
    ],
    inRelationships:
      "Es confiable y directa; cuida los acuerdos y suele ser una presencia que da seguridad.",
    inDecisions:
      "Pondera principios y consecuencias; tarda lo justo y se revisa si recibe información nueva.",
    availableStrengths: [
      "Confiabilidad y sentido de responsabilidad.",
      "Capacidad de discernir con objetividad.",
      "Ética aplicada a la vida cotidiana.",
    ],
    possibleDifficulties: [
      "Cierta tendencia a cargar con más responsabilidad de la necesaria.",
      "Dificultad para delegar si ve que algo no se hará como espera.",
      "Puede sentir incomodidad al ver su propia flexibilidad cuando no coincide con su ideal.",
    ],
    differenceFromAdjacent:
      "Respecto al nivel 1, aquí el compromiso ético exige algo de esfuerzo y vigilancia, y aparece una tensión leve ante lo imperfecto. Respecto al nivel 3, aún no hay una necesidad marcada de que los demás se alineen con su criterio.",
    examples: [
      "Revisa un informe dos veces y lo entrega, aun sabiendo que podría pulirse más.",
      "Pide disculpas a un compañero por un comentario duro y explica su punto con calma.",
      "Rechaza un atajo que beneficiaría a su equipo pero perjudicaría a terceros, y explica por qué.",
    ],
    reflectionQuestions: [
      "¿Qué parte de mi exigencia me ayuda y cuál me pesa?",
      "¿Cuándo me permito decir «así está bien»?",
      "¿Qué tareas podría compartir sin sentir que pierdo calidad?",
    ],
    growthOpportunities: [
      "Practicar la delegación en asuntos de bajo riesgo.",
      "Agendar espacios sin metas ni mejoras.",
      "Observar cuándo su indignación sirve para actuar y cuándo solo desgasta.",
    ],
  }),
  lvl(3, {
    editorialLabel: "Funcionamiento flexible con principios claros",
    description:
      "Los principios guían la vida con firmeza visible. La persona se compromete con causas y estándares, y empieza a notar el cansancio de sostenerlos, aunque todavía tolera bien la diferencia.",
    characteristicExpressions: [
      "Defiende con firmeza lo que considera correcto.",
      "Se organiza para cumplir con sus compromisos.",
      "Enseña con el ejemplo y ofrece orientación cuando se la piden.",
    ],
    thinkingPatterns: [
      "Piensa en términos de lo que «debería» ser, con matices.",
      "Compara lo real con lo ideal y busca puentes.",
      "Valora la claridad de reglas razonables.",
    ],
    emotionalPatterns: [
      "Aparece irritación contenida cuando se incumplen acuerdos.",
      "Busca expresar su enojo de manera educada.",
      "Siente satisfacción tranquila al cumplir.",
    ],
    inRelationships:
      "Es leal y exigente consigo; sus seres queridos perciben su fiabilidad y, a veces, su expectativa implícita de orden.",
    inDecisions:
      "Prefiere decidir apoyándose en normas y precedentes, y se toma un tiempo extra para comprobar que lo hace bien.",
    availableStrengths: [
      "Compromiso con la mejora de su entorno.",
      "Disciplina sostenida.",
      "Capacidad de educar y guiar con el ejemplo.",
    ],
    possibleDifficulties: [
      "Empieza a costarle disfrutar sin sentir que «debería» estar haciendo otra cosa.",
      "Puede juzgar con rapidez y luego matizar.",
      "La autoexigencia puede crecer sin que lo note.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 2, aquí el criterio se expresa con más insistencia y la persona espera que otros cumplan sus estándares, aunque con respeto. Frente al nivel 4, aún puede relajarse sin culpa y no convierte la corrección ajena en una misión.",
    examples: [
      "Organiza un voluntariado y revisa que todo cumpla las normas acordadas.",
      "Corrige un dato en una reunión con tono respetuoso, pero insiste en que quede registrado.",
      "Siente culpa si se toma una tarde libre sin haber terminado pendientes.",
    ],
    reflectionQuestions: [
      "¿Qué «debería» me repito con más frecuencia y de dónde viene?",
      "¿Cómo se sienten otros ante mis estándares?",
      "¿Qué placer me cuesta permitirme y por qué?",
    ],
    growthOpportunities: [
      "Sustituir un «debería» al día por un «prefiero» o «me gustaría».",
      "Pedir feedback sobre cómo se perciben sus expectativas.",
      "Incorporar actividades por puro disfrute, sin objetivo de mejora.",
    ],
  }),
  lvl(4, {
    editorialLabel: "Funcionamiento intermedio con idealismo exigente",
    description:
      "La brecha entre cómo son las cosas y cómo deberían ser empieza a generar inquietud constante. La persona se esfuerza por corregir y mejorar, y la voz crítica interior gana protagonismo.",
    characteristicExpressions: [
      "Detecta rápidamente lo que está mal y siente urgencia por arreglarlo.",
      "Se compromete con múltiples causas o mejoras a la vez.",
      "Adopta un tono didáctico para aclarar cómo se hacen bien las cosas.",
    ],
    thinkingPatterns: [
      "Divide las situaciones en correcto e incorrecto con poca zona gris.",
      "Piensa en lo que falta antes que en lo logrado.",
      "Anticipa errores y prepara respuestas para evitarlos.",
    ],
    emotionalPatterns: [
      "Inquietud y tensión corporal en reposo.",
      "Enojo que se procura disimular detrás de la corrección.",
      "Alivio breve al cumplir, seguido de nueva lista de pendientes.",
    ],
    inRelationships:
      "Se preocupa genuinamente por el bienestar de los demás, pero sus sugerencias de mejora pueden sentirse como críticas.",
    inDecisions:
      "Revisa varias veces antes de decidir y le cuesta cerrar sin sentir que pudo hacerlo mejor.",
    availableStrengths: [
      "Atención al detalle y a la calidad.",
      "Motivación para corregir injusticias concretas.",
      "Fuerte sentido del deber.",
    ],
    possibleDifficulties: [
      "Mayor dificultad para tolerar errores propios y ajenos.",
      "Menos espacio para el descanso y la espontaneidad.",
      "Las sugerencias bienintencionadas pueden percibirse como juicios.",
    ],
    differenceFromAdjacent:
      "Respecto al nivel 3, aquí la tensión por la diferencia entre real e ideal ya domina la atención y se vuelve más difícil disfrutar de lo logrado. Respecto al nivel 5, aún se siente la corrección como ayuda y no como derecho a dirigir a los demás.",
    examples: [
      "Reescribe tres veces un correo antes de enviarlo.",
      "Sugiere a su pareja una mejor forma de lavar los platos «para facilitar las cosas».",
      "Se queda trabajando tarde para ajustar un detalle que casi nadie notará.",
    ],
    reflectionQuestions: [
      "¿Qué siento en el cuerpo cuando algo queda imperfecto?",
      "¿Qué logros recientes he dejado pasar sin reconocer?",
      "¿Cómo reciben los demás mis sugerencias de mejora?",
    ],
    growthOpportunities: [
      "Nombrar un logro al final del día antes de pasar a lo pendiente.",
      "Preguntar antes de aconsejar: «¿quieres mi opinión o solo que te escuche?».",
      "Realizar a diario una actividad sin evaluación de resultado.",
    ],
  }),
  lvl(5, {
    editorialLabel: "Funcionamiento intermedio con autodisciplina rígida",
    description:
      "La disciplina pasa de ser herramienta a ser regla casi inamovible. La persona se organiza con precisión, se vuelve más reservada con sus emociones y empieza a ver a los demás con ojo evaluador.",
    characteristicExpressions: [
      "Sigue rutinas estrictas y se incomoda si se alteran.",
      "Explica con detalle cómo deberían hacerse las cosas.",
      "Contiene la espontaneidad para no «equivocarse».",
    ],
    thinkingPatterns: [
      "Hay una forma correcta y las demás son deficientes.",
      "Piensa en términos de reglas, plazos y procedimientos.",
      "Anticipa críticas y las responde antes de que ocurran.",
    ],
    emotionalPatterns: [
      "El enojo se transforma en frialdad o tensión en la mandíbula.",
      "El miedo a fallar se disfraza de control.",
      "Culpa o remordimiento cuando se permite algo placentero.",
    ],
    inRelationships:
      "Puede sentirse como alguien rígido o difícil de complacer; busca cercanía pero con reglas implícitas.",
    inDecisions:
      "Se aferra a procedimientos conocidos y evita improvisar; cambiar un plan genera resistencia visible.",
    availableStrengths: [
      "Organización minuciosa.",
      "Constancia a largo plazo.",
      "Capacidad de dar estructura a proyectos caóticos.",
    ],
    possibleDifficulties: [
      "Inflexibilidad ante los cambios de último momento.",
      "Sensación de carga permanente y poca alegría.",
      "Dificultad para mostrar vulnerabilidad.",
    ],
    differenceFromAdjacent:
      "Respecto al nivel 4, aquí la regla deja de ser ayuda y se vuelve norma que condiciona los vínculos y el ánimo. Respecto al nivel 6, la persona aún puede escuchar objeciones y no hace de la crítica su forma principal de relacionarse.",
    examples: [
      "Se incomoda visiblemente cuando una reunión empieza cinco minutos tarde.",
      "Mantiene la misma rutina de ejercicio aunque esté agotada, por «no fallarse».",
      "Corrige en voz alta una pronunciación o un procedimiento ajeno.",
    ],
    reflectionQuestions: [
      "¿Qué regla propia me cuesta más romper y qué pasaría si lo hiciera?",
      "¿Qué emoción se esconde detrás de mi necesidad de control?",
      "¿Qué cosas hago solo porque «se deben» hacer?",
    ],
    growthOpportunities: [
      "Introducir pequeñas variaciones a rutinas como experimento.",
      "Compartir con alguien de confianza lo que siente cuando algo sale mal.",
      "Reservar tiempo semanal para una actividad sin utilidad aparente.",
    ],
  }),
  lvl(6, {
    editorialLabel: "Funcionamiento intermedio con crítica y severidad",
    description:
      "El crítico interior se vuelve más fuerte y empieza a proyectarse hacia fuera. La persona se siente moralmente responsable de corregir a otros, y la irritación se hace más visible.",
    characteristicExpressions: [
      "Señala fallas ajenas con frecuencia y con dureza creciente.",
      "Se justifica diciendo que solo busca lo correcto.",
      "Muestra impaciencia, sarcasmo o tono tajante.",
    ],
    thinkingPatterns: [
      "Percibe sobre todo lo que falta o falla.",
      "Cree que si no insiste, las cosas se desbordan.",
      "Siente que su criterio es más confiable que el del grupo.",
    ],
    emotionalPatterns: [
      "Resentimiento por cargar con más de lo que le corresponde.",
      "Irritabilidad frecuente, con momentos de arrepentimiento.",
      "Disgusto consigo misma cuando pierde la compostura.",
    ],
    inRelationships:
      "Los vínculos se tensan por correcciones constantes; puede aislarse de quienes sienten su juicio como carga.",
    inDecisions:
      "Decide con tono inflexible y le cuesta aceptar alternativas; las objeciones se viven como ataques.",
    availableStrengths: [
      "Gran claridad para detectar problemas.",
      "Valentía para decir lo incómodo.",
      "Fuerte motivación de mejora.",
    ],
    possibleDifficulties: [
      "Impacto negativo en las relaciones por tono crítico.",
      "Sensación de soledad moral.",
      "Autoexigencia que alimenta el agotamiento.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 5, aquí la severidad ya se dirige abiertamente a otros y el resentimiento es protagonista. Frente al nivel 7, todavía reconoce que a veces exagera y puede retroceder si se le muestra el efecto de sus palabras.",
    examples: [
      "Interrumpe a un compañero para corregir un detalle menor delante de todos.",
      "Escribe un mensaje largo señalando todo lo que salió mal en un evento.",
      "Se lleva a casa el enojo por la «falta de compromiso» del equipo.",
    ],
    reflectionQuestions: [
      "¿Qué efecto tienen mis correcciones en quienes me importan?",
      "¿Qué parte de mi enojo habla de mí y qué parte de los demás?",
      "¿Qué necesito yo que no estoy pidiendo?",
    ],
    growthOpportunities: [
      "Esperar unas horas antes de enviar una crítica por escrito.",
      "Expresar primero lo que valora y después lo que propone cambiar.",
      "Practicar técnicas de pausa y respiración cuando sienta el impulso de corregir.",
    ],
  }),
  lvl(7, {
    editorialLabel: "Patrones más desadaptativos: juicio severo y poca tolerancia",
    description:
      "La visión se estrecha y la persona juzga con dureza a casi todos, incluida ella misma. La tolerancia al error es muy baja y el sufrimiento interior se intensifica, aunque se justifique en nombre de principios.",
    characteristicExpressions: [
      "Reprueba abiertamente conductas ajenas con tono moralizante.",
      "Se resiste a escuchar versiones alternativas.",
      "Su rigidez genera tensiones y distancias con su entorno.",
    ],
    thinkingPatterns: [
      "Piensa que los demás son descuidados o poco íntegros.",
      "Interpreta cualquier desvío como falta de respeto.",
      "Mantiene una lista mental de agravios.",
    ],
    emotionalPatterns: [
      "Indignación persistente y poca calma de fondo.",
      "Culpa y vergüenza por impulsos que condena en sí misma.",
      "Cansancio emocional y aislamiento.",
    ],
    inRelationships:
      "Las relaciones se resienten por la intolerancia y los reproches; algunas personas se alejan para protegerse.",
    inDecisions:
      "Las decisiones se toman desde un convencimiento total, con poca apertura a reconsiderar.",
    availableStrengths: [
      "Convicción y energía para defender valores.",
      "Capacidad de ver injusticias reales.",
      "Compromiso profundo, aun cuando se exprese de manera rígida.",
    ],
    possibleDifficulties: [
      "Desgaste de vínculos importantes.",
      "Grave dificultad para descansar o disfrutar.",
      "Autoexigencia que puede afectar la salud física y emocional.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 6, aquí el juicio ya no deja espacio a la duda ni al matiz y el costo en los vínculos es visible. Frente al nivel 8, todavía puede cumplir con sus responsabilidades básicas y mantiene cierta coherencia entre lo que predica y hace.",
    examples: [
      "Corta la comunicación con un familiar por una diferencia ética.",
      "Redacta una queja larguísima por una falta menor.",
      "No logra descansar el domingo por la sensación de que todo anda mal.",
    ],
    reflectionQuestions: [
      "¿Qué me costaría soltar de mi certeza, aunque fuera un poco?",
      "¿Qué me hace falta para sentir calma sin tener razón?",
      "¿A quién puedo contar lo que siento sin que me corrija?",
    ],
    growthOpportunities: [
      "Hablar con una persona de confianza sobre el cansancio que esta forma de vivir produce.",
      SUPPORT,
      "Practicar la autocompasión con ejercicios breves guiados.",
    ],
  }),
  lvl(8, {
    editorialLabel: "Patrones desadaptativos intensos: rigidez y doble vara",
    description:
      "La rigidez moral se vuelve extrema y aparecen contradicciones internas. La persona puede obsesionarse con faltas ajenas y, al mismo tiempo, vivir tensiones entre lo que predica y lo que desea o hace en privado.",
    characteristicExpressions: [
      "Se fija intensamente en errores ajenos y en cómo castigarlos o corregirlos.",
      "Alterna entre normas muy estrictas y descargas esporádicas que luego lamenta.",
      "Se aísla o pierde la confianza de otros por su tono implacable.",
    ],
    thinkingPatterns: [
      "Cree que el mundo es corrupto y que solo ella lo ve con claridad.",
      "Rumia sobre lo injusto durante horas.",
      "Justifica en nombre del bien medidas desproporcionadas.",
    ],
    emotionalPatterns: [
      "Rabia intensa y culpa subyacente.",
      "Vergüenza por la contradicción entre ideales y conducta.",
      "Sensación de estar al límite de las fuerzas.",
    ],
    inRelationships:
      "Pueden surgir rupturas y conflictos serios; los demás pueden sentirse vigilados o juzgados.",
    inDecisions:
      "Decisiones muy tajantes y con costos personales altos, tomadas desde la indignación.",
    availableStrengths: [
      "Conciencia ética profunda, aunque hoy distorsionada por el sufrimiento.",
      "Capacidad de sostener esfuerzos prolongados.",
      "Valentía para confrontar, que puede reorientarse hacia fines constructivos.",
    ],
    possibleDifficulties: [
      "Conflictos graves en el trabajo o la familia.",
      "Agotamiento físico y emocional.",
      "Dificultad para pedir ayuda por vergüenza.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 7, aquí aparecen contradicciones internas visibles y la rigidez genera consecuencias importantes en la vida diaria. Frente al nivel 9, aún se conserva cierta capacidad de acción y de conexión con otros.",
    examples: [
      "Denuncia con vehemencia una falta ajena mientras oculta una propia que la avergüenza.",
      "Rompe una relación cercana tras una discusión sobre honestidad.",
      "Pasa noches sin dormir repasando un agravio.",
    ],
    reflectionQuestions: [
      "¿Qué parte de mí quisiera descansar de tanta vigilancia?",
      "¿Qué temo que pase si dejo de controlar todo?",
      "¿Quién podría acompañarme sin juzgarme?",
    ],
    growthOpportunities: [
      "Hablar con alguien de confianza sobre la tensión interna que siente.",
      SUPPORT,
      "Dar pequeños pasos hacia el perdón de sí misma con ayuda de un acompañamiento adecuado.",
    ],
  }),
  lvl(9, {
    editorialLabel: "Patrones desadaptativos muy intensos: autocastigo y sufrimiento profundo",
    description:
      "El juicio interior alcanza una severidad extrema y el sufrimiento puede ser muy grande. La persona puede sentirse indigna, sin salida ni compasión posible, y su energía se agota.",
    characteristicExpressions: [
      "Se reprocha con dureza y puede aislarse por completo.",
      "Vive pensamientos de culpa y de castigo hacia sí misma o hacia otros.",
      "Pierde capacidad de sostener rutinas y responsabilidades habituales.",
    ],
    thinkingPatterns: [
      "Cree que no puede repararse ni merece alivio.",
      "Piensa en términos absolutos de culpa y castigo.",
      "Pierde la perspectiva de matices y esperanza.",
    ],
    emotionalPatterns: [
      "Desesperanza, vergüenza intensa y agotamiento.",
      "Ira dirigida hacia sí misma.",
      "Entumecimiento o llanto frecuente.",
    ],
    inRelationships:
      "El contacto con otros se reduce o se vuelve conflictivo; puede costar aceptar cuidado o afecto.",
    inDecisions:
      "La capacidad de decidir se bloquea o se reduce a conductas extremas movidas por el malestar.",
    availableStrengths: [
      "Una conciencia moral que, con apoyo, puede transformarse en compasión.",
      "Capacidad de recuperación cuando recibe cuidado sostenido.",
      "Sensibilidad ante la injusticia que puede reorientarse.",
    ],
    possibleDifficulties: [
      "Sufrimiento emocional muy fuerte.",
      "Riesgo de descuidar la salud y el autocuidado básico.",
      "Dificultad para creer que el cambio es posible.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 8, aquí la contradicción interna se convierte en una condena total y la energía para actuar casi se agota. Es el extremo del mapa, y lo que lo distingue es la intensidad del sufrimiento y la pérdida de opciones percibidas.",
    examples: [
      "Pasa días sin salir de casa convencida de que no merece compañía.",
      "Se reprocha con dureza por errores antiguos que no logra soltar.",
      "Deja de lado el cuidado básico personal por sentirse indigna.",
    ],
    reflectionQuestions: [
      "¿Qué le diría a una persona querida que sintiera lo que siento?",
      "¿Qué pequeño gesto de cuidado podría permitirme hoy?",
      "¿Con quién podría hablar de esto, aunque cueste?",
    ],
    growthOpportunities: [
      "Contactar con un profesional de salud mental o con una línea de apoyo si el malestar es intenso o aparecen ideas de hacerse daño.",
      SUPPORT,
      "Dejarse acompañar por alguien cercano en tareas cotidianas mientras se recupera la energía.",
    ],
  }),
];
