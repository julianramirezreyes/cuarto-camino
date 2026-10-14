import { Button } from "@/components/ui/button";
import type { Progress } from "@/hooks/assessment-types";

export interface ResumePromptProps {
  progress: Progress;
  onContinue: () => void;
  onRestart: () => void;
  busy?: boolean;
}

export function ResumePrompt({ progress, onContinue, onRestart, busy = false }: ResumePromptProps) {
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl md:text-4xl">Tienes una evaluación en curso</h1>
      <p className="text-muted-foreground">
        Guardamos {progress.answered} {progress.answered === 1 ? "respuesta" : "respuestas"}. Puedes seguir desde
        donde quedaste o empezar de cero (se borrarán las respuestas anteriores).
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={onContinue} disabled={busy}>
          Continuar donde lo dejaste
        </Button>
        <Button variant="secondary" onClick={onRestart} disabled={busy}>
          Empezar de nuevo
        </Button>
      </div>
    </div>
  );
}
