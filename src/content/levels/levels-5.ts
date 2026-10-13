import type { LevelProfile } from "../schema";

type Body = Omit<LevelProfile, "type" | "level" | "sourceLevelName" | "disclaimer" | "sources" | "status">;

const DISCLAIMER =
  "Este perfil es un modelo interpretativo sin validación clínica. Describe tendencias posibles, no es un resultado de evaluación y no sustituye la mirada de un profesional.";

const lvl = (level: LevelProfile["level"], body: Body): LevelProfile => ({
  type: 5,
  level,
  sourceLevelName: null,
  ...body,
  disclaimer: DISCLAIMER,
  sources: ["riso-hudson-1999", "riso-hudson-1996", "hook-2021"],
  status: "draft",
});

const SUPPORT =
  "Si esta forma de vivir resulta dolorosa o agotadora, buscar apoyo profesional (psicología o psicoterapia) y acompañamiento de personas de confianza es una decisión valiosa; no implica que este sea tu caso.";

export const levels5: LevelProfile[] = [
  lvl(1, {
    editorialLabel: "Funcionamiento muy flexible y abierto al mundo",
    description:
      "La persona observa con curiosidad y se involucra con confianza. Su necesidad de comprender convive con la capacidad de estar presente, sentir y participar sin retirarse a la mente.",
    characteristicExpressions: [
      "Comparte lo que sabe con generosidad y sencillez.",
      "Se involucra en la acción sin esperar a tener todo resuelto.",
      "Disfruta de la compañía y de la soledad por igual.",
    ],
    thinkingPatterns: [
      "Percibe con amplitud y relaciona lo que observa con la vida real.",
      "Reconoce que no necesita saberlo todo para actuar.",
      "Valora tanto la experiencia como el concepto.",
    ],
    emotionalPatterns: [
      "Siente sus emociones al momento y no después.",
      "Capacidad de asombro tranquilo.",
      "Confianza en que tiene recursos suficientes.",
    ],
    inRelationships:
      "Ofrece presencia, escucha profunda y compañía sin invadir ni retirarse; se deja afectar por los demás.",
    inDecisions:
      "Decide combinando análisis e intuición, y acepta información incompleta.",
    availableStrengths: [
      "Visión amplia y penetrante.",
      "Presencia serena.",
      "Capacidad de integrar mente, cuerpo y emoción.",
    ],
    possibleDifficulties: [
      "Puede absorberse tanto en lo que le interesa que se olvida del descanso.",
      "A veces requiere más tiempo a solas que su entorno.",
      "En ambientes ruidosos o demandantes puede agotarse con rapidez.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 2, aquí la curiosidad no se separa de la vida: observar y participar son una misma cosa. En el nivel 2 la mente aún toma la delantera y la observación suele preceder a la acción.",
    examples: [
      "Participa en un debate con apertura y luego comparte lo aprendido con alguien cercano.",
      "Acompaña a un amigo en una crisis sin necesitar entenderla del todo.",
      "Pasa una tarde estudiando y otra con su familia, disfrutando ambas.",
    ],
    reflectionQuestions: [
      "¿Cuándo siento que no necesito saber más para actuar?",
      "¿Qué me ayuda a sentir y pensar al mismo tiempo?",
      "¿Cómo disfruto de la compañía sin agotarme?",
    ],
    growthOpportunities: [
      "Compartir su conocimiento en espacios de comunidad.",
      "Mantener hábitos que cuiden su cuerpo y su descanso.",
      "Seguir explorando experiencias que no sean solo intelectuales.",
    ],
  }),
  lvl(2, {
    editorialLabel: "Funcionamiento integrado con observación atenta",
    description:
      "La persona disfruta observar y entender, y lo hace con atención y rigor. Se mantiene conectada con otros, aunque su mundo mental es un refugio importante.",
    characteristicExpressions: [
      "Observa con detalle antes de opinar.",
      "Busca comprender cómo funciona lo que le interesa.",
      "Habla cuando tiene algo que aportar.",
    ],
    thinkingPatterns: [
      "Prefiere analizar con calma antes de actuar.",
      "Distingue hechos de suposiciones.",
      "Se plantea preguntas y las explora con paciencia.",
    ],
    emotionalPatterns: [
      "Emociones contenidas que se procesan a solas.",
      "Alegría tranquila al aprender.",
      "Ligera incomodidad ante demandas emocionales inesperadas.",
    ],
    inRelationships:
      "Es leal y atenta con pocos vínculos significativos; necesita espacios de soledad para recargarse.",
    inDecisions:
      "Reúne información suficiente, evalúa riesgos y suele actuar con cautela.",
    availableStrengths: [
      "Capacidad analítica.",
      "Objetividad.",
      "Independencia de criterio.",
    ],
    possibleDifficulties: [
      "Puede demorar la acción por seguir investigando.",
      "Cierta dificultad para expresar emociones en el momento.",
      "Tiende a economizar energía social.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 1, aquí la mente se separa un poco de la experiencia directa y se prefiere pensar antes de vivir. Frente al nivel 3, aún no hay un esfuerzo por especializarse a costa de la vida social.",
    examples: [
      "Lee varios artículos antes de comprar una herramienta nueva.",
      "Escucha en una reunión y luego envía un resumen claro.",
      "Declina una invitación para dedicar tiempo a un proyecto personal.",
    ],
    reflectionQuestions: [
      "¿Qué siento antes de decidir cuánto compartir?",
      "¿Cuándo es suficiente información para actuar?",
      "¿Qué compañía me nutre y cuál me agota?",
    ],
    growthOpportunities: [
      "Fijar un plazo para decidir y respetarlo.",
      "Compartir una emoción en tiempo real con alguien de confianza.",
      "Combinar el estudio con actividades corporales.",
    ],
  }),
  lvl(3, {
    editorialLabel: "Funcionamiento flexible con enfoque en el conocimiento",
    description:
      "La persona se concentra en un área de interés y la explora con profundidad. Su pericia se convierte en parte de su identidad, aunque todavía mantiene diálogo con el entorno.",
    characteristicExpressions: [
      "Se especializa en temas que le apasionan.",
      "Dedica largos periodos a proyectos de interés.",
      "Aporta ideas originales a su campo.",
    ],
    thinkingPatterns: [
      "Valora el dominio de un tema como forma de seguridad.",
      "Construye modelos mentales complejos.",
      "Cuestiona supuestos con rigor.",
    ],
    emotionalPatterns: [
      "Entusiasmo concentrado.",
      "Poca expresión emocional hacia afuera.",
      "Leve incomodidad si interrumpen su concentración.",
    ],
    inRelationships:
      "Comparte intereses y suele ser buena compañera de conversación; puede olvidar mantener contacto cuando se absorbe.",
    inDecisions:
      "Decide con base en datos y modelos, y a veces demora por querer certeza.",
    availableStrengths: [
      "Pericia y profundidad.",
      "Pensamiento original.",
      "Independencia intelectual.",
    ],
    possibleDifficulties: [
      "Se aísla al sumergirse en un tema.",
      "Puede subestimar la importancia de lo emocional.",
      "Tiene dificultad para llevar el conocimiento a la práctica.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 2, aquí el dominio de un tema se vuelve fuente central de seguridad. Frente al nivel 4, todavía no organiza su vida alrededor de proteger su energía y su tiempo.",
    examples: [
      "Pasa fines de semana aprendiendo un nuevo lenguaje de programación.",
      "Prefiere publicar un análisis detallado antes que opinar sin base.",
      "Olvida responder mensajes por estar inmersa en un proyecto.",
    ],
    reflectionQuestions: [
      "¿Qué me da seguridad además de saber?",
      "¿Cómo se sienten mis seres queridos cuando me absorbo?",
      "¿Qué conocimiento me gustaría poner en práctica?",
    ],
    growthOpportunities: [
      "Programar contactos regulares con personas cercanas.",
      "Aplicar lo aprendido en un proyecto pequeño.",
      "Compartir un tema de interés en un grupo.",
    ],
  }),
  lvl(4, {
    editorialLabel: "Funcionamiento intermedio con protección de recursos",
    description:
      "La persona empieza a cuidar con más celo su tiempo, energía y espacio. Siente que los recursos son limitados y que las demandas externas pueden agotarla, por lo que pone límites más estrictos.",
    characteristicExpressions: [
      "Reduce compromisos sociales para conservar energía.",
      "Protege su espacio y sus horarios con firmeza.",
      "Prepara con antelación cada encuentro o tarea.",
    ],
    thinkingPatterns: [
      "Calcula cuánta energía le cuesta cada actividad.",
      "Piensa que necesita saber más antes de estar lista.",
      "Considera la participación como un gasto.",
    ],
    emotionalPatterns: [
      "Ansiedad sutil ante demandas inesperadas.",
      "Alivio al estar sola.",
      "Dificultad para identificar emociones en el momento.",
    ],
    inRelationships:
      "Se comunica de forma económica y puede parecer distante, aunque valora a quienes la respetan.",
    inDecisions:
      "Pospone decisiones que impliquen compromiso emocional o de recursos.",
    availableStrengths: [
      "Autonomía.",
      "Planificación cuidadosa.",
      "Capacidad de sostener su propio ritmo.",
    ],
    possibleDifficulties: [
      "Percibe como invasivas demandas razonables.",
      "Reduce su vida social más de lo que le gustaría.",
      "Se sobrecarga al quedarse sin margen de reserva.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 3, aquí la protección de recursos pasa a organizar buena parte de la vida cotidiana. Frente al nivel 5, aún mantiene contactos regulares y no se refugia por completo en su mundo.",
    examples: [
      "Responde correos una sola vez al día para no dispersarse.",
      "Se agota después de una reunión social larga.",
      "Rechaza una oferta de ayuda para no deber nada.",
    ],
    reflectionQuestions: [
      "¿Qué me da energía y qué me la quita?",
      "¿Qué aspectos de mi vida estoy cuidando demasiado?",
      "¿Qué relaciones merecen que invierta más tiempo?",
    ],
    growthOpportunities: [
      "Probar compartir un recurso pequeño y observar qué ocurre.",
      "Planificar un encuentro social breve y regular.",
      "Reconocer sus emociones antes de decidir si se retira.",
    ],
  }),
  lvl(5, {
    editorialLabel: "Funcionamiento intermedio con aislamiento reservado",
    description:
      "La persona se repliega con frecuencia en su mundo mental y reduce al mínimo sus necesidades y contactos. Valora su independencia, pero le cuesta conectar con la gente y con sus propios afectos.",
    characteristicExpressions: [
      "Vive con pocas necesidades materiales y sociales.",
      "Se muestra distante o difícil de leer.",
      "Dedica mucho tiempo a actividades solitarias.",
    ],
    thinkingPatterns: [
      "Prefiere pensar en las cosas antes que vivirlas.",
      "Cree que implicarse es arriesgado.",
      "Minimiza sus necesidades para depender menos.",
    ],
    emotionalPatterns: [
      "Emociones guardadas, que aparecen retrasadas.",
      "Alivio al evitar contacto.",
      "Soledad que reconoce con dificultad.",
    ],
    inRelationships:
      "Mantiene pocos vínculos y puede parecer fría; otros pueden sentirse excluidos.",
    inDecisions:
      "Tiende a no decidir hasta sentirse totalmente preparada, lo que retrasa la acción.",
    availableStrengths: [
      "Autosuficiencia.",
      "Observación sutil.",
      "Calma ante situaciones tensas.",
    ],
    possibleDifficulties: [
      "Aislamiento que reduce oportunidades.",
      "Descuido del cuerpo y las necesidades básicas.",
      "Dificultad para recibir afecto.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 4, aquí el aislamiento se vuelve la solución habitual y las necesidades se reducen para no depender. Frente al nivel 6, la mente todavía trabaja con realismo y no se llena de ideas inusuales o ansiosas.",
    examples: [
      "Pasa semanas sin ver amigos y no lo nota hasta que alguien se lo dice.",
      "Come lo mínimo para no interrumpir su tarea.",
      "Se incomoda con un abrazo inesperado.",
    ],
    reflectionQuestions: [
      "¿Qué parte de mí extraña la compañía?",
      "¿Qué necesidades estoy minimizando?",
      "¿Qué me da miedo de depender de alguien?",
    ],
    growthOpportunities: [
      "Atender una necesidad física concreta cada día.",
      "Responder a un mensaje afectuoso en lugar de postergarlo.",
      "Compartir un interés con otra persona en un entorno tranquilo.",
    ],
  }),
  lvl(6, {
    editorialLabel: "Funcionamiento intermedio con exceso de especulación",
    description:
      "La mente se vuelve intensa, especulativa y, a veces, rígida. La persona elabora teorías detalladas, se siente fácilmente invadida y puede reaccionar con distancia o sarcasmo ante la intrusión.",
    characteristicExpressions: [
      "Elabora ideas complejas con poca verificación externa.",
      "Reacciona con frialdad o ironía a las demandas.",
      "Se resiste a compartir sus procesos o conclusiones.",
    ],
    thinkingPatterns: [
      "Cree que solo ella entiende lo que sucede de fondo.",
      "Sospecha de las intenciones de quienes se acercan.",
      "Convierte ideas en certezas sin contrastarlas.",
    ],
    emotionalPatterns: [
      "Hipersensibilidad a la intrusión.",
      "Irritación o desdén defensivo.",
      "Ansiedad por la pérdida de control.",
    ],
    inRelationships:
      "Se vuelve más impenetrable y a veces ácida; las personas pueden sentirse rechazadas o juzgadas.",
    inDecisions:
      "Toma decisiones sin consultar, convencida de su análisis, y cambia de rumbo con dificultad.",
    availableStrengths: [
      "Imaginación intelectual.",
      "Capacidad de sostener ideas complejas.",
      "Independencia de criterio.",
    ],
    possibleDifficulties: [
      "Pérdida de contacto con la realidad compartida.",
      "Conflictos por reacciones defensivas.",
      "Aislamiento que alimenta pensamientos rígidos.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 5, aquí la mente se vuelve más rígida y el rechazo a la intrusión se expresa de modo activo. Frente al nivel 7, todavía puede someter sus ideas a prueba y escuchar a alguien de confianza.",
    examples: [
      "Escribe un tratado sobre un tema sin mostrar nada a nadie.",
      "Responde con sarcasmo a una pregunta sencilla de un colega.",
      "Interpreta un gesto amable como un intento de manipulación.",
    ],
    reflectionQuestions: [
      "¿Qué ideas mías no he contrastado nunca con nadie?",
      "¿Qué me hace sentir invadida con tanta facilidad?",
      "¿Quién podría ayudarme a probar mis hipótesis?",
    ],
    growthOpportunities: [
      "Compartir una idea con una persona de confianza y escuchar su respuesta.",
      "Hacer actividad física para salir del circuito mental.",
      "Anotar suposiciones y comprobar cuáles se cumplen.",
    ],
  }),
  lvl(7, {
    editorialLabel: "Patrones más desadaptativos: retraimiento intenso y desconfianza",
    description:
      "La persona se aparta de forma marcada, siente la compañía como amenaza y reduce sus actividades a lo mínimo. El mundo interior se vuelve más importante que el real y el cansancio se acumula.",
    characteristicExpressions: [
      "Evita casi todo contacto no estrictamente necesario.",
      "Reacciona con enojo o agotamiento ante cualquier petición.",
      "Reduce sus responsabilidades y su entorno al mínimo.",
    ],
    thinkingPatterns: [
      "Piensa que el mundo exige más de lo que puede dar.",
      "Interpreta la proximidad como peligro.",
      "Se convence de que está mejor sin nadie.",
    ],
    emotionalPatterns: [
      "Miedo e irritabilidad ante la cercanía.",
      "Sensación de vacío que se niega.",
      "Agotamiento y desconexión corporal.",
    ],
    inRelationships:
      "Los vínculos se cortan o se enfrían; quienes la quieren pueden sentirse impotentes.",
    inDecisions:
      "Las decisiones se orientan a evitar demandas, aunque eso limite su vida.",
    availableStrengths: [
      "Una capacidad de concentración que puede reorientarse.",
      "Honestidad intelectual.",
      "Autonomía que, bien cuidada, puede ser un recurso.",
    ],
    possibleDifficulties: [
      "Aislamiento prolongado.",
      "Descuido de la salud y del entorno físico.",
      "Dificultad para pedir ayuda.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 6, aquí el retiro es casi total y la desconfianza condiciona incluso los contactos básicos. Frente al nivel 8, todavía mantiene rutinas mínimas y algún contacto elegido.",
    examples: [
      "No responde llamadas durante semanas, ni siquiera de familiares.",
      "Pasa días en una habitación a oscuras, sumergida en sus pensamientos.",
      "Descuida las comidas por no querer salir.",
    ],
    reflectionQuestions: [
      "¿Qué es lo que más temo perder si me acerco?",
      "¿Qué pequeño contacto me resultaría tolerable?",
      "¿Quién podría acompañarme sin pedirme nada a cambio?",
    ],
    growthOpportunities: [
      "Decirle a alguien de confianza que está pasando por un momento de mucho agotamiento.",
      SUPPORT,
      "Establecer una rutina mínima de comida, sueño y movimiento.",
    ],
  }),
  lvl(8, {
    editorialLabel: "Patrones desadaptativos intensos: desconexión y pensamiento desorganizado",
    description:
      "La persona puede sentirse desconectada de su cuerpo y del mundo, con pensamientos que se vuelven confusos o abrumadores. El miedo a la intrusión es muy intenso y le cuesta ordenar su vida cotidiana.",
    characteristicExpressions: [
      "Pierde la noción del tiempo o de sus necesidades básicas.",
      "Habla poco o de forma desorganizada sobre lo que le pasa.",
      "Rechaza todo contacto que sienta intrusivo.",
    ],
    thinkingPatterns: [
      "Rumia ideas intensas sin lograr salir de ellas.",
      "Siente que no puede confiar en nadie ni en sí misma.",
      "Se queda atrapada en pensamientos sin resolución.",
    ],
    emotionalPatterns: [
      "Miedo, confusión y agotamiento.",
      "Entumecimiento emocional.",
      "Tensión y sensación de amenaza continua.",
    ],
    inRelationships:
      "El contacto con otros se reduce a lo imprescindible; puede costar aceptar ayuda aun cuando se necesita.",
    inDecisions:
      "Le cuesta tomar decisiones prácticas y se bloquea con facilidad.",
    availableStrengths: [
      "Una mente sensible que, con apoyo, puede volver a ordenarse.",
      "Capacidad de reconocer cuando necesita silencio.",
      "Capacidad de recuperación cuando hay seguridad y calma.",
    ],
    possibleDifficulties: [
      "Descuido serio de la salud y de las rutinas.",
      "Confusión que afecta el funcionamiento diario.",
      "Aislamiento que agrava el malestar.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 7, aquí aparecen confusión y desconexión notables que afectan las actividades cotidianas. Frente al nivel 9, todavía existe cierta capacidad de comunicar lo que ocurre y de recibir un contacto cuidadoso.",
    examples: [
      "No recuerda si comió o durmió en los últimos días.",
      "Se queda horas mirando un mismo punto, sin poder iniciar una tarea.",
      "Rechaza la visita de un familiar por miedo a la invasión.",
    ],
    reflectionQuestions: [
      "¿Qué necesita mi cuerpo en este momento?",
      "¿Qué tipo de compañía me daría calma?",
      "¿A quién podría decirle que me siento muy perdida?",
    ],
    growthOpportunities: [
      "Pedir a una persona de confianza que la acompañe en tareas básicas como comer o descansar.",
      SUPPORT,
      "Priorizar un entorno tranquilo y predecible mientras recupera estabilidad.",
    ],
  }),
  lvl(9, {
    editorialLabel: "Patrones desadaptativos muy intensos: aislamiento profundo y desconexión",
    description:
      "El aislamiento puede volverse casi total y la desconexión del cuerpo, de los demás y de la vida cotidiana muy marcada. El sufrimiento puede ser grande aunque cueste expresarlo.",
    characteristicExpressions: [
      "Se aparta por completo de contactos y responsabilidades.",
      "Descuida casi todas las necesidades básicas.",
      "Casi no comunica lo que le pasa.",
    ],
    thinkingPatterns: [
      "Siente que nada tiene sentido ni importa.",
      "Pierde la capacidad de organizar sus ideas.",
      "Cree que no hay forma de volver a conectar.",
    ],
    emotionalPatterns: [
      "Vacío y entumecimiento profundos.",
      "Miedo intenso o apatía.",
      "Agotamiento total.",
    ],
    inRelationships:
      "El contacto se pierde casi por completo; aceptar cuidado resulta extremadamente difícil.",
    inDecisions:
      "La capacidad de decidir y de actuar se reduce de manera importante.",
    availableStrengths: [
      "Una capacidad de recuperación que se activa con seguridad y acompañamiento paciente.",
      "Un mundo interior que puede volver a abrirse poco a poco.",
      "Capacidad de reconectar cuando el entorno es respetuoso y estable.",
    ],
    possibleDifficulties: [
      "Sufrimiento emocional muy intenso.",
      "Riesgo grave para la salud física.",
      "Dificultad para creer que el contacto humano puede ser seguro.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 8, aquí la confusión da paso a un aislamiento casi total y a la pérdida de la capacidad de sostener cualquier rutina. Es el extremo del mapa y lo distingue la ausencia de energía para el contacto.",
    examples: [
      "Pasa días sin hablar con nadie ni atender sus necesidades básicas.",
      "No logra explicar lo que siente cuando alguien le pregunta.",
      "Se queda inmóvil frente a tareas simples.",
    ],
    reflectionQuestions: [
      "¿Qué necesita mi cuerpo ahora mismo?",
      "¿Quién podría estar a mi lado en silencio?",
      "¿Qué pequeño gesto puedo permitirme hoy?",
    ],
    growthOpportunities: [
      "Contactar de inmediato con un profesional de salud mental o una línea de apoyo si el malestar es intenso o aparecen ideas de hacerse daño.",
      SUPPORT,
      "Aceptar compañía respetuosa y sin exigencias de una persona de confianza mientras recupera fuerzas.",
    ],
  }),
];
