import type { Attribution } from "./schema";

/**
 * Structured text for the history page. Every claim names whose tradition it belongs to,
 * what kind of statement it is, and which SOURCES keys back it. No dates beyond the
 * publication years already registered in SOURCES; no quotations.
 * Draft: needs specialist review before public launch.
 */

export type EvidenceKind =
  | "school-definition"
  | "editorial-interpretation"
  | "psychological-hypothesis"
  | "scientific-evidence"
  | "historical-context";

export const EVIDENCE_KINDS: readonly EvidenceKind[] = [
  "school-definition",
  "editorial-interpretation",
  "psychological-hypothesis",
  "scientific-evidence",
  "historical-context",
];

export const EVIDENCE_KIND_LABEL: Record<EvidenceKind, string> = {
  "school-definition": "Definición de escuela",
  "editorial-interpretation": "Interpretación editorial",
  "psychological-hypothesis": "Hipótesis psicológica",
  "scientific-evidence": "Evidencia científica",
  "historical-context": "Contexto histórico",
};

export const EVIDENCE_KIND_DESCRIPTION: Record<EvidenceKind, string> = {
  "school-definition": "Lo que una escuela o autor define como parte de su propio modelo.",
  "editorial-interpretation": "Nuestra lectura o síntesis; puede discrepar de alguna escuela.",
  "psychological-hypothesis": "Una idea sobre cómo funciona la personalidad que no ha sido demostrada.",
  "scientific-evidence": "Lo que revisiones de investigación han encontrado, con sus límites.",
  "historical-context": "Quién dijo o escribió qué, y en qué relación con otras tradiciones.",
};

export type HistoryAttribution = Attribution | "gurdjieff" | "ouspensky";

export interface HistoryClaim {
  text: string;
  attribution: HistoryAttribution;
  kind: EvidenceKind;
  /** Keys in SOURCES; never empty. */
  sources: string[];
}

export interface HistorySection {
  id: string;
  title: string;
  summary: string;
  claims: HistoryClaim[];
}

export const HISTORY_INTRO =
  "La historia del eneagrama se cuenta a veces como una línea recta desde una enseñanza antigua hasta los tests actuales. Es más fiel verla como varias tradiciones distintas que se fueron encadenando. Un punto debe quedar claro desde el principio: los nueve tipos de personalidad modernos no son de Gurdjieff. Lo que sigue separa lo que cada autor propuso, lo que nosotros interpretamos, lo que son hipótesis y lo que la investigación ha podido comprobar.";

