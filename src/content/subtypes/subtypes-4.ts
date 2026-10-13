import type { SubtypeProfile } from "../schema";
import { sub } from "./build";

export const subtypes4: SubtypeProfile[] = [
  sub(4, "sp", {
    name: "El que sufre en silencio y aguanta",
    description:
      "El anhelo y la sensación de falta del Cuatro se vive con una expresión contenida, tolerante al dolor y a veces con humor o ironía. Se tiende a soportar lo difícil sin quejarse y a buscar intensidad en acciones y experiencias más que en la queja. En la tradición de Naranjo es el contratipo del tipo; en la literatura se asocia con la tenacidad. Aquí se usa un nombre descriptivo propio.",
    motivations: [
      "Sobrellevar el dolor de manera digna y sin ser una carga para otros.",
      "Encontrar sentido a través de la acción y la resistencia.",
      "Sentirse fuerte y autónomo frente a la sensación de carencia.",
      "Mantener su vida emocional privada y bajo control.",
    ],
    outerManifestations: [
      "Se muestra estoico, práctico, con una vitalidad que sorprende frente a su vida interior.",
      "Puede tomar riesgos, asumir retos o dedicarse a tareas exigentes.",
      "Recurre a la ironía o el humor para hablar de lo difícil.",
      "Evita dramatizar y suele minimizar su malestar.",
    ],
    innerBehaviors: [
      "Una sensación persistente de carencia que se tapa con actividad o esfuerzo.",
      "Orgullo en no quejarse, junto con resentimiento por no ser visto.",
      "Autoexigencia para soportar más de lo razonable.",
      "Envidia disimulada hacia quienes parecen vivir sin tanto esfuerzo.",
    ],
    needs: [
      "Dar nombre al sufrimiento y compartirlo sin sentir que es debilidad.",
      "Reconocer que pedir apoyo no le quita fortaleza.",
      "Cuidar su cuerpo y su descanso sin castigo.",
      "Conectar con su vulnerabilidad en lugar de superarla.",
    ],
    fears: [
      "Ser visto como débil, necesitado o dramático.",
      "Que su dolor sea trivializado si lo muestra.",
      "Quedarse a solas con el vacío si deja de moverse.",
      "Sentirse una carga para los demás.",
    ],
    strengths: [
      "Resiliencia y capacidad de afrontar dificultades.",
      "Autenticidad combinada con humor y desenfado.",
      "Iniciativa y disposición a actuar con valentía.",
      "Profundidad emocional contenida pero real.",
    ],
    difficulties: [
      "Negación del propio malestar y acumulación de tensión.",
      "Conductas de riesgo o sobreexigencia para sentirse vivo.",
      "Distanciamiento emocional de quienes quieren acercarse.",
      "Dificultad para reconocer la envidia y la necesidad.",
    ],
    differencesFromOtherSubtypes:
      "Frente al Cuatro social, que se compara con el grupo y siente vergüenza de su diferencia, y al Cuatro sexual, que expresa la envidia con rivalidad y deseo intenso, este subtipo canaliza la falta hacia la resistencia, la autonomía y la acción. Se queja poco y se nota menos como Cuatro.",
    possibleConfusions: [
      { type: 8, note: "Ambos son resistentes y directos, pero el Ocho se siente fuerte por naturaleza; este Cuatro carga una carencia interna que compensa con esfuerzo." },
      { type: 6, note: "Ambos afrontan el miedo con acción, pero el Seis anticipa peligros y busca seguridad; este Cuatro soporta el dolor para demostrar valor." },
      { type: 3, note: "Comparte el esfuerzo y el aguante, pero el Tres se orienta a la imagen y el logro; este Cuatro busca autenticidad e intensidad personales." },
    ],
    inRelationships:
      "Es leal, algo reservado, y muestra cariño más con actos que con palabras. Puede ocultar su necesidad y luego sentirse incomprendido. Mejora al decir con claridad qué le duele y qué necesita.",
    atWork:
      "Rinde en actividades exigentes, creativas o con un componente físico o de riesgo: oficios, emprendimientos, arte, trabajos de campo. Puede evitar pedir ayuda y sobrecargarse.",
    examples: [
      "Dice 'estoy bien' en medio de una crisis y se pone a trabajar sin parar.",
      "Elige un deporte o actividad extrema para sentir que vive con intensidad.",
      "Hace un chiste ácido sobre su propio dolor en una conversación.",
      "Se aísla unos días sin explicar a nadie lo que ocurre.",
    ],
    selfObservationPractices: [
      "Registrar los momentos en que dice que está bien y verificar si es cierto.",
      "Escribir lo que no se permite sentir cuando se está esforzando.",
      "Decir a una persona de confianza una sola frase sobre cómo se siente de veras.",
      "Notar cuándo la actividad es un medio para no sentir y probar una pausa breve.",
    ],
  }),
  sub(4, "so", {
    name: "El que se siente distinto del grupo y lo escribe",
    description:
      "La sensación de ser distinto y de quedar fuera se vuelve sociable: hay conciencia aguda de cómo es visto y de la distancia con los demás. El anhelo se mezcla con vergüenza y con comparación. En la literatura se asocia con la vergüenza; aquí se usa un nombre descriptivo propio.",
    motivations: [
      "Encontrar un lugar donde su diferencia sea comprendida y valorada.",
      "Expresar su mundo interior de modo que otros se reconozcan.",
      "Ser aceptado sin tener que ocultar quién es.",
      "Pertenecer a un círculo que comparta su sensibilidad.",
    ],
    outerManifestations: [
      "Habla de su experiencia con sensibilidad, a veces con dramatismo o con vergüenza visible.",
      "Se compara de forma explícita o implícita con colegas y amistades.",
      "Participa en comunidades creativas o de ayuda mutua como observador o expresor.",
      "Alterna entre mostrarse abierto y retirarse cuando se siente juzgado.",
    ],
    innerBehaviors: [
      "Una convicción de ser defectuoso o inadecuado frente a los demás.",
      "Comparaciones continuas y envidia hacia quienes parecen pertenecer con facilidad.",
      "Vergüenza que aparece cuando se siente observado.",
      "Anhelo de pertenecer, junto con la tendencia a aislarse.",
    ],
    needs: [
      "Un grupo donde pueda mostrarse con sus matices sin ser juzgado.",
      "Reconocer que otros también se sienten fuera de lugar.",
      "Separar el valor propio de la comparación.",
      "Contribuir al grupo sin esperar a sentirse completamente aceptado.",
    ],
    fears: [
      "Ser rechazado por quien es realmente.",
      "Ser expuesto como inadecuado ante un grupo.",
      "Quedarse fuera de círculos que valora.",
      "Perder su sensibilidad al intentar adaptarse.",
    ],
    strengths: [
      "Empatía profunda con el sufrimiento y la exclusión ajenos.",
      "Capacidad de expresar con sensibilidad lo que otros sienten y no dicen.",
      "Conciencia social del impacto de pertenecer o no.",
      "Valentía para hablar de temas difíciles.",
    ],
    difficulties: [
      "Autocrítica intensa y vergüenza que paraliza.",
      "Envidia o resentimiento hacia quienes parecen adaptados.",
      "Tendencia a sentirse víctima de la exclusión.",
      "Dificultad para disfrutar de la pertenencia cuando la logra.",
    ],
    differencesFromOtherSubtypes:
      "A diferencia del Cuatro de conservación, que aguanta y actúa, y del Cuatro sexual, que expresa su envidia con intensidad y competencia, este subtipo experimenta la carencia principalmente como vergüenza y comparación ante el grupo. Es el más sensible a la mirada social.",
    possibleConfusions: [
      { type: 6, note: "Ambos son sensibles a ser juzgados por el grupo, pero el Seis teme el peligro y la traición; el Cuatro social siente vergüenza y distancia emocional." },
      { type: 9, note: "Ambos pueden sentirse al margen, pero el Nueve se adapta y minimiza su presencia; el Cuatro siente su diferencia con intensidad." },
      { type: 2, note: "El Dos también se preocupa por pertenecer, pero busca ser querido a través del servicio; el Cuatro busca ser comprendido a través de su singularidad." },
    ],
    inRelationships:
      "Busca conexiones profundas y sinceras, y es muy atento al modo en que lo ven. Puede interpretar silencios como rechazo y retirarse. Mejora al verificar sus lecturas y compartir vulnerabilidad de forma gradual.",
    atWork:
      "Se destaca en escritura, arte, psicología, diseño, comunicación y trabajos de empatía. Puede sentirse incómodo en estructuras competitivas y comparar su avance con el de otros.",
    examples: [
      "Escribe un texto muy personal y duda si compartirlo por miedo a ser juzgado.",
      "Se siente fuera de lugar en una reunión y se retrae pese a que nadie lo excluyó.",
      "Compara su carrera con la de un compañero y se desanima.",
      "Se emociona al encontrar a alguien que describe su sentir con claridad.",
    ],
    selfObservationPractices: [
      "Registrar las situaciones de comparación y escribir lo que está sintiendo debajo.",
      "Verificar con alguien de confianza una interpretación de rechazo antes de actuar.",
      "Compartir una vivencia pequeña con el grupo y observar la respuesta real.",
      "Identificar una contribución concreta que puede dar sin sentirse perfecto.",
    ],
  }),
  sub(4, "sx", {
    name: "El que envidia con intensidad y compite",
    description:
      "La sensación de falta se vuelve activa, apasionada y a veces desafiante: se desea lo que otros tienen y se lo reclama con fuerza. Hay audacia emocional, competencia y una necesidad de ser visto con intensidad. En la literatura se asocia con la competencia; aquí se usa un nombre descriptivo propio.",
    motivations: [
      "Ser visto, deseado y reconocido en su singularidad y su valor.",
      "Obtener aquello que siente que le falta, aun a costa de enfrentarse.",
      "Vivir las relaciones con profundidad y dramatismo.",
      "Ganarse un lugar significativo en el mundo emocional de otra persona.",
    ],
    outerManifestations: [
      "Se muestra directo, intenso y a veces provocador, con una expresividad marcada.",
      "Compite con rivales reales o imaginarios y puede reclamar con vehemencia.",
      "Se viste, habla o crea con estilo deliberadamente propio.",
      "Pasa de la atracción a la rabia o la decepción si no se siente correspondido.",
    ],
    innerBehaviors: [
      "Una envidia intensa que impulsa a la acción o al enfrentamiento.",
      "Fantasías de ser extraordinario o de ser elegido de manera única.",
      "Dolor por el rechazo vivido como un juicio de su valor.",
      "Mezcla de deseo y resentimiento hacia quienes tienen lo que anhela.",
    ],
    needs: [
      "Canalizar su intensidad en proyectos o prácticas creativas y corporales.",
      "Tolerar el rechazo sin tomarlo como veredicto definitivo.",
      "Reconocer sus propios logros sin compararlos con los de otros.",
      "Relaciones capaces de sostener su intensidad sin desbordarse.",
    ],
    fears: [
      "Ser ignorado o considerado intrascendente.",
      "No ser elegido ni deseado por quien le importa.",
      "Que su intensidad aleje a todos.",
      "Descubrir que no es tan singular como se imagina.",
    ],
    strengths: [
      "Pasión creativa y coraje emocional.",
      "Capacidad de expresar deseos y sentimientos con franqueza.",
      "Magnetismo y presencia fuerte.",
      "Disposición a asumir riesgos por lo que valora.",
    ],
    difficulties: [
      "Conflictos relacionales por rivalidad y reclamos desmedidos.",
      "Oscilación entre idealizar y devaluar a las personas.",
      "Reactividad emocional y dificultad para calmarse.",
      "Sentirse víctima mientras se genera confrontación.",
    ],
    differencesFromOtherSubtypes:
      "Frente al Cuatro de conservación, contenido y estoico, y al Cuatro social, que se retrae por vergüenza, este subtipo actúa su envidia con intensidad y a veces con agresividad, reclamando atención y deseo. Es el más apasionado, competitivo y expresivo.",
    possibleConfusions: [
      { type: 8, note: "Ambos son intensos y confrontadores, pero el Ocho actúa desde la fuerza y el control; el Cuatro desde la herida de la falta y la necesidad de ser visto." },
      { type: 2, note: "El Dos sexual también es intenso, pero ofrece y seduce para ser querido; el Cuatro reclama y desea para sentirse completo." },
      { type: 3, note: "Ambos buscan destacar, pero el Tres lo hace con eficacia y adaptación; el Cuatro desafiando lo convencional y mostrando su sentir sin filtro." },
    ],
    inRelationships:
      "Vive los vínculos con gran intensidad, deseo y dramatismo, y puede oscilar entre la cercanía y la distancia. Mejora cuando comunica lo que siente sin acusar y tolera los ritmos del otro.",
    atWork:
      "Se destaca en artes, diseño, espectáculo, liderazgo creativo, ventas intensas o proyectos personales. Puede rivalizar con colegas, tomar las críticas como ataques personales y buscar cargos con visibilidad.",
    examples: [
      "Envidia el éxito de un colega y lo canaliza en un proyecto propio con gran energía.",
      "Reclama con intensidad un gesto de atención que no recibió.",
      "Abandona una relación tras sentirse poco valorado, para arrepentirse luego.",
      "Escribe un mensaje apasionado a medianoche y duda si enviarlo.",
    ],
    selfObservationPractices: [
      "Anotar qué desea cuando siente envidia: ¿el objeto, el reconocimiento o la sensación de ser elegido?",
      "Esperar un día antes de enviar un mensaje escrito en un momento de intensidad.",
      "Hacer una lista de logros propios y leerla cuando se compare con otros.",
      "Practicar actividades corporales que canalicen la energía sin dirigirla a nadie.",
    ],
  }),
];
