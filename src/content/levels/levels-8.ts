import type { LevelProfile } from "../schema";

type Body = Omit<LevelProfile, "type" | "level" | "sourceLevelName" | "disclaimer" | "sources" | "status">;

const DISCLAIMER =
  "Este perfil es un modelo interpretativo para la autoobservación, sin validación clínica. No describe a una persona concreta ni sustituye una evaluación profesional.";

const lv = (level: LevelProfile["level"], b: Body): LevelProfile => ({
  type: 8,
  level,
  sourceLevelName: null,
  ...b,
  disclaimer: DISCLAIMER,
  sources: ["riso-hudson-1999", "riso-hudson-1996", "hook-2021"],
  status: "draft",
});

export const levels8: LevelProfile[] = [
  lv(1, {
    editorialLabel: "Funcionamiento muy flexible: fuerza que se permite la ternura",
    description:
      "La persona del tipo 8 usa su fuerza para proteger y cuidar, no para imponerse. Puede mostrarse vulnerable sin sentir que pierde poder. Su autoridad es generosa y su firmeza convive con delicadeza.",
    characteristicExpressions: [
      "Protege a otros sin necesidad de dominar.",
      "Reconoce abiertamente sus errores y sus límites.",
      "Expresa cariño de forma directa y sencilla.",
    ],
    thinkingPatterns: [
      "Distingue entre fuerza y control.",
      "Ve la vulnerabilidad como parte de la fuerza.",
      "Considera cómo sus decisiones afectan a quienes dependen de ella.",
    ],
    emotionalPatterns: [
      "Confianza tranquila que no necesita demostrar nada.",
      "Ternura abierta hacia personas vulnerables.",
      "Enojo que se expresa y se resuelve sin rencor.",
    ],
    inRelationships:
      "Es una presencia segura que da espacio. Acepta que otros tengan fuerza propia y no la usa para someter.",
    inDecisions:
      "Decide con firmeza, escucha las voces ajenas y reconsidera cuando hay buenas razones.",
    availableStrengths: [
      "Liderazgo generoso y protector.",
      "Valentía para defender lo justo.",
      "Capacidad de inspirar a otros a crecer.",
    ],
    possibleDifficulties: [
      "Puede asumir demasiado peso por proteger.",
      "A veces olvida cuidarse a sí misma.",
      "Puede intimidar sin querer por su presencia.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 2, aquí la fuerza se vive con total apertura hacia la vulnerabilidad; en el nivel 2 ya se nota más la seguridad en sí misma y cierto cuidado de mostrarse fuerte.",
    examples: [
      "Defender a alguien con menos poder y luego pedirle su opinión sobre cómo seguir.",
      "Llorar frente a un grupo de confianza sin sentirse débil.",
      "Ceder el protagonismo a otra persona que lo merece más.",
    ],
    reflectionQuestions: [
      "¿Cuándo me permito mostrar ternura sin sentirme expuesta?",
      "¿Cómo uso mi fuerza para que otros crezcan?",
      "¿Qué necesito yo, además de proteger a los demás?",
    ],
    growthOpportunities: [
      "Pedir cuidado y apoyo en momentos de cansancio.",
      "Compartir tu forma de ejercer fuerza con personas más jóvenes.",
      "Mantener espacios donde puedas dejar de ser quien sostiene todo.",
    ],
  }),
  lv(2, {
    editorialLabel: "Funcionamiento flexible: seguridad en sí misma y autonomía",
    description:
      "La persona confía en su criterio y en sus recursos. Es independiente, directa y decidida. Le importa la autonomía y busca mantener el control de su vida, aunque aún se permite ser sensible con los suyos.",
    characteristicExpressions: [
      "Dice con claridad lo que piensa y lo que quiere.",
      "Toma la iniciativa cuando otros dudan.",
      "Defiende su independencia con naturalidad.",
    ],
    thinkingPatterns: [
      "Prefiere la verdad directa a los rodeos.",
      "Valora la autosuficiencia.",
      "Evalúa quién tiene la capacidad real de hacer algo.",
    ],
    emotionalPatterns: [
      "Seguridad firme y energía estable.",
      "Enojo que aparece con claridad ante injusticias.",
      "Ternura que reserva para pocas personas.",
    ],
    inRelationships:
      "Es directa y leal. Espera honestidad y respeto por su autonomía, y suele respaldar a quienes quiere con hechos.",
    inDecisions:
      "Decide con rapidez y asume las consecuencias. Escucha a otros, aunque no siempre pide consejo.",
    availableStrengths: [
      "Determinación y autonomía.",
      "Claridad al comunicar.",
      "Capacidad de actuar bajo presión.",
    ],
    possibleDifficulties: [
      "Puede tardar en reconocer cuando necesita ayuda.",
      "Su franqueza a veces resulta brusca.",
      "Se impacienta con la indecisión ajena.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 1, la fuerza se centra más en la autonomía propia y menos en abrirse a la vulnerabilidad. Frente al nivel 3, todavía no necesita demostrar liderazgo ni imponerse como figura central para sentirse segura.",
    examples: [
      "Emprender un proyecto propio y asumir los riesgos.",
      "Decirle a un colega con respeto que su propuesta no funciona.",
      "Resolver una situación familiar tensa con una decisión clara.",
    ],
    reflectionQuestions: [
      "¿En qué momentos mi franqueza ayuda y en cuáles hiere?",
      "¿A quién le permito ayudarme sin sentir que pierdo control?",
      "¿Qué parte de mí se ablanda con las personas cercanas?",
    ],
    growthOpportunities: [
      "Pedir consejo en un asunto en el que normalmente decidirías sola.",
      "Dar tiempo a las personas más pausadas antes de intervenir.",
      "Reconocer en voz alta los logros de quienes te rodean.",
    ],
  }),
  lv(3, {
    editorialLabel: "Funcionamiento flexible: liderazgo decidido y protección asertiva",
    description:
      "La persona asume el mando con naturalidad y empuja proyectos, equipos o familias hacia adelante. Su energía es poderosa y práctica. Empieza a notarse un deseo de que las cosas se hagan a su manera y cierta intensidad al presionar.",
    characteristicExpressions: [
      "Toma el liderazgo en situaciones complejas.",
      "Motiva a otros con su energía y confianza.",
      "Se impone cuando ve injusticia o ineficiencia.",
    ],
    thinkingPatterns: [
      "Piensa en términos de acción y resultados.",
      "Identifica rápidamente quién controla qué.",
      "Prefiere resolver en lugar de discutir.",
    ],
    emotionalPatterns: [
      "Orgullo y vitalidad al lograr cosas.",
      "Impaciencia con la lentitud o la burocracia.",
      "Enojo que se enciende pronto y se disipa rápido.",
    ],
    inRelationships:
      "Protege y empuja a los suyos, aunque a veces decide por ellos. Espera lealtad y respeta a quienes le hacen frente con honestidad.",
    inDecisions:
      "Decide con rapidez y espera que los demás sigan. Puede tener dificultad para escuchar objeciones cuando ya ha resuelto.",
    availableStrengths: [
      "Liderazgo práctico y resolutivo.",
      "Capacidad de movilizar recursos.",
      "Valentía ante el conflicto.",
    ],
    possibleDifficulties: [
      "Puede atropellar los ritmos de otras personas.",
      "Tendencia a asumir todo el control.",
      "Dificultad para delegar sin vigilar.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 2, la seguridad se convierte en liderazgo activo que moviliza a otros. Frente al nivel 4, todavía lidera por convicción y no necesita probar su poder frente a los demás ni vigilar si la respetan.",
    examples: [
      "Reorganizar un equipo en crisis y repartir tareas en una hora.",
      "Enfrentar a un proveedor que incumplió un acuerdo.",
      "Decidir un plan familiar sin esperar una larga conversación.",
    ],
    reflectionQuestions: [
      "¿Cuándo mi liderazgo da espacio y cuándo lo ocupa todo?",
      "¿Qué siento cuando alguien cuestiona mi decisión?",
      "¿Qué haría diferente si confiara más en la capacidad de los demás?",
    ],
    growthOpportunities: [
      "Delegar una responsabilidad completa y no intervenir durante un tiempo.",
      "Preguntar antes de decidir por otros.",
      "Dar reconocimiento explícito a quienes cumplen bien su parte.",
    ],
  }),
  lv(4, {
    editorialLabel: "Funcionamiento intermedio: necesidad de control y de ser respetada",
    description:
      "La persona siente que debe mantener el control para no ser vulnerable. Se vuelve más competitiva y pone a prueba el respeto de los demás. Los límites se viven como desafíos y la franqueza empieza a endurecerse.",
    characteristicExpressions: [
      "Marca territorio y deja claro quién decide.",
      "Compite con otros por influencia o reconocimiento.",
      "Pone a prueba la firmeza de quienes la rodean.",
    ],
    thinkingPatterns: [
      "Interpreta muchas situaciones como lucha de poder.",
      "Sospecha de quien parece demasiado complaciente o suave.",
      "Valora a las personas según su fuerza percibida.",
    ],
    emotionalPatterns: [
      "Tensión ante cualquier señal de ser controlada.",
      "Enojo más frecuente y con mayor intensidad.",
      "Incomodidad con las emociones de vulnerabilidad.",
    ],
    inRelationships:
      "Se muestra dominante y cuestiona la autoridad ajena. Aprecia a quienes la enfrentan con firmeza, pero le cuesta abrirse con ternura.",
    inDecisions:
      "Decide pronto y espera acatamiento. Le molesta que se discuta una vez tomada la decisión.",
    availableStrengths: [
      "Determinación y resistencia.",
      "Habilidad para negociar desde la firmeza.",
      "Franqueza que despeja confusiones.",
    ],
    possibleDifficulties: [
      "Relaciones con rivalidad o tensión permanente.",
      "Dificultad para aceptar críticas.",
      "Aislamiento emocional por no mostrarse vulnerable.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 3, el liderazgo deja de ser solo impulso por la tarea y pasa a girar en torno al control y al respeto personal. Frente al nivel 5, aún no impone sus normas con tanta dureza ni exige lealtad incondicional a quienes la rodean.",
    examples: [
      "Contradecir públicamente a un compañero para marcar su posición.",
      "Negarse a seguir una instrucción porque no la dio ella.",
      "Responder con fuerza a un comentario que percibe como falta de respeto.",
    ],
    reflectionQuestions: [
      "¿Qué temo que ocurra si dejo de tener el control?",
      "¿A quién podría escuchar sin sentir que pierdo poder?",
      "¿Qué significa para mí el respeto y cómo lo pido?",
    ],
    growthOpportunities: [
      "Aceptar una crítica sin responder de inmediato y evaluarla al día siguiente.",
      "Reconocer una vez al día algo que otro hizo mejor que tú.",
      "Mostrar a una persona de confianza una parte vulnerable de tu experiencia.",
    ],
  }),
  lv(5, {
    editorialLabel: "Funcionamiento intermedio: dominio, bravuconería y exigencia de lealtad",
    description:
      "La persona se muestra dura, jactanciosa y exigente. Impone su criterio y espera lealtad total. Teme parecer débil, por lo que tiende a magnificar su fuerza y a minimizar las necesidades de los demás.",
    characteristicExpressions: [
      "Presume su poder, su capacidad o su experiencia.",
      "Impone normas y castiga la desobediencia.",
      "Habla con volumen o dureza para marcar autoridad.",
    ],
    thinkingPatterns: [
      "Considera que ser amable es una debilidad.",
      "Cree que la fuerza resuelve la mayoría de los problemas.",
      "Divide el mundo entre quienes se someten y quienes se enfrentan.",
    ],
    emotionalPatterns: [
      "Rabia fácil y expresión intensa.",
      "Desconfianza hacia la ternura o la gratitud.",
      "Soledad que no reconoce.",
    ],
    inRelationships:
      "Puede ser protectora pero también autoritaria. Los demás pueden sentir miedo o cautela, y ella no siempre lo nota.",
    inDecisions:
      "Decide de forma unilateral y espera obediencia. Considera las dudas como falta de compromiso.",
    availableStrengths: [
      "Fuerza para sostener decisiones difíciles.",
      "Capacidad de resistir presión.",
      "Lealtad profunda con quienes la respetan.",
    ],
    possibleDifficulties: [
      "Relaciones marcadas por el miedo o el resentimiento.",
      "Pérdida de información valiosa por no escuchar.",
      "Incapacidad para pedir perdón.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 4, la competencia se convierte en dominio abierto y exigencia de sumisión. Frente al nivel 6, todavía conserva un criterio de justicia y cierto vínculo afectivo, y no recurre a la intimidación como forma habitual.",
    examples: [
      "Hablar fuerte en una reunión para que nadie discuta su propuesta.",
      "Presumir de logros pasados ante un grupo nuevo.",
      "Responder con silencio frío a quien cuestionó su decisión.",
    ],
    reflectionQuestions: [
      "¿Qué siento cuando alguien me muestra afecto sin pedir nada?",
      "¿Cómo se sienten los demás cuando levanto la voz?",
      "¿Qué protegería yo si pudiera bajar un poco la guardia?",
    ],
    growthOpportunities: [
      "Preguntar a alguien de confianza cómo te percibe cuando discutes.",
      "Practicar disculpas simples y concretas.",
      "Dar espacio a que otros decidan en asuntos menores.",
    ],
  }),
  lv(6, {
    editorialLabel: "Funcionamiento intermedio: imposición, intimidación y poca tolerancia a la oposición",
    description:
      "La persona se siente obligada a imponerse y vive la oposición como una amenaza. Puede intimidar, humillar o amenazar para mantener su posición. Detrás hay una necesidad de no ser dominada, y la sensibilidad queda oculta.",
    characteristicExpressions: [
      "Usa amenazas o intimidación para conseguir lo que quiere.",
      "Menosprecia a quienes considera débiles.",
      "Se niega a reconocer errores o a ceder.",
    ],
    thinkingPatterns: [
      "Ve a quienes se oponen como enemigos.",
      "Cree que cualquier concesión será aprovechada.",
      "Justifica su dureza como necesaria.",
    ],
    emotionalPatterns: [
      "Rabia intensa y rencor que persiste.",
      "Sensación de estar rodeada de rivales.",
      "Incomodidad con la culpa, que desvía con ataques.",
    ],
    inRelationships:
      "Las relaciones se vuelven difíciles y a veces se rompen. Puede alejar a quienes más quiere sin darse cuenta del daño.",
    inDecisions:
      "Decide por afirmación de poder más que por análisis. Desestima el consejo y castiga la disidencia.",
    availableStrengths: [
      "Capacidad de protección intensa de los suyos.",
      "Resistencia ante la adversidad.",
      "Posibilidad de reparar cuando se siente respetada.",
    ],
    possibleDifficulties: [
      "Conflictos graves y rupturas.",
      "Poca capacidad de recibir retroalimentación.",
      "Desgaste físico por tensión constante.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 5, la dureza se vuelve intimidación y poca tolerancia a la oposición. Frente al nivel 7, todavía conserva sentido de justicia y puede responder a quien se gana su respeto, y no actúa de forma imprudente ni sin control de sí misma.",
    examples: [
      "Amenazar con romper relaciones si le llevan la contraria.",
      "Humillar a un colaborador frente al grupo.",
      "No volver a hablar con una persona que la corrigió.",
    ],
    reflectionQuestions: [
      "¿Qué experiencias me enseñaron que ceder era peligroso?",
      "¿Qué efectos tiene mi dureza sobre quienes quiero?",
      "¿Hay alguien con quien podría ensayar un gesto de reparación?",
    ],
    growthOpportunities: [
      "Practicar pausas antes de reaccionar cuando te sientas contradicha.",
      "Pedir a una persona de confianza que te señale cuándo cruzas un límite.",
      "Reconocer una vez al mes un error propio de manera explícita.",
    ],
  }),
  lv(7, {
    editorialLabel: "Funcionamiento con patrones más desadaptativos: temeridad y desafío de límites",
    description:
      "La persona se siente invencible y desafía normas, riesgos y consecuencias. Puede actuar de modo imprudente, con un fuerte rechazo a cualquier freno. Debajo hay un miedo profundo a ser dañada o controlada, que casi no se muestra.",
    characteristicExpressions: [
      "Asume riesgos innecesarios para demostrar fuerza.",
      "Desafía normas, figuras de autoridad o consejos.",
      "Se muestra implacable con quienes percibe como amenaza.",
    ],
    thinkingPatterns: [
      "Cree que las reglas no se aplican a ella.",
      "Considera la compasión como debilidad peligrosa.",
      "Minimiza las consecuencias de sus actos.",
    ],
    emotionalPatterns: [
      "Rabia intensa, rápida y poco regulada.",
      "Rechazo agudo a la vulnerabilidad.",
      "Soledad profunda que no se admite.",
    ],
    inRelationships:
      "Las relaciones se sostienen por miedo o conveniencia más que por confianza. Puede lastimar seriamente a otros y distanciarse de quienes la quieren.",
    inDecisions:
      "Decide con arrogancia y sin medir efectos. Rechaza el consejo y se enfrenta a las consecuencias cuando ya son grandes.",
    availableStrengths: [
      "Un coraje que puede reorientarse hacia fines protectores.",
      "Capacidad de reconocer, tarde o temprano, el daño causado.",
      "Fidelidad profunda a pocas personas.",
    ],
    possibleDifficulties: [
      "Problemas con la justicia o con la salud por conductas arriesgadas.",
      "Pérdida de vínculos de confianza.",
      "Dificultad para pedir o aceptar ayuda.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 6, la intimidación se vuelve desafío abierto a cualquier límite y riesgo. Frente al nivel 8, todavía mantiene su energía y control sobre sí misma, y no se manifiesta una necesidad de dominar a todos ni de romper por completo con su entorno.",
    examples: [
      "Conducir o actuar de manera arriesgada para demostrar que nada la detiene.",
      "Ignorar un aviso médico por no aceptar que necesita cuidado.",
      "Romper acuerdos formales y enfrentarse a quien se lo reprocha.",
    ],
    reflectionQuestions: [
      "¿A quién o a qué temo realmente cuando me muestro invencible?",
      "¿Qué pérdida concreta podría evitar si me permito frenar?",
      "¿Quién me cuidó alguna vez sin pedir nada a cambio?",
    ],
    growthOpportunities: [
      "Aceptar una opinión externa sobre un riesgo concreto antes de actuar.",
      "Si este funcionamiento resulta doloroso o limitante, buscar apoyo profesional y de personas de confianza es un paso valioso y legítimo.",
      "Canalizar tu fuerza en actividades físicas o proyectos que protejan a otros.",
    ],
  }),
  lv(8, {
    editorialLabel: "Funcionamiento con patrones más desadaptativos: dominio total y aislamiento hostil",
    description:
      "La persona siente que solo puede sentirse segura dominando por completo su entorno. Se vuelve hostil, desconfiada y vengativa. La necesidad de control es casi absoluta y las relaciones quedan reducidas a quien obedece y quien amenaza.",
    characteristicExpressions: [
      "Intenta controlar a otros por completo.",
      "Responde a las críticas con represalias.",
      "Se aísla o se rodea solo de quienes obedecen.",
    ],
    thinkingPatterns: [
      "Cree que cualquiera podría traicionarla.",
      "Concibe la relación con otros como dominar o ser dominada.",
      "Rechaza ideas que cuestionen su visión.",
    ],
    emotionalPatterns: [
      "Rabia constante y desconfianza.",
      "Insensibilidad aparente hacia el dolor ajeno.",
      "Cansancio y soledad profundos que oculta.",
    ],
    inRelationships:
      "Las relaciones se deterioran fuertemente. Quienes están cerca pueden sentir miedo y alejarse, lo que refuerza su aislamiento.",
    inDecisions:
      "Decide de forma autoritaria y vengativa. Le cuesta evaluar el costo humano de sus actos.",
    availableStrengths: [
      "Una enorme capacidad de acción que podría reorientarse.",
      "Lealtad intensa con quienes percibe como cercanos.",
      "Posibilidad de ablandarse ante gestos genuinos de cuidado.",
    ],
    possibleDifficulties: [
      "Aislamiento severo.",
      "Conflictos legales, laborales o familiares graves.",
      "Agotamiento físico por tensión constante.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 7, el desafío imprudente se convierte en dominio hostil y aislamiento defensivo. Frente al nivel 9, todavía conserva cierta organización y capacidad de acción, y no se manifiesta un derrumbe tan fuerte ni una ruptura total con los demás.",
    examples: [
      "Cortar relaciones con personas que no obedecen.",
      "Tomar represalias contra quien la criticó tiempo atrás.",
      "Aislarse en casa o en su entorno con pocas personas leales.",
    ],
    reflectionQuestions: [
      "¿Qué necesito para sentirme segura sin dominar a todos?",
      "¿Hay alguien que me haya sostenido, aunque yo lo negara?",
      "¿Qué parte de mí está cansada de estar en guardia?",
    ],
    growthOpportunities: [
      "Aceptar un gesto de cuidado sin buscar segundas intenciones.",
      "Si este funcionamiento resulta doloroso o limitante, acudir a apoyo profesional es una decisión de fortaleza.",
      "Cuidar el cuerpo con descanso y actividad física para bajar la tensión.",
    ],
  }),
  lv(9, {
    editorialLabel: "Funcionamiento con patrones más desadaptativos: ruptura total y derrumbe de la defensa",
    description:
      "La defensa de fuerza se quiebra o se vuelve extrema. La persona puede alternar entre un ataque destructivo y un colapso de vulnerabilidad, sintiendo que ha perdido todo. Es un nivel de mucho dolor y necesidad de contención segura.",
    characteristicExpressions: [
      "Actúa con una furia que busca destruir lo que la amenaza.",
      "Puede derrumbarse tras episodios de agresividad.",
      "Se desconecta de personas, trabajo y proyectos.",
    ],
    thinkingPatterns: [
      "Siente que debe aniquilar o ser aniquilada.",
      "Ve todo en blanco y negro, sin matices.",
      "Le cuesta imaginar la reparación posible.",
    ],
    emotionalPatterns: [
      "Rabia desbordada seguida de vacío.",
      "Culpa y vergüenza intensas.",
      "Desamparo profundo bajo la dureza.",
    ],
    inRelationships:
      "Las relaciones suelen quedar rotas o en riesgo. Necesita contención firme, calmada y sin humillación para volver a confiar.",
    inDecisions:
      "Le cuesta decidir con sensatez; puede actuar de manera destructiva y luego sentir un colapso emocional.",
    availableStrengths: [
      "Un núcleo de ternura que sigue existiendo y puede reaparecer.",
      "Capacidad de recuperación con cuidado sostenido.",
      "Deseo de volver a sentirse una persona digna de confianza.",
    ],
    possibleDifficulties: [
      "Riesgo para sí misma y para otros.",
      "Aislamiento extremo.",
      "Rechazo de ayuda por orgullo o por miedo.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 8, ya no hay un dominio organizado sino un desborde destructivo alternado con desplome emocional. Es el extremo del continuo, por lo que solo se compara con el nivel 8.",
    examples: [
      "Estallar con furia y luego encerrarse sin hablar con nadie por días.",
      "Dañar lo propio o lo ajeno en un momento de rabia.",
      "Perder el trabajo o la familia tras una crisis y sentirse aniquilada.",
    ],
    reflectionQuestions: [
      "¿Qué necesito en este momento para sentirme un poco menos sola?",
      "¿Quién podría acompañarme sin juzgarme ni confrontarme?",
      "¿Qué es lo más pequeño que podría hacer hoy para cuidarme?",
    ],
    growthOpportunities: [
      "Reconocer que el dolor intenso y la rabia desbordada merecen atención, y que pedir ayuda es válido.",
      "Si este funcionamiento resulta doloroso o limitante, buscar apoyo profesional y de personas de confianza cuanto antes es un paso importante.",
      "Alejarte con calma de situaciones que te desbordan y buscar un entorno seguro.",
    ],
  }),
];