export const HISTORY_SECTIONS: HistorySection[] = [
  {
    id: "gurdjieff-ouspensky",
    title: "Gurdjieff y el símbolo, a través de Ouspensky",
    summary: "El símbolo de nueve puntos pertenece a la tradición del Cuarto Camino; los tipos de personalidad, no.",
    claims: [
      {
        text: "El libro de Ouspensky sobre sus años con Gurdjieff es la fuente habitual para conocer el símbolo del eneagrama dentro del Cuarto Camino. Allí aparece como una figura para describir procesos y leyes del universo, no como un mapa de caracteres.",
        attribution: "ouspensky",
        kind: "historical-context",
        sources: ["ouspensky-1949"],
      },
      {
        text: "Los nueve tipos de personalidad modernos no son de Gurdjieff: no forman parte de la enseñanza que Ouspensky registra. Atribuirle los nueve tipos es una confusión frecuente que conviene evitar.",
        attribution: "editorial",
        kind: "historical-context",
        sources: ["ouspensky-1949"],
      },
      {
        text: "Que el símbolo y los tipos compartan nombre no significa que compartan origen ni propósito. El símbolo sirve en el Cuarto Camino para pensar procesos; la tipología se apoya en él de forma posterior.",
        attribution: "editorial",
        kind: "editorial-interpretation",
        sources: ["ouspensky-1949", "ichazo-1982"],
      },
    ],
  },
  {
    id: "ichazo",
    title: "Ichazo: fijaciones y pasiones",
    summary: "La asociación entre el símbolo y nueve patrones del ego se atribuye a Oscar Ichazo.",
    claims: [
      {
        text: "Oscar Ichazo, en el marco de su escuela Arica, relacionó nueve patrones del ego con el símbolo del eneagrama. De su propuesta proceden las nociones de fijación y de pasión que luego se usaron en otras escuelas.",
        attribution: "ichazo",
        kind: "school-definition",
        sources: ["ichazo-1982"],
      },
      {
        text: "En la presentación de Ichazo, cada punto del símbolo se vincula a un modo de distorsión de la atención y a una emoción dominante. Los nombres concretos y su lectura psicológica varían entre quienes los retoman.",
        attribution: "ichazo",
        kind: "school-definition",
        sources: ["ichazo-1982", "naranjo-1990"],
      },
      {
        text: "Es una propuesta de escuela, transmitida en un contexto de enseñanza, no un resultado de investigación psicológica. Conviene leerla como un modelo de trabajo sobre sí mismo.",
        attribution: "editorial",
        kind: "editorial-interpretation",
        sources: ["ichazo-1982"],
      },
    ],
  },
  {
    id: "naranjo",
    title: "Naranjo: estudios de carácter",
    summary: "Claudio Naranjo vinculó el modelo con la psicología clínica y describió el carácter de cada tipo.",
    claims: [
      {
        text: "Claudio Naranjo describió cada tipo como una estructura de carácter, combinando la tradición recibida con ideas del psicoanálisis y de otras escuelas psicológicas. Sus libros son el punto de partida de gran parte de la literatura posterior.",
        attribution: "naranjo",
        kind: "school-definition",
        sources: ["naranjo-1990", "naranjo-1994"],
      },
      {
        text: "En su tradición se habla de variantes instintivas dentro de cada tipo y de contratipos, es decir, expresiones que pueden parecer opuestas a la imagen habitual del tipo. Qué subtipo cuenta como contratipo no siempre coincide entre autores.",
        attribution: "naranjo",
        kind: "school-definition",
        sources: ["naranjo-1990"],
      },
      {
        text: "Que Naranjo use conceptos psicológicos no convierte sus descripciones en hallazgos empíricos. Son hipótesis clínicas y de observación, que cada lector puede contrastar con su propia experiencia, con cautela.",
        attribution: "editorial",
        kind: "psychological-hypothesis",
        sources: ["naranjo-1994"],
      },
    ],
  },
  {
    id: "riso-hudson",
    title: "Riso y Hudson: niveles de desarrollo",
    summary: "La escuela de Riso y Hudson aportó los niveles, las alas y una presentación muy difundida de las flechas.",
    claims: [
      {
        text: "Don Riso y Russ Hudson popularizaron el eneagrama en el mundo anglosajón y propusieron nueve niveles de desarrollo dentro de cada tipo, desde un funcionamiento más flexible hasta uno más rígido.",
        attribution: "riso-hudson",
        kind: "school-definition",
        sources: ["riso-hudson-1996", "riso-hudson-1999"],
      },
      {
        text: "Su obra describe también las alas y las direcciones de integración y de estrés. Otras escuelas matizan o reorganizan estas conexiones, por lo que no hay un único mapa de flechas aceptado por todos.",
        attribution: "riso-hudson",
        kind: "school-definition",
        sources: ["riso-hudson-1999"],
      },
      {
        text: "Los niveles son una escala descriptiva propia de esta escuela. No están validados como instrumento clínico y en esta biblioteca se presentan con etiquetas editoriales prudentes, no con los nombres originales.",
        attribution: "editorial",
        kind: "editorial-interpretation",
        sources: ["riso-hudson-1999", "hook-2021"],
      },
    ],
  },
  {
    id: "chestnut",
    title: "Chestnut y los 27 subtipos",
    summary: "Beatrice Chestnut sistematizó las tres variantes instintivas de cada tipo.",
    claims: [
      {
        text: "Beatrice Chestnut desarrolló una exposición sistemática de los 27 subtipos, resultado de cruzar los nueve tipos con tres instintos: conservación, social y sexual o uno a uno.",
        attribution: "chestnut",
        kind: "school-definition",
        sources: ["chestnut-2013"],
      },
      {
        text: "Su trabajo se apoya en la tradición de Naranjo y la ordena para el lector general. Las descripciones concretas de cada subtipo son interpretaciones de la autora y de su escuela.",
        attribution: "chestnut",
        kind: "school-definition",
        sources: ["chestnut-2013", "naranjo-1990"],
      },
      {
        text: "Asignar una persona a un subtipo con pocos datos es difícil: dos personas con el mismo instinto pueden verse muy distintas. Por eso esta biblioteca trata los subtipos como descripciones para explorar, no como etiquetas.",
        attribution: "editorial",
        kind: "editorial-interpretation",
        sources: ["chestnut-2013"],
      },
    ],
  },
  {
    id: "palmer",
    title: "Palmer y la tradición narrativa",
    summary: "Helen Palmer difundió una forma de transmisión basada en el relato de la propia experiencia.",
    claims: [
      {
        text: "Helen Palmer es asociada con la llamada tradición narrativa: en lugar de partir de una teoría del carácter, se pide a personas de un mismo tipo que cuenten cómo viven sus motivaciones, y se contrastan los relatos.",
        attribution: "palmer",
        kind: "school-definition",
        sources: ["palmer-1988"],
      },
      {
        text: "Este enfoque pone el acento en la voz de quien se reconoce en un tipo y en el diálogo entre tipos. Es una fuente de descripciones ricas, pero depende de lo que cada grupo pueda decir de sí mismo.",
        attribution: "editorial",
        kind: "editorial-interpretation",
        sources: ["palmer-1988"],
      },
    ],
  },
  {
    id: "contemporary",
    title: "Interpretaciones contemporáneas",
    summary: "Hoy conviven escuelas, divulgadores y cuestionarios con definiciones que no siempre coinciden.",
    claims: [
      {
        text: "Además de las escuelas anteriores existen numerosas reinterpretaciones: agrupaciones de tipos por centros, por actitud ante los demás o ante la frustración, y modelos que combinan varios tipos. Cada una parte de supuestos propios y puede contradecir a otra.",
        attribution: "contemporary",
        kind: "historical-context",
        sources: ["riso-hudson-1999", "horney-1945"],
      },
      {
        text: "La agrupación en tipos que avanzan hacia, contra o lejos de los demás se apoya en una idea de Karen Horney sobre las estrategias frente a los conflictos internos. Su aplicación al eneagrama es una adaptación posterior, no algo que Horney formulara.",
        attribution: "horney",
        kind: "historical-context",
        sources: ["horney-1945"],
      },
      {
        text: "Cuando varias fuentes difieren, esta biblioteca lo señala en lugar de elegir una versión como definitiva. Esa decisión es editorial y busca evitar que una escuela se presente como si fuera todo el campo.",
        attribution: "editorial",
        kind: "editorial-interpretation",
        sources: ["riso-hudson-1999", "naranjo-1990", "palmer-1988"],
      },
    ],
  },
  {
    id: "evidencia",
    title: "Qué dice la evidencia científica",
    summary: "La investigación disponible es limitada y mixta; no respalda tomar el eneagrama como diagnóstico.",
    claims: [
      {
        text: "Una revisión sistemática de la literatura publicada en el Journal of Clinical Psychology encontró evidencia mixta sobre la fiabilidad y la validez de los instrumentos del eneagrama y señaló la necesidad de más estudios rigurosos.",
        attribution: "contemporary",
        kind: "scientific-evidence",
        sources: ["hook-2021"],
      },
      {
        text: "Entre las limitaciones que esa revisión recoge está que no se ha demostrado de forma concluyente que existan nueve tipos diferenciados, ni que los niveles o los subtipos midan lo que sus escuelas afirman.",
        attribution: "contemporary",
        kind: "scientific-evidence",
        sources: ["hook-2021"],
      },
      {
        text: "Es razonable pensar que el eneagrama funciona como un lenguaje para conversar sobre motivaciones. Esa utilidad subjetiva es una hipótesis plausible, no una prueba de que describa a las personas con exactitud.",
        attribution: "editorial",
        kind: "psychological-hypothesis",
        sources: ["hook-2021"],
      },
      {
        text: "Por eso nada en esta biblioteca ni en la evaluación debe leerse como diagnóstico, pronóstico o medida de salud mental. Si algo te preocupa, un profesional puede ayudarte mejor que cualquier tipología.",
        attribution: "editorial",
        kind: "editorial-interpretation",
        sources: ["hook-2021"],
      },
    ],
  },
];
