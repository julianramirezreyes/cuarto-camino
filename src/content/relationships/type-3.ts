import type { RelationshipProfile } from "../schema";

export const relType3: RelationshipProfile = {
  type: 3,
  summary:
    "En este modelo, el tipo 3 se acerca a los vínculos con energía, iniciativa y ganas de que las cosas avancen. Su motivación suele ser sentir que tiene valor y recibir reconocimiento, y por eso tiende a mostrar su mejor versión y a orientarse a metas compartidas. Aporta entusiasmo, eficacia y la capacidad de motivar a quienes están cerca. También puede ocurrir que la imagen que presenta tape lo que siente de verdad, y que la otra persona no sepa cuándo encontrarse con quien hay detrás.",
  contexts: {
    friendship: {
      brings: [
        "Entusiasmo contagioso para proponer planes, viajes y proyectos que sacan a las amistades de la rutina.",
        "Generosidad al celebrar los logros ajenos cuando se siente en confianza dentro del vínculo.",
        "Capacidad de adaptarse a distintos círculos y hacer que cada persona se sienta incluida.",
        "Talento para impulsar y concretar ideas que otras amistades dejaban en el aire.",
      ],
      needs: [
        "Sentir que la amistad la acoge incluso en los momentos en que no brilla ni rinde.",
        "Escuchar reconocimiento por lo que es, además de lo que consigue.",
        "Espacio para hablar de dudas y cansancio sin que se interprete como fracaso.",
        "Amistades que pregunten por sus sentimientos y no solo por sus novedades.",
      ],
      frictions: [
        "Puede llenar la agenda hasta dejar poco tiempo para conversaciones lentas y sin objetivo.",
        "El tono competitivo, aun en broma, puede incomodar a quien no busca medirse.",
        "Quizás muestre solo la parte exitosa de su vida y la amistad no llegue a conocer sus dudas.",
        "Si la amistad le parece estancada, puede alejarse sin explicar lo que ocurre.",
      ],
      tips: [
        "Una vez al mes, compartir con una amistad algo que no salió bien y escuchar su reacción.",
        "Probar con «Hoy no tengo un plan, solo ganas de estar contigo» como invitación.",
        "Preguntar a las amistades qué valoran de ti más allá de lo que organiza o consigue.",
        "Frenar el impulso de resolver y ofrecer primero atención completa, sin pantalla ni agenda.",
      ],
    },
    partner: {
      brings: [
        "Impulso para construir proyectos de vida compartidos y dedicación para sostenerlos.",
        "Capacidad de cuidar la imagen y la dinámica de la pareja ante familia y amistades.",
        "Estímulo hacia el crecimiento: suele animar a la pareja a perseguir sus propias metas.",
        "Eficacia para resolver los asuntos prácticos de la vida compartida.",
      ],
      needs: [
        "Aprecio expresado con palabras por quien es, no solo por los logros o el aspecto.",
        "Tiempo de intimidad sin tareas ni resultados, donde pueda sentir sin actuar.",
        "Que la pareja le haga saber que puede mostrarse vulnerable sin perder respeto.",
        "Acuerdos explícitos sobre cómo repartir tiempo entre el trabajo, la pareja y el descanso.",
      ],
      frictions: [
        "La agenda llena puede dejar a la pareja con la sensación de ocupar el último lugar en las prioridades.",
        "Puede ajustar su manera de ser a lo que cree que la pareja espera y luego sentir desconexión.",
        "Los desacuerdos se resuelven a veces con rapidez práctica, sin dar espacio a lo que ambas personas sienten.",
        "La preocupación por la imagen de la relación puede hacer que los problemas se escondan.",
      ],
      tips: [
        "Reservar una cita semanal con la misma seriedad que una reunión, sin teléfono sobre la mesa.",
        "Practicar «Esto es lo que me está pasando de verdad» antes de dar la versión resumida.",
        "Preguntar «¿Qué necesitas de mí esta semana que no sea un plan?» y escuchar sin arreglar.",
        "Celebrar con la pareja un día de descanso sin objetivos y observar qué emociones aparecen.",
      ],
    },
    family: {
      brings: [
        "Motivación para sostener a la familia en lo material y en lo organizativo.",
        "Ejemplo de esfuerzo y de perseverancia que puede inspirar a niñas, niños y jóvenes.",
        "Orgullo genuino por los avances de quienes quiere y deseo de verlos crecer.",
        "Capacidad de movilizar recursos y contactos cuando alguien de la familia atraviesa dificultades.",
      ],
      needs: [
        "Recibir cariño en la familia sin que se vincule el afecto a su rendimiento.",
        "Que la familia valore su presencia y no solo su aporte económico o logístico.",
        "Tiempo de convivencia sencilla, sin cuentas pendientes sobre el éxito o el fracaso.",
        "Confianza para mostrar su cansancio ante las personas que la conocen desde hace años.",
      ],
      frictions: [
        "Si trabaja mucho, las personas cercanas pueden sentir que hay presencia física sin presencia emocional.",
        "Las comparaciones entre hermanos o primos pueden surgir sin intención y herir.",
        "Puede transmitir a niñas y niños la idea de que el cariño se gana con resultados.",
        "En celebraciones, puede cuidar tanto la imagen del evento que se pierde la espontaneidad.",
      ],
      tips: [
        "Anclar un ritual familiar fijo, como una cena o un paseo, y protegerlo de la agenda laboral.",
        "Con niñas y niños, decir con frecuencia «Me gusta cómo eres» sin añadir un logro.",
        "Contar en familia una experiencia de fracaso o duda y qué se aprendió de esa experiencia.",
        "Pedir a un familiar que avise con una seña acordada cuando note que se aleja en lo emocional.",
      ],
    },
    work: {
      brings: [
        "Orientación a resultados y claridad sobre los objetivos del equipo.",
        "Habilidad para motivar, comunicar y presentar el trabajo de manera atractiva.",
        "Adaptabilidad para aprender rápido y ajustarse a distintos entornos.",
        "Capacidad de movilizar a una comunidad hacia metas comunes con optimismo.",
      ],
      needs: [
        "Reconocimiento visible de su contribución, que le dé una medida de su impacto.",
        "Objetivos claros y medibles, con autonomía para organizar el camino.",
        "Retroalimentación honesta que diferencie el resultado de su valor como persona.",
        "Un entorno donde detenerse a reflexionar no se interprete como pérdida de tiempo.",
      ],
      frictions: [
        "La prisa por llegar a la meta puede pasar por encima de procesos que otras personas necesitan.",
        "Quien prefiere un ritmo más lento puede sentir presión y no atreverse a decirlo.",
        "Puede asumir el mérito de logros colectivos sin intención, lo que genera resentimiento.",
        "El miedo a no destacar puede llevar a competir donde la colaboración daría mejor resultado.",
      ],
      tips: [
        "Al cerrar un proyecto, nombrar uno por uno los aportes del equipo antes de resumir el resultado.",
        "Incluir un momento de pausa y revisión del proceso en cada etapa, no solo al final.",
        "Preguntar «¿Qué ritmo le conviene al equipo para hacer esto bien?» antes de fijar fechas.",
        "Distinguir en las reuniones lo urgente de lo importante, y proteger un bloque para lo segundo.",
      ],
    },
  },
  forOthers: [
    "Preguntar cómo se siente, no solo cómo va el trabajo; puede tardar en responder, porque a veces no lo tiene claro.",
    "Valorar quién es sin mencionar un logro, para que el aprecio no quede unido al rendimiento.",
    "Decir con franqueza cuando necesitas su atención completa, en un momento sin pantallas.",
    "Ofrecer un espacio donde no tenga que mostrarse competente, y respetar el ritmo en que se abra.",
    "Reconocer su esfuerzo en público cuando sea apropiado, porque el reconocimiento le importa.",
    "Compartir tu propio ritmo y tus límites con claridad; suele ajustarse mejor cuando sabe lo que se espera.",
  ],
  reflectionQuestions: [
    "¿Qué parte de mí le muestro a esta persona y qué parte me reservo?",
    "¿Cuándo mi actividad me acerca a quien quiero y cuándo me separa?",
    "¿Qué sentiría si hoy no tuviera nada que lograr ni demostrar?",
    "¿Qué necesita la otra persona de mí que no pase por hacer algo?",
    "¿En qué momentos adapto mi manera de ser a lo que creo que se espera de mí?",
    "¿A quién podría contarle hoy una duda o un cansancio, y qué me lo dificulta?",
    "¿Cómo cambiaría el vínculo si me conocieran también en mis fallos?",
  ],
  sameTypeNote:
    "Dos personas de tipo 3 pueden reconocerse en las ganas de avanzar, en el ritmo de trabajo y en el gusto por los proyectos compartidos, y eso suele generar mucha energía y complicidad. Es probable que se entiendan sin explicaciones largas. Los puntos ciegos compartidos podrían ser que ambas vivan en modo de logro y dejen poco espacio para sentir, que se comparen sin querer, y que cada una muestre su mejor versión mientras ninguna pregunta por lo que hay detrás. Pactar momentos sin objetivos, y animarse a contar dudas, puede hacer el vínculo más hondo.",
  caveats:
    "El tipo no lo explica todo: el nivel de salud de cada persona, su estilo de apego, su historia con el reconocimiento, el ala (3 con ala 2 o con ala 4) y el subtipo instintivo cambian mucho cómo se vive la cercanía. En momentos de mayor salud, el entusiasmo se combina con autenticidad y generosidad; bajo estrés puede predominar la imagen y la competencia. El modelo del eneagrama tiene respaldo empírico limitado para describir relaciones, por lo que estas ideas son un punto de partida para conversar y no una conclusión ni una predicción.",
  sources: ["enneagram-institute-combinations", "palmer-1995", "riso-hudson-1999", "hook-2021"],
  status: "draft",
};
