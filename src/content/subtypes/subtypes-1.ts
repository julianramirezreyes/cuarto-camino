import type { SubtypeProfile } from "../schema";
import { sub } from "./build";

export const subtypes1: SubtypeProfile[] = [
  sub(1, "sp", {
    name: "El vigilante de lo que puede salir mal",
    description:
      "El perfeccionismo del Uno se vuelca hacia el cuidado de la propia seguridad, la salud, el dinero y la casa. La exigencia interna aparece como preocupación anticipatoria: hay que prever, revisar y corregir para que nada falle. En la literatura de Chestnut suele asociarse con la idea de ansiedad; aquí se usa un nombre descriptivo propio.",
    motivations: [
      "Evitar errores que tengan consecuencias materiales o de salud para uno mismo o su entorno cercano.",
      "Sentir que todo está en orden y bajo control antes de poder descansar.",
      "Ser alguien confiable que no depende de la suerte ni del rescate de otros.",
      "Convertir la inquietud difusa en listas, rutinas y previsiones concretas.",
    ],
    outerManifestations: [
      "Revisa cerraduras, cuentas, plazos y repuestos más de una vez, aunque ya sepa la respuesta.",
      "Planifica con antelación y carga con un plan B para casi cualquier salida o trámite.",
      "Mantiene la casa y los gastos en un orden visible y se incomoda si otros lo alteran.",
      "Tiende a hablar de lo que falta o de lo que podría fallar antes que de lo que ya está bien.",
    ],
    innerBehaviors: [
      "Un monólogo de alerta que repasa riesgos y se apaga solo cuando algo se resuelve.",
      "Autocrítica por no haber previsto algo, incluso cuando era imprevisible.",
      "Resentimiento contenido hacia quienes descuidan lo que él o ella sí cuida.",
      "Dificultad para disfrutar un descanso mientras queden pendientes sin cerrar.",
    ],
    needs: [
      "Permitirse márgenes de error razonables sin sentir que todo se desmorona.",
      "Espacios de descanso que no estén condicionados a haber terminado la lista.",
      "Reconocimiento de que su prudencia protege, sin quedar reducida a rigidez.",
      "Poder delegar tareas sin supervisarlas de manera constante.",
    ],
    fears: [
      "Que una omisión suya provoque una pérdida económica o un daño evitable.",
      "Quedar expuesto a una situación que no pueda controlar con su preparación.",
      "Ser juzgado como descuidado o irresponsable.",
      "Perder la estabilidad que construyó con tanto esfuerzo.",
    ],
    strengths: [
      "Prudencia práctica, orden y capacidad de dejar los sistemas funcionando.",
      "Cumplimiento fiable de compromisos domésticos y laborales.",
      "Buen ojo para detectar fallas de detalle antes de que crezcan.",
      "Sentido de responsabilidad concreto con la salud y los recursos.",
    ],
    difficulties: [
      "Tensión corporal y cansancio por mantenerse en alerta constante.",
      "Rigidez ante cambios de plan o hábitos ajenos que alteran su sistema.",
      "Tendencia a postergar placeres hasta que todo esté 'bien', lo que casi nunca ocurre.",
      "Preocupación que se confunde con eficacia y se vuelve una carga para los demás.",
    ],
    differencesFromOtherSubtypes:
      "Frente al Uno social, que se pregunta cómo debe comportarse en el grupo, y al Uno sexual, que dirige su energía a mejorar a otros o a vivir con intensidad, este subtipo concentra la exigencia en la seguridad práctica propia: salud, hogar, dinero y previsión. Su malestar principal es la inquietud anticipatoria, no el choque con la norma social ni el celo vincular.",
    possibleConfusions: [
      { type: 6, note: "Comparte la anticipación de riesgos, pero el Uno busca estar en lo correcto y se culpa por fallar; el Seis duda de su propia seguridad y de en quién confiar." },
      { type: 5, note: "Ambos cuidan sus recursos, pero el Cinco lo hace por escasez de energía y para evitar demandas; el Uno por deber y control de calidad." },
      { type: 9, note: "El Nueve de conservación también ama la rutina, pero la vive como comodidad y evitación del conflicto, no como vigilancia crítica." },
    ],
    inRelationships:
      "Muestra cariño cuidando: ocupándose de la logística, la salud y la estabilidad de la pareja o la familia. Puede sonar a corrección o a lista de pendientes cuando está tensa o tenso, y le cuesta pedir ayuda emocional de forma directa. Mejora cuando comparte la preocupación en voz alta en lugar de resolverla en silencio.",
    atWork:
      "Es quien sostiene los procesos, la documentación, los presupuestos y los plazos. Rinde en roles administrativos, de calidad, finanzas o logística. Puede microgestionar y le cuesta trabajar en entornos improvisados o con reglas cambiantes.",
    examples: [
      "Llega con tiempo extra a un viaje y vuelve a la puerta para comprobar que cerró.",
      "Al recibir un aumento, su primera reacción es calcular qué podría salir mal antes de alegrarse.",
      "Se queda en casa en un fin de semana lluvioso arreglando un cajón en lugar de salir a ver a alguien.",
      "Se irrita cuando alguien deja una factura sin pagar 'por un día'.",
    ],
    selfObservationPractices: [
      "Anotar durante una semana cuántas veces revisó algo ya revisado y qué sentía justo antes.",
      "Distinguir entre un riesgo real y uno imaginado con la pregunta: ¿qué haría si ocurriera de verdad?",
      "Programar una pequeña cosa a medias a propósito y observar el malestar sin corregirla.",
      "Notar en el cuerpo dónde se acumula la alerta (mandíbula, hombros) y pausar tres respiraciones.",
    ],
  }),
  sub(1, "so", {
    name: "El que enseña con el ejemplo y no se adapta",
    description:
      "La exigencia del Uno se orienta a los grupos, instituciones y normas compartidas. Hay una convicción de saber cómo se deberían hacer las cosas y un esfuerzo por encarnar ese modelo. En algunas lecturas de Chestnut se vincula con la idea de no adaptabilidad; aquí se usa un nombre descriptivo propio.",
    motivations: [
      "Ser un modelo de conducta íntegra para la comunidad o el equipo.",
      "Contribuir a que las instituciones y los grupos funcionen con justicia y claridad.",
      "Que las reglas se apliquen de modo parejo, incluidas a sí mismo.",
      "Pertenecer a un grupo sin renunciar a sus principios.",
    ],
    outerManifestations: [
      "Se presenta con corrección, puntualidad y un tono de voz medido, incluso en situaciones informales.",
      "Participa en comités, voluntariados o asociaciones, a menudo asumiendo la parte ardua.",
      "Corrige con firmeza o enseña el 'modo correcto' de hacer algo, a veces sin que se lo pidan.",
      "Mantiene posturas firmes y se resiste a ceder cuando siente que cambiarlas sería traicionar un principio.",
    ],
    innerBehaviors: [
      "Una comparación continua entre cómo se hacen las cosas y cómo deberían hacerse.",
      "Rabia contenida ante la hipocresía o el 'todo vale' de otros.",
      "Dudas silenciosas sobre si es demasiado exigente o si se ha vuelto sermoneador.",
      "Sensación de cargar con una responsabilidad que otros evaden.",
    ],
    needs: [
      "Espacios donde pueda expresar el desacuerdo sin que se lea como ataque.",
      "Aprender a distinguir entre principios esenciales y preferencias personales.",
      "Sentirse aceptado sin tener que ser ejemplar todo el tiempo.",
      "Humor y ligereza compartida para aflojar la vigilancia moral.",
    ],
    fears: [
      "Ser visto como incoherente o hipócrita.",
      "Que el grupo se corrompa o se vuelva injusto y no haber hecho nada.",
      "Ser rechazado por defender una postura impopular.",
      "Perder el respeto de aquellos a quienes considera referentes.",
    ],
    strengths: [
      "Integridad visible y capacidad de sostener una causa en el tiempo.",
      "Habilidad para explicar normas y ordenar procedimientos colectivos.",
      "Sentido de justicia que puede proteger a los más débiles del grupo.",
      "Disposición a asumir cargas y responsabilidades públicas.",
    ],
    difficulties: [
      "Rigidez de opinión que dificulta negociar y hacer concesiones.",
      "Tono moralizante que provoca distancia o resistencia.",
      "Dificultad para tolerar estilos distintos del suyo aunque funcionen.",
      "Aislamiento irónico: querer pertenecer y, a la vez, sentirse por encima del grupo.",
    ],
    differencesFromOtherSubtypes:
      "A diferencia del Uno de conservación, preocupado por la seguridad práctica, y del Uno sexual, centrado en la relación intensa y en mejorar al otro, este subtipo se define por su relación con el colectivo: la norma, el ejemplo y la reputación ética. Su incomodidad típica es la distancia entre el grupo real y el grupo ideal, no el riesgo material ni el celo de pareja.",
    possibleConfusions: [
      { type: 3, note: "Ambos cuidan su imagen pública, pero el Tres lo hace para tener éxito y adaptarse a lo que se valora; el Uno social defiende lo que cree correcto aunque no sea popular." },
      { type: 8, note: "Ambos defienden la justicia con firmeza, pero el Ocho actúa por poder directo y confrontación; el Uno por deber y corrección de lo que está mal." },
      { type: 6, note: "El Seis también cumple normas de grupo, pero lo hace por lealtad y para sentirse seguro, no por convicción propia de lo correcto." },
    ],
    inRelationships:
      "Valora a las personas que comparten sus valores y puede ser generoso en la causa común. En lo íntimo, puede sonar a profesor o a juez, y le cuesta mostrar vulnerabilidad cuando se siente criticado. Gana calidez cuando escucha sin evaluar.",
    atWork:
      "Rinde en funciones de gestión, enseñanza, ética, regulación, derecho y organizaciones con misión. Lidera con el ejemplo y las reglas claras; tiene dificultades con la ambigüedad política y con colegas que cambian de postura según conveniencia.",
    examples: [
      "En una reunión de vecinos defiende una norma aun cuando le resulte poco popular.",
      "Se niega a aceptar un favor que le parece fuera de las reglas, incluso si sería conveniente.",
      "Corrige la gramática de un cartel comunitario y luego se pregunta si fue necesario.",
      "Se queda tarde ordenando el acta de la asamblea para que quede bien hecha.",
    ],
    selfObservationPractices: [
      "Registrar cuántas veces en un día corrige a otros y qué espera obtener con eso.",
      "Pedir feedback a alguien de confianza sobre cómo suena su tono cuando se siente en lo cierto.",
      "Elegir un tema menor y dejar que el grupo decida distinto, observando lo que siente.",
      "Escribir qué principios son innegociables y cuáles son preferencias, y revisar la lista cada tanto.",
    ],
  }),
  sub(1, "sx", {
    name: "El de la intensidad que quiere mejorar al otro",
    description:
      "El impulso perfeccionista se concentra en la relación cercana y en las pasiones propias. Hay una energía intensa, un sentimiento de entrega y, a veces, celos o afán de corregir al ser querido. En la literatura se asocia con el celo y la vehemencia; aquí se emplea un nombre descriptivo propio.",
    motivations: [
      "Vivir con pasión y compromiso sus causas y su vínculo principal.",
      "Mejorar a la persona amada o a su círculo íntimo desde un deseo genuino de bien.",
      "Que la relación sea auténtica, leal y a la altura de un ideal.",
      "Ser elegido por alguien que valore su entrega y su integridad.",
    ],
    outerManifestations: [
      "Expresa entusiasmo y convicción con una intensidad que sorprende frente a su fachada controlada.",
      "Se involucra a fondo en pocas personas o proyectos y descuida el resto.",
      "Sugiere cambios a su pareja o amistades 'por su bien', con tono de consejo o de reproche.",
      "Pasa de un autocontrol severo a estallidos puntuales de enojo o de celos.",
    ],
    innerBehaviors: [
      "Un diálogo interno que evalúa si el otro está a la altura de la entrega recibida.",
      "Energía contenida que busca una vía, a veces de manera abrupta.",
      "Culpa después de haber dicho algo duro y deseo de reparar con acciones.",
      "Celos o sospecha cuando percibe falta de reciprocidad o compromiso.",
    ],
    needs: [
      "Canales físicos y creativos para descargar la tensión sin dañar vínculos.",
      "Una pareja o amistad que le diga con calma cuando algo le duele.",
      "Aprender a pedir en lugar de corregir.",
      "Aceptar que el otro tiene un ritmo y un criterio distintos.",
    ],
    fears: [
      "Ser abandonado o reemplazado tras haber entregado tanto.",
      "Perder el control de su enojo y herir a quien quiere.",
      "Que la persona elegida resulte no ser lo que el ideal prometía.",
      "Verse a sí mismo como alguien mezquino o posesivo.",
    ],
    strengths: [
      "Entrega y fidelidad en los vínculos y en las causas que elige.",
      "Energía vital y capacidad de motivar a otros a dar lo mejor.",
      "Honestidad emocional cuando logra bajar la defensa.",
      "Compromiso con el crecimiento mutuo en la pareja o el equipo.",
    ],
    difficulties: [
      "Celos y tendencia a controlar o corregir al otro.",
      "Oscilación entre contención severa y explosiones de intensidad.",
      "Exigencia desmedida a la relación, con el riesgo de asfixiarla.",
      "Dificultad para disfrutar del presente sin evaluar si es lo bastante bueno.",
    ],
    differencesFromOtherSubtypes:
      "Se diferencia del Uno de conservación, que canaliza la exigencia en prevención y orden, y del Uno social, que lo hace en el ejemplo hacia el grupo, porque aquí la presión recae en el vínculo íntimo: la persona amada se vuelve el espacio donde se juega el ideal. Es el menos contenido de los tres y el más propenso al calor, al celo y a la expresión directa.",
    possibleConfusions: [
      { type: 4, note: "Comparte la intensidad y la entrega, pero el Cuatro vive la falta y el anhelo de lo que no está; el Uno sexual quiere perfeccionar lo que ya tiene." },
      { type: 8, note: "Ambos pueden ser vehementes y protectores, pero el Ocho no se siente culpable por su fuerza, mientras que el Uno sexual se autocritica por perder el control." },
      { type: 2, note: "El Dos también entrega y se entrega, pero espera ser necesitado y cuidar al otro; el Uno busca que el otro se acerque a un ideal de rectitud." },
    ],
    inRelationships:
      "Ofrece lealtad apasionada y compromiso concreto. Puede asfixiar con el celo o con una evaluación constante del otro, y le cuesta separar el cariño de la corrección. Mejora cuando nombra su miedo en lugar de transformarlo en crítica.",
    atWork:
      "Se destaca en trabajos con misión o vocación personal: artes, activismo, enseñanza, salud, emprendimientos propios. Puede ser carismático y exigente; tiene dificultades con jefaturas que no valoren su convicción y con colegas poco comprometidos.",
    examples: [
      "Prepara una sorpresa muy cuidada para su pareja y luego se frustra si no se aprecia el detalle.",
      "Discute con un amigo cercano sobre su estilo de vida 'porque le importa', y luego se arrepiente.",
      "Dedica sus fines de semana a un proyecto personal con una dedicación casi total.",
      "Siente celos de una amistad de su pareja y los disimula con una ironía.",
    ],
    selfObservationPractices: [
      "Escribir lo que quería pedir antes de convertirlo en consejo o crítica a otra persona.",
      "Detectar la señal corporal previa al enojo (calor, mandíbula) y pausar antes de hablar.",
      "Preguntarse qué tiene el celo que ver con su propio miedo, no con la conducta del otro.",
      "Practicar una actividad física regular para dar un cauce estable a la intensidad.",
    ],
  }),
];
