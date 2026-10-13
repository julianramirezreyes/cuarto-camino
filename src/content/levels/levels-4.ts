import type { LevelProfile } from "../schema";

type Body = Omit<LevelProfile, "type" | "level" | "sourceLevelName" | "disclaimer" | "sources" | "status">;

const DISCLAIMER =
  "Este perfil es un modelo interpretativo sin validación clínica. Describe tendencias posibles, no es un resultado de evaluación y no sustituye la mirada de un profesional.";

const lvl = (level: LevelProfile["level"], body: Body): LevelProfile => ({
  type: 4,
  level,
  sourceLevelName: null,
  ...body,
  disclaimer: DISCLAIMER,
  sources: ["riso-hudson-1999", "riso-hudson-1996", "hook-2021"],
  status: "draft",
});

const SUPPORT =
  "Si esta forma de vivir resulta dolorosa o agotadora, buscar apoyo profesional (psicología o psicoterapia) y acompañamiento de personas de confianza es una decisión valiosa; no implica que este sea tu caso.";

export const levels4: LevelProfile[] = [
  lvl(1, {
    editorialLabel: "Funcionamiento muy flexible y ecuánime",
    description:
      "La persona vive su profundidad emocional con serenidad. Acepta sus luces y sombras, se siente conectada con lo universal de la experiencia humana y puede crear o expresarse sin depender del dolor.",
    characteristicExpressions: [
      "Transforma experiencias intensas en obras o gestos significativos.",
      "Acompaña el sufrimiento ajeno sin hundirse en él.",
      "Disfruta de lo cotidiano con una atención delicada.",
    ],
    thinkingPatterns: [
      "Se reconoce parecida a los demás aun siendo única.",
      "Ve lo que falta sin sentirlo como amenaza a su valor.",
      "Acepta que los estados de ánimo cambian.",
    ],
    emotionalPatterns: [
      "Capacidad de sentir mucho y recuperarse.",
      "Melancolía suave que no ahoga.",
      "Gratitud serena por lo vivido.",
    ],
    inRelationships:
      "Ofrece intimidad auténtica y constancia emocional; permite que el otro sea quien es.",
    inDecisions:
      "Decide con una mezcla de sensibilidad e intuición, y también con sentido práctico.",
    availableStrengths: [
      "Profundidad emocional equilibrada.",
      "Creatividad con propósito.",
      "Empatía para el sufrimiento.",
    ],
    possibleDifficulties: [
      "Puede sentirse abrumada ante ambientes muy superficiales.",
      "Su sensibilidad alta requiere cuidar el descanso.",
      "A veces desea una intensidad que el día a día no ofrece.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 2, aquí la profundidad emocional se vive sin necesidad de ser distinta ni de destacar por ello. En el nivel 2 todavía hay una fuerte atención a la propia vida interior y a su singularidad.",
    examples: [
      "Escribe sobre una pérdida y la comparte para acompañar a otros.",
      "Se sienta con un amigo triste sin intentar arreglarlo.",
      "Disfruta de una caminata ordinaria con atención plena.",
    ],
    reflectionQuestions: [
      "¿Cómo se siente la profundidad cuando no necesito que me entiendan?",
      "¿Qué me conecta con otras personas cuando me siento distinta?",
      "¿Qué disfruto del presente sin añorar otra cosa?",
    ],
    growthOpportunities: [
      "Compartir su sensibilidad en espacios creativos o de acompañamiento.",
      "Seguir cultivando rutinas que la mantengan estable.",
      "Mentorear a quienes se sienten incomprendidos.",
    ],
  }),
  lvl(2, {
    editorialLabel: "Funcionamiento integrado con sensibilidad introspectiva",
    description:
      "La persona presta atención a su mundo interior y encuentra en él una fuente de sentido. Es consciente de sus emociones, se permite sentirlas y todavía las integra a la vida cotidiana.",
    characteristicExpressions: [
      "Se toma tiempo para reflexionar sobre lo que siente.",
      "Muestra autenticidad en lo que dice y hace.",
      "Valora los vínculos con significado.",
    ],
    thinkingPatterns: [
      "Se pregunta qué es genuino para ella.",
      "Busca sentido en sus experiencias.",
      "Reconoce sus cambios de ánimo sin dramatizarlos.",
    ],
    emotionalPatterns: [
      "Emociones matizadas y variadas.",
      "Momentos de nostalgia o tristeza que pasan.",
      "Alegría profunda ante lo bello.",
    ],
    inRelationships:
      "Busca intimidad y honestidad emocional; puede necesitar tiempo a solas para recuperarse.",
    inDecisions:
      "Decide guiada por lo que siente verdadero, y consulta a su razón cuando es necesario.",
    availableStrengths: [
      "Autoconocimiento.",
      "Sensibilidad estética.",
      "Honestidad emocional.",
    ],
    possibleDifficulties: [
      "Puede sentirse incomprendida a veces.",
      "A ratos se queda demasiado en su mundo interno.",
      "Tiende a idealizar vínculos profundos.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 1, aquí la vida interior ocupa más espacio y aparece una búsqueda de identidad propia más consciente. Frente al nivel 3, aún no hay una necesidad insistente de ser vista como especial.",
    examples: [
      "Lleva un diario y lo usa para tomar decisiones.",
      "Prefiere conversaciones profundas a eventos masivos.",
      "Se emociona con una canción y lo comparte con un amigo.",
    ],
    reflectionQuestions: [
      "¿Qué emociones he dejado de escuchar últimamente?",
      "¿Cómo equilibro mi mundo interno con lo que pasa afuera?",
      "¿Qué significa para mí «ser auténtica»?",
    ],
    growthOpportunities: [
      "Convertir una intuición en un pequeño acto concreto.",
      "Compartir sus emociones con una persona cercana.",
      "Mantener una rutina física que la ancle al presente.",
    ],
  }),
  lvl(3, {
    editorialLabel: "Funcionamiento flexible con expresión personal marcada",
    description:
      "La persona siente la necesidad de expresar lo que vive y de hacerlo de manera singular. Cultiva su estilo, su estética y su forma de ver el mundo, y sigue manteniendo apertura hacia otros.",
    characteristicExpressions: [
      "Elige con cuidado cómo se presenta, desde la ropa hasta sus palabras.",
      "Se vuelca en actividades creativas o expresivas.",
      "Comunica sus emociones con riqueza y sensibilidad.",
    ],
    thinkingPatterns: [
      "Valora lo único y lo personal por encima de lo común.",
      "Se compara de vez en cuando con otros para entenderse.",
      "Piensa en cómo darle forma propia a su vida.",
    ],
    emotionalPatterns: [
      "Intensidad emocional que va y viene.",
      "Cierta nostalgia por lo que no ocurrió.",
      "Orgullo callado de lo que crea.",
    ],
    inRelationships:
      "Es cálida y reflexiva; puede esperar que los demás capten matices sin que los diga.",
    inDecisions:
      "Elige alternativas que se sientan auténticas, aunque no sean las más cómodas.",
    availableStrengths: [
      "Originalidad.",
      "Expresividad.",
      "Compasión ante el dolor ajeno.",
    ],
    possibleDifficulties: [
      "Puede dudar de si es suficientemente original.",
      "Se frustra cuando no la entienden.",
      "A veces idealiza lo que no tiene.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 2, aquí la expresión de lo singular cobra más importancia en la identidad. Frente al nivel 4, aún no domina la tendencia a refugiarse en la fantasía o la nostalgia.",
    examples: [
      "Decora su casa con objetos que cuentan una historia.",
      "Escribe una carta larga para expresar lo que siente.",
      "Se desanima si un amigo no entiende un gesto simbólico.",
    ],
    reflectionQuestions: [
      "¿Qué parte de mi singularidad me da orgullo y cuál me pesa?",
      "¿Qué espero de los otros cuando me expreso?",
      "¿Qué diferencia hay entre ser única y estar sola?",
    ],
    growthOpportunities: [
      "Pedir de forma directa lo que necesita en vez de esperar que lo adivinen.",
      "Compartir una creación inacabada para recibir retroalimentación.",
      "Notar cuándo compara su valor con el de otros.",
    ],
  }),
  lvl(4, {
    editorialLabel: "Funcionamiento intermedio con tendencia a la nostalgia y la fantasía",
    description:
      "La vida interior empieza a competir con la realidad. La persona se refugia en recuerdos, ideales y fantasías que alivian, pero también la separan de lo que tiene a mano.",
    characteristicExpressions: [
      "Se detiene a menudo en lo que podría haber sido.",
      "Imagina vínculos o proyectos ideales con más detalle que en la práctica.",
      "Cultiva un ambiente estético que sostiene su estado de ánimo.",
    ],
    thinkingPatterns: [
      "Cree que lo que desea está en otra parte o en otra persona.",
      "Siente que algo esencial le falta.",
      "Se conmueve más con lo ausente que con lo presente.",
    ],
    emotionalPatterns: [
      "Melancolía frecuente.",
      "Anhelo intenso, seguido de desencanto.",
      "Estados de ánimo cambiantes.",
    ],
    inRelationships:
      "Se acerca con intensidad a personas que idealiza y se decepciona cuando no encajan con la imagen.",
    inDecisions:
      "Pospone decisiones esperando sentir «lo correcto» o el momento perfecto.",
    availableStrengths: [
      "Imaginación.",
      "Capacidad de apreciar lo sutil.",
      "Sensibilidad al sufrimiento.",
    ],
    possibleDifficulties: [
      "Dificultad para actuar sobre sus ideas.",
      "Desilusión recurrente en los vínculos.",
      "Pérdida de tiempo y energía en la rumiación.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 3, aquí la fantasía y la nostalgia compiten con el presente y limitan la acción. Frente al nivel 5, aún mantiene contacto fluido con otros y no se retira como respuesta habitual.",
    examples: [
      "Pasa horas imaginando cómo sería una vida distinta.",
      "Se desencanta de un nuevo amigo al notar un defecto.",
      "No termina un proyecto porque ya no coincide con su idea inicial.",
    ],
    reflectionQuestions: [
      "¿Qué estoy esperando para empezar?",
      "¿Qué tiene mi vida actual que valoro de verdad?",
      "¿Qué parte de mi anhelo habla de un deseo concreto?",
    ],
    growthOpportunities: [
      "Convertir una fantasía en un paso pequeño y concreto.",
      "Registrar por escrito tres cosas valiosas del presente cada día.",
      "Hacer una caminata o ejercicio breve cuando sienta que se hunde en la nostalgia.",
    ],
  }),
  lvl(5, {
    editorialLabel: "Funcionamiento intermedio con retraimiento y autoabsorción",
    description:
      "La persona se retira para protegerse de sentirse incomprendida o expuesta. El mundo interior ocupa gran parte de la atención y las relaciones se reducen a quienes siente seguros.",
    characteristicExpressions: [
      "Se aísla cuando se siente herida o malinterpretada.",
      "Habla poco de sí misma, pero espera ser captada.",
      "Cuida con celo su intimidad.",
    ],
    thinkingPatterns: [
      "Piensa que nadie capta cómo se siente.",
      "Convierte sucesos pequeños en símbolos de algo mayor.",
      "Se compara con los demás y concluye que le falta algo.",
    ],
    emotionalPatterns: [
      "Sensibilidad extrema a los desaires.",
      "Tristeza y cansancio frecuentes.",
      "Alternancia entre querer cercanía y rechazarla.",
    ],
    inRelationships:
      "Puede oscilar entre acercarse y alejarse; los demás pueden sentir que no saben cómo acompañarla.",
    inDecisions:
      "Decide en función de lo que protege su estado emocional y evita lo que la expone.",
    availableStrengths: [
      "Capacidad de introspección.",
      "Sensibilidad estética.",
      "Lealtad con quienes confía.",
    ],
    possibleDifficulties: [
      "Aislamiento que alimenta la tristeza.",
      "Interpretar gestos neutros como rechazo.",
      "Descuido de tareas cotidianas por agotamiento emocional.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 4, aquí el retiro es una respuesta habitual y la atención se centra en el propio estado. Frente al nivel 6, todavía puede sentirse especial sin recurrir a la comparación dolorosa constante.",
    examples: [
      "Cancela planes porque no se siente comprendida.",
      "Interpreta un mensaje breve de un amigo como indiferencia.",
      "Pasa fines de semana enteros sola, sintiéndose cada vez más lejos.",
    ],
    reflectionQuestions: [
      "¿Qué quiero proteger cuando me retiro?",
      "¿Qué le diría a un amigo que se aísla igual que yo?",
      "¿A quién puedo mostrar un poco más de lo que siento?",
    ],
    growthOpportunities: [
      "Mantener un contacto breve y regular con una persona segura.",
      "Salir a caminar, aunque no tenga ganas, para cambiar de ambiente.",
      "Nombrar lo que siente antes de retirarse.",
    ],
  }),
  lvl(6, {
    editorialLabel: "Funcionamiento intermedio con autocompasión y envidia",
    description:
      "La sensación de ser diferente se carga de dolor. La persona se compara y concluye que los demás tienen lo que ella no tiene, lo que genera envidia, autocompasión y, a veces, reproche a quienes la rodean.",
    characteristicExpressions: [
      "Habla de lo difícil que es su vida o de lo mal que la tratan.",
      "Se compara y señala lo que otros tienen y ella no.",
      "Oscila entre acercarse y reprochar distancia.",
    ],
    thinkingPatterns: [
      "Cree que los demás lo tienen más fácil.",
      "Se ve como una víctima de las circunstancias.",
      "Piensa que su sufrimiento es más profundo que el de otros.",
    ],
    emotionalPatterns: [
      "Envidia dolorosa.",
      "Autocompasión intensa.",
      "Tristeza y enfado que se alternan.",
    ],
    inRelationships:
      "Los vínculos se tensan por reproches velados y demandas de comprensión; quienes la quieren pueden agotarse.",
    inDecisions:
      "Decide según su estado de ánimo, a veces sin considerar las consecuencias prácticas.",
    availableStrengths: [
      "Gran sensibilidad.",
      "Capacidad de expresar el dolor con claridad.",
      "Disposición a la introspección profunda.",
    ],
    possibleDifficulties: [
      "Dificultad para reconocer lo bueno en su vida.",
      "Aislamiento por conflictos con otros.",
      "Pérdida de oportunidades por sentimientos de inferioridad.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 5, aquí la comparación dolorosa y la autocompasión dominan la vivencia y se dirigen a otros. Frente al nivel 7, todavía puede salir del estado de ánimo con ayuda de actividades o personas cercanas.",
    examples: [
      "Se entristece al ver las fotos de unas vacaciones ajenas.",
      "Le dice a su pareja «nadie me entiende como tú no lo haces».",
      "Rechaza un plan porque siente que no pertenece.",
    ],
    reflectionQuestions: [
      "¿Qué tienen los demás que siento que me falta?",
      "¿Qué parte de mi dolor es real y cuál es comparación?",
      "¿Qué hago con mis emociones cuando me siento desplazada?",
    ],
    growthOpportunities: [
      "Anotar a diario algo que tiene y que antes deseaba.",
      "Pedir apoyo concreto a alguien, no solo compañía en el dolor.",
      "Participar en un grupo o actividad donde su aporte sea claro.",
    ],
  }),
  lvl(7, {
    editorialLabel: "Patrones más desadaptativos: desánimo y alejamiento",
    description:
      "La persona se siente cada vez más cansada y desesperanzada. Cree que no puede alcanzar lo que desea y su energía se reduce, lo que la lleva a alejarse de responsabilidades y de las personas que le importan.",
    characteristicExpressions: [
      "Deja proyectos a medias y se aísla de su entorno.",
      "Habla de sí misma con dureza o resignación.",
      "Evita contacto por sentirse sin fuerzas.",
    ],
    thinkingPatterns: [
      "Piensa que algo en ella está dañado de forma irreparable.",
      "Cree que no tiene sentido intentar.",
      "Interpreta todo desde la pérdida y la carencia.",
    ],
    emotionalPatterns: [
      "Tristeza profunda y persistente.",
      "Vergüenza por sentirse débil.",
      "Cansancio que cuesta explicar.",
    ],
    inRelationships:
      "Se aleja de quienes la quieren y siente que es una carga; las relaciones se enfrían.",
    inDecisions:
      "Le cuesta decidir y tiende a dejar que las cosas pasen, aunque le perjudiquen.",
    availableStrengths: [
      "Una sensibilidad profunda que puede orientarse a cuidar de sí.",
      "Capacidad de reconocer su propio dolor.",
      "Honestidad emocional.",
    ],
    possibleDifficulties: [
      "Deterioro de rutinas básicas como sueño y alimentación.",
      "Pérdida de trabajo o estudios por desgano.",
      "Dificultad para pedir ayuda.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 6, aquí el desánimo reemplaza a la comparación y reduce las acciones y vínculos. Frente al nivel 8, todavía existen momentos de conexión y la capacidad de hacer pequeñas cosas.",
    examples: [
      "Deja de contestar mensajes durante semanas.",
      "Posterga trámites básicos y se siente culpable.",
      "Se queda en cama gran parte del día sin motivo aparente.",
    ],
    reflectionQuestions: [
      "¿Cuándo empecé a sentirme así?",
      "¿Qué pequeño paso me sería posible hoy?",
      "¿A quién podría decirle cómo estoy de verdad?",
    ],
    growthOpportunities: [
      "Contarle a una persona de confianza lo cansada y desanimada que se siente.",
      SUPPORT,
      "Establecer rutinas mínimas de sueño, comida y movimiento.",
    ],
  }),
  lvl(8, {
    editorialLabel: "Patrones desadaptativos intensos: autorreproche y desesperanza",
    description:
      "La voz interior se vuelve dura y hostil. La persona se culpa por sentirse como se siente, cree que no tiene salida y puede percibir su vida como irremediablemente dañada.",
    characteristicExpressions: [
      "Se reprocha continuamente por lo que es o no es.",
      "Rechaza consuelo y se aleja de quienes la quieren.",
      "Abandona actividades que antes le daban sentido.",
    ],
    thinkingPatterns: [
      "Piensa que no merece cuidado ni futuro.",
      "Interpreta cualquier error como prueba de que no vale.",
      "Siente que nada va a cambiar.",
    ],
    emotionalPatterns: [
      "Desesperanza profunda y vergüenza.",
      "Ira dirigida hacia sí misma.",
      "Cansancio y vacío persistentes.",
    ],
    inRelationships:
      "Se retrae casi por completo; los demás pueden sentirse impotentes o rechazados.",
    inDecisions:
      "Las decisiones se bloquean o se toman desde la desesperación y el castigo.",
    availableStrengths: [
      "Una enorme sensibilidad que, con acompañamiento, puede transformarse en cuidado hacia sí misma.",
      "Honestidad sobre su sufrimiento.",
      "Capacidad de recuperación cuando se siente segura.",
    ],
    possibleDifficulties: [
      "Riesgo de descuidar su salud física y emocional.",
      "Pérdida de redes de apoyo.",
      "Dificultad para creer que alguien la acompañará sin juzgarla.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 7, aquí el desánimo se convierte en autorreproche duro y desesperanza marcada. Frente al nivel 9, todavía mantiene cierta capacidad de hablar de lo que le pasa y de recibir contacto.",
    examples: [
      "Se dice a sí misma que es un fracaso por no poder levantarse de la cama.",
      "Rechaza una visita porque siente que no merece compañía.",
      "Deja de cuidar su alimentación e higiene por falta de ganas.",
    ],
    reflectionQuestions: [
      "¿Qué le diría a una persona querida que me hablara como yo me hablo?",
      "¿Qué necesidad básica puedo atender hoy?",
      "¿Quién podría estar conmigo sin esperar que me anime?",
    ],
    growthOpportunities: [
      "Hablar con alguien de confianza sobre el peso que lleva, sin necesidad de explicarlo todo.",
      SUPPORT,
      "Atender una necesidad básica por día: dormir, comer o salir unos minutos al aire libre.",
    ],
  }),
  lvl(9, {
    editorialLabel: "Patrones desadaptativos muy intensos: agotamiento y desesperación",
    description:
      "El sufrimiento puede volverse abrumador. La persona puede sentirse sin fuerzas, sin valor y sin esperanza de que algo cambie, con la energía vital muy reducida.",
    characteristicExpressions: [
      "Se aísla casi por completo.",
      "Pierde interés por actividades y personas.",
      "Descuida su salud y sus necesidades básicas.",
    ],
    thinkingPatterns: [
      "Cree que no hay salida a su dolor.",
      "Se percibe como una carga para los demás.",
      "Piensa en absolutos de desesperanza.",
    ],
    emotionalPatterns: [
      "Desesperación y agotamiento intensos.",
      "Entumecimiento emocional o llanto continuo.",
      "Vergüenza profunda.",
    ],
    inRelationships:
      "Puede cortar contacto con casi todos; aceptar cuidado resulta muy difícil.",
    inDecisions:
      "La capacidad de decidir se reduce mucho o se dirige a escapar del dolor.",
    availableStrengths: [
      "Una sensibilidad que, con apoyo, puede volver a conectar con la vida.",
      "Capacidad de reconstrucción gradual.",
      "Posibilidad de aceptar compañía segura y sostenida.",
    ],
    possibleDifficulties: [
      "Sufrimiento emocional muy intenso.",
      "Riesgo para la salud y la seguridad personal.",
      "Dificultad para creer que el alivio es posible.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 8, aquí la lucha interna cede paso a un agotamiento casi total y a la pérdida de esperanza. Es el extremo del mapa y lo distingue la ausencia de energía para sostener cualquier vínculo o rutina.",
    examples: [
      "Pasa días sin comunicarse con nadie.",
      "No logra realizar tareas simples de cuidado personal.",
      "Siente que su vida no tiene sentido y no ve cómo cambiarlo.",
    ],
    reflectionQuestions: [
      "¿Qué cosa pequeña me haría sentir un poco menos sola hoy?",
      "¿A quién puedo escribir o llamar, aunque sea una línea?",
      "¿Qué necesita mi cuerpo ahora?",
    ],
    growthOpportunities: [
      "Contactar de inmediato con un profesional de salud mental o una línea de apoyo si el malestar es intenso o aparecen ideas de hacerse daño.",
      SUPPORT,
      "Dejar que una persona cercana la acompañe en tareas básicas mientras recupera energía.",
    ],
  }),
];
