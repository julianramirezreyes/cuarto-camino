import type { SubtypeProfile } from "../schema";
import { sub } from "./build";

export const subtypes3: SubtypeProfile[] = [
  sub(3, "sp", {
    name: "El que se asegura con esfuerzo silencioso",
    description:
      "La búsqueda de valor a través del logro se orienta a la seguridad material y al deber de cumplir. La imagen que se cuida es la de la persona trabajadora, solvente y sin falla, y el engaño tiende a ser hacia adentro: se evita sentir que se necesita algo. En la literatura suele asociarse con la seguridad; aquí se usa un nombre descriptivo propio.",
    motivations: [
      "Garantizar estabilidad económica y un lugar seguro mediante el trabajo constante.",
      "Ser considerado buen proveedor, responsable y eficiente.",
      "Probar su valor sin ostentación, a través de resultados verificables.",
      "Evitar la vergüenza de depender de otros o de fracasar en lo práctico.",
    ],
    outerManifestations: [
      "Trabaja muchas horas y se muestra poco quejoso, con un perfil discreto.",
      "Prioriza ingresos, ahorros y bienes que den una sensación de solidez.",
      "Descuida el descanso, la salud o los vínculos si lo laboral lo exige.",
      "Presenta una imagen sobria: orden, puntualidad, sin alardes.",
    ],
    innerBehaviors: [
      "Un cálculo constante de cuánto ha logrado y cuánto falta para sentirse a salvo.",
      "Desconexión de la fatiga y de las propias emociones para seguir rindiendo.",
      "Culpa leve cuando descansa sin ser productivo.",
      "Confusión entre lo que desea y lo que se espera de él o de ella.",
    ],
    needs: [
      "Descansar y sentir que su valor no depende de lo producido.",
      "Reconocer sus emociones y su cansancio con honestidad.",
      "Pedir apoyo sin interpretarlo como fracaso.",
      "Definir qué seguridad es suficiente.",
    ],
    fears: [
      "Quedarse sin recursos o depender de otros.",
      "Que el esfuerzo de años se pierda por un error.",
      "Ser visto como alguien que no cumple.",
      "Descubrir que, sin el trabajo, no sabe quién es.",
    ],
    strengths: [
      "Eficacia práctica, disciplina y fiabilidad.",
      "Capacidad de sostener esfuerzos largos y metas concretas.",
      "Sensatez financiera y organización.",
      "Humildad aparente que facilita trabajar en equipo sin protagonismo.",
    ],
    difficulties: [
      "Adicción al trabajo y desgaste físico por no parar.",
      "Aislamiento emocional detrás de la ocupación.",
      "Dificultad para disfrutar de lo que se ha conseguido.",
      "Dificultad para distinguir su identidad más allá del rol productivo.",
    ],
    differencesFromOtherSubtypes:
      "Frente al Tres social, que cuida su imagen pública y su prestigio, y al Tres sexual, que enfoca su imagen en resultar atractivo o admirable para alguien, este subtipo se vuelca a ser productivo y seguro sin ostentar. Es el más reservado y a menudo el que menos parece un Tres.",
    possibleConfusions: [
      { type: 1, note: "Ambos son disciplinados y trabajadores, pero el Uno se guía por un sentido de lo correcto; el Tres por la eficacia y el reconocimiento de su valor." },
      { type: 6, note: "Ambos cumplen obligaciones y buscan seguridad, pero el Seis lo hace desde la duda y el miedo; el Tres desde la meta y la imagen de competencia." },
      { type: 5, note: "Ambos pueden verse reservados y competentes, pero el Cinco se retira para conservar energía; el Tres se activa para rendir." },
    ],
    inRelationships:
      "Muestra cariño proveyendo, resolviendo y estando disponible a nivel práctico. Puede estar emocionalmente ausente y postergar el tiempo juntos hasta 'después'. Mejora cuando reserva tiempo concreto sin trabajo y comparte cómo se siente.",
    atWork:
      "Sobresale en finanzas, ingeniería, operaciones, emprendimientos con ritmo sostenido y cargos de ejecución. Puede ser un colega fiable, aunque propenso al exceso de horas y a la competitividad silenciosa.",
    examples: [
      "Responde correos en la cama y justifica que 'ya casi termina'.",
      "Reinvierte un bono en ahorros en vez de celebrar con algo que le guste.",
      "Cancela una cita médica porque coincide con una entrega.",
      "Dice que está bien cuando está agotado y sigue cumpliendo.",
    ],
    selfObservationPractices: [
      "Registrar cuándo descansa realmente y cuándo solo cambia de tarea.",
      "Preguntarse al final del día qué sintió, no solo qué logró.",
      "Planificar una actividad sin utilidad productiva y observar la resistencia.",
      "Escribir qué le daría seguridad 'suficiente' en cifras y en vivencias.",
    ],
  }),
  sub(3, "so", {
    name: "El que cuida su imagen pública y su lugar en el grupo",
    description:
      "El Tres se orienta a ser admirado y bien posicionado en su entorno social o profesional. Adopta con facilidad los códigos del grupo y trabaja su reputación. El engaño se despliega en la imagen compartida: se es lo que el contexto valora. En la literatura suele asociarse con el prestigio; aquí se usa un nombre descriptivo propio.",
    motivations: [
      "Ser reconocido como exitoso, competente y modelo en su comunidad o industria.",
      "Pertenecer a círculos que considera importantes y destacar en ellos.",
      "Encarnar los valores que su entorno admira.",
      "Que su nombre se asocie con resultados valorados.",
    ],
    outerManifestations: [
      "Se adapta con soltura a distintos ambientes, cambia de registro y habla el lenguaje del grupo.",
      "Cuida su currículum, su presencia en redes y su círculo de contactos.",
      "Busca roles visibles: presentaciones, liderazgo, representación.",
      "Motiva y moviliza a otros, con un entusiasmo contagioso.",
    ],
    innerBehaviors: [
      "Una autoevaluación constante basada en cómo es visto.",
      "Comparación con quienes están en posiciones similares o superiores.",
      "Ansiedad ante la posibilidad de ser expuesto como menos de lo que aparenta.",
      "Dificultad para saber qué piensa o siente por fuera del papel que representa.",
    ],
    needs: [
      "Explorar su identidad fuera de los roles y logros.",
      "Relaciones en las que pueda mostrarse sin eficiencia ni brillo.",
      "Aceptar que el fracaso es parte de cualquier trayectoria.",
      "Elegir metas porque le importan y no solo porque dan estatus.",
    ],
    fears: [
      "Perder reputación o ser visto como un impostor.",
      "Ser ignorado o reemplazado por alguien más brillante.",
      "Quedar fuera de los círculos que valora.",
      "Que lo reconozcan solo por su función y no por su persona.",
    ],
    strengths: [
      "Carisma, habilidad social y capacidad de inspirar a grupos.",
      "Visión estratégica sobre la imagen y la comunicación.",
      "Energía para sacar adelante proyectos colectivos.",
      "Capacidad de adaptarse a distintos contextos con eficacia.",
    ],
    difficulties: [
      "Exceso de preocupación por la apariencia en detrimento de la autenticidad.",
      "Competitividad abierta o encubierta que erosiona la confianza.",
      "Dificultad para decir 'no sé' o 'necesito ayuda' en público.",
      "Vacío o confusión cuando cesan los aplausos.",
    ],
    differencesFromOtherSubtypes:
      "A diferencia del Tres de conservación, más discreto y centrado en seguridad material, y del Tres sexual, que modula su imagen para ser deseado por alguien en concreto, este subtipo es el más público: su valor se juega en el estatus, la reputación y la imagen ante el grupo.",
    possibleConfusions: [
      { type: 2, note: "El Dos social también busca reconocimiento en la red, pero a través de la ayuda y el vínculo; el Tres a través de logros y resultados visibles." },
      { type: 7, note: "Ambos son enérgicos y sociables, pero el Siete busca experiencias y evita el dolor; el Tres busca éxito y reconocimiento." },
      { type: 8, note: "Ambos lideran con seguridad, pero el Ocho no se ajusta a la imagen que el grupo espera; el Tres modula su presentación para ser aceptado." },
    ],
    inRelationships:
      "Es sociable, generoso con su tiempo en el trabajo conjunto y valora a las parejas que lo acompañen en su vida pública. Puede mostrar una versión editada de sí y evitar la intimidad cuando se siente expuesto. Gana cercanía al compartir sus dudas.",
    atWork:
      "Se desempeña en liderazgo, marketing, política, ventas, consultoría y roles de representación. Puede ser excelente en visibilizar a un equipo, aunque tiende a atribuirse méritos y a invertir demasiado en la imagen.",
    examples: [
      "Ajusta su manera de hablar según esté con colegas, familiares o clientes.",
      "Acepta una presentación en público incluso con poco tiempo para prepararla.",
      "Revisa varias veces una publicación profesional antes de enviarla.",
      "Se siente vacío tras un ascenso celebrado por todos.",
    ],
    selfObservationPractices: [
      "Registrar cuántas decisiones del día se tomaron pensando en la mirada de otros.",
      "Compartir un fracaso o duda con una persona de confianza y observar la reacción.",
      "Preguntarse qué haría si nadie fuera a enterarse.",
      "Dedicar un rato semanal a una actividad que no pueda mostrar.",
    ],
  }),
  sub(3, "sx", {
    name: "El que se vuelve deseable para quien le importa",
    description:
      "La imagen se adapta para resultar atractivo, admirable o valioso para una persona concreta o para el ideal de pareja. En lugar de promocionarse, se promociona al otro y se apoya su éxito; el engaño consiste en ser lo que el otro desea. En la literatura se lo vincula con la masculinidad y la feminidad; aquí se usa un nombre descriptivo propio.",
    motivations: [
      "Ser la pareja o el apoyo ideal para alguien a quien admira.",
      "Sentirse valioso al contribuir al éxito de la persona amada.",
      "Cumplir con un ideal de atractivo, éxito o madurez que sea digno de ser amado.",
      "Obtener la conexión íntima sin mostrar necesidad.",
    ],
    outerManifestations: [
      "Se muestra afable, cuidado en su apariencia y dispuesto a apoyar a quien le importa.",
      "Se adapta al estilo y a los intereses de la persona elegida.",
      "Impulsa proyectos y metas de otros con entusiasmo y eficiencia.",
      "Evita mostrar vulnerabilidad y se presenta como alguien que 'puede con todo'.",
    ],
    innerBehaviors: [
      "Una autoexigencia de ser el mejor compañero o compañera posible.",
      "Desconexión de los propios deseos frente a lo que el otro espera.",
      "Inseguridad velada sobre si es querido por quien es o por lo que aporta.",
      "Competencia silenciosa con rivales percibidos.",
    ],
    needs: [
      "Un vínculo donde pueda mostrarse sin disfraz ni rendimiento.",
      "Identificar lo que quiere independientemente de lo que el otro espera.",
      "Recibir cuidado sin sentirse en deuda.",
      "Aceptar que ser querido no exige ser perfecto.",
    ],
    fears: [
      "No ser deseable ni suficiente para la persona que le importa.",
      "Ser abandonado si deja de ser útil o brillante.",
      "Mostrar flaquezas y perder el respeto del otro.",
      "Perder la conexión íntima por no estar a la altura.",
    ],
    strengths: [
      "Apoyo entusiasta y práctico para quienes le importan.",
      "Encanto y cuidado de los detalles de la relación.",
      "Capacidad de movilizarse por el bien de otro.",
      "Atención a la propia presencia y vitalidad.",
    ],
    difficulties: [
      "Pérdida de la propia identidad al amoldarse al otro.",
      "Dificultad para expresar necesidades o enfados.",
      "Idealización del otro, seguida de desilusión.",
      "Uso de la apariencia o el rendimiento como moneda de conexión.",
    ],
    differencesFromOtherSubtypes:
      "Se distingue del Tres de conservación, que se vuelca en la productividad segura, y del Tres social, que busca reputación ante el colectivo, en que su imagen se modela para una persona o una pareja concreta: el éxito se pone al servicio del vínculo y del atractivo personal. Es el subtipo con mayor desplazamiento de la ambición hacia el otro.",
    possibleConfusions: [
      { type: 2, note: "Comparten el apoyo al otro y el encanto, pero el Dos actúa desde la necesidad de ser querido por sus cuidados; el Tres desde la necesidad de ser valioso por su desempeño." },
      { type: 4, note: "Ambos se preocupan por cómo son vistos íntimamente, pero el Cuatro se afirma en la diferencia y la profundidad; el Tres en la imagen eficaz y adaptada." },
      { type: 7, note: "Ambos son atractivos y entusiastas, pero el Siete evita el compromiso emocional; el Tres lo busca pero esconde su vulnerabilidad." },
    ],
    inRelationships:
      "Es apoyo activo, cariñoso y motivador, y se esfuerza por ser un buen compañero. Puede ocultar sus necesidades y presentar una versión editada, lo que genera distancia pese a la dedicación. Gana autenticidad al expresar cansancio o duda.",
    atWork:
      "Funciona bien como mano derecha, productor, agente, coach o líder que promueve el talento ajeno. Puede subordinar sus propias metas a las de un socio o jefe admirado y desdibujar el límite entre lo laboral y lo íntimo.",
    examples: [
      "Se involucra a fondo en el proyecto de su pareja y descuida el propio.",
      "Cambia de estilo o de intereses tras conocer a alguien que le atrae.",
      "Dice que está bien tras una discusión para no incomodar.",
      "Prepara una cena impecable para impresionar y luego se siente exhausto.",
    ],
    selfObservationPractices: [
      "Anotar qué preferencias personales ha dejado de lado para encajar con otra persona.",
      "Contar a alguien una necesidad pequeña y real, y notar el impulso a minimizarla.",
      "Revisar si está apoyando al otro por afecto o por ganarse su aprobación.",
      "Reservar tiempo para un interés propio que no comparta con la pareja.",
    ],
  }),
];
