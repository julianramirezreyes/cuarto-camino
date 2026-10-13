import type { LevelProfile } from "../schema";

type Body = Omit<LevelProfile, "type" | "level" | "sourceLevelName" | "disclaimer" | "sources" | "status">;

const DISCLAIMER =
  "Este perfil es un modelo interpretativo para la autoobservación, sin validación clínica. No describe a una persona concreta ni sustituye una evaluación profesional.";

const lv = (level: LevelProfile["level"], b: Body): LevelProfile => ({
  type: 6,
  level,
  sourceLevelName: null,
  ...b,
  disclaimer: DISCLAIMER,
  sources: ["riso-hudson-1999", "riso-hudson-1996", "hook-2021"],
  status: "draft",
});

export const levels6: LevelProfile[] = [
  lv(1, {
    editorialLabel: "Funcionamiento muy flexible: confianza interior y valentía serena",
    description:
      "La persona del tipo 6 se apoya en una confianza que ya no depende de que todo esté asegurado. Puede dudar, preguntar y aun así actuar. La lealtad se vive como elección libre, no como necesidad de protección.",
    characteristicExpressions: [
      "Actúa con coraje tranquilo cuando hay incertidumbre real.",
      "Se compromete con personas y causas sin exigir garantías absolutas.",
      "Pide ayuda y también la ofrece con naturalidad.",
    ],
    thinkingPatterns: [
      "Evalúa riesgos sin quedar atrapada en ellos.",
      "Distingue entre peligro real y miedo anticipado.",
      "Puede sostener una duda abierta sin urgencia por resolverla.",
    ],
    emotionalPatterns: [
      "El miedo aparece y pasa sin tomar el mando.",
      "Hay una calma estable que no depende de la aprobación ajena.",
      "Expresa vulnerabilidad sin sentirse expuesta.",
    ],
    inRelationships:
      "Ofrece una presencia firme y cálida. Confía en los demás sin ingenuidad y tolera que otros piensen distinto sin leerlo como amenaza.",
    inDecisions:
      "Consulta opiniones, pero termina decidiendo con su propio criterio. Acepta que ninguna decisión elimina todo el riesgo.",
    availableStrengths: [
      "Fiabilidad genuina y sentido del compromiso.",
      "Capacidad de anticipar problemas de forma útil.",
      "Valentía para sostener lo que considera justo.",
    ],
    possibleDifficulties: [
      "Puede costarle bajar el ritmo de alerta en momentos de mucho estrés.",
      "A veces carga con responsabilidades por lealtad.",
      "La inquietud puede reaparecer ante cambios bruscos.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 2, aquí la confianza no necesita apoyos externos para sostenerse; en el nivel 2 ya aparece cierta búsqueda de referentes confiables, aunque con buen criterio propio.",
    examples: [
      "Aceptar un trabajo con riesgos razonables tras informarse, sin buscar certeza total.",
      "Defender a un compañero en una reunión sin esperar a ver quién más lo hace.",
      "Reconocer un miedo en voz alta y seguir adelante con un plan sencillo.",
    ],
    reflectionQuestions: [
      "¿En qué situaciones siento confianza sin necesitar comprobarlo todo?",
      "¿Qué me ayuda a distinguir un riesgo real de uno imaginado?",
      "¿Cómo expreso mi lealtad cuando no hay presión externa?",
    ],
    growthOpportunities: [
      "Practicar descanso y juego sin sentir que bajas la guardia de forma peligrosa.",
      "Compartir tu experiencia de confianza con personas que viven más ansiedad.",
      "Cuidar que la responsabilidad no se convierta en una carga permanente.",
    ],
  }),
  lv(2, {
    editorialLabel: "Funcionamiento flexible: compromiso y cooperación confiable",
    description:
      "La persona valora la estabilidad y se une a grupos, familias o proyectos con entrega. Todavía confía en sí misma, pero le tranquiliza contar con personas e ideas en las que apoyarse. Su cooperación es cálida y constante.",
    characteristicExpressions: [
      "Cumple sus compromisos y espera reciprocidad razonable.",
      "Busca mentores, equipos o tradiciones que den orientación.",
      "Se preocupa por el bienestar de su círculo cercano.",
    ],
    thinkingPatterns: [
      "Piensa en lo que podría salir mal para prevenirlo.",
      "Contrasta su opinión con la de personas de confianza.",
      "Valora los acuerdos claros y las reglas compartidas.",
    ],
    emotionalPatterns: [
      "Siente seguridad cuando pertenece a algo estable.",
      "Una leve inquietud la mantiene atenta, sin paralizarla.",
      "Se emociona con la camaradería y la fidelidad mutua.",
    ],
    inRelationships:
      "Es una amistad o pareja leal y constante. Muestra afecto a través del compromiso y de estar presente en los momentos difíciles.",
    inDecisions:
      "Prefiere decidir tras consultar y revisar riesgos. Una vez comprometida, mantiene la decisión con perseverancia.",
    availableStrengths: [
      "Trabajo en equipo y sentido de comunidad.",
      "Prudencia práctica al planificar.",
      "Constancia en proyectos de largo plazo.",
    ],
    possibleDifficulties: [
      "Puede depender un poco más de la validación de su grupo.",
      "Le cuesta decidir cuando las opiniones de su entorno se contradicen.",
      "A veces pospone iniciativas propias por no querer arriesgar la estabilidad.",
    ],
    differenceFromAdjacent:
      "Respecto al nivel 1, la seguridad pasa de ser interior a apoyarse bastante en vínculos y estructuras. Respecto al nivel 3, todavía la persona no necesita convencerse de que hace lo correcto mediante esfuerzo constante o mucho trabajo.",
    examples: [
      "Preparar con anticipación un viaje familiar revisando detalles y alternativas.",
      "Consultar a dos colegas antes de proponer un cambio en el trabajo.",
      "Quedarse a apoyar a un amigo en una mudanza aunque tenga otros planes.",
    ],
    reflectionQuestions: [
      "¿De qué personas o estructuras recibo mayor seguridad y por qué?",
      "¿Cuándo consulto por verdadero interés y cuándo por inseguridad?",
      "¿Qué decisiones podría tomar hoy sin pedir más opiniones?",
    ],
    growthOpportunities: [
      "Tomar pequeñas decisiones sin consultar y observar cómo te sientes.",
      "Reconocer cuánta confianza ya has construido en tu criterio.",
      "Ampliar tu círculo de apoyo para no depender de una sola fuente.",
    ],
  }),
  lv(3, {
    editorialLabel: "Funcionamiento flexible: esfuerzo, responsabilidad y búsqueda de seguridad",
    description:
      "La persona se esfuerza mucho por cumplir sus deberes y por mantener a salvo lo que valora. Hay disciplina, organización y trabajo constante. Empieza a aparecer cierta tensión por demostrar que es digna de confianza y por evitar errores.",
    characteristicExpressions: [
      "Trabaja con dedicación y revisa los detalles con cuidado.",
      "Sostiene rutinas que protegen a su familia o equipo.",
      "Cumple con lo esperado y a veces ofrece más de lo necesario.",
    ],
    thinkingPatterns: [
      "Calcula posibles consecuencias antes de actuar.",
      "Se exige cumplir bien para no fallar a otros.",
      "Compara las situaciones nuevas con experiencias previas.",
    ],
    emotionalPatterns: [
      "Siente satisfacción al cumplir y tensión cuando algo se escapa de control.",
      "Una preocupación de fondo la acompaña aunque todo vaya bien.",
      "Se alivia al terminar tareas y cerrar pendientes.",
    ],
    inRelationships:
      "Se muestra confiable y entregada, aunque a veces espera que los demás respondan con el mismo nivel de compromiso. Puede cansarse en silencio.",
    inDecisions:
      "Decide con prudencia y mucha preparación. Le cuesta delegar y puede tardar si siente que le falta información.",
    availableStrengths: [
      "Disciplina y organización.",
      "Capacidad de sostener responsabilidades pesadas.",
      "Atención a los detalles que otros pasan por alto.",
    ],
    possibleDifficulties: [
      "Tendencia a sobrecargarse de obligaciones.",
      "Cansancio por una vigilancia constante.",
      "Dificultad para disfrutar sin sentir que olvida algo importante.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 2, el compromiso se vuelve más exigente: ya no solo coopera, también trabaja de más para ganarse seguridad. Frente al nivel 4, aún no hay una desconfianza marcada hacia la autoridad ni necesidad de pruebas constantes del entorno.",
    examples: [
      "Revisar tres veces un informe antes de enviarlo, aunque ya estaba bien.",
      "Aceptar horas extras para evitar que un equipo quede desprotegido.",
      "Dejar listo un plan alternativo para cualquier imprevisto de un evento.",
    ],
    reflectionQuestions: [
      "¿Qué cantidad de preparación es suficiente para sentirme tranquila?",
      "¿A quién le exijo tanto como me exijo a mí misma?",
      "¿Qué haría hoy si me permitiera cumplir al ochenta por ciento?",
    ],
    growthOpportunities: [
      "Delegar una tarea pequeña y observar qué ocurre realmente.",
      "Incluir descanso en tu agenda como parte del compromiso, no como recompensa.",
      "Notar cuándo la preparación sirve a la tarea y cuándo solo calma el miedo.",
    ],
  }),
  lv(4, {
    editorialLabel: "Funcionamiento intermedio: cautela marcada y necesidad de garantías",
    description:
      "La inseguridad se vuelve más visible y la persona busca reglas, jerarquías o figuras que le indiquen qué hacer. Se muestra cautelosa y a veces evita decidir por sí misma. La duda ocupa más espacio en su día a día.",
    characteristicExpressions: [
      "Pide instrucciones precisas antes de comenzar algo.",
      "Cumple normas con rigidez para no cometer errores.",
      "Se apoya en autoridades o en grupos para validar lo que piensa.",
    ],
    thinkingPatterns: [
      "Repasa escenarios problemáticos antes de actuar.",
      "Busca señales que confirmen si algo es seguro o no.",
      "Duda de su propia lectura de la situación.",
    ],
    emotionalPatterns: [
      "Ansiedad anticipatoria frecuente ante decisiones.",
      "Alivio fuerte cuando alguien confiable da una indicación clara.",
      "Irritación leve cuando la información cambia.",
    ],
    inRelationships:
      "Busca seguridad constante en los vínculos y puede pedir confirmaciones de afecto o de compromiso. Se incomoda cuando las otras personas son ambiguas o impredecibles.",
    inDecisions:
      "Pospone o consulta repetidamente. Prefiere procedimientos conocidos y tiende a evitar caminos que no tienen respaldo.",
    availableStrengths: [
      "Atención cuidadosa a las reglas y procedimientos.",
      "Lealtad con quienes percibe como confiables.",
      "Detección temprana de inconsistencias.",
    ],
    possibleDifficulties: [
      "Indecisión que retrasa proyectos.",
      "Dependencia de la aprobación de figuras de autoridad.",
      "Cansancio por darle vueltas a los mismos temas.",
    ],
    differenceFromAdjacent:
      "Respecto al nivel 3, la preocupación deja de canalizarse sobre todo en trabajo y pasa a mostrarse como duda e indecisión visibles. Respecto al nivel 5, todavía confía en referentes y no suele desconfiar de ellos con la misma fuerza ni alternar con claridad entre buscar apoyo y rebelarse.",
    examples: [
      "Pedir por escrito las instrucciones de una tarea antes de empezar.",
      "Preguntarle a tres personas si conviene aceptar una oferta.",
      "Evitar opinar en una reunión hasta saber qué piensa quien dirige.",
    ],
    reflectionQuestions: [
      "¿Qué tipo de garantías busco con más frecuencia y qué me dan en realidad?",
      "¿Cuándo hago caso a una indicación aunque mi intuición diga otra cosa?",
      "¿Qué pequeña decisión podría tomar hoy a partir de mi criterio?",
    ],
    growthOpportunities: [
      "Anotar tu opinión antes de consultar y compararla después con la de otros.",
      "Practicar decisiones de bajo riesgo para fortalecer la confianza propia.",
      "Observar cuántas veces tus temores previos no se cumplieron.",
    ],
  }),
  lv(5, {
    editorialLabel: "Funcionamiento intermedio: alternancia entre buscar apoyo y poner a prueba",
    description:
      "La persona oscila entre depender de figuras de apoyo y sospechar de ellas. Puede mostrarse cercana un día y reservada o desafiante al siguiente. La ambivalencia se nota tanto hacia los demás como hacia sus propias decisiones.",
    characteristicExpressions: [
      "Pone a prueba sutilmente la lealtad de los demás.",
      "Alterna entre obedecer y cuestionar abiertamente.",
      "Cambia de postura según se sienta apoyada o no.",
    ],
    thinkingPatterns: [
      "Busca motivos ocultos detrás de lo que otros dicen.",
      "Piensa en dos o tres versiones opuestas de un mismo hecho.",
      "Se queda con los datos que sostienen su inquietud.",
    ],
    emotionalPatterns: [
      "Alternancia entre cercanía necesitada y recelo defensivo.",
      "Tensión interna ante la ambigüedad.",
      "Culpa cuando siente que fue injusta con alguien de confianza.",
    ],
    inRelationships:
      "Puede acercarse con entusiasmo y luego tomar distancia al percibir una señal ambigua. Quienes la rodean pueden sentirse puestos a prueba sin saberlo.",
    inDecisions:
      "Se debate entre opciones opuestas y a veces decide de forma reactiva para salir de la tensión. Luego puede replantearse lo hecho.",
    availableStrengths: [
      "Sensibilidad para detectar incoherencias.",
      "Capacidad de cuestionar con argumentos.",
      "Gran lealtad cuando se siente respetada.",
    ],
    possibleDifficulties: [
      "Interpretaciones apresuradas de gestos neutros.",
      "Cambios de postura que desconciertan a otros.",
      "Desgaste en relaciones por la puesta a prueba constante.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 4, la necesidad de garantías se mezcla con desconfianza y reacciones de contraste. Frente al nivel 6, todavía puede reconocer su propia ambivalencia y aún no reacciona con tanta intensidad defensiva ni culpa de manera sistemática a otros.",
    examples: [
      "Preguntar de forma indirecta a un amigo para ver si realmente le importa un tema.",
      "Aceptar un consejo y luego buscar razones para rechazarlo.",
      "Sentir calma con un jefe claro y recelo con otro más ambiguo.",
    ],
    reflectionQuestions: [
      "¿Qué señales interpreto como falta de apoyo y qué otras explicaciones podrían existir?",
      "¿Cómo se sienten las personas cuando las pongo a prueba?",
      "¿Qué le diría a una amiga que dudara de mí con la misma intensidad?",
    ],
    growthOpportunities: [
      "Preguntar de manera directa lo que quieres saber en lugar de poner a prueba.",
      "Tomar nota de cuándo tus sospechas se confirmaron y cuándo no.",
      "Contar con una persona de confianza que te devuelva otra lectura de la situación.",
    ],
  }),
  lv(6, {
    editorialLabel: "Funcionamiento intermedio: reactividad defensiva y tensión sostenida",
    description:
      "La inquietud se traduce en reacciones defensivas más intensas: sarcasmo, terquedad, acusaciones o retraimiento. La persona puede sentirse acorralada y responder con dureza hacia quienes percibe como amenaza, aunque por dentro tenga miedo.",
    characteristicExpressions: [
      "Reacciona con ironía o dureza cuando se siente cuestionada.",
      "Se vuelve inflexible con sus ideas o con grupos de pertenencia.",
      "Señala fallas ajenas para aliviar su propia tensión.",
    ],
    thinkingPatterns: [
      "Divide a las personas entre aliadas y amenazantes.",
      "Anticipa lo peor y lo trata casi como un hecho.",
      "Le cuesta incorporar información que contradice sus sospechas.",
    ],
    emotionalPatterns: [
      "Tensión física y mental que casi no cede.",
      "Enojo que cubre un miedo más profundo.",
      "Culpa y cansancio después de reaccionar con demasiada fuerza.",
    ],
    inRelationships:
      "Genera conflictos por reacciones desproporcionadas y por tomar posiciones tajantes. Aun así, desea cercanía y suele arrepentirse después.",
    inDecisions:
      "Decide por reacción, con mirada de corto plazo. Cuesta que escuche alternativas cuando se siente atacada.",
    availableStrengths: [
      "Capacidad de defender a otros con firmeza.",
      "Olfato para detectar riesgos reales.",
      "Honestidad directa cuando se siente a salvo.",
    ],
    possibleDifficulties: [
      "Discusiones que escalan rápido.",
      "Aislamiento por el desgaste de los vínculos.",
      "Agotamiento por una alerta casi permanente.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 5, la ambivalencia se endurece en reacciones defensivas visibles hacia los demás. Frente al nivel 7, todavía puede reflexionar y repararse tras el conflicto, y no domina una sensación de inseguridad y desvalimiento tan fuerte.",
    examples: [
      "Responder con sarcasmo a una pregunta de un colega que percibió como crítica.",
      "Cortar una conversación tras sentirse juzgada, y lamentarlo después.",
      "Defender con firmeza a su equipo ante un directivo, con tono muy agresivo.",
    ],
    reflectionQuestions: [
      "¿Qué siento justo antes de reaccionar con dureza?",
      "¿Qué temor podría estar debajo de mi enojo?",
      "¿Cómo puedo pedir una pausa cuando noto que me estoy defendiendo?",
    ],
    growthOpportunities: [
      "Introducir una pausa corta de respiración antes de responder en situaciones tensas.",
      "Repasar después de un conflicto qué parte fue miedo y qué parte fue hecho.",
      "Cultivar espacios de calma corporal, como caminar o estirarse, que bajen la alerta.",
    ],
  }),
  lv(7, {
    editorialLabel: "Funcionamiento con patrones más desadaptativos: inseguridad intensa y dependencia de apoyo",
    description:
      "La inseguridad y el miedo pesan de forma muy fuerte. La persona se siente poco capaz de enfrentar la vida por sí misma y se aferra a figuras o grupos para sentirse sostenida. Puede perder confianza en su juicio y mostrarse muy dependiente.",
    characteristicExpressions: [
      "Necesita que otros decidan o confirmen casi todo.",
      "Se deprecia con frecuencia y minimiza sus capacidades.",
      "Evita por completo situaciones con riesgo o con exposición.",
    ],
    thinkingPatterns: [
      "Se ve como poco capaz ante los desafíos.",
      "Imagina que, sin apoyo, algo grave ocurriría.",
      "Acepta con rapidez la opinión de quien percibe fuerte.",
    ],
    emotionalPatterns: [
      "Miedo persistente a quedarse sin respaldo.",
      "Vergüenza y desánimo al compararse con otros.",
      "Alivio breve al recibir protección, seguido de nueva inquietud.",
    ],
    inRelationships:
      "Se vincula desde la necesidad y le cuesta imponer límites. Puede tolerar tratos injustos por miedo a perder respaldo.",
    inDecisions:
      "Casi no decide por sí misma. Delega con facilidad, incluso en asuntos importantes, y teme asumir consecuencias.",
    availableStrengths: [
      "Sensibilidad profunda al sufrimiento ajeno.",
      "Capacidad de agradecer y de vincularse con lealtad.",
      "Disposición a recibir ayuda cuando se la ofrecen con respeto.",
    ],
    possibleDifficulties: [
      "Pérdida de confianza en el propio criterio.",
      "Vulnerabilidad a relaciones desiguales.",
      "Dificultad para avanzar en proyectos personales.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 6, la reactividad se transforma en un sentimiento de impotencia y subordinación más fuerte. Frente al nivel 8, todavía la persona puede reconocer el sufrimiento que siente y tiene algún margen para pedir ayuda sin reaccionar de forma impulsiva.",
    examples: [
      "Pedir permiso para decisiones cotidianas que antes tomaba sin problema.",
      "Permanecer en un entorno que le hace daño por miedo a quedarse sola.",
      "Rechazar una oportunidad por considerar que no estará a la altura.",
    ],
    reflectionQuestions: [
      "¿Qué parte de mí sigue sabiendo lo que quiere, aunque me cueste decirlo?",
      "¿Cuándo he sorprendido a otros y a mí misma con algo que sí pude hacer?",
      "¿En quién puedo apoyarme sin que esa persona decida por mí?",
    ],
    growthOpportunities: [
      "Empezar con decisiones muy pequeñas y celebrarlas como logros reales.",
      "Si este funcionamiento resulta doloroso o limitante, buscar apoyo profesional y de personas de confianza es un paso valioso y legítimo.",
      "Recordar logros pasados concretos para reconstruir confianza paso a paso.",
    ],
  }),
  lv(8, {
    editorialLabel: "Funcionamiento con patrones más desadaptativos: desconfianza intensa y aislamiento reactivo",
    description:
      "El miedo se vuelve muy intenso y la persona puede interpretar con rapidez que los demás la amenazan. Alterna entre retraimiento y respuestas bruscas. La sensación de estar bajo ataque o de no tener salida condiciona buena parte de su vida cotidiana.",
    characteristicExpressions: [
      "Se aísla o se muestra hostil ante lo que percibe como amenaza.",
      "Culpa a otros de sus dificultades o de lo que teme.",
      "Reacciona con fuerza cuando siente que puede ser lastimada.",
    ],
    thinkingPatterns: [
      "Interpreta mensajes neutros como ataques posibles.",
      "Siente que debe protegerse constantemente.",
      "Se aferra a explicaciones que justifican su alerta.",
    ],
    emotionalPatterns: [
      "Miedo agudo y sensación de estar acorralada.",
      "Enojo defensivo que oculta una gran fragilidad.",
      "Agotamiento profundo y soledad.",
    ],
    inRelationships:
      "Las relaciones se vuelven tensas y a veces se rompen. Rechaza el contacto aunque en el fondo anhele sentirse a salvo y acompañada.",
    inDecisions:
      "Decide desde la urgencia de protegerse, sin tiempo para evaluar. Después puede sentir arrepentimiento o confusión.",
    availableStrengths: [
      "Una enorme necesidad y capacidad de cuidar lo que ama.",
      "Honestidad intensa sobre lo que siente.",
      "Fuerza interior que puede orientarse hacia la protección sana.",
    ],
    possibleDifficulties: [
      "Pérdida de vínculos y redes de apoyo.",
      "Dificultad para distinguir amenaza real de percibida.",
      "Desgaste físico y emocional fuerte.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 7, la inseguridad deja de expresarse como búsqueda de apoyo y se vuelve hostilidad o aislamiento defensivo. Frente al nivel 9, aún conserva alguna capacidad de contacto, de reconocer su dolor y de pedir ayuda, aunque con mucha dificultad.",
    examples: [
      "Dejar de responder mensajes por sentir que alguien quiere perjudicarla.",
      "Confrontar de forma brusca a una persona cercana por un malentendido.",
      "Cambiar de rutinas o de lugar de trabajo por sospechas persistentes.",
    ],
    reflectionQuestions: [
      "¿Qué necesito en este momento para sentirme un poco más a salvo?",
      "¿Hay alguien que ha cuidado de mí y a quien podría escuchar con calma?",
      "¿Qué parte de mi miedo me protege y qué parte me aísla?",
    ],
    growthOpportunities: [
      "Buscar un espacio de contención seguro, con una persona de confianza, para contar lo que sientes.",
      "Si este funcionamiento resulta doloroso o limitante, acercarte a apoyo profesional es un acto de cuidado y no de debilidad.",
      "Priorizar rutinas básicas de sueño, alimentación y movimiento que reduzcan la tensión.",
    ],
  }),
  lv(9, {
    editorialLabel: "Funcionamiento con patrones más desadaptativos: miedo abrumador y búsqueda desesperada de salida",
    description:
      "El miedo y la sensación de vulnerabilidad se vuelven abrumadores. La persona puede sentir que no hay salida y actuar de manera extrema para escapar de la angustia, entregándose a figuras que parecen fuertes o rechazando todo apoyo. Es un nivel de gran sufrimiento y necesidad de cuidado.",
    characteristicExpressions: [
      "Se desmorona emocionalmente ante la presión.",
      "Se somete a otros o ataca de forma repentina por desesperación.",
      "Descuida su propio bienestar y seguridad.",
    ],
    thinkingPatterns: [
      "Siente que no puede sostener nada por sí misma.",
      "Ve el entorno como una amenaza casi total.",
      "Le cuesta pensar con claridad bajo la angustia.",
    ],
    emotionalPatterns: [
      "Angustia intensa y sensación de desamparo.",
      "Culpa y vergüenza profundas.",
      "Agotamiento extremo y desesperanza.",
    ],
    inRelationships:
      "La relación con otros se rompe o se vuelve muy dependiente. Necesita presencia segura y paciente, y es fácil que se sienta incomprendida.",
    inDecisions:
      "Casi no logra decidir con claridad. Puede actuar de manera impulsiva para aliviar el malestar, con consecuencias que luego lamenta.",
    availableStrengths: [
      "Un deseo genuino de seguridad y de vínculo.",
      "Capacidad de recibir cuidado cuando se ofrece con calidez.",
      "Posibilidad de recuperarse con acompañamiento adecuado.",
    ],
    possibleDifficulties: [
      "Riesgo de dañar su salud o sus relaciones por desesperación.",
      "Aislamiento severo.",
      "Dificultad para reconocer que hay ayuda disponible.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 8, ya no predomina la defensa activa sino un colapso emocional marcado, con poco margen para reflexionar o sostener la distancia con el miedo. Es el extremo del continuo, así que aquí solo se compara con el nivel 8.",
    examples: [
      "Tomar decisiones drásticas de forma abrupta tras un episodio de gran angustia.",
      "Aferrarse a una persona o a un grupo sin evaluar si le hace bien.",
      "Dejar de atender necesidades básicas por la intensidad del miedo.",
    ],
    reflectionQuestions: [
      "¿Quién podría acompañarme ahora, aunque sea unos minutos?",
      "¿Qué es lo más pequeño que podría hacer hoy para sentirme un poco más segura?",
      "¿Qué me diría una persona que me quiere si viera cómo estoy?",
    ],
    growthOpportunities: [
      "Reconocer que el sufrimiento intenso merece atención y que pedir ayuda es una forma de fortaleza.",
      "Si este funcionamiento resulta doloroso o limitante, buscar apoyo profesional y de personas de confianza lo antes posible es un paso importante.",
      "Apoyarte en una persona segura para dar pasos mínimos y concretos, uno a la vez.",
    ],
  }),
];
