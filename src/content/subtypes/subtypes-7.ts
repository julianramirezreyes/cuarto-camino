import type { SubtypeProfile } from "../schema";
import { sub } from "./build";

export const subtypes7: SubtypeProfile[] = [
  sub(7, "sp", {
    name: "El que arma una red de aliados y oportunidades",
    description:
      "El apetito del Siete por la variedad y el placer se vuelve práctico: se tejen redes de personas afines, intercambios y recursos que garanticen el bienestar. Hay una versión de la gula expresada como acumulación de oportunidades y de comodidades. En la literatura suele asociarse con la idea de familia o red; aquí se usa un nombre descriptivo propio.",
    motivations: [
      "Asegurar placer, variedad y comodidad con una red de apoyo confiable.",
      "Contar con aliados que compartan sus intereses y sus oportunidades.",
      "Proteger la libertad de ser quien es sin quedarse sin recursos.",
      "Evitar el dolor y la escasez manteniendo muchas opciones abiertas.",
    ],
    outerManifestations: [
      "Se rodea de un grupo reducido y leal con quien intercambia planes, contactos y favores.",
      "Cuida su comodidad: buena comida, entorno agradable, recursos.",
      "Habla de oportunidades y trueques con un tono práctico y entusiasta.",
      "Planifica con astucia para tener siempre una alternativa.",
    ],
    innerBehaviors: [
      "Un cálculo de oportunidades y de qué opción le conviene mantener abierta.",
      "Optimismo racionalizado que reencuadra las dificultades como oportunidades.",
      "Temor a quedarse limitado o sin una red de protección.",
      "Evitación de emociones dolorosas mediante la planificación del siguiente estímulo.",
    ],
    needs: [
      "Quedarse con una sola opción el tiempo suficiente para profundizar.",
      "Afrontar el dolor y el aburrimiento sin buscar escape inmediato.",
      "Vínculos sostenidos más allá del intercambio de beneficios.",
      "Distinguir entre disfrute genuino y acumulación.",
    ],
    fears: [
      "Perder su libertad o ver reducidas sus opciones.",
      "Quedarse sin recursos o sin red de apoyo.",
      "Verse atrapado en un dolor o una obligación sin salida.",
      "Que su círculo no lo sostenga cuando lo necesite.",
    ],
    strengths: [
      "Ingenio práctico y capacidad de generar oportunidades.",
      "Sociabilidad cálida con un grupo cercano.",
      "Optimismo, energía y flexibilidad.",
      "Habilidad para conectar a personas con recursos y necesidades.",
    ],
    difficulties: [
      "Superficialidad en los compromisos y dispersión.",
      "Mirada utilitaria hacia las relaciones.",
      "Dificultad para tolerar el aburrimiento y el dolor.",
      "Acumulación de opciones que impide decidir.",
    ],
    differencesFromOtherSubtypes:
      "Frente al Siete social, que sacrifica su apetito por el bien del grupo, y al Siete sexual, que se entusiasma con ideales y personas fascinantes, este subtipo orienta la gula hacia la seguridad práctica y la red cercana: oportunidades, comodidad y aliados. Es el más pragmático y el más cercano al estereotipo de Siete.",
    possibleConfusions: [
      { type: 3, note: "Ambos son prácticos y orientados a resultados, pero el Tres busca éxito e imagen; el Siete busca opciones, placer y libertad." },
      { type: 2, note: "Ambos son cálidos y sociables, pero el Dos busca ser querido a través de la ayuda; el Siete busca experiencias compartidas y aliados." },
      { type: 8, note: "Ambos son enérgicos y abiertos al riesgo, pero el Ocho busca poder y control; el Siete placer y variedad." },
    ],
    inRelationships:
      "Es encantador, generoso con su círculo y divertido, y valora la complicidad. Puede evitar las conversaciones difíciles y desaparecer cuando el vínculo se vuelve exigente. Mejora al quedarse con el malestar del otro sin ofrecer soluciones rápidas.",
    atWork:
      "Funciona en emprendimiento, ventas, gestión de proyectos, producción, hospitalidad y roles de conexión. Puede dispersarse entre iniciativas y resistirse a la rutina o al seguimiento detallado.",
    examples: [
      "Organiza una cena para conectar a dos amigos que podrían hacer negocios.",
      "Mantiene tres proyectos abiertos 'por si alguno despega'.",
      "Se escapa de una conversación incómoda proponiendo un plan.",
      "Compra algo de calidad sin necesitarlo y justifica que es una inversión.",
    ],
    selfObservationPractices: [
      "Registrar las ocasiones en que cambia de plan para evitar una sensación incómoda.",
      "Cerrar un proyecto antes de abrir otro y notar lo que aparece.",
      "Preguntarse qué está evitando cuando la agenda está muy llena.",
      "Quedarse un rato con una emoción difícil sin buscar distracción.",
    ],
  }),
  sub(7, "so", {
    name: "El que posterga su deseo por el bien del grupo",
    description:
      "El apetito del Siete se modera en favor de la responsabilidad hacia otros: se renuncia a lo propio para ser alguien bueno y valioso. Es una forma menos hedonista del tipo, orientada a la entrega. En la tradición de Naranjo es el contratipo del tipo; en la literatura suele asociarse con el sacrificio. Aquí se usa un nombre descriptivo propio.",
    motivations: [
      "Ser una persona buena, útil y digna ante los demás.",
      "Aportar a un ideal o a un grupo mayor que su propio disfrute.",
      "Compensar la culpa de su apetito con servicio y renuncia.",
      "Sentirse parte de una comunidad que le dé sentido.",
    ],
    outerManifestations: [
      "Asume responsabilidades en grupos y causas, a menudo con entusiasmo visible.",
      "Posterga placeres propios para atender las necesidades del colectivo.",
      "Se presenta como alguien serio, generoso y dispuesto a ayudar.",
      "Conserva humor y energía, pero con un tono más medido y comprometido.",
    ],
    innerBehaviors: [
      "Una tensión entre el deseo de disfrutar y la culpa de hacerlo.",
      "Idealización de sí como alguien que se sacrifica por una causa.",
      "Resentimiento disimulado cuando su entrega no se reconoce.",
      "Dificultad para saber qué quiere realmente sin pensar en lo que debería querer.",
    ],
    needs: [
      "Reconocer su derecho al disfrute sin culpa.",
      "Distinguir el servicio genuino del sacrificio por imagen.",
      "Expresar su deseo y su cansancio de modo directo.",
      "Aceptar que no siempre es posible ser bueno con todos.",
    ],
    fears: [
      "Ser visto como egoísta o superficial.",
      "Perder la aprobación del grupo por mostrar sus propios deseos.",
      "Quedar atrapado en una carga sin poder salir.",
      "Descubrir que su entrega es también una forma de evitar el dolor.",
    ],
    strengths: [
      "Generosidad, compromiso y entusiasmo por las causas colectivas.",
      "Capacidad de combinar optimismo con responsabilidad.",
      "Sentido de comunidad y disposición a colaborar.",
      "Habilidad para animar y motivar a grupos.",
    ],
    difficulties: [
      "Culpa por el disfrute y autocensura del deseo.",
      "Sacrificio como forma de evitar la vulnerabilidad.",
      "Idealismo que puede ignorar los costos personales.",
      "Resentimiento acumulado por dar más de lo que recibe.",
    ],
    differencesFromOtherSubtypes:
      "A diferencia del Siete de conservación, que acumula oportunidades y confort, y del Siete sexual, que se ilusiona con ideales y personas, este subtipo contiene la gula en favor del grupo: se parece menos a un Siete típico y más a alguien comprometido y moral. Su conflicto es la culpa por querer.",
    possibleConfusions: [
      { type: 1, note: "Ambos se comprometen con deberes y causas, pero el Uno se guía por un ideal de corrección y critica lo imperfecto; el Siete social sacrifica su deseo y mantiene el optimismo." },
      { type: 2, note: "Ambos ayudan al colectivo, pero el Dos busca ser querido y reconocido; el Siete social busca ser bueno y aliviar su culpa." },
      { type: 6, note: "Ambos son leales y responsables, pero el Seis actúa desde el miedo y la duda; el Siete desde el idealismo y la culpa." },
    ],
    inRelationships:
      "Es generoso, leal y dispuesto a dar tiempo y energía. Puede olvidar sus propias necesidades y acumular resentimiento silencioso. Mejora cuando pide lo que desea y acepta recibir sin devolver de inmediato.",
    atWork:
      "Prospera en ONG, educación, activismo, salud pública y proyectos con misión social. Puede aceptar demasiada carga y tener dificultades para negociar sus propias condiciones.",
    examples: [
      "Acepta coordinar un voluntariado aun cuando tenía planes para descansar.",
      "Bromea para animar al equipo mientras ignora su propio agotamiento.",
      "Se siente culpable por gastar en un capricho mientras otros necesitan ayuda.",
      "Se frustra en silencio cuando nadie agradece su esfuerzo.",
    ],
    selfObservationPractices: [
      "Anotar qué quiere hacer hoy por pura apetencia, sin justificarlo.",
      "Observar cuándo el 'sí' al grupo es un modo de evitar un 'no' incómodo.",
      "Pedir ayuda en una tarea concreta y notar la reacción interna.",
      "Distinguir en una lista qué ayudas surgen de afecto y cuáles de culpa.",
    ],
  }),
  sub(7, "sx", {
    name: "El que se fascina con ideales y personas",
    description:
      "El apetito se orienta a la ilusión: se idealiza a personas, ideas o experiencias que prometen transformar la vida. Hay entusiasmo, ensoñación y facilidad para dejarse seducir por lo prometedor. En la literatura suele asociarse con la sugestionabilidad y la fascinación; aquí se usa un nombre descriptivo propio.",
    motivations: [
      "Vivir experiencias intensas, bellas y transformadoras.",
      "Encontrar a alguien o algo que justifique su entusiasmo.",
      "Mantener vivo el asombro y la sensación de posibilidad.",
      "Evitar la rutina y la desilusión alimentando la ilusión.",
    ],
    outerManifestations: [
      "Se entusiasma rápidamente con personas, proyectos o ideas, a menudo con efusividad.",
      "Habla de sueños y posibilidades con un tono entusiasta y encantador.",
      "Cambia de intereses o relaciones al aparecer algo más fascinante.",
      "Busca experiencias estéticas, espirituales o románticas intensas.",
    ],
    innerBehaviors: [
      "Una imaginación que anticipa lo bueno y minimiza lo difícil.",
      "Idealización seguida de desencanto cuando la realidad no coincide.",
      "Aversión al aburrimiento y a los límites prácticos.",
      "Dificultad para quedarse con la decepción y el duelo.",
    ],
    needs: [
      "Cultivar un compromiso sostenido más allá de la primera fascinación.",
      "Ver a las personas y proyectos tal como son.",
      "Tolerar la decepción como parte de profundizar.",
      "Anclar sus ideales en acciones concretas.",
    ],
    fears: [
      "Una vida gris, sin asombro ni entusiasmo.",
      "Perderse una experiencia extraordinaria por no estar atento.",
      "Descubrir que su ideal era una ilusión.",
      "Quedar atrapado en una relación o rutina sin chispa.",
    ],
    strengths: [
      "Imaginación, entusiasmo y creatividad.",
      "Capacidad de inspirar a otros con visiones.",
      "Apertura al asombro y a lo nuevo.",
      "Optimismo contagioso en entornos creativos.",
    ],
    difficulties: [
      "Idealización y desilusión repetidas.",
      "Falta de constancia en proyectos y relaciones.",
      "Sugestionabilidad ante figuras o ideas carismáticas.",
      "Evitación de la realidad cotidiana y del dolor.",
    ],
    differencesFromOtherSubtypes:
      "Frente al Siete de conservación, que busca seguridad y red de aliados, y al Siete social, que se contiene por el grupo, este subtipo se entrega a la fascinación: personas, ideales y experiencias que prometen plenitud. Es el más soñador, romántico e idealista.",
    possibleConfusions: [
      { type: 4, note: "Ambos buscan intensidad y belleza, pero el Cuatro se hunde en la falta y la melancolía; el Siete se fascina y evita ese dolor." },
      { type: 2, note: "Ambos se entusiasman con las personas, pero el Dos busca ser querido y necesitado; el Siete busca una experiencia que lo maraville." },
      { type: 9, note: "Ambos pueden idealizar y soñar, pero el Nueve se adapta a lo cómodo y se fusiona; el Siete se lanza hacia lo nuevo." },
    ],
    inRelationships:
      "Es apasionado, encantador y dispuesto a aventuras compartidas. Puede enamorarse de la idea del otro y retirarse cuando aparece la realidad. Mejora cuando se queda a conocer las sombras de la persona y de la relación.",
    atWork:
      "Funciona en creatividad, arte, innovación, docencia inspiradora y emprendimientos con visión. Puede iniciar muchas cosas con brillo y dificultad para terminarlas o sostener el seguimiento.",
    examples: [
      "Se enamora de un proyecto nuevo y lo describe con una emoción contagiosa.",
      "Idealiza a un mentor y se desilusiona al descubrir sus límites.",
      "Planea un viaje espontáneo para escapar de una semana gris.",
      "Cambia de pasión creativa cada pocos meses.",
    ],
    selfObservationPractices: [
      "Registrar cuántas ilusiones nuevas aparecen cuando una cosa se vuelve rutinaria.",
      "Escribir tres aspectos no ideales de una persona o proyecto que admira.",
      "Comprometerse con una actividad durante un período definido y observar el impulso de abandonarla.",
      "Quedarse con una decepción reciente sin transformarla en una nueva ilusión.",
    ],
  }),
];
