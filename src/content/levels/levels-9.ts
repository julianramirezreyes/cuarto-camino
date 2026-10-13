import type { LevelProfile } from "../schema";

type Body = Omit<LevelProfile, "type" | "level" | "sourceLevelName" | "disclaimer" | "sources" | "status">;

const DISCLAIMER =
  "Este perfil es un modelo interpretativo para la autoobservación, sin validación clínica. No describe a una persona concreta ni sustituye una evaluación profesional.";

const lv = (level: LevelProfile["level"], b: Body): LevelProfile => ({
  type: 9,
  level,
  sourceLevelName: null,
  ...b,
  disclaimer: DISCLAIMER,
  sources: ["riso-hudson-1999", "riso-hudson-1996", "hook-2021"],
  status: "draft",
});

export const levels9: LevelProfile[] = [
  lv(1, {
    editorialLabel: "Funcionamiento muy flexible: presencia plena y paz que incluye el conflicto",
    description:
      "La persona del tipo 9 está plenamente presente y conectada consigo misma. Su paz no depende de evitar tensiones: puede sostener desacuerdos y seguir en calma. Actúa con iniciativa propia y trae armonía sin renunciar a su voz.",
    characteristicExpressions: [
      "Se involucra en lo que vive con atención plena.",
      "Expresa su opinión sin miedo a perder la armonía.",
      "Acompaña a otros con una calma que invita a la confianza.",
    ],
    thinkingPatterns: [
      "Sabe lo que quiere y lo comunica.",
      "Ve distintos puntos de vista sin diluir el propio.",
      "Reconoce el valor de su presencia.",
    ],
    emotionalPatterns: [
      "Serenidad profunda y energía estable.",
      "Enojo que se siente y se expresa con moderación.",
      "Gozo sencillo en la vida cotidiana.",
    ],
    inRelationships:
      "Es una compañía tranquila y presente. Acepta el conflicto sano como parte del vínculo y se mantiene firme en lo que le importa.",
    inDecisions:
      "Decide con claridad y a tiempo, escuchando a los demás sin perder de vista lo que necesita ella.",
    availableStrengths: [
      "Capacidad de mediar con equidad.",
      "Presencia serena que calma entornos tensos.",
      "Iniciativa tranquila y constante.",
    ],
    possibleDifficulties: [
      "Puede subestimar el peso de su propia influencia.",
      "En momentos de estrés intenso, puede retomar la costumbre de aplazar.",
      "Puede dar demasiado espacio a otros por inercia.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 2, aquí la paz incluye sostener el conflicto y la propia voz; en el nivel 2 la persona es muy conciliadora y empieza a priorizar un poco más la armonía.",
    examples: [
      "Decir con calma que no está de acuerdo en una reunión y proponer una alternativa.",
      "Dedicar una tarde a una actividad que le importa sin sentirse culpable.",
      "Mediar en una discusión sin perder su propia postura.",
    ],
    reflectionQuestions: [
      "¿Cuándo me siento más conectada con lo que quiero?",
      "¿Cómo expreso un desacuerdo sin romper la calma?",
      "¿Qué me ayuda a sostener mi iniciativa día a día?",
    ],
    growthOpportunities: [
      "Compartir tu forma de estar presente con quienes viven con prisa.",
      "Seguir poniendo en palabras lo que quieres, aunque no haya conflicto.",
      "Cuidar espacios de silencio y descanso que renueven tu energía.",
    ],
  }),
  lv(2, {
    editorialLabel: "Funcionamiento flexible: armonía, receptividad y confianza en los demás",
    description:
      "La persona es receptiva, tranquila y accesible. Crea ambientes cómodos y acepta a las personas tal como son. Valora la paz, aunque aún expresa lo que piensa cuando es importante.",
    characteristicExpressions: [
      "Escucha sin juzgar y deja espacio a cada quien.",
      "Suaviza tensiones con calma y con humor amable.",
      "Se adapta a distintos entornos con facilidad.",
    ],
    thinkingPatterns: [
      "Ve el valor de cada perspectiva.",
      "Prefiere buscar puntos en común.",
      "Confía en que las cosas se resuelven con paciencia.",
    ],
    emotionalPatterns: [
      "Calma estable y sensación de bienestar.",
      "Enojo suave que reconoce con cierta lentitud.",
      "Disfrute del ritmo pausado.",
    ],
    inRelationships:
      "Es una amistad confiable y conciliadora. Se esfuerza por que todos se sientan incluidos y aceptados.",
    inDecisions:
      "Decide después de considerar con calma. A veces tarda, pero termina eligiendo con claridad cuando algo le importa.",
    availableStrengths: [
      "Empatía y receptividad.",
      "Capacidad de crear ambientes seguros.",
      "Paciencia y estabilidad.",
    ],
    possibleDifficulties: [
      "Puede restar importancia a sus propias preferencias.",
      "Puede demorarse en comenzar cosas nuevas.",
      "Tiende a evitar temas tensos si no son indispensables.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 1, la armonía se prioriza un poco más que la afirmación de la propia voz. Frente al nivel 3, todavía la persona se involucra y expresa sus deseos sin recurrir a la complacencia constante.",
    examples: [
      "Hacer que una persona nueva se sienta cómoda en un grupo.",
      "Proponer un plan sencillo que convenga a todos.",
      "Contar con calma que algo la incomodó, después de pensarlo.",
    ],
    reflectionQuestions: [
      "¿Cuándo digo lo que quiero con la misma facilidad con la que acepto lo de otros?",
      "¿Qué ritmo me hace sentir bien sin quedarme estancada?",
      "¿Qué tema importante podría abordar con calma esta semana?",
    ],
    growthOpportunities: [
      "Anotar tus preferencias antes de decidir en grupo.",
      "Dar un primer paso en un proyecto que has postergado.",
      "Pedir explícitamente lo que necesitas a alguien cercano.",
    ],
  }),
  lv(3, {
    editorialLabel: "Funcionamiento flexible: mediación y apoyo, con tendencia a postergarse",
    description:
      "La persona se convierte en puente entre otras personas y apoya con generosidad. Resuelve tensiones y mantiene unidos a los grupos. Empieza a dejar sus propias metas en segundo plano para que todo fluya.",
    characteristicExpressions: [
      "Media entre personas con posturas distintas.",
      "Ayuda a que los demás se sientan escuchados.",
      "Acepta tareas para evitar discusiones.",
    ],
    thinkingPatterns: [
      "Piensa primero en cómo mantener el equilibrio del grupo.",
      "Reduce el peso de sus propias necesidades.",
      "Tiende a minimizar los problemas para no incomodar.",
    ],
    emotionalPatterns: [
      "Satisfacción al lograr armonía.",
      "Cierta incomodidad cuando surgen desacuerdos.",
      "Cansancio silencioso por cargar con todo.",
    ],
    inRelationships:
      "Es muy apreciada por su capacidad de escuchar. Puede dejar de expresar lo que necesita y acumular pequeñas frustraciones.",
    inDecisions:
      "Suele decidir según lo que convenga al grupo. Se le dificulta marcar prioridades propias.",
    availableStrengths: [
      "Habilidad para mediar y conciliar.",
      "Generosidad sin alardes.",
      "Capacidad de ver varios lados de una situación.",
    ],
    possibleDifficulties: [
      "Postergar metas personales.",
      "Dificultad para decir que no.",
      "Frustraciones guardadas que no se nombran.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 2, la conciliación empieza a ir acompañada de postergarse a sí misma. Frente al nivel 4, aún puede nombrar lo que quiere con algo de esfuerzo, y no evita sistemáticamente cualquier tema que pueda causar tensión.",
    examples: [
      "Aceptar el plan de otros aunque tenía otra idea.",
      "Resolver una discusión entre dos amigos sin tomar partido.",
      "Dejar para después una actividad propia para ayudar a alguien.",
    ],
    reflectionQuestions: [
      "¿Qué cosas dejo para después para no incomodar?",
      "¿Qué pasaría si dijera no a una petición esta semana?",
      "¿Qué necesidad mía estoy guardando en silencio?",
    ],
    growthOpportunities: [
      "Elegir una meta propia y reservarle un horario fijo.",
      "Decir no a algo pequeño y observar cómo reaccionan los demás.",
      "Hablar de un malestar menor antes de que se acumule.",
    ],
  }),
  lv(4, {
    editorialLabel: "Funcionamiento intermedio: evitación del conflicto y adaptación excesiva",
    description:
      "La persona evita sistemáticamente la tensión y se adapta a lo que los demás esperan. Minimiza sus necesidades y cede con facilidad. La paz que busca es más una ausencia de conflicto que una calma genuina.",
    characteristicExpressions: [
      "Dice que sí cuando preferiría decir que no.",
      "Cambia de tema cuando surge un desacuerdo.",
      "Se amolda a la opinión predominante del grupo.",
    ],
    thinkingPatterns: [
      "Piensa que sus opiniones no son tan importantes.",
      "Prefiere no remover las cosas.",
      "Tiende a ver el conflicto como más peligroso de lo que es.",
    ],
    emotionalPatterns: [
      "Alivio al evitar la discusión.",
      "Enojo que se reprime y reaparece como malestar vago.",
      "Dificultad para identificar qué siente.",
    ],
    inRelationships:
      "Se muestra complaciente y esquiva el desacuerdo. Los demás pueden no saber lo que piensa ni lo que necesita.",
    inDecisions:
      "Deja que otros decidan y se adapta. Si le piden preferencias, le cuesta responder.",
    availableStrengths: [
      "Flexibilidad y apertura.",
      "Habilidad para evitar escaladas innecesarias.",
      "Receptividad a distintas ideas.",
    ],
    possibleDifficulties: [
      "Resentimientos que no se expresan.",
      "Dificultad para reconocer lo que quiere.",
      "Sensación de ser invisible para los demás.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 3, la postergación se vuelve evitación sistemática de la tensión. Frente al nivel 5, todavía participa en lo que ocurre a su alrededor y no se desconecta de manera marcada de las tareas ni de sus propias señales.",
    examples: [
      "Aceptar un restaurante que no le gusta para evitar discutir.",
      "Dejar que otro hable por ella en una situación importante.",
      "Callar una incomodidad durante semanas hasta que se enfría la ocasión.",
    ],
    reflectionQuestions: [
      "¿Qué temo que ocurra si expreso un desacuerdo?",
      "¿Qué preferencias propias he dejado de reconocer?",
      "¿Cómo se sentiría alguien cercano si supiera lo que realmente pienso?",
    ],
    growthOpportunities: [
      "Expresar una preferencia pequeña cada día.",
      "Escribir lo que sientes antes de una conversación para ordenar tus ideas.",
      "Notar las señales físicas de enojo o incomodidad y nombrarlas.",
    ],
  }),
  lv(5, {
    editorialLabel: "Funcionamiento intermedio: desconexión, rutinas y minimización de problemas",
    description:
      "La persona se desconecta de las propias prioridades y se refugia en rutinas, distracciones o comodidades. Minimiza los problemas y pospone decisiones. Su energía se apaga y cuesta ponerse en marcha ante lo que importa.",
    characteristicExpressions: [
      "Se refugia en rutinas, pantallas o pasatiempos para evitar tareas.",
      "Posterga trámites o conversaciones necesarias.",
      "Responde con frases vagas como no pasa nada.",
    ],
    thinkingPatterns: [
      "Cree que los problemas se resolverán solos.",
      "Se distrae con pensamientos o detalles secundarios.",
      "Reduce la importancia de lo que le inquieta.",
    ],
    emotionalPatterns: [
      "Apatía leve y cansancio persistente.",
      "Irritación pasiva cuando alguien la presiona.",
      "Sensación de estar en piloto automático.",
    ],
    inRelationships:
      "Puede parecer presente pero estar ausente. Los demás pueden frustrarse por su pasividad o por la falta de respuesta clara.",
    inDecisions:
      "Pospone hasta que la decisión se toma por ella. Le cuesta priorizar y empezar.",
    availableStrengths: [
      "Habilidad para mantener la calma ante la presión externa.",
      "Capacidad de no dramatizar.",
      "Disfrute de lo simple y cotidiano.",
    ],
    possibleDifficulties: [
      "Metas y tareas sin avanzar.",
      "Distancia emocional de personas cercanas.",
      "Problemas que se agravan por no atenderlos.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 4, la evitación del conflicto se convierte en desconexión de las propias metas y energía. Frente al nivel 6, todavía puede reaccionar cuando alguien insiste con cariño, y no se muestra tan resignada ni minimizando de forma sistemática problemas evidentes.",
    examples: [
      "Pasar varias tardes con actividades sin importancia mientras un trámite se acumula.",
      "Decir que todo está bien cuando algo claramente no lo está.",
      "Olvidar o aplazar una conversación importante con la pareja.",
    ],
    reflectionQuestions: [
      "¿Qué tarea llevo tiempo evitando y qué siento al pensarla?",
      "¿Qué actividades me ayudan a desconectarme y cuáles a recuperarme?",
      "¿Qué me diría una persona cercana si le contara lo que he postergado?",
    ],
    growthOpportunities: [
      "Dividir una tarea pendiente en un primer paso mínimo y hacerlo hoy.",
      "Establecer un horario corto para una prioridad personal.",
      "Pedir a alguien de confianza que te acompañe en un trámite que evitas.",
    ],
  }),
  lv(6, {
    editorialLabel: "Funcionamiento intermedio: resignación, pasividad y negación de problemas",
    description:
      "La persona se resigna y minimiza incluso problemas evidentes. Evita comprometerse y se vuelve poco reactiva, lo que puede afectar a su entorno. Responde con terquedad pasiva cuando se le exige algo.",
    characteristicExpressions: [
      "Niega o minimiza dificultades evidentes.",
      "Responde con silencios o con evasivas ante las exigencias.",
      "Se resiste con pasividad a las presiones ajenas.",
    ],
    thinkingPatterns: [
      "Piensa que nada de lo que haga cambiará las cosas.",
      "Prefiere no mirar lo que genera malestar.",
      "Se convence de que el problema no es tan grave.",
    ],
    emotionalPatterns: [
      "Resignación y desánimo discretos.",
      "Enojo pasivo que se manifiesta como lentitud.",
      "Insensibilidad parcial ante lo que ocurre.",
    ],
    inRelationships:
      "Los demás pueden sentirse solos o frustrados con su falta de respuesta. Puede esquivar acuerdos por miedo a comprometerse.",
    inDecisions:
      "Evita decidir y deja que las cosas sigan su curso. Cuando la presionan, se resiste con inacción.",
    availableStrengths: [
      "Tolerancia ante la incertidumbre.",
      "Sensibilidad al ritmo de los demás.",
      "Capacidad de recuperar energía con apoyo cercano.",
    ],
    possibleDifficulties: [
      "Problemas importantes ignorados.",
      "Tensión en relaciones por falta de respuesta.",
      "Pérdida de oportunidades y de motivación.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 5, la desconexión se convierte en resignación y negación de lo evidente. Frente al nivel 7, todavía responde a cuidado y a pedidos directos, y mantiene cierta capacidad de funcionar en lo básico.",
    examples: [
      "Seguir como si nada con una situación económica o de salud preocupante.",
      "Responder con silencio a un reclamo de la pareja.",
      "Aceptar una situación incómoda en el trabajo sin intentar cambiarla.",
    ],
    reflectionQuestions: [
      "¿Qué problema estoy tratando de no mirar y qué sentiría al mirarlo?",
      "¿Qué parte de mí quisiera cambiar algo, aunque cueste?",
      "¿Quién podría ayudarme a dar un primer paso?",
    ],
    growthOpportunities: [
      "Nombrar en voz alta una dificultad ante una persona de confianza.",
      "Elegir una acción mínima y concreta para esa dificultad esta semana.",
      "Reconocer los pequeños momentos en que sí actuaste y te sentiste mejor.",
    ],
  }),
  lv(7, {
    editorialLabel: "Funcionamiento con patrones más desadaptativos: desvanecimiento de la iniciativa y la presencia",
    description:
      "La persona se siente incapaz de afrontar la vida y se retira de ella. Su atención se dispersa, la energía es muy baja y le cuesta sostener tareas básicas. Puede depender de otros para organizarse y sentirse segura.",
    characteristicExpressions: [
      "Se muestra desorientada o ausente frente a las tareas.",
      "Depende de otros para organizarse y decidir.",
      "Se mueve con lentitud y poca reacción emocional.",
    ],
    thinkingPatterns: [
      "Siente que no puede con las exigencias.",
      "Se queda en blanco ante problemas concretos.",
      "Ve la vida como algo que le pasa, más que algo que ella construye.",
    ],
    emotionalPatterns: [
      "Embotamiento emocional y cansancio profundo.",
      "Vergüenza por no poder hacer lo que otros hacen.",
      "Miedo difuso a ser una carga.",
    ],
    inRelationships:
      "Las personas cercanas pueden asumir gran parte de sus responsabilidades. A veces se siente invisible o incomprendida.",
    inDecisions:
      "Casi no decide por sí misma. Se limita a seguir indicaciones o a dejar que el tiempo pase.",
    availableStrengths: [
      "Una sensibilidad que sigue presente bajo el cansancio.",
      "Capacidad de agradecer el cuidado recibido.",
      "Posibilidad de reactivarse con acompañamiento paciente.",
    ],
    possibleDifficulties: [
      "Dificultad para sostener trabajo y rutinas.",
      "Dependencia de otros.",
      "Aislamiento y pérdida de interés.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 6, la resignación se vuelve una retirada que afecta funciones básicas. Frente al nivel 8, todavía mantiene contacto con quienes la cuidan y puede responder a su ayuda, y no se presenta un desprendimiento tan fuerte de sí misma.",
    examples: [
      "Pasar buena parte del día en cama o frente a una pantalla sin energía para otra cosa.",
      "Esperar a que alguien le diga qué hacer para cada tarea.",
      "Dejar de contestar mensajes o llamadas por falta de ánimo.",
    ],
    reflectionQuestions: [
      "¿Qué necesito para sentirme un poco más capaz hoy?",
      "¿A quién podría pedirle compañía para hacer una tarea pequeña?",
      "¿Qué me ayudó en otros momentos en que me sentí con poca energía?",
    ],
    growthOpportunities: [
      "Dar pasos muy pequeños y acompañados, como salir a caminar diez minutos.",
      "Si este funcionamiento resulta doloroso o limitante, buscar apoyo profesional y de personas de confianza es un paso valioso y legítimo.",
      "Cuidar rutinas básicas de sueño, alimentación y luz natural.",
    ],
  }),
  lv(8, {
    editorialLabel: "Funcionamiento con patrones más desadaptativos: disociación de la experiencia y desconexión profunda",
    description:
      "La persona puede sentirse como si estuviera fuera de su propia vida, con poca conciencia de sus emociones y de lo que ocurre alrededor. Se muestra distante, confusa o ausente. Los vínculos y las responsabilidades se vuelven muy difíciles de sostener.",
    characteristicExpressions: [
      "Parece desconectada de lo que sucede a su alrededor.",
      "Olvida con frecuencia compromisos o conversaciones.",
      "Responde con pocas palabras y mínima expresión.",
    ],
    thinkingPatterns: [
      "Siente que las cosas ocurren lejos de ella.",
      "Le cuesta ordenar sus ideas.",
      "Tiene dificultad para percibir el paso del tiempo.",
    ],
    emotionalPatterns: [
      "Entumecimiento y distancia afectiva.",
      "Miedo vago que no puede nombrar.",
      "Momentos de profunda tristeza y soledad.",
    ],
    inRelationships:
      "Se vuelve difícil de alcanzar y los otros pueden sentir que no la reconocen. Necesita una presencia constante, amable y sin exigencias.",
    inDecisions:
      "Prácticamente no logra decidir. Las cosas suceden o dejan de suceder sin que se involucre.",
    availableStrengths: [
      "Una capacidad de recuperación que puede aparecer con cuidado.",
      "Receptividad a la ternura y a la paciencia.",
      "Disposición a dejarse acompañar.",
    ],
    possibleDifficulties: [
      "Incapacidad para sostener trabajo o estudios.",
      "Descuido de la salud y de la seguridad básica.",
      "Pérdida de contacto con su red de apoyo.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 7, la retirada se profundiza hacia una desconexión de la propia experiencia y del entorno. Frente al nivel 9, aún queda algún contacto con las personas y con los afectos, aunque limitado.",
    examples: [
      "No recordar lo que hizo durante buena parte del día.",
      "Mirar a un familiar que le habla sin lograr responder.",
      "Perder trabajo o gestiones básicas por falta de respuesta sostenida.",
    ],
    reflectionQuestions: [
      "¿Qué sensación o lugar me ayuda a sentirme un poco más presente?",
      "¿Quién podría estar a mi lado sin pedirme nada ahora?",
      "¿Qué cosa pequeña puedo hacer hoy para cuidar mi cuerpo?",
    ],
    growthOpportunities: [
      "Buscar el contacto con una persona segura que pueda acompañarte sin presionarte.",
      "Si este funcionamiento resulta doloroso o limitante, acudir a apoyo profesional es un acto de cuidado y no de debilidad.",
      "Apoyarte en rutinas muy simples y en estímulos suaves, como el contacto con la naturaleza o el cuerpo.",
    ],
  }),
  lv(9, {
    editorialLabel: "Funcionamiento con patrones más desadaptativos: retirada casi total de la experiencia compartida",
    description:
      "La persona se aparta casi por completo de la vida compartida y de sí misma. Es un estado de muy poca energía, escasa respuesta al entorno y gran necesidad de cuidado. Detrás de la distancia, el deseo de paz y de conexión sigue existiendo.",
    characteristicExpressions: [
      "Apenas responde a estímulos o a invitaciones.",
      "Necesita ayuda para necesidades básicas.",
      "Permanece largo tiempo en silencio o inmóvil.",
    ],
    thinkingPatterns: [
      "Siente que nada importa ni cambiará.",
      "Casi no puede formular pensamientos claros.",
      "Se percibe lejana a todo.",
    ],
    emotionalPatterns: [
      "Apatía profunda y vacío.",
      "Desamparo que no logra expresar.",
      "Un anhelo silencioso de ser alcanzada con ternura.",
    ],
    inRelationships:
      "La relación con otros queda en suspenso. Necesita una presencia paciente que no exija respuestas y que ofrezca cuidado concreto.",
    inDecisions:
      "No logra decidir ni actuar por sí misma. Requiere acompañamiento externo para las necesidades básicas.",
    availableStrengths: [
      "Un núcleo de calma y de sensibilidad que puede recuperarse.",
      "Capacidad de responder a la ternura constante.",
      "Posibilidad de volver a conectarse con apoyo adecuado.",
    ],
    possibleDifficulties: [
      "Riesgo para la salud por descuido de lo básico.",
      "Aislamiento severo.",
      "Dificultad para pedir o reconocer que necesita ayuda.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 8, la desconexión ya es casi total y el contacto con las personas y con las necesidades básicas es mínimo. Es el extremo del continuo, por lo que solo se compara con el nivel 8.",
    examples: [
      "Pasar días sin comer ni comunicarse con nadie.",
      "No reaccionar ante la voz de un ser querido.",
      "Depender por completo de otra persona para sus cuidados.",
    ],
    reflectionQuestions: [
      "¿Hay alguien cuya presencia me da un poco de calma?",
      "¿Qué cosa mínima podría aceptar hoy de otra persona?",
      "¿Qué le diría a alguien querido que se sintiera así?",
    ],
    growthOpportunities: [
      "Reconocer que este nivel de cansancio y desconexión merece atención y cuidado, y que aceptar ayuda es válido.",
      "Si este funcionamiento resulta doloroso o limitante, buscar apoyo profesional y de personas de confianza cuanto antes es un paso importante.",
      "Aceptar acompañamiento para cubrir necesidades básicas de forma gradual y amable.",
    ],
  }),
];
