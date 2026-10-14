import { Compass, RotateCcw } from "lucide-react";
import type { AssessmentReport } from "@/domain/adaptive-engine";
import { Button } from "@/components/ui/button";
import { ShareBar } from "./common";
import type { AlternativeSummary, TypeBundle } from "./types";

/** Top of the report: the provisional reading, the two closest alternatives and the actions. */
export function ResultHeader({
  report,
  bundle,
  alternatives,
  onExplore,
  onReset,
}: {
  report: AssessmentReport;
  bundle: TypeBundle;
  alternatives: AlternativeSummary[];
  onExplore: () => void;
  onReset: () => void;
}) {
  const shareOf = (type: number) => report.ranking.find((r) => r.type === type)?.share ?? 0;
  const p = bundle.profile;
  return (
    <header className="space-y-5">
      <span className="inline-block rounded-full border border-accent px-3 py-1 text-sm font-medium text-accent">
        Interpretación provisional
      </span>
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">Tu tipo más compatible por ahora</p>
        <h1 className="font-serif text-4xl sm:text-5xl">
          Tipo {bundle.type} · {p.name}
        </h1>
        <p className="text-lg">{p.summary}</p>
      </div>
      {report.ambiguous ? (
        <p role="status" className="rounded-xl border border-accent bg-muted p-4">
          Tu resultado es ambiguo: la diferencia entre los tipos más cercanos es pequeña. Lee también las alternativas y quédate con el tipo en el que más te reconozcas.
        </p>
      ) : null}
      <div className="grid gap-4 rounded-2xl border border-border bg-card p-5 md:grid-cols-2">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Motivaciones principales</h2>
          <p>{p.coreMotivation}</p>
          <p className="text-muted-foreground">{p.basicDesire}</p>
        </div>
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Compatibilidad relativa</h2>
          <ShareBar label={`Tipo ${bundle.type} · ${p.name}`} share={shareOf(bundle.type)} strong />
          {alternatives.map((a) => (
            <ShareBar key={a.type} label={`Tipo ${a.type} · ${a.name}`} share={shareOf(a.type)} />
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Qué significan estos porcentajes: son una compatibilidad relativa, calculada al comparar tus respuestas con el patrón de cada uno de los nueve tipos y repartir el total entre ellos. No es una probabilidad ni un diagnóstico: solo ordena qué tipo se parece más a lo que respondiste.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={onExplore}>
          <Compass aria-hidden="true" className="size-5" />
          Explorar otros eneatipos
        </Button>
        <Button variant="secondary" onClick={onReset}>
          <RotateCcw aria-hidden="true" className="size-5" />
          Reiniciar evaluación
        </Button>
      </div>
      {/*
        EXTENSION POINT (accounts): the account UI does not exist yet, so there is deliberately no
        "Crear cuenta" button here (a dead control is worse than none). When it ships, render the call
        to action in this slot; the claim API (POST /api/assessments/claim) already moves the guest's
        results to the account.
      */}
      <p className="text-sm text-muted-foreground">
        Las cuentas aún no están disponibles: por ahora tu resultado queda asociado a este navegador.
      </p>
    </header>
  );
}
