import type { SubtypeProfile } from "../schema";
import { sub } from "./build";

export const subtypes6: SubtypeProfile[] = [
  sub(6, "sp", {
    name: "El que se protege creando aliados cercanos",
    description:
      "El miedo del Seis se maneja buscando seguridad en vínculos cálidos, amistosos y de bajo conflicto: se gana la simpatía de otros para sentirse a salvo. Es la forma más fóbica del tipo, que anticipa peligros y recurre al afecto como defensa. En la literatura suele asociarse con la calidez; aquí se usa un nombre descriptivo propio.",
    motivations: [
      "Sentirse seguro rodeado de personas que lo aprecian y lo protegerían.",
      "Evitar la hostilidad ganándose la simpatía de quienes podrían ser una amenaza.",
      "Contar con aliados fiables en lo práctico y lo emocional.",
      "Reducir la incertidumbre mediante vínculos estables y previsibles.",
    ],
    outerManifestations: [
      "Es amable, atento y a menudo bromista; busca crear un ambiente cordial.",
      "Pide opinión y consejo a menudo antes de decidir.",
      "Almacena información y recursos para prever contingencias.",
      "Duda en voz alta y busca confirmación sobre quién es de fiar.",
    ],
    innerBehaviors: [
      "Un escáner constante de señales de riesgo en personas y situaciones.",
      "Dudas sobre las intenciones de los demás junto con la necesidad de ser querido.",
      "Rumiación de escenarios negativos y de planes de contingencia.",
      "Temor a molestar o a quedar solo ante el peligro.",
    ],
    needs: [
      "Aprender a confiar en su juicio sin verificar con otros cada vez.",
      "Reconocer que no todas las personas son una amenaza.",
      "Tolerar la incertidumbre sin precisar ayuda constante.",
      "Expresar enojo o desacuerdo sin temer perder el afecto.",
    ],
    fears: [
      "Quedarse sin protección ni aliados cuando algo falle.",
      "Ser traicionado por alguien cercano.",
      "Que lo vean como débil o dependiente.",
      "Enfrentar una crisis sin red de apoyo.",
    ],
    strengths: [
      "Calidez, lealtad y capacidad de generar confianza.",
      "Sentido práctico para anticipar problemas.",
      "Empatía y atención a las necesidades de sus allegados.",
      "Humor que alivia la tensión del grupo.",
    ],
    difficulties: [
      "Ansiedad, indecisión y búsqueda excesiva de reaseguro.",
      "Evitación del conflicto y reticencia a expresar enojo.",
      "Dependencia de la aprobación de sus aliados.",
      "Sospecha encubierta tras una apariencia amable.",
    ],
    differencesFromOtherSubtypes:
      "Frente al Seis social, que se ampara en reglas, deberes y estructuras, y al Seis sexual, que enfrenta el miedo con fuerza y desafío, este subtipo se protege con calidez y vínculos cercanos. Es el más abiertamente temeroso y el más afectuoso de los tres.",
    possibleConfusions: [
      { type: 2, note: "Ambos son cálidos y atentos, pero el Dos da para ser querido; el Seis cálido busca seguridad y aliados ante el miedo." },
      { type: 9, note: "Ambos buscan armonía y evitan el conflicto, pero el Nueve se acomoda por inercia; el Seis lo hace por temor y vigilancia." },
      { type: 7, note: "Ambos pueden ser simpáticos y bromistas, pero el Siete evita el dolor con planes y estímulos; el Seis busca seguridad ante la amenaza." },
    ],
    inRelationships:
      "Es leal, cálido y atento, con tendencia a pedir y ofrecer reaseguro. Puede dudar de las intenciones del otro y necesitar pruebas de lealtad. Mejora al comunicar sus miedos y no atribuirlos al comportamiento ajeno.",
    atWork:
      "Funciona bien en equipos cohesionados, atención al público, salud, seguros y roles de prevención. Puede costarle tomar decisiones sin consulta y sentirse inseguro ante cambios de jefatura.",
    examples: [
      "Pregunta la opinión a tres amigos antes de tomar una decisión menor.",
      "Hace un comentario amable a un conocido hostil para mantener la paz.",
      "Guarda provisiones y copias de documentos 'por si acaso'.",
      "Se queda pensando en un mensaje ambiguo y le pide a alguien que lo interprete.",
    ],
    selfObservationPractices: [
      "Anotar cuántas decisiones del día consultó y cuáles habría podido tomar sola o solo.",
      "Distinguir entre un riesgo real y uno imaginado con evidencia observable.",
      "Expresar un desacuerdo menor y notar si el vínculo realmente se rompe.",
      "Observar el miedo en el cuerpo antes de buscar la reaseguración de otros.",
    ],
  }),
  sub(6, "so", {
    name: "El que se ampara en el deber y en las reglas",
    description:
      "El miedo se maneja ordenándose en estructuras claras: normas, jerarquías, ideologías y lealtades. Se busca saber cuáles son las reglas y cumplirlas, y se espera lo mismo de otros. En la literatura suele asociarse con el deber; aquí se usa un nombre descriptivo propio.",
    motivations: [
      "Tener claridad sobre qué se espera de él o ella y cumplirlo.",
      "Pertenecer a una estructura confiable que ofrezca protección y orientación.",
      "Ser leal a una causa, un grupo o una autoridad legítima.",
      "Reducir la ansiedad con normas, procedimientos y roles definidos.",
    ],
    outerManifestations: [
      "Cumple con rigor sus responsabilidades y espera lo mismo de los demás.",
      "Se apoya en protocolos, jerarquías y listas de verificación.",
      "Puede mostrarse suspicaz con figuras de autoridad o rebelarse contra ellas.",
      "Defiende firmemente a su grupo, organización o ideología.",
    ],
    innerBehaviors: [
      "Un conflicto entre el deseo de obedecer y la sospecha hacia la autoridad.",
      "Ansiedad cuando las reglas son ambiguas o cambian.",
      "Búsqueda de certeza en un sistema de creencias o un referente confiable.",
      "Pensamiento polarizado sobre quién es aliado y quién es amenaza.",
    ],
    needs: [
      "Tolerar la ambigüedad sin recurrir a una regla rígida.",
      "Cuestionar las normas con criterio propio, sin sumisión ni rebeldía automática.",
      "Reconocer su valor al margen de cumplir con lo esperado.",
      "Relajar la vigilancia sobre sí y sobre los demás.",
    ],
    fears: [
      "Quedar sin guía ante un orden que se derrumba.",
      "Ser castigado o juzgado por incumplir una norma.",
      "Que la autoridad en la que confía lo traicione.",
      "Cometer un error que ponga en riesgo al grupo.",
    ],
    strengths: [
      "Lealtad, responsabilidad y sentido del deber.",
      "Claridad para ordenar procedimientos y roles.",
      "Capacidad de ver las fallas de un sistema y prevenir riesgos.",
      "Compromiso firme con las causas que considera justas.",
    ],
    difficulties: [
      "Rigidez y dificultad para adaptarse a lo no previsto.",
      "Pensamiento en bloques: 'nosotros' frente a 'ellos'.",
      "Dependencia de estructuras externas para sentir seguridad.",
      "Alternancia entre obediencia excesiva y desconfianza hacia la autoridad.",
    ],
    differencesFromOtherSubtypes:
      "A diferencia del Seis de conservación, que busca seguridad con afecto y aliados, y del Seis sexual, que enfrenta el miedo con fuerza y desafío, este subtipo la busca en la estructura: normas, roles, jerarquía y lealtad. Es el más ordenado, intelectual y apegado al deber.",
    possibleConfusions: [
      { type: 1, note: "Ambos cumplen reglas con rigor, pero el Uno se guía por un ideal interno de lo correcto; el Seis por la necesidad de seguridad y la lealtad al sistema." },
      { type: 5, note: "Ambos son analíticos y precavidos, pero el Cinco se desvincula para conservar autonomía; el Seis se ancla a estructuras y grupos." },
      { type: 3, note: "Ambos cumplen roles con eficiencia, pero el Tres lo hace para destacar; el Seis para estar a salvo y ser fiel." },
    ],
    inRelationships:
      "Es fiel, responsable y valora la claridad sobre los acuerdos. Puede ser inflexible o suspicaz ante lo que percibe como deslealtad. Mejora al compartir dudas y al aceptar que el otro no siempre actuará según lo previsto.",
    atWork:
      "Funciona en administración, derecho, auditoría, seguridad, fuerzas armadas, burocracia, docencia y organizaciones con jerarquía definida. Puede ser un buen segundo al mando, con tendencia a la desconfianza ante cambios no explicados.",
    examples: [
      "Pide por escrito una instrucción ambigua antes de ejecutarla.",
      "Defiende los procedimientos de su organización ante una crítica externa.",
      "Se incomoda cuando un colega se salta una norma sin consecuencias.",
      "Se alarma ante un cambio repentino de reglas y busca averiguar quién lo decidió.",
    ],
    selfObservationPractices: [
      "Anotar qué reglas sigue por convicción y cuáles solo por temor al castigo.",
      "Identificar cuándo clasifica a las personas como aliadas o amenazas y buscar contraevidencia.",
      "Tomar una decisión sin consultar ningún manual y observar la ansiedad.",
      "Cuestionar con respeto una norma menor y notar qué pasa.",
    ],
  }),
  sub(6, "sx", {
    name: "El que enfrenta el miedo con fuerza y desafío",
    description:
      "El miedo se maneja yendo hacia él: se proyecta fuerza, valentía o belleza para intimidar o impresionar y no sentirse vulnerable. Es la forma contrafóbica del tipo. En la tradición de Naranjo es el contratipo del tipo; en la literatura suele asociarse con la fuerza y la belleza. Aquí se usa un nombre descriptivo propio.",
    motivations: [
      "No sentirse débil ni vulnerable ante el peligro.",
      "Proyectar una imagen de fuerza, atractivo o seguridad que disuada la amenaza.",
      "Demostrarse a sí mismo que puede con aquello que teme.",
      "Ganar respeto y ser tomado en serio, sobre todo por quienes importan.",
    ],
    outerManifestations: [
      "Se muestra directo, desafiante o intimidante, a veces con un tono de provocación.",
      "Se expone al riesgo o a la confrontación para probar su valentía.",
      "Cuida su presencia física y su estilo para proyectar poder o atractivo.",
      "Puede alternar entre seducir y desafiar para comprobar la lealtad del otro.",
    ],
    innerBehaviors: [
      "Un miedo que se vive como rabia o impulso de enfrentar.",
      "Prueba constante de la propia valentía y de la lealtad ajena.",
      "Dudas internas tapadas por una fachada de seguridad.",
      "Hipervigilancia disfrazada de agresividad o desafío.",
    ],
    needs: [
      "Reconocer su miedo como tal, sin transformarlo siempre en ataque.",
      "Confiar en vínculos que no necesiten ser puestos a prueba.",
      "Aceptar su vulnerabilidad sin sentir que lo anula.",
      "Descubrir formas de seguridad que no requieran intimidar.",
    ],
    fears: [
      "Ser visto como débil o cobarde.",
      "Ser traicionado o dominado por alguien más fuerte.",
      "Perder la capacidad de defenderse.",
      "Que su fachada de fuerza se desmorone y quede expuesto.",
    ],
    strengths: [
      "Valentía real y disposición a defender a quienes quiere.",
      "Franqueza y energía para confrontar problemas.",
      "Sentido de protección hacia los suyos.",
      "Capacidad de actuar bajo presión.",
    ],
    difficulties: [
      "Reactividad, confrontación y búsqueda de riesgo innecesaria.",
      "Dificultad para reconocer el miedo propio.",
      "Puesta a prueba constante de los demás, que desgasta los vínculos.",
      "Alternancia entre agresividad y vulnerabilidad súbita.",
    ],
    differencesFromOtherSubtypes:
      "Frente al Seis de conservación, que se protege con calidez, y al Seis social, que se ampara en deberes y estructuras, este subtipo responde al miedo con fuerza, seducción o desafío. Es el menos evidentemente miedoso y el más a menudo confundido con tipos más asertivos como el 8.",
    possibleConfusions: [
      { type: 8, note: "Ambos son directos y confrontadores, pero el Ocho actúa por poder y control sin dudar; el Seis contrafóbico actúa para vencer una duda y una amenaza interna." },
      { type: 3, note: "Ambos proyectan una imagen de fuerza o atractivo, pero el Tres busca éxito y admiración; el Seis busca defenderse del peligro y probar su valor." },
      { type: 7, note: "Ambos se arriesgan, pero el Siete busca placer y estímulo; el Seis contrafóbico enfrenta lo temido." },
    ],
    inRelationships:
      "Es protector, apasionado y leal, con una intensidad que puede resultar intimidante. Pone a prueba la fidelidad del otro y le cuesta bajar la guardia. Mejora al decir 'tengo miedo' en vez de atacar.",
    atWork:
      "Funciona en roles de riesgo o confrontación: emergencias, deportes, litigios, seguridad, emprendimiento arriesgado, ventas agresivas. Puede entrar en choques con la autoridad y probar los límites.",
    examples: [
      "Responde a un desafío con una provocación para no mostrarse inseguro.",
      "Se lanza a una actividad peligrosa después de sentir ansiedad.",
      "Reta a su pareja con una prueba de lealtad y luego se arrepiente.",
      "Se muestra seguro ante un jefe, mientras dentro duda de sí.",
    ],
    selfObservationPractices: [
      "Notar el miedo detrás de la rabia o el desafío antes de reaccionar.",
      "Registrar cuántas veces pone a prueba a otros y qué espera descubrir.",
      "Compartir con alguien de confianza una inseguridad concreta.",
      "Practicar la pausa de tres respiraciones antes de responder a una provocación.",
    ],
  }),
];
