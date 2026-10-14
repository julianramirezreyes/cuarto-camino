import { cn } from "@/lib/utils";
import { MODULE_LABELS, MODULE_ORDER, type Progress } from "@/hooks/assessment-types";

/** Fraction (0-1) of the current module that is done, measured against its maximum length. */
function moduleFraction(p: Progress) {
  if (p.moduleMax <= 0) return 0;
  return Math.min(1, Math.max(0, p.moduleIndex / p.moduleMax));
}

export function ProgressHeader({ progress }: { progress: Progress }) {
  const current = MODULE_ORDER.indexOf(progress.module);
  const fraction = moduleFraction(progress);
  const overall = Math.round(((current + fraction) / MODULE_ORDER.length) * 100);

  return (
    <div className="space-y-3">
      <div aria-live="polite" className="flex items-baseline justify-between text-sm">
        <span className="font-medium">{MODULE_LABELS[progress.module]}</span>
        <span className="text-muted-foreground">Pregunta {progress.position}</span>
      </div>
      <div
        role="progressbar"
        aria-label="Progreso de la evaluación"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={overall}
        className="flex gap-1.5"
      >
        {MODULE_ORDER.map((module, i) => {
          const fill = i < current ? 1 : i === current ? fraction : 0;
          return (
            <div key={module} className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full origin-left rounded-full bg-primary transition-transform duration-500 ease-out")}
                style={{ transform: `scaleX(${fill})` }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
