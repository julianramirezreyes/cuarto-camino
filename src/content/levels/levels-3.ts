import type { LevelProfile } from "../schema";

type Body = Omit<LevelProfile, "type" | "level" | "sourceLevelName" | "disclaimer" | "sources" | "status">;

const DISCLAIMER =
  "Este perfil es un modelo interpretativo sin validación clínica. Describe tendencias posibles, no es un resultado de evaluación y no sustituye la mirada de un profesional.";

const lvl = (level: LevelProfile["level"], body: Body): LevelProfile => ({
  type: 3,
  level,
  sourceLevelName: null,
  ...body,
  disclaimer: DISCLAIMER,
  sources: ["riso-hudson-1999", "riso-hudson-1996", "hook-2021"],
  status: "draft",
});

const SUPPORT =
  "Si esta forma de vivir resulta dolorosa o agotadora, buscar apoyo profesional (psicología o psicoterapia) y acompañamiento de personas de confianza es una decisión valiosa; no implica que este sea tu caso.";

export const levels3: LevelProfile[] = [
  lvl(1, {
    editorialLabel: "Funcionamiento muy flexible y auténtico",
    description:
      "La persona se siente valiosa más allá de sus logros. Trabaja y se destaca porque disfruta hacerlo y le importa lo que construye, no por la necesidad de aprobación.",
    characteristicExpressions: [
      "Muestra sus logros con sencillez y reconoce el aporte de otros.",
      "Se muestra tal como es, incluso cuando no luce impecable.",
      "Pone su talento al servicio de algo más amplio que su imagen.",
    ],
    thinkingPatterns: [
      "Distingue lo que hace de lo que es.",
      "Valora el proceso tanto como el resultado.",
      "Se pregunta qué es realmente importante para ella.",
    ],
    emotionalPatterns: [
      "Orgullo tranquilo sin necesidad de público.",
      "Capacidad de sentir tristeza o decepción sin taparlas.",
      "Seguridad interna ante el fracaso.",
    ],
    inRelationships:
      "Se relaciona con transparencia y calidez; permite que la vean vulnerable.",
    inDecisions:
      "Decide según sus valores y sus ganas, aunque no sean la ruta más vistosa.",
    availableStrengths: [
      "Energía y eficacia con propósito.",
      "Honestidad consigo misma.",
      "Inspiración genuina para otros.",
    ],
    possibleDifficulties: [
      "Puede trabajar demasiado si se entusiasma con un proyecto.",
      "En ambientes muy competitivos puede sentirse fuera de ritmo.",
      "A veces cuesta pausar aun cuando está en paz.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 2, aquí la autoestima no se apoya en el desempeño: se vive como algo dado. En el nivel 2 todavía hay interés por crecer y destacar, aunque ya con buena conexión interior.",
    examples: [
      "Recibe un reconocimiento, agradece y lo comparte con su equipo.",
      "Acepta un proyecto menos visible porque le parece significativo.",
      "Admite en una reunión que no domina un tema y pide ayuda.",
    ],
    reflectionQuestions: [
      "¿Qué haría si nadie fuera a ver los resultados?",
      "¿Cómo me siento cuando no estoy logrando nada?",
      "¿Qué parte de mí queda por mostrar a otros?",
    ],
    growthOpportunities: [
      "Seguir cultivando espacios de descanso sin productividad.",
      "Mentorear a otros desde la autenticidad.",
      "Elegir proyectos por sentido y no por visibilidad.",
    ],
  }),
  lvl(2, {
    editorialLabel: "Funcionamiento integrado con ambición sana",
    description:
      "La persona tiene energía para crecer y mejorar. Se fija metas y las persigue con entusiasmo, y todavía se siente valiosa cuando las cosas no salen según lo previsto.",
    characteristicExpressions: [
      "Plantea objetivos realistas y trabaja con constancia.",
      "Se adapta a distintos entornos sin perder su identidad.",
      "Aprovecha oportunidades de aprendizaje.",
    ],
    thinkingPatterns: [
      "Piensa en cómo mejorar su desempeño y el del equipo.",
      "Evalúa avances con base en datos y sentido práctico.",
      "Valora la reputación como consecuencia, no como meta.",
    ],
    emotionalPatterns: [
      "Entusiasmo y motivación estable.",
      "Decepción pasajera ante un revés.",
      "Satisfacción al ver el esfuerzo dar frutos.",
    ],
    inRelationships:
      "Es una persona motivadora que comparte los éxitos; puede estar muy ocupada, pero hace tiempo para quienes quiere.",
    inDecisions:
      "Decide con rapidez y busca equilibrar resultados con valores; admite correcciones.",
    availableStrengths: [
      "Eficacia y organización.",
      "Capacidad de motivar equipos.",
      "Adaptabilidad.",
    ],
    possibleDifficulties: [
      "Cierta tendencia a llenar la agenda más de lo necesario.",
      "Dificultad ocasional para frenar cuando está cansada.",
      "A veces prioriza lo visible sobre lo íntimo.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 1, aquí el logro cobra mayor peso en la identidad, aunque sin sacrificar la autenticidad. Frente al nivel 3, todavía no se ajusta la imagen para obtener aprobación.",
    examples: [
      "Se propone ascender en un año, pero acepta una pausa si el equipo lo necesita.",
      "Se esfuerza por una presentación y luego celebra con quienes la ayudaron.",
      "Dedica parte del fin de semana a un curso y otra a la familia.",
    ],
    reflectionQuestions: [
      "¿Qué parte de mi día es para mí y no para lograr algo?",
      "¿Cómo defino un buen día más allá de los resultados?",
      "¿Qué me importaría si no tuviera que impresionar a nadie?",
    ],
    growthOpportunities: [
      "Proteger un espacio semanal sin metas.",
      "Preguntar a alguien cercano cómo percibe su ritmo.",
      "Reconocer sus logros sin saltar de inmediato al siguiente.",
    ],
  }),
  lvl(3, {
    editorialLabel: "Funcionamiento flexible con orientación al rendimiento",
    description:
      "El deseo de destacar se vuelve más visible. La persona se enfoca en objetivos claros, cuida la manera en que se presenta y busca ser reconocida, aunque todavía mantiene un contacto sano con sus sentimientos.",
    characteristicExpressions: [
      "Se presenta de forma cuidada y segura.",
      "Fija metas ambiciosas y organiza el camino para lograrlas.",
      "Busca ser un ejemplo de eficacia.",
    ],
    thinkingPatterns: [
      "Piensa en qué cosas otorgarían reconocimiento.",
      "Evalúa su valor en parte por lo conseguido.",
      "Anticipa cómo será vista por los demás.",
    ],
    emotionalPatterns: [
      "Motivación fuerte y a veces ansiedad por rendir.",
      "Contento al recibir reconocimiento.",
      "Incomodidad leve ante la crítica.",
    ],
    inRelationships:
      "Es carismática y generosa con su tiempo cuando hay metas compartidas; puede costarle detenerse en lo emocional.",
    inDecisions:
      "Prefiere decisiones rápidas y orientadas a resultados; revisa sus valores cuando algo la inquieta.",
    availableStrengths: [
      "Carisma y energía.",
      "Orientación a resultados.",
      "Habilidad para comunicar con claridad.",
    ],
    possibleDifficulties: [
      "Empieza a medir su valor por las metas alcanzadas.",
      "Menos tiempo para la introspección.",
      "Cuesta pedir ayuda por no parecer vulnerable.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 2, aquí la imagen y el reconocimiento ganan peso en las decisiones. Frente al nivel 4, aún se conserva claridad sobre lo que siente y no se ajusta la imagen de forma sistemática.",
    examples: [
      "Elige su ropa y su discurso para una entrevista importante con mucho cuidado.",
      "Pospone una conversación íntima para terminar un proyecto.",
      "Se alegra mucho ante un elogio público.",
    ],
    reflectionQuestions: [
      "¿Qué siento cuando no estoy rindiendo?",
      "¿Qué cosa valiosa para mí no se ve desde afuera?",
      "¿A quién le muestro mis dudas?",
    ],
    growthOpportunities: [
      "Compartir una duda con alguien de confianza.",
      "Practicar dos minutos diarios de pausa y chequeo emocional.",
      "Reconocer logros no visibles, como un gesto amable o un descanso.",
    ],
  }),
  lvl(4, {
    editorialLabel: "Funcionamiento intermedio con foco en la competencia",
    description:
      "La persona se esfuerza por ser la mejor en lo que hace y compara su desempeño con el de otros. El éxito se vuelve una medida frecuente de su valor.",
    characteristicExpressions: [
      "Compara con frecuencia sus logros con los de colegas.",
      "Se esfuerza por superar expectativas.",
      "Presenta su trabajo para obtener reconocimiento.",
    ],
    thinkingPatterns: [
      "Piensa en términos de ganar o perder.",
      "Mide el valor propio por el estatus y el rendimiento.",
      "Prioriza lo que impulsa su carrera.",
    ],
    emotionalPatterns: [
      "Ansiedad al compararse con otros.",
      "Emoción intensa por reconocimiento y desánimo al faltar.",
      "Impaciencia con procesos lentos.",
    ],
    inRelationships:
      "Se vuelve más competitiva y a veces apresurada; tiene menos tiempo para la conversación íntima.",
    inDecisions:
      "Elige lo que más beneficia su trayectoria y puede dejar en segundo plano lo afectivo.",
    availableStrengths: [
      "Gran capacidad de trabajo.",
      "Pensamiento estratégico.",
      "Resiliencia ante la presión.",
    ],
    possibleDifficulties: [
      "Descuida su descanso y vínculos.",
      "Dificultad para disfrutar de los logros.",
      "Se siente menos cuando otros destacan.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 3, aquí la comparación y la competencia gobiernan buena parte de las decisiones. Frente al nivel 5, aún se distingue entre ser y parecer, y la imagen no se vuelve el centro de todo.",
    examples: [
      "Revisa en redes los avances de sus colegas y se siente presionada.",
      "Acepta un proyecto extra por no perder visibilidad.",
      "Cancela una cena familiar por un compromiso laboral.",
    ],
    reflectionQuestions: [
      "¿A quién me comparo y qué siento al hacerlo?",
      "¿Qué estoy dejando de lado por rendir?",
      "¿Qué significa para mí «ser suficiente»?",
    ],
    growthOpportunities: [
      "Reducir el tiempo dedicado a compararse en redes.",
      "Planear un descanso protegido cada semana.",
      "Reconocer el trabajo ajeno sin sentirlo como amenaza.",
    ],
  }),
  lvl(5, {
    editorialLabel: "Funcionamiento intermedio con imagen muy cuidada",
    description:
      "La persona cuida cada detalle de su imagen y adapta su discurso a lo que cree que se espera. Puede perder contacto con lo que siente realmente mientras se concentra en proyectar éxito.",
    characteristicExpressions: [
      "Ajusta su presentación según el público.",
      "Resalta logros y minimiza dudas.",
      "Trabaja con intensidad para sostener su perfil.",
    ],
    thinkingPatterns: [
      "Piensa que su valor es lo que los demás ven.",
      "Evita mostrar debilidades para no perder estatus.",
      "Se pregunta con frecuencia cómo la perciben.",
    ],
    emotionalPatterns: [
      "Sensación de vacío tras los logros.",
      "Miedo al fracaso que se oculta con activismo.",
      "Dificultad para identificar lo que desea de verdad.",
    ],
    inRelationships:
      "Establece vínculos útiles y agradables, con poca profundidad cuando teme parecer vulnerable.",
    inDecisions:
      "Decide pensando en la proyección pública, lo que puede alejarla de sus propios deseos.",
    availableStrengths: [
      "Gran habilidad social.",
      "Capacidad de ejecución.",
      "Sentido del detalle en la presentación.",
    ],
    possibleDifficulties: [
      "Pérdida de contacto con lo que realmente siente.",
      "Cansancio por sostener una imagen.",
      "Miedo intenso a ser vista fracasar.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 4, aquí la imagen se convierte en el eje de la identidad y la persona ajusta quién muestra ser. Frente al nivel 6, aún evita exagerar o engañar y se esfuerza por que la imagen tenga un respaldo real.",
    examples: [
      "Se presenta con entusiasmo en una reunión aunque se siente desanimada.",
      "Se inscribe en un evento solo para dejarse ver.",
      "Responde «todo muy bien» cuando no es así.",
    ],
    reflectionQuestions: [
      "¿Qué siento realmente cuando termino un logro?",
      "¿Qué parte de mí queda sin mostrar?",
      "¿Qué haría diferente si no necesitara aprobación?",
    ],
    growthOpportunities: [
      "Contar a una persona de confianza algo que no suele compartir.",
      "Preguntarse «¿qué quiero yo?» antes de elegir un proyecto.",
      "Tomarse un fin de semana sin publicar ni mostrar nada.",
    ],
  }),
  lvl(6, {
    editorialLabel: "Funcionamiento intermedio con exageración de logros",
    description:
      "La brecha entre lo que muestra y lo que vive se agranda. La persona recurre a exagerar logros o a adornar su historia para mantener una imagen de éxito, mientras la inseguridad crece por dentro.",
    characteristicExpressions: [
      "Adorna sus logros y presume de su éxito.",
      "Evita hablar de sus fracasos o los minimiza.",
      "Busca la admiración y se incomoda ante los que no se la dan.",
    ],
    thinkingPatterns: [
      "Cree que ser común equivale a ser poco valiosa.",
      "Piensa que debe superar constantemente su último logro.",
      "Se convence de su propia narración para sostenerla.",
    ],
    emotionalPatterns: [
      "Inseguridad profunda detrás de la seguridad aparente.",
      "Envidia o rabia ante el éxito de otros.",
      "Agotamiento y miedo al descubrimiento.",
    ],
    inRelationships:
      "Se rodea de personas que la admiran y evita a quienes puedan ver más allá de su imagen; la intimidad se vuelve difícil.",
    inDecisions:
      "Opta por lo que mejora su perfil, incluso cuando va contra sus valores o su descanso.",
    availableStrengths: [
      "Capacidad de persuasión.",
      "Energía para emprender.",
      "Resiliencia para recomponerse.",
    ],
    possibleDifficulties: [
      "Tensión por mantener una imagen que no coincide con la realidad.",
      "Relaciones superficiales.",
      "Dificultad para reconocer errores ante otros.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 5, aquí ya se amplían o distorsionan los hechos para sostener la imagen. Frente al nivel 7, todavía puede reconocer la distancia entre lo real y lo mostrado y le incomoda.",
    examples: [
      "Cuenta que dirigió un proyecto cuando solo colaboró.",
      "Evita contar que no la ascendieron.",
      "Se irrita cuando un colega recibe más aplausos.",
    ],
    reflectionQuestions: [
      "¿Qué temo que pase si cuento lo que realmente ocurrió?",
      "¿Cómo me siento cuando exagero?",
      "¿Quién me conocería si me mostrara sin adornos?",
    ],
    growthOpportunities: [
      "Practicar contar un logro tal como fue, sin añadidos.",
      "Compartir un fracaso con alguien de confianza.",
      "Identificar qué necesidad hay detrás de la admiración que busca.",
    ],
  }),
  lvl(7, {
    editorialLabel: "Patrones más desadaptativos: oportunismo y engaño de sí misma",
    description:
      "La persona puede usar a otros como medio para sostener su imagen y engañarse a sí misma sobre sus motivos. Con frecuencia vive con una gran tensión entre la imagen y la vergüenza que teme.",
    characteristicExpressions: [
      "Toma decisiones en función de lo que le conviene más en lo inmediato.",
      "Oculta datos o los presenta de forma sesgada.",
      "Se vuelve distante o fría ante quienes no le sirven.",
    ],
    thinkingPatterns: [
      "Cree que «todo vale» para no quedar mal.",
      "Racionaliza sus actos para evitar sentir vergüenza.",
      "Piensa que los demás hacen lo mismo.",
    ],
    emotionalPatterns: [
      "Vacío interno y miedo a ser descubierta.",
      "Rabia ante la crítica.",
      "Cansancio profundo que no logra reconocer.",
    ],
    inRelationships:
      "Las relaciones se vuelven instrumentales y se resienten; pueden sentirse desconfianza y distancia.",
    inDecisions:
      "Decide por conveniencia, con poca consideración por el impacto en otros o en su propio bienestar.",
    availableStrengths: [
      "Gran capacidad de adaptación.",
      "Perseverancia.",
      "Habilidad para recuperarse tras un revés, si se sostiene en algo auténtico.",
    ],
    possibleDifficulties: [
      "Pérdida de confianza de quienes la rodean.",
      "Agotamiento por sostener una máscara.",
      "Conflictos laborales o legales por decisiones apresuradas.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 6, aquí el engaño se extiende a los motivos propios y los otros pasan a ser medios. Frente al nivel 8, todavía conserva alguna conexión con valores personales y siente incomodidad por sus actos.",
    examples: [
      "Se atribuye un trabajo de otra persona en una reunión.",
      "Deja de contestar a un amigo que ya no le ofrece contactos.",
      "Se justifica diciendo «es solo negocio» cuando algo la inquieta.",
    ],
    reflectionQuestions: [
      "¿Qué sentimiento intento evitar con tanto movimiento?",
      "¿Qué relaciones valoro más allá de lo que me aportan?",
      "¿Con quién podría hablar de esta presión sin ser juzgada?",
    ],
    growthOpportunities: [
      "Contar a una persona de confianza el cansancio que acarrea sostener la imagen.",
      SUPPORT,
      "Retomar una actividad que disfrutaba sin buscar resultados.",
    ],
  }),
  lvl(8, {
    editorialLabel: "Patrones desadaptativos intensos: rivalidad y hostilidad",
    description:
      "El miedo a la humillación y al fracaso se vuelve intenso. La persona puede reaccionar con hostilidad o sabotear a quienes percibe como amenaza, mientras se siente cada vez más desconectada de sí misma.",
    characteristicExpressions: [
      "Menosprecia o desacredita a quienes percibe como rivales.",
      "Reacciona con enojo o frialdad ante cualquier crítica.",
      "Evita mostrar debilidad, incluso en privado.",
    ],
    thinkingPatterns: [
      "Piensa que el éxito de otros es una amenaza.",
      "Justifica ataques como defensa de su posición.",
      "Se convence de que está sola contra todos.",
    ],
    emotionalPatterns: [
      "Rabia, miedo y vergüenza mezclados.",
      "Desprecio hacia quienes percibe débiles.",
      "Insomnio, tensión y desasosiego constantes.",
    ],
    inRelationships:
      "Hay rupturas y conflictos serios; los demás pueden sentir temor o rechazo.",
    inDecisions:
      "Elige confrontar o eliminar amenazas, a veces con riesgo para su propia estabilidad.",
    availableStrengths: [
      "Coraje y determinación.",
      "Habilidad para actuar bajo presión.",
      "Capacidad de reconstruirse si recibe apoyo auténtico.",
    ],
    possibleDifficulties: [
      "Aislamiento por conflictos acumulados.",
      "Salud física y emocional muy afectada.",
      "Dificultad para pedir ayuda sin sentirse expuesta.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 7, aquí el miedo a fracasar se traduce en hostilidad abierta hacia posibles rivales. Frente al nivel 9, aún puede planificar y mantener la apariencia, aunque con costos crecientes.",
    examples: [
      "Difunde rumores sobre un colega que podría ascender.",
      "Responde con ira a una corrección de su jefe.",
      "Pasa noches en vela repasando cómo derrotar a un competidor.",
    ],
    reflectionQuestions: [
      "¿Qué temo sentir si me detengo?",
      "¿Qué parte de mí quisiera descansar de la competencia?",
      "¿Quién podría acompañarme sin evaluarme?",
    ],
    growthOpportunities: [
      "Hablar con alguien de confianza sobre el miedo que hay detrás de la rivalidad.",
      SUPPORT,
      "Dar pequeños pasos de cuidado personal, como dormir y comer con regularidad.",
    ],
  }),
  lvl(9, {
    editorialLabel: "Patrones desadaptativos muy intensos: derrumbe de la imagen y vergüenza profunda",
    description:
      "Cuando la imagen se desmorona, la persona puede sentirse sin valor, huir de la situación o buscar cualquier modo de evitar ser vista. El sufrimiento puede ser muy grande y afectar la capacidad de funcionar.",
    characteristicExpressions: [
      "Se retira de la vida pública o de sus compromisos.",
      "Evita contacto con quienes conocen su situación.",
      "Alterna entre apatía y reacciones desesperadas.",
    ],
    thinkingPatterns: [
      "Cree que, sin éxito, no vale nada.",
      "Piensa que todos la miran con desprecio.",
      "Pierde la capacidad de ver alternativas.",
    ],
    emotionalPatterns: [
      "Vergüenza intensa y desánimo.",
      "Rabia hacia sí misma y hacia otros.",
      "Entumecimiento o llanto repentino.",
    ],
    inRelationships:
      "Se aleja de las personas que la quieren por vergüenza; puede costar aceptar ayuda.",
    inDecisions:
      "Las decisiones se bloquean o se toman para escapar del dolor inmediato.",
    availableStrengths: [
      "Una capacidad de esfuerzo que puede reorientarse con apoyo.",
      "Posibilidad de reconstruir su identidad desde algo más auténtico.",
      "Energía que reaparece cuando se siente segura.",
    ],
    possibleDifficulties: [
      "Sufrimiento emocional muy intenso.",
      "Riesgo de descuidar la salud y el autocuidado.",
      "Aislamiento que agrava la vergüenza.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 8, aquí la lucha por mantener la imagen cede y deja paso a la vergüenza y el colapso de la energía. Es el extremo del mapa y lo distingue la pérdida de recursos para sostener nada.",
    examples: [
      "Deja de contestar llamadas tras perder un cargo importante.",
      "Evita salir de casa por miedo a ser reconocida.",
      "Se critica con dureza sin hallar salida.",
    ],
    reflectionQuestions: [
      "¿Quién sería yo sin mis logros?",
      "¿Qué le diría a una persona querida que viviera esto?",
      "¿Con quién podría hablar aunque me dé vergüenza?",
    ],
    growthOpportunities: [
      "Contactar con un profesional de salud mental o una línea de apoyo si el malestar es intenso o aparecen ideas de hacerse daño.",
      SUPPORT,
      "Aceptar acompañamiento de una persona cercana mientras recupera estabilidad y rutina.",
    ],
  }),
];
