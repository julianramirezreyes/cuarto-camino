import type { LevelProfile } from "../schema";

type Body = Omit<LevelProfile, "type" | "level" | "sourceLevelName" | "disclaimer" | "sources" | "status">;

const DISCLAIMER =
  "Este perfil es un modelo interpretativo para la autoobservación, sin validación clínica. No describe a una persona concreta ni sustituye una evaluación profesional.";

const lv = (level: LevelProfile["level"], b: Body): LevelProfile => ({
  type: 7,
  level,
  sourceLevelName: null,
  ...b,
  disclaimer: DISCLAIMER,
  sources: ["riso-hudson-1999", "riso-hudson-1996", "hook-2021"],
  status: "draft",
});

export const levels7: LevelProfile[] = [
  lv(1, {
    editorialLabel: "Funcionamiento muy flexible: gratitud y disfrute del momento presente",
    description:
      "La persona del tipo 7 disfruta de la vida con profundidad y sin huir de lo difícil. Su alegría no depende de acumular experiencias, sino de estar presente en lo que ocurre, sea agradable o doloroso. La curiosidad se combina con asombro y gratitud.",
    characteristicExpressions: [
      "Se entrega a lo que vive sin pensar ya en lo siguiente.",
      "Acompaña el dolor propio y ajeno sin intentar disfrazarlo.",
      "Transmite alegría serena y contagiosa.",
    ],
    thinkingPatterns: [
      "Reconoce el valor de cada experiencia, incluso las sencillas.",
      "Mira lo difícil con realismo y esperanza a la vez.",
      "Elige con claridad lo que realmente le importa.",
    ],
    emotionalPatterns: [
      "Gratitud tranquila ante lo cotidiano.",
      "Tolera la tristeza sin necesidad de taparla.",
      "Siente entusiasmo sin ansiedad por que dure.",
    ],
    inRelationships:
      "Está disponible y atenta; escucha con interés genuino. Acepta que algunos momentos con otros son aburridos o intensos y los atraviesa sin escapar.",
    inDecisions:
      "Decide con enfoque y acepta renunciar a opciones. Entiende que elegir una cosa implica soltar otras sin vivirlo como pérdida.",
    availableStrengths: [
      "Alegría profunda y contagiosa.",
      "Creatividad y visión amplia.",
      "Capacidad de concentrarse en lo valioso.",
    ],
    possibleDifficulties: [
      "Puede sentirse tentada por la dispersión en etapas de mucho estímulo.",
      "A veces le cuesta sostener tareas sin atractivo.",
      "Puede subestimar su propio cansancio.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 2, aquí el entusiasmo se asienta en presencia y gratitud, mientras que en el nivel 2 aparece más movimiento hacia nuevas experiencias y mayor entusiasmo por probar cosas.",
    examples: [
      "Pasar una tarde en casa con alguien querido sin necesidad de planear nada más.",
      "Aceptar una despedida con tristeza y apreciar lo vivido.",
      "Elegir un proyecto a la vez y llevarlo a término con alegría.",
    ],
    reflectionQuestions: [
      "¿Cuándo me siento plenamente en el momento presente?",
      "¿Qué me permite quedarme con lo difícil sin escapar?",
      "¿Qué experiencias valoro más al soltar otras opciones?",
    ],
    growthOpportunities: [
      "Compartir tu forma de disfrutar con personas que se sienten dispersas.",
      "Mantener momentos de silencio y pausa como parte de la alegría.",
      "Atender señales de cansancio antes de que lleguen al límite.",
    ],
  }),
  lv(2, {
    editorialLabel: "Funcionamiento flexible: entusiasmo curioso y optimismo",
    description:
      "La persona se abre al mundo con curiosidad, buen humor y energía. Disfruta aprender, viajar y conectar ideas. Todavía puede quedarse con lo que vive, aunque la mente tiende a explorar nuevas posibilidades con facilidad.",
    characteristicExpressions: [
      "Propone planes y despierta ánimo en los demás.",
      "Se interesa por muchos temas y personas.",
      "Mira el lado positivo sin negar los problemas.",
    ],
    thinkingPatterns: [
      "Conecta ideas distintas con rapidez.",
      "Imagina posibilidades y nuevas soluciones.",
      "Prefiere enfocar los problemas como oportunidades.",
    ],
    emotionalPatterns: [
      "Entusiasmo frecuente y fácil.",
      "Tristeza que reconoce y no se prolonga demasiado.",
      "Gusto por la ligereza y el humor.",
    ],
    inRelationships:
      "Es una compañía animada que invita a compartir. Puede ser generosa con su tiempo y con sus ideas, y valora la libertad de ambos.",
    inDecisions:
      "Decide con rapidez, guiada por el interés. Suele terminar lo que empieza cuando algo la entusiasma de verdad.",
    availableStrengths: [
      "Optimismo realista y energizante.",
      "Versatilidad para aprender.",
      "Facilidad para generar ideas nuevas.",
    ],
    possibleDifficulties: [
      "Puede evitar conversaciones incómodas por cuidar el buen clima.",
      "Se aburre con rutinas largas.",
      "Tiende a prometer más de lo que puede cumplir.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 1, la alegría se apoya en explorar y variar, no tanto en la presencia profunda. Frente al nivel 3, todavía las experiencias se disfrutan por sí mismas y no hay necesidad de acumularlas para sentirse satisfecha.",
    examples: [
      "Organizar una salida distinta cada mes con amigos.",
      "Aprender un idioma nuevo por curiosidad.",
      "Proponer una idea creativa en una reunión que anima al equipo.",
    ],
    reflectionQuestions: [
      "¿Qué temas me entusiasman de forma sostenida y cuáles solo por un tiempo?",
      "¿Cuándo prefiero cambiar de plan en lugar de profundizar?",
      "¿Qué conversaciones difíciles estoy evitando para mantener un buen ambiente?",
    ],
    growthOpportunities: [
      "Profundizar en uno de tus intereses hasta ver qué ofrece más allá del inicio.",
      "Tener al menos una conversación incómoda pendiente con calma.",
      "Registrar compromisos que asumes para no sobrecargarte.",
    ],
  }),
  lv(3, {
    editorialLabel: "Funcionamiento flexible: productividad vital con muchos intereses",
    description:
      "La persona canaliza su energía en múltiples proyectos y logra mucho. Es hábil, versátil y práctica; combina trabajo y disfrute. Empieza a notarse cierta prisa por no perder oportunidades y una agenda cada vez más llena.",
    characteristicExpressions: [
      "Maneja varios proyectos a la vez con soltura.",
      "Se adapta rápido a entornos y equipos nuevos.",
      "Convierte ideas en acciones concretas.",
    ],
    thinkingPatterns: [
      "Planifica pensando en múltiples opciones.",
      "Busca la manera más ágil de resolver un problema.",
      "Mide el tiempo como un recurso valioso.",
    ],
    emotionalPatterns: [
      "Vitalidad y satisfacción al producir y experimentar.",
      "Ligera inquietud cuando la agenda se queda vacía.",
      "Impaciencia al esperar resultados lentos.",
    ],
    inRelationships:
      "Disfruta compartir actividades y aventuras. Puede estar menos disponible para conversaciones largas o emocionalmente densas por tener la agenda llena.",
    inDecisions:
      "Elige con rapidez y mantiene varias puertas abiertas. Se compromete mientras la opción siga siendo estimulante.",
    availableStrengths: [
      "Versatilidad y habilidades prácticas.",
      "Energía para sostener ritmos exigentes.",
      "Capacidad de motivar a otros hacia objetivos.",
    ],
    possibleDifficulties: [
      "Dificultad para decir no a nuevas oportunidades.",
      "Menor atención a los detalles.",
      "Cansancio acumulado que se ignora.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 2, la curiosidad se orienta a producir y a sumar logros, no solo a explorar. Frente al nivel 4, aún elige con cierto criterio y no necesita llenar el tiempo con experiencias para sentirse bien.",
    examples: [
      "Llevar un trabajo, un curso y un proyecto personal a la vez con buen resultado.",
      "Aceptar una invitación más aunque el fin de semana ya está lleno.",
      "Resolver un imprevisto con una solución ingeniosa y rápida.",
    ],
    reflectionQuestions: [
      "¿Qué parte de mi agenda me nutre y cuál solo me llena?",
      "¿A qué oportunidad podría decir no esta semana?",
      "¿Cuándo fue la última vez que descansé sin planear algo después?",
    ],
    growthOpportunities: [
      "Reservar bloques de tiempo libre de forma intencional.",
      "Terminar un proyecto pendiente antes de comenzar otro.",
      "Escuchar al cuerpo para ajustar el ritmo antes del agotamiento.",
    ],
  }),
  lv(4, {
    editorialLabel: "Funcionamiento intermedio: búsqueda de estímulo y dispersión",
    description:
      "La persona busca nuevas experiencias con más urgencia y le cuesta quedarse en una sola. Aumenta la dispersión y la necesidad de variedad. Evita el aburrimiento y la incomodidad con planes, compras o actividades.",
    characteristicExpressions: [
      "Cambia de plan con frecuencia y mantiene varias opciones abiertas.",
      "Se distrae fácilmente en conversaciones o tareas largas.",
      "Colecciona experiencias, objetos o ideas nuevas.",
    ],
    thinkingPatterns: [
      "Piensa en lo siguiente antes de terminar lo actual.",
      "Imagina que podría haber algo mejor en otro lado.",
      "Reencuadra lo negativo para no quedarse en ello.",
    ],
    emotionalPatterns: [
      "Excitación al comenzar y menor interés al continuar.",
      "Incomodidad ante el silencio o el vacío.",
      "Entusiasmo alto que tapa un malestar leve.",
    ],
    inRelationships:
      "Se muestra animada, aunque puede ser inconstante con los compromisos. Le incomoda que le pidan más profundidad o que le planteen reclamos.",
    inDecisions:
      "Decide por atractivo del momento y deja puertas abiertas. Se le complica renunciar a alternativas.",
    availableStrengths: [
      "Gran capacidad de iniciar y proponer.",
      "Facilidad para socializar y adaptarse.",
      "Imaginación y flexibilidad mental.",
    ],
    possibleDifficulties: [
      "Proyectos inconclusos.",
      "Compromisos que se posponen o se cancelan.",
      "Dificultad para quedarse con emociones difíciles.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 3, el movimiento ya no busca resultados sino evitar la incomodidad del aburrimiento. Frente al nivel 5, aún puede detenerse cuando alguien se lo pide y su búsqueda de estímulos no consume tantos recursos ni genera tantos excesos.",
    examples: [
      "Inscribirse en tres cursos distintos y abandonar dos al mes.",
      "Cambiar de tema cuando una conversación se vuelve seria.",
      "Reservar un viaje por impulso para evitar un fin de semana sin planes.",
    ],
    reflectionQuestions: [
      "¿Qué siento cuando no tengo nada planeado?",
      "¿Qué proyecto inconcluso me gustaría retomar y por qué lo dejé?",
      "¿Qué emociones evito cuando cambio de plan con rapidez?",
    ],
    growthOpportunities: [
      "Elegir una actividad y sostenerla durante un periodo definido.",
      "Practicar quedarte unos minutos con una emoción incómoda sin buscar distracción.",
      "Hablar con alguien de confianza sobre lo que se esconde detrás de la prisa.",
    ],
  }),
  lv(5, {
    editorialLabel: "Funcionamiento intermedio: exceso, impaciencia y dificultad para saciarse",
    description:
      "La persona se lanza a experiencias con intensidad creciente y nunca parece tener suficiente. Aparecen excesos en gastos, tiempo, comida, actividades o compromisos. El entusiasmo se mezcla con inquietud e impaciencia.",
    characteristicExpressions: [
      "Se compromete con más de lo que puede atender.",
      "Gasta energía, dinero o tiempo en exceso por estímulos nuevos.",
      "Interrumpe, se adelanta o se aburre en conversaciones.",
    ],
    thinkingPatterns: [
      "Cree que lo próximo la satisfará más.",
      "Minimiza los costos de sus excesos.",
      "Racionaliza decisiones impulsivas con buenos argumentos.",
    ],
    emotionalPatterns: [
      "Inquietud constante bajo la apariencia animada.",
      "Frustración cuando algo limita su libertad.",
      "Cansancio que reaparece tras la euforia.",
    ],
    inRelationships:
      "Resulta divertida, aunque puede dejar a otros agotados o desatendidos. Suele evitar críticas con humor y cambios de tema.",
    inDecisions:
      "Decide rápido y por entusiasmo, sin medir bien las consecuencias. Luego busca justificarlo.",
    availableStrengths: [
      "Energía contagiosa.",
      "Capacidad de reinventarse ante problemas.",
      "Humor que alivia tensiones.",
    ],
    possibleDifficulties: [
      "Desorden en tiempos, gastos y compromisos.",
      "Relaciones desgastadas por el incumplimiento.",
      "Dificultad para escuchar límites propios y ajenos.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 4, la dispersión se convierte en exceso y en dificultad real para frenar. Frente al nivel 6, todavía conserva simpatía y capacidad de reparar, y no domina un deseo de imponer su ritmo o de ser el centro de atención.",
    examples: [
      "Aceptar tres compromisos el mismo día y llegar tarde a todos.",
      "Gastar más de lo previsto en un viaje espontáneo.",
      "Hacer chistes para esquivar una conversación sobre un reclamo.",
    ],
    reflectionQuestions: [
      "¿Qué pasa en mí cuando alguien me pide que me detenga?",
      "¿Qué excesos me dejan agotada al final?",
      "¿Qué costo tienen mis decisiones rápidas para las personas que quiero?",
    ],
    growthOpportunities: [
      "Establecer límites concretos de gasto, tiempo y compromisos.",
      "Pedir a una persona de confianza que te avise cuando te sobrecargues.",
      "Practicar la espera breve antes de decir que sí a algo nuevo.",
    ],
  }),
  lv(6, {
    editorialLabel: "Funcionamiento intermedio: autoindulgencia, centralidad y poca tolerancia a la frustración",
    description:
      "La persona se centra en sus propios deseos y se irrita con quienes se interponen. Puede volverse demandante, autoindulgente o impaciente. Busca que el entorno acompañe su ritmo y se defiende de la incomodidad con una actitud más dura o evasiva.",
    characteristicExpressions: [
      "Espera que los demás se adapten a sus planes.",
      "Se queja o se enoja cuando algo se frustra.",
      "Se justifica con rapidez ante errores o promesas rotas.",
    ],
    thinkingPatterns: [
      "Se considera con derecho a lo que desea.",
      "Percibe los límites como ataques a su libertad.",
      "Reduce la importancia del daño que causa a otros.",
    ],
    emotionalPatterns: [
      "Irritabilidad al sentirse limitada.",
      "Ansiedad que oculta con actividad frenética.",
      "Culpa breve que no logra sostener.",
    ],
    inRelationships:
      "Las relaciones se desgastan porque ella suele priorizar sus deseos. Puede mostrar enojo o sarcasmo cuando se le pide responsabilidad.",
    inDecisions:
      "Decide por impulso y sin considerar el efecto en otros. Evita asumir consecuencias.",
    availableStrengths: [
      "Seguridad para expresar lo que quiere.",
      "Capacidad de reconocer errores cuando se siente a salvo.",
      "Encanto personal que facilita reparar vínculos.",
    ],
    possibleDifficulties: [
      "Conflictos por incumplimiento reiterado.",
      "Poca empatía en momentos de frustración.",
      "Aislamiento cuando otros se alejan.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 5, el exceso se acompaña de actitud demandante y reactividad ante los límites. Frente al nivel 7, aún puede reconocer el daño y retomar el contacto, y no hay una huida tan intensa ni una pérdida marcada de dirección.",
    examples: [
      "Cancelar a último momento y molestarse cuando alguien lo reprocha.",
      "Insistir en un plan que perjudica a otros porque a ella le conviene.",
      "Reaccionar con burla cuando se le señala un olvido.",
    ],
    reflectionQuestions: [
      "¿Cómo reacciono cuando alguien me dice que no?",
      "¿Qué efecto tienen mis cancelaciones o cambios sobre otras personas?",
      "¿Qué miedo se esconde detrás de mi necesidad de libertad total?",
    ],
    growthOpportunities: [
      "Pedir disculpas concretas y cumplir un compromiso pequeño.",
      "Observar la irritación como señal de límites y no como ataque.",
      "Compartir con alguien cercano lo que te inquieta de fondo.",
    ],
  }),
  lv(7, {
    editorialLabel: "Funcionamiento con patrones más desadaptativos: huida impulsiva del malestar",
    description:
      "La persona intenta escapar de la ansiedad mediante actividad frenética, estímulos fuertes o decisiones imprudentes. Pierde el control de su tiempo, de sus recursos o de su salud. Detrás hay un miedo intenso a sentir dolor o vacío.",
    characteristicExpressions: [
      "Se lanza a conductas arriesgadas o excesivas para no sentir.",
      "Abandona responsabilidades con facilidad.",
      "Se muestra dispersa, impulsiva y poco confiable.",
    ],
    thinkingPatterns: [
      "Cree que detenerse sería insoportable.",
      "Evita pensar en consecuencias futuras.",
      "Se convence de que cambiar de entorno resolverá todo.",
    ],
    emotionalPatterns: [
      "Ansiedad intensa si hay quietud.",
      "Euforia seguida de bajones marcados.",
      "Vergüenza y desánimo al ver el desorden.",
    ],
    inRelationships:
      "Puede lastimar a quienes quiere con ausencias, promesas rotas o conductas impulsivas. A menudo siente culpa y miedo a que la abandonen.",
    inDecisions:
      "Decide sin evaluar, movida por la urgencia de aliviar el malestar. Luego se enfrenta a consecuencias que le cuesta asumir.",
    availableStrengths: [
      "Un deseo genuino de vivir intensamente y con alegría.",
      "Capacidad de reconocer cuando necesita ayuda si se siente comprendida.",
      "Creatividad que puede reorientarse hacia metas cuidadas.",
    ],
    possibleDifficulties: [
      "Daños a la salud, la economía o los vínculos.",
      "Dificultad para sostener rutinas básicas.",
      "Rechazo de ayuda por temor a perder libertad.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 6, la autoindulgencia se convierte en una huida compulsiva, con riesgos reales para el bienestar. Frente al nivel 8, todavía existe un hilo de conexión con sus relaciones y con sus metas, y no hay una pérdida tan fuerte de control ni un colapso marcado.",
    examples: [
      "Pasar varias noches sin dormir por actividades para evitar pensar.",
      "Gastar ahorros en un viaje para no enfrentar un problema.",
      "Dejar un trabajo de golpe sin plan al sentirse estancada.",
    ],
    reflectionQuestions: [
      "¿De qué intento alejarme cuando me muevo tan rápido?",
      "¿Qué necesitaría para sentirme segura al detenerme un rato?",
      "¿A quién podría contarle lo que me pasa sin sentirme juzgada?",
    ],
    growthOpportunities: [
      "Reducir estímulos por periodos cortos y notar qué emerge, acompañada de alguien de confianza.",
      "Si este funcionamiento resulta doloroso o limitante, buscar apoyo profesional y de personas cercanas es un paso valioso y legítimo.",
      "Cuidar sueño, alimentación y rutinas simples como base de estabilidad.",
    ],
  }),
  lv(8, {
    editorialLabel: "Funcionamiento con patrones más desadaptativos: descontrol, agotamiento y deterioro de lo cotidiano",
    description:
      "La actividad compulsiva y la evitación llevan a un notable desgaste físico y emocional. La persona pierde estabilidad en su vida cotidiana y puede aferrarse a experiencias intensas que ya no la satisfacen. Predomina la sensación de desborde.",
    characteristicExpressions: [
      "Abandona obligaciones básicas por buscar alivio inmediato.",
      "Repite conductas que le hacen daño aun sabiéndolo.",
      "Se aísla o se rodea de estímulos intensos sin descanso.",
    ],
    thinkingPatterns: [
      "Siente que no puede parar aunque lo desee.",
      "Minimiza el deterioro con explicaciones rápidas.",
      "Teme que enfrentar el dolor la destruya.",
    ],
    emotionalPatterns: [
      "Agotamiento profundo bajo una fachada animada.",
      "Culpa, vergüenza y ansiedad persistentes.",
      "Vacío que reaparece cuando termina el estímulo.",
    ],
    inRelationships:
      "Las relaciones se resienten por ausencias y cambios de humor. Puede desear la cercanía pero evitar enfrentar las consecuencias de lo ocurrido.",
    inDecisions:
      "Cuesta mucho planificar o sostener decisiones. Se guía por la necesidad inmediata de alivio.",
    availableStrengths: [
      "Una sensibilidad que puede reconocer cuánto sufre.",
      "Disposición a aceptar apoyo cuando se ofrece sin juicio.",
      "Capacidad de recuperar entusiasmo con acompañamiento.",
    ],
    possibleDifficulties: [
      "Pérdida de trabajo, de estabilidad o de vínculos.",
      "Deterioro de la salud física.",
      "Sensación de estar fuera de control.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 7, la huida impulsiva se vuelve un patrón que desborda la vida diaria y deja poca capacidad de frenar. Frente al nivel 9, todavía hay momentos de lucidez y deseo de cambio, y no domina una desesperanza tan fuerte.",
    examples: [
      "No responder llamadas y evitar a la familia por vergüenza.",
      "Mantener un ritmo de salidas y excesos que impide trabajar.",
      "Prometer cambios cada semana sin lograr sostenerlos.",
    ],
    reflectionQuestions: [
      "¿Qué me haría sentir un poco de alivio sin hacerme más daño?",
      "¿Quién me ha mostrado cuidado en el pasado y podría acompañarme ahora?",
      "¿Qué pequeño paso podría dar hoy que me devuelva algo de estabilidad?",
    ],
    growthOpportunities: [
      "Comunicar a una persona de confianza cómo te sientes, aunque sea con pocas palabras.",
      "Si este funcionamiento resulta doloroso o limitante, acudir a apoyo profesional es un acto de cuidado y fortaleza.",
      "Recuperar una rutina mínima: dormir, comer a horas regulares y salir a caminar.",
    ],
  }),
  lv(9, {
    editorialLabel: "Funcionamiento con patrones más desadaptativos: agotamiento extremo y colapso de los recursos",
    description:
      "Tras el desgaste prolongado, la persona puede sentirse sin energía, con una gran angustia y sin saber cómo detenerse. La alegría cede lugar a un cansancio profundo y a una sensación de que todo se derrumba. Es un estado de mucho sufrimiento que requiere cuidado atento.",
    characteristicExpressions: [
      "Se retira de actividades, personas y compromisos.",
      "Puede actuar de modo errático o autodestructivo para aliviar el malestar.",
      "Se muestra abatida, vacía o desorganizada.",
    ],
    thinkingPatterns: [
      "Siente que ya nada tiene sentido ni escapatoria.",
      "Se juzga con dureza por lo ocurrido.",
      "Le cuesta imaginar un futuro distinto.",
    ],
    emotionalPatterns: [
      "Agotamiento extremo y tristeza intensa.",
      "Pánico ante el silencio o la soledad.",
      "Vergüenza y arrepentimiento profundos.",
    ],
    inRelationships:
      "Es fácil que se aleje o que dependa de quien la sostenga. Necesita presencia paciente, sin reproches ni exigencias.",
    inDecisions:
      "Le cuesta decidir con claridad; puede actuar de forma abrupta para escapar del dolor y luego lamentarlo.",
    availableStrengths: [
      "Posibilidad de recuperación con cuidado y compañía.",
      "Una capacidad creativa que puede reaparecer.",
      "Deseo de volver a conectar con la alegría real.",
    ],
    possibleDifficulties: [
      "Riesgos graves para la salud y la seguridad.",
      "Aislamiento severo.",
      "Dificultad para pedir o aceptar ayuda.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 8, el desborde ya no se disfraza de actividad: da paso a un agotamiento y un desánimo marcados con poca capacidad de reacción. Es el extremo del continuo, por lo que solo se compara con el nivel 8.",
    examples: [
      "Pasar días en cama sin comunicarse tras un periodo de actividad frenética.",
      "Tomar decisiones drásticas de golpe, sin consultar a nadie.",
      "Descuidar la alimentación y el sueño por completo.",
    ],
    reflectionQuestions: [
      "¿Quién podría estar conmigo hoy, aunque no hablemos de todo?",
      "¿Qué cosa mínima puedo hacer ahora por mi cuidado?",
      "¿Qué le diría a alguien querido que estuviera pasando por esto?",
    ],
    growthOpportunities: [
      "Reconocer que el cansancio extremo y el dolor merecen atención y que pedir ayuda es válido.",
      "Si este funcionamiento resulta doloroso o limitante, buscar apoyo profesional y de personas de confianza cuanto antes es un paso importante.",
      "Dar pasos mínimos y concretos, acompañada, para recuperar descanso y seguridad.",
    ],
  }),
];
