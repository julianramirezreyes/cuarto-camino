import type { SubtypeProfile } from "../schema";
import { sub } from "./build";

export const subtypes2: SubtypeProfile[] = [
  sub(2, "sp", {
    name: "El que cuida primero de sí y espera ser cuidado",
    description:
      "Es el subtipo que menos aparenta ser un Dos: el afán de ser querido se expresa de modo más infantil, juguetón y a veces reivindicativo. Sabe de su necesidad y se permite pedir atención o privilegios. En la tradición de Naranjo se lo considera el contratipo del tipo; en Chestnut suele asociarse con la idea de 'yo primero'. Aquí se usa un nombre descriptivo propio.",
    motivations: [
      "Sentirse cuidado y seguro en lo material y afectivo sin tener que pedirlo de manera explícita.",
      "Mantener una imagen de persona encantadora, vulnerable y digna de atención.",
      "Ser querido por lo que es y no solo por lo que hace por los demás.",
      "Asegurar que sus propias necesidades no queden relegadas tras las de otros.",
    ],
    outerManifestations: [
      "Se muestra cálido y simpático, con un toque de ternura o de picardía que invita a cuidarlo.",
      "Pide favores o atención de manera indirecta, a veces con humor o con queja suave.",
      "Se rodea de comodidades y de personas que le dan seguridad.",
      "Puede ser generoso, pero espera un trato especial a cambio.",
    ],
    innerBehaviors: [
      "Una fantasía de ser rescatado o mimado, acompañada de vergüenza por desearlo.",
      "Cálculo silencioso de cuánto ha dado y cuánto ha recibido.",
      "Resentimiento cuando otros no reconocen su esfuerzo o sus necesidades.",
      "Oscilación entre sentirse necesitado y sentirse desatendido.",
    ],
    needs: [
      "Aprender a pedir de modo directo lo que necesita sin disfrazarlo de broma.",
      "Reconocer su propio derecho a cuidarse sin culpa.",
      "Relaciones que no dependan de la reciprocidad contable.",
      "Un sentido de seguridad propio, no solo prestado por quien lo cuida.",
    ],
    fears: [
      "Quedarse sin quién lo cuide ni lo valore.",
      "Ser visto como egoísta o exigente.",
      "No tener lo necesario en lo material ni en lo afectivo.",
      "Que su vulnerabilidad sea usada en su contra.",
    ],
    strengths: [
      "Encanto, humor y capacidad de crear cercanía rápidamente.",
      "Mayor contacto con sus propias necesidades que otros Dos.",
      "Practicidad para organizar comodidades y recursos.",
      "Generosidad real cuando se siente seguro.",
    ],
    difficulties: [
      "Manipulación sutil cuando no logra pedir de modo claro.",
      "Sensación de privilegio que puede molestar a quienes le rodean.",
      "Dependencia emocional de quienes lo cuidan.",
      "Dificultad para reconocer la propia pasión de orgullo, al verse más como necesitado que como dador.",
    ],
    differencesFromOtherSubtypes:
      "Frente al Dos social, que busca ser querido a través de la influencia y la ambición dentro del grupo, y al Dos sexual, que seduce con intensidad y entrega para ganarse a una persona concreta, este subtipo centra el vínculo en el cuidado y la seguridad personales. El orgullo está más oculto y se manifiesta como derecho a ser atendido.",
    possibleConfusions: [
      { type: 7, note: "Comparte la simpatía y el juego, pero el Siete evita el dolor con planes y estímulos; este Dos busca ser cuidado y querido." },
      { type: 4, note: "Ambos muestran vulnerabilidad, pero el Cuatro se identifica con la falta y la diferencia; este Dos gestiona la atención de manera relacional y práctica." },
      { type: 9, note: "El Nueve de conservación también busca confort, pero evita demandar y se adapta; este Dos pide atención aunque sea de forma indirecta." },
    ],
    inRelationships:
      "Se vincula desde la ternura y el cuidado mutuo, y desea una pareja protectora. Puede alternar entre dar mucho y reclamar atención, con reproches implícitos. Mejora cuando formula peticiones claras y tolera que la respuesta no sea inmediata.",
    atWork:
      "Funciona bien en roles de atención al cliente, hospitalidad, salud, ventas relacionales o coordinación de equipos pequeños. Puede evitar tareas que no le den contacto humano y esperar reconocimiento personalizado.",
    examples: [
      "Cuenta que está agotado con un tono ligero, esperando que alguien se ofrezca a ayudar.",
      "Cocina para otros con esmero y luego se siente dolido si nadie le pregunta cómo está.",
      "Se queda en la cama un domingo esperando que alguien lo busque.",
      "Acepta un regalo con efusión, pero lleva en silencio la cuenta de lo que dio.",
    ],
    selfObservationPractices: [
      "Antes de insinuar una necesidad, formularla en una frase directa y notar lo que ocurre.",
      "Registrar los momentos en que cuenta lo que ha hecho por otros y qué espera recibir.",
      "Identificar qué necesitaría hoy si nadie fuera a notar que lo necesita.",
      "Practicar una tarde sin hacer favores y observar la incomodidad.",
    ],
  }),
  sub(2, "so", {
    name: "El que gana influencia ayudando al grupo",
    description:
      "El deseo de ser querido se dirige a la vida colectiva: ser útil, conocido y apreciado por muchos, a menudo ocupando posiciones de apoyo estratégico. El poder se ejerce a través del servicio y la red de favores. En Chestnut suele vincularse con la ambición; aquí se usa un nombre descriptivo propio.",
    motivations: [
      "Ser indispensable y valorado dentro de un grupo, comunidad o institución.",
      "Conectar a las personas y ser el nexo que facilita las cosas.",
      "Ganar reconocimiento y cierta influencia sin pedirlo de modo explícito.",
      "Sentir que pertenece a un círculo importante.",
    ],
    outerManifestations: [
      "Conoce a mucha gente, recuerda detalles y facilita presentaciones.",
      "Ofrece ayuda o consejo en el momento oportuno, en especial a quienes tienen influencia.",
      "Se encarga de la organización de eventos y de la logística relacional de un grupo.",
      "Habla con un tono amistoso que combina calidez y cierto poder discreto.",
    ],
    innerBehaviors: [
      "Un mapa interno de quién importa, quién lo valora y a quién ha ayudado.",
      "Orgullo de ser quien resuelve, junto con miedo a ser reemplazable.",
      "Resentimiento si siente que su trabajo no se reconoce públicamente.",
      "Dificultad para identificar qué quiere más allá de ser útil.",
    ],
    needs: [
      "Reconocer sus propios deseos independientemente de su papel en el grupo.",
      "Dar sin esperar que se convierta en prestigio o lealtad.",
      "Tiempo de intimidad en el que no sea 'el que ayuda'.",
      "Tolerar que otros lideren sin sentirse desplazado.",
    ],
    fears: [
      "Quedar fuera de los círculos que le importan.",
      "Ser visto como interesado o aprovechado.",
      "Perder su lugar de importancia y que el grupo siga sin él.",
      "No ser querido cuando no tiene nada que ofrecer.",
    ],
    strengths: [
      "Excelente lectura de dinámicas grupales y de necesidades ajenas.",
      "Capacidad de tejer redes y movilizar apoyos.",
      "Generosidad organizada y liderazgo desde el servicio.",
      "Diplomacia y tacto con distintos tipos de personas.",
    ],
    difficulties: [
      "Cálculo de favores que erosiona la espontaneidad.",
      "Agotamiento por sostener demasiadas relaciones y compromisos.",
      "Cercanía selectiva con quienes tienen estatus, que puede ser leída como instrumental.",
      "Dificultad para reconocer el orgullo detrás de la ayuda.",
    ],
    differencesFromOtherSubtypes:
      "Se distingue del Dos de conservación, que busca ser cuidado en lo personal, y del Dos sexual, que enfoca la seducción en una persona, porque aquí el escenario es el grupo: la red de contactos, el prestigio de ser útil y la influencia. Es el más público y estratégico de los tres.",
    possibleConfusions: [
      { type: 3, note: "Ambos son sociables y orientados al reconocimiento, pero el Tres persigue logros y eficacia; el Dos social persigue la relación y el agradecimiento." },
      { type: 8, note: "Comparte el interés por el poder y la protección de los suyos, pero el Ocho se impone abiertamente; el Dos lo hace a través del servicio y la lealtad." },
      { type: 1, note: "El Uno social también se compromete con el colectivo, pero lo hace por principio y deber; el Dos por vínculo y reconocimiento personal." },
    ],
    inRelationships:
      "Cultiva amistades extensas y se esfuerza por que cada persona se sienta vista. En pareja puede privilegiar el rol público o el círculo común sobre la intimidad. Gana profundidad cuando se permite estar con alguien sin agenda.",
    atWork:
      "Brilla en coordinación, recursos humanos, política, relaciones públicas, organizaciones comunitarias y ventas consultivas. Puede asumir demasiado y resentirse cuando el esfuerzo no se ve; le cuesta decir no a quienes considera importantes.",
    examples: [
      "Organiza la cena de despedida de un colega y se asegura de que nadie falte.",
      "Presenta a dos personas que podrían colaborar y se alegra de haber sido el puente.",
      "Dice que sí a un comité más aunque ya está sobrecargado.",
      "Se siente herido cuando un grupo que ayudó no lo menciona en un agradecimiento.",
    ],
    selfObservationPractices: [
      "Anotar a quién ayuda por afecto y a quién por posicionamiento, sin juzgar la lista.",
      "Practicar decir 'déjame pensarlo' antes de aceptar un nuevo compromiso.",
      "Pasar un rato con una persona sin ninguna utilidad aparente y notar la incomodidad.",
      "Preguntarse qué querría hacer si nadie estuviera mirando.",
    ],
  }),
  sub(2, "sx", {
    name: "El que seduce para ganarse a una persona",
    description:
      "El deseo de ser querido se concentra en una persona o en pocas: se pone intensidad, atractivo y entrega para ser elegido. Hay una cualidad de conquista emocional y, a veces, de presión suave. En la literatura se vincula con la seducción y la agresión; aquí se usa un nombre descriptivo propio.",
    motivations: [
      "Ser deseado y elegido de manera especial por una persona importante.",
      "Tener una conexión íntima intensa que confirme su valor.",
      "Descubrir y satisfacer lo que el otro necesita para volverse imprescindible.",
      "Sentirse vivo y atractivo a través de la mirada del otro.",
    ],
    outerManifestations: [
      "Se adapta a los gustos de la persona que le interesa y le dedica atención casi exclusiva.",
      "Combina calidez, halago y contacto físico o afectivo para generar cercanía.",
      "Puede cuidar su apariencia y energía para resultar atractivo.",
      "Es persistente y puede mostrarse celoso o reclamante si siente distancia.",
    ],
    innerBehaviors: [
      "Una atención aguda a las señales de interés o rechazo del otro.",
      "Fantasías de fusión o de ser el centro de la vida de la otra persona.",
      "Mezcla de entrega y exigencia que se enciende cuando no es correspondido.",
      "Dificultad para saber quién es cuando no hay alguien a quien conquistar.",
    ],
    needs: [
      "Una relación donde el cariño no dependa de la conquista continua.",
      "Reconocer sus propios deseos antes de entrar en los del otro.",
      "Aprender a tolerar la ausencia y el 'no' sin sentirse descartado.",
      "Cultivar intereses que no giren alrededor de un vínculo.",
    ],
    fears: [
      "Ser rechazado por la persona que ha elegido.",
      "Quedarse sin un vínculo íntimo que dé sentido a su vida.",
      "Que su intensidad abrume y aleje al otro.",
      "Descubrir que su entrega estaba motivada en parte por necesidad.",
    ],
    strengths: [
      "Calidez magnética y capacidad de hacer sentir especial a alguien.",
      "Generosidad emocional y atención al detalle del otro.",
      "Pasión y entusiasmo por las personas y los proyectos en pareja.",
      "Intuición fina de lo que otro desea o necesita.",
    ],
    difficulties: [
      "Intrusión o presión cuando el otro se aleja.",
      "Pérdida de identidad propia al adaptarse en exceso.",
      "Celos y escenas emocionales en momentos de inseguridad.",
      "Cambios de intensidad según la respuesta de la persona elegida.",
    ],
    differencesFromOtherSubtypes:
      "A diferencia del Dos de conservación, que reclama cuidado y comodidad, y del Dos social, que busca influencia en el grupo, este subtipo orienta su orgullo hacia la conquista de una persona: el valor se mide por ser elegido de forma exclusiva. Es el más intenso, personal y propenso a la fusión.",
    possibleConfusions: [
      { type: 4, note: "Ambos son intensos y buscan la conexión profunda, pero el Cuatro se enfoca en la falta y en la autenticidad propia; el Dos en conquistar y servir al otro." },
      { type: 7, note: "Comparte el encanto y el entusiasmo, pero el Siete evita el compromiso y el dolor; este Dos se compromete con fuerza y teme la separación." },
      { type: 8, note: "Ambos pueden ser apasionados y absorbentes, pero el Ocho no necesita aprobación del otro, mientras que este Dos sí." },
    ],
    inRelationships:
      "Se entrega con calor, atención y detalle, y desea una vinculación profunda y exclusiva. Puede perder el centro propio y reaccionar con intensidad ante la distancia. Mejora al sostener sus propias actividades y expresar sus deseos sin condicionarlos a la respuesta.",
    atWork:
      "Funciona bien en trabajos relacionales de alta intensidad: coaching, arte, terapias, ventas personalizadas, hostelería de alto trato. Puede mezclar lo laboral con lo personal y sentirse rechazado ante críticas.",
    examples: [
      "Aprende de memoria los gustos de alguien que le interesa y los menciona en el momento justo.",
      "Cambia sus planes del fin de semana para estar disponible por si el otro escribe.",
      "Se siente herido ante una respuesta tardía y reacciona con un reclamo suave.",
      "Escribe un mensaje muy elaborado y lo borra por miedo a parecer demasiado.",
    ],
    selfObservationPractices: [
      "Notar cuánto de su día depende de una respuesta ajena y registrarlo sin juzgar.",
      "Practicar una actividad personal regular que no involucre a su pareja ni a la persona elegida.",
      "Antes de actuar ante un silencio, preguntarse qué historia se está contando.",
      "Pedir lo que desea de manera clara y observar la reacción sin reinterpretarla.",
    ],
  }),
];
