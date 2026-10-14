import type { AssessmentReport } from "@/domain/adaptive-engine";
import { Button } from "@/components/ui/button";
import { Card, SectionShell, ShareBar } from "../common";
import type { AlternativeSummary, TypeBundle } from "../types";

/** B · Tus alternativas: the main type next to the two closest types. */
export function AlternativesSection({
  bundle,
  report,
  alternatives,
  onExplore,
}: {
  bundle: TypeBundle;
  report: AssessmentReport;
  alternatives: AlternativeSummary[];
  /** Opens everything about that alternative (the same explorer view as the symbol). */
  onExplore?: (type: AlternativeSummary["type"]) => void;
}) {
  const shareOf = (type: number) => report.ranking.find((r) => r.type === type)?.share ?? 0;
  return (
    <SectionShell
      title="Tus alternativas"
      intro="Los tipos más cercanos a tus respuestas. Leer sus diferencias ayuda a comprobar cuál te reconoce mejor."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Tu tipo más afín" className="border-primary">
          <h3 className="font-serif text-xl">
            Tipo {bundle.type} · {bundle.profile.name}
          </h3>
          <ShareBar label={`tipo ${bundle.type}`} share={shareOf(bundle.type)} strong />
          <p>{bundle.profile.summary}</p>
        </Card>
        {alternatives.map((a) => (
          <Card key={a.type} title="Alternativa cercana">
            <h3 className="font-serif text-xl">
              Tipo {a.type} · {a.name}
            </h3>
            <ShareBar label={`tipo ${a.type}`} share={shareOf(a.type)} />
            <p>{a.summary}</p>
            <p className="text-sm text-muted-foreground">Motivación: {a.coreMotivation}</p>
            {a.difference ? (
              <div className="space-y-1 border-t border-border pt-3">
                <p className="text-sm font-semibold">Cómo se diferencia del tipo {bundle.type}</p>
                <p>{a.difference}</p>
              </div>
            ) : null}
            {onExplore ? (
              <Button variant="secondary" onClick={() => onExplore(a.type)}>
                Ver todo sobre el tipo {a.type}
              </Button>
            ) : null}
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}
