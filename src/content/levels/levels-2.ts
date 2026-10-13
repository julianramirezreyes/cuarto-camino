import type { LevelProfile } from "../schema";

type Body = Omit<LevelProfile, "type" | "level" | "sourceLevelName" | "disclaimer" | "sources" | "status">;

const DISCLAIMER =
  "Este perfil es un modelo interpretativo sin validación clínica. Describe tendencias posibles, no es un resultado de evaluación y no sustituye la mirada de un profesional.";

const lvl = (level: LevelProfile["level"], body: Body): LevelProfile => ({
  type: 2,
  level,
  sourceLevelName: null,
  ...body,
  disclaimer: DISCLAIMER,
  sources: ["riso-hudson-1999", "riso-hudson-1996", "hook-2021"],
  status: "draft",
});

const SUPPORT =
  "Si esta forma de vivir resulta dolorosa o agotadora, buscar apoyo profesional (psicología o psicoterapia) y acompañamiento de personas de confianza es una decisión valiosa; no implica que este sea tu caso.";

export const levels2: LevelProfile[] = [
  lvl(1, {
    editorialLabel: "Funcionamiento muy flexible y generoso",
    description:
      "La persona da y recibe con la misma naturalidad. Su cuidado por los demás no depende de ser necesitada ni de obtener gratitud, y se sostiene en una estima propia estable.",
    characteristicExpressions: [
      "Ayuda sin esperar nada y sin llevar la cuenta.",
      "Acepta recibir cuidado y regalos con gusto.",
      "Dice «no» sin culpa cuando necesita descansar.",
    ],
    thinkingPatterns: [
      "Se ve a sí misma como digna de afecto tal como es.",
      "Distingue lo que ofrece de lo que puede esperar.",
      "Reconoce que los demás tienen sus propios recursos.",
    ],
    emotionalPatterns: [
      "Alegría genuina ante el bienestar ajeno.",
      "Tristeza y rabia se expresan sin disfraz.",
      "Seguridad afectiva que no se tambalea ante un rechazo.",
    ],
    inRelationships:
      "Genera vínculos recíprocos y libres, donde nadie queda en deuda ni se siente invadido.",
    inDecisions:
      "Decide considerando tanto sus necesidades como las ajenas, sin sacrificarse por defecto.",
    availableStrengths: [
      "Calidez auténtica.",
      "Empatía que respeta la autonomía del otro.",
      "Capacidad de estar presente sin salvar.",
    ],
    possibleDifficulties: [
      "Puede sentir tristeza al ver que otros no cuidan de sí.",
      "Aun así, hay días en que le cuesta pedir lo que necesita.",
      "Su apertura puede ser malinterpretada como disponibilidad total.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 2, aquí dar y recibir no pasa por la necesidad de ser querida: se vive con libertad. En el nivel 2 aún hay un deseo sutil de ser valorada por lo que se ofrece.",
    examples: [
      "Acompaña a una amiga en un duelo y luego se toma una tarde para sí sin sentirlo egoísta.",
      "Agradece con sencillez un regalo y lo disfruta.",
      "Rechaza un favor en un día difícil y lo explica con calma.",
    ],
    reflectionQuestions: [
      "¿Cuándo doy desde la abundancia y cuándo desde la expectativa?",
      "¿Qué me cuesta pedir y por qué?",
      "¿Cómo acepto el cuidado de otros?",
    ],
    growthOpportunities: [
      "Seguir nutriendo vínculos recíprocos.",
      "Cultivar espacios de soledad serena.",
      "Compartir su experiencia con quienes están aprendiendo a poner límites.",
    ],
  }),
  lvl(2, {
    editorialLabel: "Funcionamiento integrado con cuidado atento",
    description:
      "La persona se vuelca con afecto sobre quienes la rodean, con una sensibilidad fina a las necesidades del otro. Disfruta ser útil y todavía distingue su deseo de ayudar de su necesidad de ser querida.",
    characteristicExpressions: [
      "Detecta lo que otros necesitan antes de que lo pidan.",
      "Ofrece su tiempo y atención con calidez.",
      "Celebra los logros ajenos como propios.",
    ],
    thinkingPatterns: [
      "Piensa en cómo apoyar a las personas que quiere.",
      "Considera cómo se sentirá el otro antes de actuar.",
      "Se pregunta con frecuencia si está siendo útil.",
    ],
    emotionalPatterns: [
      "Ternura y entusiasmo en la ayuda.",
      "Inquietud leve si siente que no está cuidando bien.",
      "Gratificación al ver bienestar en otros.",
    ],
    inRelationships:
      "Es una presencia que acoge, con tendencia a priorizar al otro y a veces a olvidar su propio descanso.",
    inDecisions:
      "Pondera el efecto de sus decisiones en otros y a veces pospone lo suyo para no incomodar.",
    availableStrengths: [
      "Empatía activa.",
      "Generosidad concreta.",
      "Habilidad para crear ambientes cálidos.",
    ],
    possibleDifficulties: [
      "Puede olvidar sus necesidades por atender las de otros.",
      "Le cuesta decir que no cuando lo pide alguien querido.",
      "Cierta tendencia a medir su valor por su utilidad.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 1, aquí el afecto de dar empieza a mezclarse con la necesidad de sentirse valorada. Frente al nivel 3, aún no aparece el esfuerzo sostenido por lograr que el otro dependa de ella.",
    examples: [
      "Prepara una comida para una vecina enferma y se queda a conversar.",
      "Acepta una tarea extra para ayudar a un compañero y luego se agota.",
      "Siente alegría al recordar un cumpleaños importante.",
    ],
    reflectionQuestions: [
      "¿Qué necesito yo hoy y a quién se lo diría?",
      "¿Qué siento cuando alguien no valora mi ayuda?",
      "¿Cómo distingo ayudar de querer ser indispensable?",
    ],
    growthOpportunities: [
      "Preguntar qué necesita el otro antes de ofrecer.",
      "Reservar un momento diario para una necesidad propia.",
      "Practicar un «déjame pensarlo» antes de aceptar encargos.",
    ],
  }),
  lvl(3, {
    editorialLabel: "Funcionamiento flexible con entrega y calidez visible",
    description:
      "La persona se entrega con entusiasmo a mostrar su afecto: elogia, anima, atiende. Es un nivel aún flexible, aunque empieza a aparecer el deseo de que su cercanía sea reconocida.",
    characteristicExpressions: [
      "Expresa con palabras y gestos lo mucho que valora a otros.",
      "Se esfuerza por que la gente se sienta bien en su presencia.",
      "Suele ofrecer consejos y apoyo emocional.",
    ],
    thinkingPatterns: [
      "Cree que sus gestos de cariño construyen los vínculos.",
      "Se fija en cómo responden los demás a su afecto.",
      "Imagina cómo mejorar la vida de las personas cercanas.",
    ],
    emotionalPatterns: [
      "Entusiasmo y afecto expresivos.",
      "Una pequeña inquietud cuando el cariño no se corresponde.",
      "Satisfacción al sentir que importa.",
    ],
    inRelationships:
      "Crea cercanía rápida y cálida, con riesgo de dar más de lo que recibe sin decirlo.",
    inDecisions:
      "Se deja guiar por lo que fortalece sus vínculos, y le cuesta decidir si eso implica una discusión.",
    availableStrengths: [
      "Expresividad afectiva.",
      "Capacidad de animar.",
      "Atención a los detalles de las personas.",
    ],
    possibleDifficulties: [
      "Empieza a dar más de lo que puede sostener.",
      "Se incomoda al sentirse invisibilizada.",
      "Puede sobreestimar el efecto que sus gestos tienen en otros.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 2, aquí el afecto se vuelve más expresivo y la mirada del otro cobra importancia. Frente al nivel 4, aún no hay un esfuerzo marcado por asegurarse de ser indispensable.",
    examples: [
      "Escribe mensajes de ánimo a amigos antes de sus entrevistas de trabajo.",
      "Organiza una reunión sorpresa y espera ver su agradecimiento.",
      "Cuenta a sus conocidos lo bien que cuida de su familia.",
    ],
    reflectionQuestions: [
      "¿Qué respuesta espero de quienes ayudo?",
      "¿Qué siento si mi cariño pasa desapercibido?",
      "¿Qué hago para cuidar mi propio bienestar?",
    ],
    growthOpportunities: [
      "Expresar una necesidad pequeña a alguien cercano esta semana.",
      "Darse un reconocimiento propio sin esperar el de otros.",
      "Probar dar sin contar para observar qué siente.",
    ],
  }),
  lvl(4, {
    editorialLabel: "Funcionamiento intermedio con deseo de ser querida",
    description:
      "El cariño se acompaña de una búsqueda más activa de cercanía y aprobación. La persona se vuelve más atenta a cómo la perciben y comienza a adaptar su conducta para ser apreciada.",
    characteristicExpressions: [
      "Ofrece halagos y gestos para fortalecer los vínculos.",
      "Se acerca de manera afectuosa y a veces invasiva.",
      "Adapta lo que muestra según quién esté presente.",
    ],
    thinkingPatterns: [
      "Piensa que su valor depende de lo que aporta.",
      "Interpreta los silencios como señales de rechazo.",
      "Anticipa lo que el otro quiere para estar a su altura.",
    ],
    emotionalPatterns: [
      "Ansiedad leve ante la posibilidad de no ser querida.",
      "Cariño intenso que busca confirmación.",
      "Dolor ante cualquier señal de distancia.",
    ],
    inRelationships:
      "Se acerca mucho y busca ser parte importante de la vida del otro; a veces olvida pedir lo que desea.",
    inDecisions:
      "Opta por lo que mantiene la cercanía, y puede postergar lo propio por temor a incomodar.",
    availableStrengths: [
      "Sensibilidad interpersonal.",
      "Compromiso afectivo.",
      "Habilidad para hacer sentir bienvenidas a las personas.",
    ],
    possibleDifficulties: [
      "Confunde interés con afecto verdadero.",
      "Le cuesta tolerar desacuerdos.",
      "Su entrega puede sentirse intensa para algunos.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 3, aquí la necesidad de aprobación orienta activamente la conducta. Frente al nivel 5, todavía no se busca que el otro quede en deuda ni se espera una compensación explícita.",
    examples: [
      "Llama varias veces a una amiga que no responde por si ocurrió algo.",
      "Elogia el trabajo de un jefe para ser apreciada.",
      "Dice «sí» a un plan que no le apetece para no decepcionar.",
    ],
    reflectionQuestions: [
      "¿Qué temo que pase si dejo de ser tan disponible?",
      "¿En qué momentos adapto lo que digo para agradar?",
      "¿A quién le pido ayuda sin sentirme una carga?",
    ],
    growthOpportunities: [
      "Practicar decir lo que piensa en situaciones de bajo riesgo.",
      "Notar su ansiedad ante el silencio de otros y respirar antes de actuar.",
      "Buscar actividades donde sea apreciada por algo distinto a ayudar.",
    ],
  }),
  lvl(5, {
    editorialLabel: "Funcionamiento intermedio con cercanía posesiva",
    description:
      "La ayuda se acompaña de una necesidad de ocupar un lugar central en la vida de otros. La persona empieza a sentir que merece reciprocidad y a sentirse herida cuando no la recibe.",
    characteristicExpressions: [
      "Se involucra en la vida de otros incluso sin ser invitada.",
      "Da consejos y soluciones que nadie ha pedido.",
      "Recuerda con detalle lo que ha hecho por los demás.",
    ],
    thinkingPatterns: [
      "Cree que los demás le deben afecto por lo que da.",
      "Piensa que sin ella las cosas no funcionarían.",
      "Interpreta la independencia ajena como rechazo.",
    ],
    emotionalPatterns: [
      "Orgullo por ser necesaria y herida cuando no se reconoce.",
      "Celos ante otros vínculos importantes de sus seres queridos.",
      "Resentimiento que se disimula con amabilidad.",
    ],
    inRelationships:
      "Puede resultar absorbente; los demás sienten que deben corresponder o dar explicaciones.",
    inDecisions:
      "Decide en función de mantener su lugar en la vida de los demás y le cuesta aceptar que la excluyan.",
    availableStrengths: [
      "Entrega concreta y constante.",
      "Memoria afectiva.",
      "Disposición a actuar cuando alguien lo necesita.",
    ],
    possibleDifficulties: [
      "Invade límites ajenos sin darse cuenta.",
      "Se agota atendiendo a todos.",
      "Siente que no recibe lo mismo que da.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 4, aquí ya hay expectativa de reciprocidad y cierta sensación de deuda del otro. Frente al nivel 6, todavía no se usa el reproche ni la culpa como herramienta sistemática.",
    examples: [
      "Se presenta en casa de un amigo con comida «por si acaso» sin avisar.",
      "Recuerda en una discusión todo lo que ha hecho por la otra persona.",
      "Se siente dolida si no la invitan a una reunión familiar.",
    ],
    reflectionQuestions: [
      "¿Qué espero a cambio cuando ayudo?",
      "¿Qué pasaría si alguien resolviera algo sin mí?",
      "¿Cómo vive el otro mi ayuda?",
    ],
    growthOpportunities: [
      "Esperar a que la ayuda sea pedida en situaciones no urgentes.",
      "Registrar lo que recibe de los demás, no solo lo que da.",
      "Compartir con alguien de confianza sus sentimientos de celos o desvalorización.",
    ],
  }),
  lvl(6, {
    editorialLabel: "Funcionamiento intermedio con presión afectiva",
    description:
      "La necesidad de sentirse indispensable se vuelve más visible. La persona recurre al reproche suave, la culpa o el sacrificio para mantener a los demás cerca, aunque no lo advierta del todo.",
    characteristicExpressions: [
      "Recuerda sacrificios para suscitar gratitud.",
      "Se queja de estar agotada, pero sigue sobrecargándose.",
      "Ofrece ayuda de forma que resulta difícil rechazar.",
    ],
    thinkingPatterns: [
      "Cree que sufre más que nadie por los demás.",
      "Interpreta los límites ajenos como ingratitud.",
      "Se convence de que sus intenciones son puras y los otros no lo ven.",
    ],
    emotionalPatterns: [
      "Resentimiento acumulado bajo la amabilidad.",
      "Autocompasión cuando se siente poco valorada.",
      "Culpa cuando siente que no está dando lo suficiente.",
    ],
    inRelationships:
      "Los vínculos se llenan de expectativas implícitas; algunas personas se alejan para evitar sentirse en deuda.",
    inDecisions:
      "Decide pensando en cómo ganar o conservar cercanía, y en ocasiones lo hace de forma indirecta.",
    availableStrengths: [
      "Gran capacidad de entrega.",
      "Sensibilidad a las necesidades ajenas.",
      "Persistencia para no soltar a quienes quiere.",
    ],
    possibleDifficulties: [
      "Relaciones tensas por reproches velados.",
      "Agotamiento y poca atención al autocuidado.",
      "Dificultad para reconocer su propia necesidad de control.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 5, aquí se utiliza activamente la culpa o el sacrificio para sostener la cercanía. Frente al nivel 7, todavía reconoce a veces que está presionando y puede ajustar su conducta.",
    examples: [
      "Dice «no importa, yo me encargo» con un tono que deja claro lo contrario.",
      "Menciona lo cansada que está para que alguien le agradezca.",
      "Se ofende por un comentario de su pareja y calla durante horas.",
    ],
    reflectionQuestions: [
      "¿Cuándo pido cariño de manera indirecta?",
      "¿Qué siento cuando alguien rechaza mi ayuda?",
      "¿Qué haría diferente si no necesitara agradecimiento?",
    ],
    growthOpportunities: [
      "Pedir de forma directa y breve algo que desea.",
      "Identificar el resentimiento temprano y hablar de él con calma.",
      "Dedicar tiempo a actividades que no dependan de otros.",
    ],
  }),
  lvl(7, {
    editorialLabel: "Patrones más desadaptativos: sentido de merecimiento y control afectivo",
    description:
      "La persona siente que ha dado tanto que los demás le deben. Se vuelve intrusiva y controladora en nombre del cariño, y el malestar se intensifica cuando no recibe lo que espera.",
    characteristicExpressions: [
      "Reclama atención y reconocimiento con insistencia.",
      "Interviene en decisiones ajenas «por su bien».",
      "Se muestra dolida o enojada ante cualquier distancia.",
    ],
    thinkingPatterns: [
      "Piensa que todos están en deuda con ella.",
      "Cree que sin su ayuda los demás no saldrían adelante.",
      "Interpreta críticas como ingratitud.",
    ],
    emotionalPatterns: [
      "Rabia contenida y sensación de injusticia.",
      "Tristeza profunda por sentirse poco querida.",
      "Alternancia entre ternura excesiva y reproche.",
    ],
    inRelationships:
      "Los vínculos se tensan o se rompen; algunas personas se sienten sofocadas o controladas.",
    inDecisions:
      "Las decisiones se toman con el fin de asegurar un lugar en la vida del otro, aun a costa de su propia estabilidad.",
    availableStrengths: [
      "Entrega y compromiso profundos.",
      "Intuición sobre necesidades ajenas.",
      "Capacidad de movilizarse por quienes quiere.",
    ],
    possibleDifficulties: [
      "Pérdida de vínculos importantes.",
      "Salud física y emocional deterioradas por sobrecarga.",
      "Dificultad para ver el efecto de su conducta.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 6, aquí el sentido de merecimiento es explícito y el control sobre otros se vuelve insistente. Frente al nivel 8, todavía puede reconocer momentos de ternura y mantener algunas relaciones recíprocas.",
    examples: [
      "Le recuerda a un hijo adulto todo lo que sacrificó mientras se queja de que no la visita.",
      "Aparece sin avisar en el trabajo de su pareja para «comprobar que está bien».",
      "Cuenta a otros sus sacrificios para obtener comprensión.",
    ],
    reflectionQuestions: [
      "¿Qué temo perder si dejo de ocuparme de todo?",
      "¿Qué me cuesta aceptar de que otros decidan sin mí?",
      "¿Quién podría escucharme sin tomar partido?",
    ],
    growthOpportunities: [
      "Hablar con una persona de confianza sobre la soledad y el cansancio que siente.",
      SUPPORT,
      "Practicar pausas antes de intervenir en asuntos ajenos.",
    ],
  }),
  lvl(8, {
    editorialLabel: "Patrones desadaptativos intensos: dependencia y coerción afectiva",
    description:
      "El temor a ser abandonada domina la vida afectiva. La persona puede ejercer presión intensa para evitar la pérdida, a veces con reproches fuertes o descuidando su propia salud, y le cuesta ver lo que hace.",
    characteristicExpressions: [
      "Insiste en la presencia y la atención de los demás.",
      "Descuida su propio bienestar mientras exige ser atendida.",
      "Alterna entre generosidad extrema y reclamos duros.",
    ],
    thinkingPatterns: [
      "Cree que si la dejan, no podrá sostenerse.",
      "Interpreta las pausas del otro como abandono.",
      "Justifica sus presiones como pruebas de amor.",
    ],
    emotionalPatterns: [
      "Miedo profundo a quedarse sola.",
      "Ira repentina seguida de culpa.",
      "Agotamiento y sensación de vacío.",
    ],
    inRelationships:
      "Relaciones marcadas por tensión y dependencia; el entorno puede sentirse atrapado o culpable.",
    inDecisions:
      "Decide por temor a la pérdida, a menudo con costos personales altos.",
    availableStrengths: [
      "Capacidad de amar con hondura.",
      "Coraje para sostener vínculos difíciles.",
      "Disposición a trabajar por quienes importan, que puede reorientarse al autocuidado.",
    ],
    possibleDifficulties: [
      "Conflictos intensos con seres queridos.",
      "Descuido de la salud por sobrecarga y estrés.",
      "Dificultad para pedir ayuda sin sentirse humillada.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 7, aquí la presión sobre los demás se vuelve coercitiva y está impulsada por un miedo intenso a la soledad. Frente al nivel 9, aún se conserva capacidad de relacionarse y de sostener cierta rutina.",
    examples: [
      "Amenaza con enfermarse si su pareja se va de viaje.",
      "Llama sin parar a un familiar que se aleja.",
      "Deja de comer o dormir por la angustia de una discusión.",
    ],
    reflectionQuestions: [
      "¿Qué siento cuando imagino quedarme sola?",
      "¿Qué necesito de mí misma que no estoy dándome?",
      "¿A quién puedo recurrir cuando el miedo es muy grande?",
    ],
    growthOpportunities: [
      "Contar a alguien de confianza el miedo que está sintiendo.",
      SUPPORT,
      "Construir poco a poco rutinas de autocuidado con acompañamiento.",
    ],
  }),
  lvl(9, {
    editorialLabel: "Patrones desadaptativos muy intensos: agotamiento y desamparo",
    description:
      "Tras años de dar sin recibir, la persona puede sentirse completamente vacía, abandonada o enferma. La energía para cuidar se agota y el malestar emocional y físico puede ser muy grande.",
    characteristicExpressions: [
      "Se retira o se desploma tras una crisis de cansancio.",
      "Expresa dolor intenso por sentirse no querida.",
      "Presenta quejas físicas o emocionales persistentes.",
    ],
    thinkingPatterns: [
      "Cree que nadie la quiere ni la cuidará.",
      "Siente que todo lo que hizo fue inútil.",
      "Pierde la perspectiva de que existan relaciones sanas.",
    ],
    emotionalPatterns: [
      "Desesperanza, tristeza y agotamiento profundos.",
      "Ira y dolor hacia quienes siente que la dejaron.",
      "Vergüenza por haber dependido tanto.",
    ],
    inRelationships:
      "El contacto con otros se rompe o se vuelve muy difícil; puede costar aceptar cuidado.",
    inDecisions:
      "Pierde la capacidad de organizar su día; las decisiones se bloquean o se toman desde el desamparo.",
    availableStrengths: [
      "Una enorme capacidad de afecto que puede recuperarse con apoyo.",
      "Sensibilidad que, con cuidado, vuelve hacia sí misma.",
      "Capacidad de reconstruir vínculos reales cuando se siente segura.",
    ],
    possibleDifficulties: [
      "Sufrimiento emocional muy intenso.",
      "Riesgo de descuidar su salud.",
      "Dificultad para creer que alguien la cuidará sin condiciones.",
    ],
    differenceFromAdjacent:
      "Frente al nivel 8, aquí la lucha por mantener cerca a los demás cede paso al agotamiento y a la sensación de desamparo. Es el extremo del mapa, no una etiqueta personal, y lo distingue la pérdida de energía y de esperanza.",
    examples: [
      "Pasa días en cama sin responder mensajes tras una discusión.",
      "Siente que no merece que nadie la cuide.",
      "Rechaza ayuda por vergüenza y luego se siente aún más sola.",
    ],
    reflectionQuestions: [
      "¿Qué me diría un amigo que me quiere ahora mismo?",
      "¿Qué pequeño cuidado puedo permitirme hoy?",
      "¿A quién puedo llamar aunque me cueste?",
    ],
    growthOpportunities: [
      "Contactar con un profesional de salud mental o una línea de apoyo si el malestar es intenso o aparecen ideas de hacerse daño.",
      SUPPORT,
      "Aceptar cuidados concretos de una persona cercana mientras recupera fuerzas.",
    ],
  }),
];
