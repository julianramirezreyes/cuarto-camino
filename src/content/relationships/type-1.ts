import type { RelationshipProfile } from "../schema";

export const relType1: RelationshipProfile = {
  type: 1,
  summary:
    "En este modelo, el tipo 1 se acerca a los vínculos con el deseo de hacer las cosas bien y de ser una persona íntegra para quienes le importan. Esa exigencia nace de una convicción profunda: que cuidar a alguien incluye esforzarse por mejorar lo que se comparte. Suele ofrecer compromiso, coherencia y un sentido claro de la responsabilidad. También puede tender a corregir o a quedarse con una regla interna que la otra persona no conoce, y entonces la cercanía se tensa sin que nadie lo haya querido.",
  contexts: {
    friendship: {
      brings: [
        "Lealtad concreta: recuerda lo prometido y aparece cuando dijo que iba a aparecer.",
        "Honestidad cuidadosa: dice lo que piensa con la intención de que la amistad sea más sólida y no más cómoda.",
        "Disposición a ayudar con tareas reales, como una mudanza, un trámite o la revisión de un texto.",
        "Un sentido del humor que a menudo se suelta más en la confianza que en público.",
      ],
      needs: [
        "Sentir que la amistad no depende de rendir bien ni de tener razón en cada asunto.",
        "Que alguien le agradezca el esfuerzo que pone sin que tenga que recordarlo.",
        "Espacios de juego y ocio sin objetivo, donde pueda soltar el control sin que se juzgue.",
        "Recibir las opiniones distintas sin que parezcan un ataque a su manera de ver las cosas.",
      ],
      frictions: [
        "Una sugerencia pensada como ayuda puede escucharse como reproche, y ambas personas quedan a la defensiva.",
        "Puede guardar molestias pequeñas hasta que se acumulan y aparecen con más fuerza de la esperada.",
        "Los planes improvisados o los retrasos pueden resultarle más incómodos de lo que la otra persona imagina.",
        "Si el grupo de amistades se divierte de una manera que le parece poco responsable, puede quedarse al margen en silencio.",
      ],
      tips: [
        "Probar con una frase como «Antes de opinar, ¿quieres consejo o prefieres que te escuche?» para evitar corregir sin que lo pidan.",
        "Decir en voz alta lo que sí le gusta de la amistad, no solo lo que quisiera ajustar.",
        "Pactar con las amistades una forma amable de avisar cuando algo le molesta, antes de que crezca.",
        "Proponer de vez en cuando un plan sin agenda, como caminar sin rumbo fijo, y observar cómo se siente.",
      ],
    },
    partner: {
      brings: [
        "Un compromiso serio con la relación: tiende a tomarse en serio los acuerdos y las decisiones de a dos.",
        "Atención a los detalles prácticos del hogar y de la vida compartida.",
        "Deseo genuino de crecer junto a la pareja y de aportar a la relación lo mejor de sí.",
        "Gestos de cuidado que se expresan en actos: arreglar, organizar, llegar a tiempo, cumplir.",
      ],
      needs: [
        "Escuchar con claridad que la pareja la valora tal como es y no solo cuando todo está en orden.",
        "Poder hablar de lo que le molesta sin que la conversación se entienda como una acusación.",
        "Momentos de ternura y de juego que le permitan bajar la guardia y dejar la lista de pendientes.",
        "Acuerdos explícitos sobre responsabilidades, para no cargar en silencio con lo que le parece justo repartir.",
      ],
      frictions: [
        "Las reglas internas sobre cómo se hacen las cosas pueden chocar con las de la pareja, y ninguna manera está equivocada, solo es distinta.",
        "El tono de corrección, aun suave, puede erosionar la espontaneidad y la sensación de ser aceptado sin condiciones.",
        "La molestia contenida puede salir como irritación por asuntos menores, como el orden o los horarios.",
        "A veces postpone el placer y el descanso, y la pareja puede sentir que el tiempo de calidad llega después del deber.",
      ],
      tips: [
        "Pactar una conversación breve y regular sobre el hogar, con un tono de equipo y no de revisión.",
        "Sustituir «Está mal hecho» por «A mí me ayudaría que lo hiciéramos de esta otra manera» y escuchar la versión de la otra persona.",
        "Agendar un rato semanal de cuerpo y placer, sin metas: bailar, cocinar sin receta, descansar en compañía.",
        "Preguntar a la pareja qué le haría sentir cuidado y no suponer que coincide con lo que a quien pregunta le parece correcto.",
      ],
    },
    family: {
      brings: [
        "Un sentido fuerte del deber hacia quienes forman parte de la familia, sea cual sea su forma.",
        "Constancia: sostiene rutinas, cuidados y acuerdos que dan estructura al día a día.",
        "Valores claros que transmite con el ejemplo, más que con discursos.",
        "Disposición a asumir la parte difícil y poco vistosa de la organización familiar.",
      ],
      needs: [
        "Reconocimiento por la carga que asume, dicho con palabras y no solo dado por sentado.",
        "Que el resto de la familia participe y no deje en sus manos lo que considera importante.",
        "Aceptación de su propia imperfección, sin que se espere que sea quien no falla en el grupo.",
        "Ocasiones de convivencia ligera, donde nadie corrija ni evalúe.",
      ],
      frictions: [
        "Si ejerce un rol de cuidado, como madre, padre o hermano mayor, la insistencia en los modos correctos puede leerse como control.",
        "Las normas rígidas pueden dejar poco margen a que niñas, niños o adolescentes prueben y se equivoquen a su manera.",
        "En reuniones extensas, la tensión entre cómo se hacen las cosas y cómo les gustaría a otros puede estallar por detalles.",
        "Puede costarle sentirse comprendido cuando otras personas viven con más soltura asuntos que para el tipo 1 son importantes.",
      ],
      tips: [
        "Explicar el porqué de una norma y dejar espacio para negociar lo que no sea esencial.",
        "Si hay hijas o hijos, celebrar el esfuerzo y la curiosidad, además del resultado correcto.",
        "Elegir una o dos costumbres familiares que importan de verdad y soltar las demás, aunque cueste.",
        "Pedir ayuda concreta con una frase como «Necesito que te encargues de esto esta semana», en lugar de esperar que se note.",
      ],
    },
    work: {
      brings: [
        "Calidad y cuidado en lo que entrega, con atención a los estándares y a los procesos.",
        "Confiabilidad: tiende a cumplir plazos y a tomarse en serio los compromisos del equipo.",
        "Ojo para detectar errores, riesgos y asuntos éticos que otros pasarían por alto.",
        "Compromiso con la mejora continua de la comunidad, la organización o la institución a la que pertenece.",
      ],
      needs: [
        "Criterios claros sobre lo que se espera y cómo se evalúa el trabajo.",
        "Retroalimentación que reconozca lo bien hecho además de lo pendiente.",
        "Margen para ejercer su criterio sin verse en la obligación de avalar decisiones que le parecen incorrectas.",
        "Un equipo que comparta la responsabilidad en lugar de delegarle el rigor.",
      ],
      frictions: [
        "El perfeccionismo puede alargar entregas y provocar tensión cuando el equipo prioriza la rapidez.",
        "Una corrección dicha con prisa puede percibirse como crítica a la persona y no a la tarea.",
        "Puede tener dificultad para delegar si piensa que no se hará con el cuidado que pondría el tipo 1.",
        "En espacios con reglas ambiguas, la frustración puede transformarse en rigidez o en enojo contenido.",
      ],
      tips: [
        "Definir en equipo qué entregas necesitan nivel excelente y cuáles con un nivel suficiente alcanzan.",
        "Abrir las observaciones con algo concreto que funciona, y luego proponer el ajuste como una pregunta.",
        "Al delegar, acordar el resultado esperado y no el método paso a paso.",
        "Programar pausas reales durante la jornada y tratarlas con la misma seriedad que una reunión.",
      ],
    },
  },
  forOthers: [
    "Agradecer de manera específica lo que hace; el reconocimiento explícito suele aliviar la autoexigencia.",
    "Evitar interpretar su seriedad como frialdad: con frecuencia detrás hay un cuidado muy comprometido.",
    "Preguntar «¿Qué es lo que más te importa de esto?» ayuda a entender qué valor está defendiendo.",
    "Cuando hay algo que corregir, hacerlo en privado, con calma y sin ironía, abre más escucha que el reproche público.",
    "Invitarle a actividades de disfrute sin metas, aceptando que quizás tarde unos minutos en soltarse.",
    "Compartir la responsabilidad de manera visible, para que no sienta que todo depende de su rigor.",
  ],
  reflectionQuestions: [
    "¿Qué regla interna sobre cómo se hacen las cosas estoy aplicando ahora, y la otra persona la conoce?",
    "¿Cuándo mi exigencia ha cuidado una relación y cuándo ha puesto distancia?",
    "¿Qué necesita la otra persona de mí que no sea corregir ni mejorar algo?",
    "¿En qué momentos guardo una molestia en lugar de decirla con suavidad, y qué me lo impide?",
    "¿Qué disfruto de verdad hacer con alguien sin que tenga que ser útil ni estar bien hecho?",
    "¿Cómo se siente la otra persona cuando le doy una sugerencia, y se lo he preguntado?",
    "¿Qué le diría a una amistad que se exigiera tanto como yo me exijo?",
  ],
  sameTypeNote:
    "Dos personas de tipo 1 pueden reconocerse enseguida en el valor que dan a la honestidad, al esfuerzo y a la responsabilidad, y eso suele generar respeto mutuo. Entre ambas puede haber una conversación muy franca sobre lo que significa hacer las cosas con sentido. Los puntos ciegos compartidos podrían ser que cada quien tenga su propia versión de lo correcto y se corrijan sin notarlo, que ninguna se permita descansar o disfrutar sin culpa, y que la molestia contenida circule en silencio. Conversar sobre qué estándares son esenciales y cuáles son preferencias personales puede dar aire a ambas partes.",
  caveats:
    "Lo que más pesa en una relación no es el tipo: el nivel de salud de cada persona, su apego y su historia, el ala (1 con ala 9 o con ala 2) y el subtipo instintivo cambian mucho cómo se vive la exigencia y la cercanía. Una persona de tipo 1 en un momento de mayor salud suele ser flexible y cálida; bajo estrés puede volverse crítica y rígida. El modelo del eneagrama tiene respaldo empírico limitado para describir relaciones, por lo que estas ideas son hipótesis para conversar y no un diagnóstico ni una predicción.",
  sources: ["enneagram-institute-combinations", "palmer-1995", "riso-hudson-1999", "carpenter-2015"],
  status: "draft",
};
