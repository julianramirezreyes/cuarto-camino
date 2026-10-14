import type { RelationshipProfile } from "../schema";

export const relType2: RelationshipProfile = {
  type: 2,
  summary:
    "En este modelo, el tipo 2 se acerca a los vínculos a través del cuidado: percibe con rapidez lo que otras personas necesitan y se mueve para ofrecerlo. Detrás hay un anhelo de recibir cariño y de sentir que su presencia hace falta, que se expresa como generosidad, calidez y atención al detalle. Esa misma sensibilidad puede llevar a poner las necesidades ajenas por delante y a callar las propias. Entonces la relación se carga de expectativas que nadie ha dicho en voz alta.",
  contexts: {
    friendship: {
      brings: [
        "Calidez inmediata: recuerda cumpleaños, gustos y momentos difíciles de las amistades.",
        "Capacidad de hacer que otras personas se sientan bienvenidas y vistas en un grupo.",
        "Disposición a acudir cuando alguien pasa por un mal momento, a veces antes de que lo pida.",
        "Habilidad para conectar a unas amistades con otras y mantener vivo el círculo.",
      ],
      needs: [
        "Señales de que la amistad también existe cuando no está ayudando.",
        "Que le pregunten cómo está y esperen una respuesta real, no una fórmula de cortesía.",
        "Palabras de agradecimiento que reconozcan el gesto concreto y no solo el resultado.",
        "Permiso explícito para decir que no sin que la relación se resienta.",
      ],
      frictions: [
        "Ofrecer ayuda que no fue pedida puede resultar abrumador para quien prefiere resolver por su cuenta.",
        "Si el esfuerzo no se nota, puede acumularse un resentimiento que se manifiesta de manera indirecta.",
        "Le cuesta pedir lo que necesita y espera que las amistades lo adivinen, lo que genera malentendidos.",
        "Puede sentir que pierde lugar cuando una amistad crea vínculos nuevos y quedar con una sensación de vacío.",
      ],
      tips: [
        "Practicar la frase «Me encantaría ayudarte, ¿qué te vendría bien de mí?» antes de actuar.",
        "Elegir una vez por semana algo que desea y proponerlo directamente a una amistad.",
        "Cuando algo moleste, nombrarlo en el momento con calma, sin esperar a que se acumule.",
        "Aceptar un regalo o un favor sin devolverlo de inmediato, para ensayar el recibir.",
      ],
    },
    partner: {
      brings: [
        "Entrega afectuosa: pequeños gestos cotidianos, atención a los estados de ánimo, ternura expresada.",
        "Una intuición fina para las necesidades emocionales de la pareja.",
        "Deseo profundo de crear intimidad y de que la pareja se sienta acompañada.",
        "Generosidad en el tiempo, la energía y la disponibilidad para el proyecto compartido.",
      ],
      needs: [
        "Sentir con claridad que recibe cariño por quien es y no por lo que hace.",
        "Un espacio donde sus necesidades sean tan legítimas como las de la pareja.",
        "Demostraciones de afecto y reconocimiento verbal, especialmente cuando se esfuerza.",
        "Conversaciones en las que pueda decir que tiene cansancio o que desea algo, sin que se interprete como queja.",
      ],
      frictions: [
        "Si entrega mucho y no comunica lo que espera, la pareja puede sentir una deuda que no sabía que existía.",
        "El cuidado puede llegar a sentirse como control cuando se anticipa a todo lo que la pareja podría necesitar.",
        "El cansancio emocional puede aparecer como reproche o como un repentino distanciamiento.",
        "Puede ajustar su personalidad a la pareja hasta que ya no sabe bien qué quiere por su cuenta.",
      ],
      tips: [
        "Pactar un ritual semanal donde cada persona diga una necesidad propia y una cosa que agradece.",
        "Antes de resolver algo por la pareja, preguntar «¿Quieres que lo haga o prefieres hacerlo tú?».",
        "Anotar tres cosas que disfruta fuera de lo que hace por la relación, y compartirlas.",
        "Cuando aparezca la irritación, nombrarla como «Siento sobrecarga y quiero hablarlo» y no como crítica.",
      ],
    },
    family: {
      brings: [
        "Un papel de sostén emocional: suele ser quien llama, organiza reuniones y sabe cómo está cada integrante.",
        "Capacidad de acompañar etapas de enfermedad, duelo o transición con presencia concreta.",
        "Hospitalidad que hace que la casa sea un lugar al que se desea volver.",
        "Memoria afectiva de la historia familiar, de sus fechas y rituales.",
      ],
      needs: [
        "Que la familia reconozca el trabajo emocional, que a menudo es invisible.",
        "Que otras personas asuman cuidados para que no recaigan en una sola persona.",
        "Respeto cuando elige un tiempo para sí, sin que se interprete como abandono.",
        "Expresiones de cariño que no estén condicionadas a que cumpla con un rol.",
      ],
      frictions: [
        "Si es madre, padre o figura cuidadora, puede costarle ver crecer a niñas y niños hacia su independencia.",
        "Puede mediar entre integrantes y quedar en un papel de intermediación agotador.",
        "Los consejos no solicitados sobre la vida de familiares adultos pueden vivirse como intromisión.",
        "En reuniones grandes, puede sobrecargarse de organizar y resentir que nadie lo note.",
      ],
      tips: [
        "Repartir tareas de cuidado con nombres y fechas concretas y no esperar a que alguien se ofrezca.",
        "Probar con «Hoy necesito descansar, ¿puedes encargarte tú?» y observar cómo reacciona la familia.",
        "Con jóvenes, preguntar «¿Quieres mi opinión o solo que te escuche?» antes de aconsejar.",
        "Llevar a una reunión algo sencillo y quedarse un rato sin atender a nadie.",
      ],
    },
    work: {
      brings: [
        "Sensibilidad para el clima del equipo: percibe tensiones y apoya a quien está pasando un mal momento.",
        "Capacidad de crear lazos de confianza que facilitan la colaboración.",
        "Atención al bienestar de las personas en proyectos comunitarios, de voluntariado o de servicio.",
        "Entusiasmo para dar la bienvenida a quien llega y ayudarle a integrarse.",
      ],
      needs: [
        "Recibir reconocimiento por su aporte relacional, no solo por los resultados medibles.",
        "Claridad sobre los límites de su rol, para no absorber tareas que no le corresponden.",
        "Retroalimentación cálida que separe el desempeño de su valor como persona.",
        "Espacio para decir que no a nuevas solicitudes sin que se lea como falta de compromiso.",
      ],
      frictions: [
        "Aceptar demasiadas peticiones puede conducir a la sobrecarga y a una irritación que no sabe cómo expresar.",
        "Puede costarle dar una devolución crítica, por temor a dañar el vínculo.",
        "Si su apoyo pasa desapercibido, puede sentir que su aporte no se valora y retirarse en silencio.",
        "La cercanía que construye puede confundirse con influencia y generar incomodidad en otros.",
      ],
      tips: [
        "Antes de aceptar una tarea nueva, pedir un día para responder y revisar la carga real.",
        "Entrenar la crítica constructiva con una estructura: observación, efecto, petición.",
        "Documentar lo que aporta al equipo y compartirlo en las revisiones de desempeño.",
        "Mantener un límite de horario para las conversaciones de apoyo emocional dentro de la jornada.",
      ],
    },
  },
  forOthers: [
    "Preguntarle cómo está y quedarse a escuchar la respuesta, porque suele desviar la conversación hacia los demás.",
    "Agradecer lo concreto: decir qué fue lo que ayudó y cómo se sintió, en lugar de un agradecimiento general.",
    "Decirle con claridad cuando no se necesita ayuda; lo recibirá mejor si no se entiende como rechazo.",
    "Invitarle a pedir lo que quiere y celebrar cuando lo hace, aunque sea pequeño.",
    "Dar espacio para que descanse y recibir cuidado, sin esperar a que se agote.",
    "Reconocer el trabajo emocional como trabajo real, sobre todo cuando es silencioso.",
  ],
  reflectionQuestions: [
    "¿Qué necesito en este momento y a quién se lo he dicho con claridad?",
    "¿Cuándo mi ayuda surge de un deseo genuino y cuándo de la esperanza de recibir cariño a cambio?",
    "¿Qué necesita la otra persona que quizás yo no estoy preguntando por anticiparme?",
    "¿Cómo sé si alguien me quiere cuando no estoy haciendo nada por esa persona?",
    "¿Qué se siente decir que no, y qué temo que pase si lo hago?",
    "¿En qué relaciones doy mucho más de lo que recibo, y qué parte de esa dinámica sostengo yo?",
    "¿Qué dejaría de hacer si supiera que el vínculo no depende de ello?",
  ],
  sameTypeNote:
    "Dos personas de tipo 2 pueden reconocerse en la generosidad y en la atención a las demás personas, y es fácil que se sientan muy cuidadas entre sí. Hay una comprensión inmediata de lo que significa dar con cariño. Los puntos ciegos compartidos podrían ser que ambas se pongan al servicio de la otra y ninguna diga lo que necesita, que se anticipen mutuamente hasta que nadie sabe quién desea qué, y que el cansancio de ambas aparezca como silencio o distancia. Acordar un momento para nombrar necesidades propias, sin disculpas, puede abrir un tipo de intimidad menos centrada en el servicio.",
  caveats:
    "El tipo cuenta menos que otras variables: el nivel de salud de cada persona, su estilo de apego, su historia familiar, el ala (2 con ala 1 o con ala 3) y el subtipo instintivo moldean mucho cómo se vive el cuidado y la cercanía. En momentos de mayor salud, el cuidado se acompaña de límites claros y de la capacidad de recibir; bajo estrés puede volverse intrusivo o resentido. El modelo del eneagrama tiene respaldo empírico limitado para describir relaciones, de modo que estas ideas sirven para reflexionar y conversar, no para diagnosticar ni predecir.",
  sources: ["enneagram-institute-combinations", "palmer-1995", "riso-hudson-1996", "carpenter-2015"],
  status: "draft",
};
