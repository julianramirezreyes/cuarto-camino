import type { Claim } from "@/content/schema";
import { Card, ATTRIBUTION_ES, SectionShell } from "../common";
import type { TypeBundle } from "../types";

function ClaimCard({ title, claim }: { title: string; claim: Claim }) {
  return (
    <Card title={title}>
      <p>{claim.text}</p>
      <p className="text-sm text-muted-foreground">Según {ATTRIBUTION_ES[claim.attribution]}</p>
    </Card>
  );
}

/** A · Tu personalidad. `bundle` can be any type (type explorer). */
export function PersonalitySection({ bundle, title = "Tu personalidad" }: { bundle: TypeBundle; title?: string }) {
  const p = bundle.profile;
  return (
    <SectionShell title={title} intro="Una descripción posible, no una etiqueta: léela como hipótesis para observarte.">
      <p className="text-lg">{p.summary}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card title="Motivación central">
          <p>{p.coreMotivation}</p>
        </Card>
        <Card title="Deseo básico">
          <p>{p.basicDesire}</p>
        </Card>
        <Card title="Miedo básico">
          <p>{p.basicFear}</p>
        </Card>
        <Card title="Imagen de sí">
          <p>{p.selfImage}</p>
        </Card>
        <ClaimCard title={`Pasión`} claim={p.passion} />
        <ClaimCard title={`Fijación`} claim={p.fixation} />
      </div>
      <Card title="Diferencias entre autores">
        <p>{p.authorDifferences}</p>
      </Card>
    </SectionShell>
  );
}
