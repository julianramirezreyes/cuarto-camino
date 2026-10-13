import type { SubtypeProfile } from "../schema";
import { sub } from "./build";

export const subtypes8: SubtypeProfile[] = [
  sub(8, "sp", {
    name: "El que asegura lo suyo y lo toma sin pedir permiso",
    description:
      "El exceso del Ocho se dirige a satisfacer necesidades materiales y de control: territorio, recursos, comodidad y autonomía. Es el más pragmático y reservado de los tres, con una intensidad volcada en obtener y proteger lo necesario. En la literatura suele asociarse con la satisfacción y la supervivencia; aquí se usa un nombre descriptivo propio.",
    motivations: [
      "Garantizar recursos, territorio y autonomía sin depender de nadie.",
      "Mantener el control de su entorno inmediato.",
      "Satisfacer de inmediato sus necesidades para no sentirse vulnerable.",
      "Proteger a su círculo íntimo en lo material.",
    ],
    outerManifestations: [
      "Va directo a lo que necesita, con poca ceremonia y mucho pragmatismo.",
      "Acumula recursos, bienes o poder en lo concreto y se mueve con confianza en su terreno.",
      "Es reservado con quienes no conoce y generoso con lo suyo.",
      "Puede ser tajante cuando algo amenaza sus recursos o su territorio.",
    ],
    innerBehaviors: [
      "Una evaluación continua de quién controla qué y de dónde puede venir una amenaza.",
      "Impaciencia con lo que retrasa la satisfacción de una necesidad.",
      "Desconfianza como defensa ante la posibilidad de ser aprovechado.",
      "Ocultamiento de la ternura detrás de la dureza práctica.",
    ],
    needs: [
      "Reconocer necesidades emocionales además de las materiales.",
      "Recibir sin sentir que pierde poder.",
      "Moderar el exceso de trabajo, comida o placer como forma de control.",
      "Descansar sin sentir que baja la guardia.",
    ],
    fears: [
      "Ser controlado o dependiente de otros.",
      "Quedarse sin recursos ni territorio propio.",
      "Que lo vulneren en lo material.",
      "Mostrar debilidad y ser aprovechado.",
    ],
    strengths: [
      "Pragmatismo, resolución y capacidad de proveer.",
      "Fuerza para proteger a los suyos de manera concreta.",
      "Autonomía y claridad en la defensa de sus límites.",
      "Generosidad real con su círculo íntimo.",
    ],
    difficulties: [
      "Abuso de la fuerza o el control para conseguir lo que necesita.",
      "Desconexión emocional y aislamiento defensivo.",
      "Excesos en trabajo, comida o placer.",
      "Impaciencia y poca tolerancia a la dependencia de los demás.",
    ],
    differencesFromOtherSubtypes:
      "Frente al Ocho social, que se involucra en la protección de grupos y causas, y al Ocho sexual, que vuelca su intensidad en un vínculo apasionado y posesivo, este subtipo se concentra en lo material y el control de su entorno. Es el más reservado, terrenal y menos expresivo emocionalmente.",
    possibleConfusions: [
      { type: 5, note: "Ambos cuidan su territorio y recursos, pero el Cinco se retrae y evita la implicación; el Ocho se impone y actúa." },
      { type: 1, note: "Ambos son firmes y exigentes, pero el Uno se somete a un ideal interno de corrección; el Ocho a su propia voluntad." },
      { type: 3, note: "Ambos son pragmáticos y trabajadores, pero el Tres se apoya en la imagen y el logro; el Ocho en la fuerza y el control directo." },
    ],
    inRelationships:
      "Es protector, leal y generoso con su círculo cercano, aunque no demuestra el afecto con palabras. Puede resultar dominante o cerrado cuando se siente vulnerable. Mejora al compartir lo que siente en lugar de resolver todo solo.",
    atWork:
      "Sobresale en negocios propios, construcción, logística, finanzas, producción y cualquier trabajo con resultados tangibles. Puede mostrarse autoritario y tener dificultad para delegar o aceptar jefaturas.",
    examples: [
      "Resuelve una necesidad doméstica sin consultar a nadie y avisa cuando ya está hecho.",
      "Se niega a pedir ayuda en una mudanza aun estando agotado.",
      "Negocia con dureza un precio y es generoso con un amigo en apuros.",
      "Se queda trabajando hasta tarde para no depender de un tercero.",
    ],
    selfObservationPractices: [
      "Registrar cuándo toma el control de algo que otro podría hacer y qué teme que pase si no lo hace.",
      "Pedir ayuda concreta una vez a la semana y observar la sensación.",
      "Notar cuándo un exceso (trabajo, comida) cumple la función de no sentir.",
      "Compartir una vulnerabilidad pequeña con alguien de confianza.",
    ],
  }),
  sub(8, "so", {
    name: "El que protege al grupo y se compromete con los suyos",
    description:
      "La intensidad del Ocho se pone al servicio de amigos, causas y colectivos: se defiende al débil, se arma alianza y se actúa con lealtad. Es una forma menos dominante y más solidaria del tipo. En la tradición de Naranjo es el contratipo del tipo; en la literatura suele asociarse con la solidaridad o la amistad. Aquí se usa un nombre descriptivo propio.",
    motivations: [
      "Proteger a los vulnerables y defender la justicia en su entorno.",
      "Ser leal a sus amigos, a su grupo y a sus causas.",
      "Construir alianzas fuertes en las que pueda confiar.",
      "Ejercer su fuerza de modo constructivo y reconocido.",
    ],
    outerManifestations: [
      "Se involucra en causas colectivas y defiende abiertamente a quienes siente a su cargo.",
      "Es cercano, afectuoso en la lealtad y comprometido con su gente.",
      "Puede ser el líder natural que protege y moviliza a su grupo.",
      "Confronta las injusticias con determinación, pero modera su dureza por el vínculo.",
    ],
    innerBehaviors: [
      "Una sensibilidad aguda a la injusticia y al abuso de poder.",
      "Orgullo de ser alguien confiable, junto con temor a mostrar su ternura.",
      "Evaluación de a quién puede considerar amigo y a quién no.",
      "Culpa o enojo ante la sensación de no haber protegido a alguien.",
    ],
    needs: [
      "Recibir apoyo y cuidado sin sentirse débil.",
      "Moderar la intensidad en entornos que lo requieran.",
      "Reconocer sus propias necesidades además de las de su grupo.",
      "Permitir que otros asuman liderazgo.",
    ],
    fears: [
      "Que traicionen a su grupo o a él mismo.",
      "Perder la lealtad de sus amigos.",
      "Quedar impotente ante una injusticia.",
      "Mostrar debilidad ante quienes dependen de él.",
    ],
    strengths: [
      "Lealtad, liderazgo protector y generosidad con los suyos.",
      "Valentía para confrontar abusos.",
      "Capacidad de crear comunidad y movilizar a otros.",
      "Calidez práctica al servicio de causas compartidas.",
    ],
    difficulties: [
      "Paternalismo y control disfrazado de protección.",
      "Dificultad para aceptar disidencia dentro de su círculo.",
      "Agotamiento por cargar con las necesidades del grupo.",
      "Reacciones fuertes ante lo percibido como traición.",
    ],
    differencesFromOtherSubtypes:
      "Frente al Ocho de conservación, enfocado en recursos y control, y al Ocho sexual, que arde en la intensidad del vínculo individual, este subtipo orienta su fuerza a la lealtad grupal y a la protección. Es el más sociable y el menos parecido al estereotipo de dureza dominante.",
    possibleConfusions: [
      { type: 2, note: "Ambos protegen y cuidan a su círculo, pero el Dos lo hace para ser querido; el Ocho para defender y ejercer su fuerza." },
      { type: 1, note: "Ambos se comprometen con causas justas, pero el Uno lo hace por principio y autocrítica; el Ocho por impulso de protección y poder." },
      { type: 6, note: "Ambos son leales, pero el Seis lo es por miedo y búsqueda de seguridad; el Ocho por fuerza y compromiso." },
    ],
    inRelationships:
      "Es leal, protector y comprometido con sus vínculos, y se muestra afectuoso con su círculo. Puede controlar disfrazando de cuidado y reaccionar fuerte ante la traición. Mejora al aceptar ser cuidado.",
    atWork:
      "Prospera en liderazgo comunitario, sindicatos, activismo, política, emprendimientos con equipo, deportes de grupo. Puede asumir demasiadas cargas y ser intolerante con quien percibe desleal.",
    examples: [
      "Defiende en una reunión a un colega que fue tratado injustamente.",
      "Organiza a sus amigos para ayudar a un vecino en problemas.",
      "Se enfurece al saber que alguien cercano fue engañado.",
      "Se siente incómodo al recibir un favor y busca devolverlo de inmediato.",
    ],
    selfObservationPractices: [
      "Anotar cuándo protege a alguien que no se lo pidió y qué teme que ocurra si no lo hace.",
      "Dejar que otro lidere una actividad grupal y observar la inquietud.",
      "Pedir apoyo a un amigo y registrar la incomodidad y la reacción del otro.",
      "Reconocer una situación en la que su dureza fue más de lo necesario.",
    ],
  }),
  sub(8, "sx", {
    name: "El que arde en el vínculo y exige entrega total",
    description:
      "La intensidad del Ocho se concentra en un vínculo apasionado: se busca poseer y ser poseído, con una entrega total y un deseo de control sobre la relación. Es el subtipo más rebelde, vehemente y expuesto del tipo. En la literatura suele asociarse con la posesión y la entrega; aquí se usa un nombre descriptivo propio.",
    motivations: [
      "Vivir una conexión intensa, total y sin reservas con alguien.",
      "Experimentar una entrega que no lo haga sentirse controlado.",
      "Desafiar normas y convenciones para vivir con autenticidad.",
      "Ser plenamente visto y aceptado en su fuerza y en su ternura.",
    ],
    outerManifestations: [
      "Se muestra vehemente, magnético y a veces desafiante ante la autoridad.",
      "Entrega todo en un vínculo y exige igual compromiso.",
      "Puede mostrar celos o posesividad y reaccionar con intensidad a lo percibido como traición.",
      "Busca experiencias intensas, tanto en el amor como en la aventura.",
    ],
    innerBehaviors: [
      "Un deseo de fusión junto con el miedo a ser dominado.",
      "Oscilación entre entrega total y reacciones de control.",
      "Rebeldía interna ante cualquier norma que perciba como imposición.",
      "Vulnerabilidad oculta tras la intensidad y la dureza.",
    ],
    needs: [
      "Aprender a experimentar la vulnerabilidad sin sentir que pierde poder.",
      "Canalizar su intensidad en prácticas físicas y creativas.",
      "Diferenciar el compromiso de la posesión.",
      "Tolerar la autonomía del otro.",
    ],
    fears: [
      "Ser traicionado por quien se ha entregado por completo.",
      "Perder el control de su vínculo o de sí mismo.",
      "Ser sometido o manipulado por alguien.",
      "Ser abandonado después de mostrar su ternura.",
    ],
    strengths: [
      "Pasión, entrega y autenticidad intensas.",
      "Valentía para desafiar lo establecido.",
      "Magnetismo y presencia fuerte.",
      "Lealtad profunda hacia quien elige.",
    ],
    difficulties: [
      "Posesividad, celos y escenas de gran intensidad.",
      "Impulsividad y búsqueda de riesgo.",
      "Dificultad para aceptar límites o crítica.",
      "Vaivenes entre dominar y entregarse.",
    ],
    differencesFromOtherSubtypes:
      "Frente al Ocho de conservación, pragmático y reservado, y al Ocho social, solidario con el grupo, este subtipo canaliza su fuerza en una relación apasionada y total. Es el más rebelde, el más emocionalmente expuesto y el más propenso a la posesividad.",
    possibleConfusions: [
      { type: 4, note: "Ambos son intensos y apasionados, pero el Cuatro vive la falta y la herida; el Ocho se afirma en la fuerza y rechaza mostrar carencia." },
      { type: 7, note: "Ambos buscan intensidad y aventura, pero el Siete evita el dolor y el compromiso; el Ocho se entrega con vehemencia." },
      { type: 2, note: "El Dos sexual también se entrega con intensidad, pero lo hace para ser querido; el Ocho para vivir plenamente y no ser dominado." },
    ],
    inRelationships:
      "Se entrega de manera total y exige lo mismo, con pasión y protección. Puede ser celoso, intenso y difícil de contener cuando se siente herido. Mejora al hablar de su miedo a ser traicionado y al dar espacio al otro.",
    atWork:
      "Funciona en artes, espectáculo, emprendimiento audaz, deportes, liderazgo carismático y trabajos creativos. Puede chocar con la autoridad y mezclar el entorno laboral con lo personal.",
    examples: [
      "Se entrega por completo a un proyecto nuevo y exige igual compromiso al equipo.",
      "Reacciona con celos intensos ante un mensaje ambiguo de su pareja.",
      "Desafía una norma que considera arbitraria aunque tenga consecuencias.",
      "Muestra una ternura inesperada y luego se retrae con dureza.",
    ],
    selfObservationPractices: [
      "Notar el miedo que precede al impulso de controlar o poseer.",
      "Hacer una actividad física intensa antes de una conversación difícil.",
      "Decir en voz alta a alguien de confianza qué sintió tras una reacción desmedida.",
      "Observar cuándo la rebeldía es una elección y cuándo una reacción automática.",
    ],
  }),
];
