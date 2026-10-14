import type { Progress, QuestionDTO } from "@/hooks/assessment-types";

export const forcedChoice: QuestionDTO = {
  id: "q1",
  text: "¿Qué describe mejor tu reacción habitual?",
  kind: "forced-choice",
  module: "type",
  options: [
    { id: "a", text: "Me anticipo a lo que puede salir mal" },
    { id: "b", text: "Busco que todos estén bien" },
    { id: "c", text: "Voy directo a resolver" },
  ],
};

export const likert: QuestionDTO = {
  id: "q2",
  text: "Me cuesta soltar el control.",
  kind: "likert",
  module: "wing",
  options: [
    { id: "1", text: "Nunca" },
    { id: "2", text: "A veces" },
    { id: "3", text: "Siempre" },
  ],
};

export const progress: Progress = { answered: 3, position: 4, module: "type", moduleIndex: 3, moduleMin: 5, moduleMax: 10 };
