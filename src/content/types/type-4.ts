import type { TypeProfile } from "../schema";

export const type4: TypeProfile = {
  type: 4,
  name: "Individualista",
  summary:
    "En este modelo interpretativo, el tipo 4 describe una atención dirigida a lo que falta y a lo que hace único: percibe con intensidad su mundo emocional y tiende a sentir que algo esencial le fue negado, mientras otros parecen tenerlo.",
  coreMotivation:
    "Encontrar y expresar una identidad propia, auténtica y significativa, y ser comprendido en esa singularidad.",
  basicDesire: "Ser él mismo, tener una identidad propia y significativa.",
  basicFear: "No tener identidad ni significado personal; ser ordinario o carecer de algo esencial.",
  psychologicalNeed:
    "Sentir que pertenece y que su valor no depende de ser distinto, y sostener la estabilidad emocional sin perder sensibilidad.",
  passion: {
    text: "Envidia: una atención persistente a lo que otros tienen y uno no, con un anhelo doloroso de algo que se siente ausente en uno mismo.",
    attribution: "naranjo",
    sources: ["naranjo-1990", "ichazo-1982"],
  },
  fixation: {
    text: "Melancolía: una inclinación a quedarse en el anhelo, la nostalgia y el dolor por lo perdido o inalcanzable, con cierta idealización de ello. Es la fijación que Ichazo propone para este tipo.",
    attribution: "ichazo",
    sources: ["ichazo-1982", "naranjo-1990"],
  },
  virtue: {
    text: "Ecuanimidad: la capacidad de sentir con profundidad sin dejarse arrastrar por cada oleada emocional, valorando lo que hay en el presente.",
    attribution: "naranjo",
    sources: ["naranjo-1990"],
  },
  selfImage:
    "Se ve como una persona sensible, diferente y profunda, que siente más que el resto y que tiene una mirada propia, aunque a veces se siente incomprendido o incompleto.",
  defenseMechanisms: [
    {
      text: "Introyección: en la tradición de Naranjo, lo valioso o lo doloroso que se atribuye a otros se incorpora al mundo interno, y el reproche o la pérdida se vuelven autoacusación y fantasía.",
      attribution: "naranjo",
      sources: ["naranjo-1994"],
    },
    {
      text: "Riso y Hudson también utilizan la introyección para describir cómo el tipo 4 asimila sentimientos hacia figuras importantes. Los conceptos se toman del psicoanálisis con cierta libertad y no hay una lista canónica compartida.",
      attribution: "riso-hudson",
      sources: ["riso-hudson-1996"],
    },
  ],
  strengths: [
    "Profundidad emocional y capacidad de acompañar el dolor ajeno sin apurarse a arreglarlo.",
    "Creatividad y sensibilidad estética para dar forma a lo que siente.",
    "Autenticidad: tiende a rechazar lo superficial o impostado.",
    "Capacidad de poner en palabras matices emocionales difíciles de nombrar.",
    "Empatía con quienes atraviesan pérdidas, crisis o exclusión.",
  ],
  limitations: [
    "Puede quedar atrapado en estados de ánimo bajos y alimentarlos con rumiación.",
    "Tiende a compararse y concluir que está en desventaja.",
    "Se aleja cuando alguien se acerca demasiado y se acerca cuando se aleja.",
    "La intensidad puede resultar abrumadora para otros y generar malentendidos.",
    "Puede postergar tareas prácticas esperando el estado de ánimo adecuado.",
  ],
  habitualBehaviors: [
    "Cuida detalles de estilo, ambiente y expresión personal que digan algo de quién es.",
    "Se sumerge en música, lecturas o escritura que reflejen su estado emocional.",
    "Analiza una conversación varias veces para descifrar lo que quiso decir el otro.",
    "Busca vínculos intensos y se aburre o decepciona con los cotidianos.",
    "Se retira cuando se siente malinterpretado y espera que alguien lo busque.",
  ],
  recurringThoughts: [
    "A los demás les resulta más fácil que a mí.",
    "Nadie termina de entenderme.",
    "Algo importante me falta y no sé qué es.",
    "Si fuera diferente, me querrían más.",
    "Esto no es lo auténtico, es solo una parte de lo que siento.",
  ],
  emotionalResponses: [
    "Nostalgia o anhelo ante recuerdos y personas ausentes, a menudo idealizados.",
    "Tristeza o vacío que aparece sin motivo claro y se prolonga.",
    "Herida intensa ante un gesto de indiferencia o falta de atención.",
    "Alivio y calidez cuando alguien reconoce su profundidad sin juzgarla.",
    "Vergüenza discreta ante la sensación de ser demasiado o de no ser suficiente.",
  ],
  inRelationships:
    "Busca intimidad profunda, honestidad emocional y vínculos con significado. Puede ser un compañero atento al mundo interno del otro. Su desafío es el vaivén entre acercarse y alejarse: el idealizado se vuelve decepcionante de cerca y el ausente se vuelve deseable. Cuando se sostiene lo cotidiano, la relación gana estabilidad.",
  atWork:
    "Se desarrolla en tareas que permiten expresión personal y sentido: artes, diseño, escritura, terapia, curaduría, docencia, causas sociales. Le cuesta la rutina impersonal y las reglas rígidas. Puede dar un enorme valor cuando siente que el trabajo es suyo, y bajar el rendimiento cuando se siente ignorado.",
  inLeadership:
    "Lidera desde la autenticidad y la capacidad de ver lo humano en cada integrante. Es sensible al clima emocional del equipo. Puede dudar de sus decisiones, tomar los comentarios críticos de forma personal y oscilar entre cercanía y distancia.",
  inConflict:
    "Suele vivir el conflicto de forma muy intensa y tomarlo como un juicio sobre su persona. Puede retirarse y sentirse herido, o reaccionar con dramatismo. Tiende a recordar con detalle las ofensas y a necesitar que el otro reconozca el daño emocional antes de resolver el tema práctico.",
  underPressure:
    "Se intensifican la autocrítica, la sensación de ser distinto y el aislamiento. En algunas lecturas del modelo, bajo estrés se describen rasgos del tipo 2: buscar cercanía de forma insistente o dependiente. Es una interpretación y no una regla universal.",
  constructivePatterns:
    "En sus mejores momentos transforma lo que siente en algo compartible, tolera los estados de ánimo cambiantes sin identificarse con ellos, valora lo ordinario y actúa con constancia, de modo que su sensibilidad se vuelve fuente de conexión más que de separación.",
  lookAlikes: [
    {
      type: 6,
      difference:
        "Ambos sienten ansiedad y sospechan de lo que ven. El 6 teme el peligro, busca certezas y apoyo en estructuras o personas fiables; el 4 siente un vacío o carencia identitaria y busca significado y autenticidad. El 6 se pregunta si puede confiar; el 4, quién es y si alguien lo entiende de verdad.",
    },
    {
      type: 5,
      difference:
        "Los dos se retiran y valoran su mundo interno. El 5 se aísla para conservar energía, observar y comprender, y suele desconectarse de la emoción; el 4 se retira para sentir y ser comprendido, y la emoción está en primer plano. El 5 minimiza necesidades; el 4 anhela la conexión mientras teme no merecerla.",
    },
    {
      type: 9,
      difference:
        "Ambos pueden parecer ensimismados o melancólicos. El 9 tiende a adormecer sus deseos y apaciguar la tensión, a veces con indolencia; el 4 mantiene viva la intensidad y el anhelo. El 9 diluye la identidad para mantenerse en armonía; el 4 la afirma y teme no tenerla.",
    },
  ],
  selfObservationQuestions: [
    "¿Qué me hace sentir que me falta algo que otros tienen?",
    "¿Cuándo uso mi estado de ánimo como explicación para no actuar?",
    "¿Qué parte de lo ordinario de mi vida estoy dejando de ver?",
    "¿Cómo cambia lo que siento por alguien cuando se vuelve más cercano o más lejano?",
    "¿Qué pasaría si no necesitara ser especial para pertenecer?",
  ],
  everydayExamples: [
    "Ve una publicación de un conocido que celebra un logro y siente a la vez admiración y un pellizco en el pecho, y pasa el resto de la tarde pensando en lo que no ha hecho.",
    "Escucha la misma canción por horas porque expresa lo que siente mejor que sus propias palabras.",
    "Tras una cena, vuelve a casa repasando cada comentario por si alguien lo ignoró o lo malinterpretó.",
    "Evita ir a un evento por pensar que no encajará, y luego se siente excluido por no haber ido.",
    "Un compañero de trabajo le da una crítica constructiva y la escucha como un rechazo a su persona.",
  ],
  developmentPractices: [
    "Escribe lo que sientes sin intentar interpretarlo; luego pon una hora de por medio antes de decidir qué hacer.",
    "Elige una pequeña tarea cotidiana y hazla aunque no tengas ganas, para ver cómo cambia el ánimo.",
    "Cuando surja una comparación, anota qué es lo que realmente admiras en el otro y qué te muestra de ti.",
    "Practica identificar en una escala del uno al diez la intensidad de una emoción antes de reaccionar.",
    "Cuida una rutina sencilla de sueño, comida y movimiento, que apoya la estabilidad sin quitar sensibilidad.",
  ],
  authorDifferences:
    "Ichazo y Naranjo coinciden en envidia como pasión y melancolía como fijación. Naranjo subraya la dinámica del reclamo y de la autodevaluación asociadas con la envidia; Riso y Hudson destacan la búsqueda de identidad y la sensación de ser diferente; Palmer enfatiza la atención a lo que falta y el contraste con los demás. Los subtipos instintivos de este tipo se describen de forma muy distinta de la imagen habitual del 4 triste, y varían entre autores. Es un modelo interpretativo con evidencia científica limitada (Hook et al., 2021).",
  sources: ["ichazo-1982", "naranjo-1990", "naranjo-1994", "riso-hudson-1999", "palmer-1988", "hook-2021"],
  status: "draft",
};
