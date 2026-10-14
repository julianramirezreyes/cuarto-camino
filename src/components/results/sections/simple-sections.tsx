import { BulletList, Card, SectionShell } from "../common";
import type { TypeBundle } from "../types";

/** F · Patrones automáticos. */
export function PatternsSection({ bundle, title = "Patrones automáticos" }: { bundle: TypeBundle; title?: string }) {
  const p = bundle.profile;
  return (
    <SectionShell
      title={title}
      intro="Hábitos de acción y pensamiento que suelen activarse solos. Notarlos ya es el primer paso; no hace falta cambiarlos."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Conductas habituales">
          <BulletList items={p.habitualBehaviors} />
        </Card>
        <Card title="Pensamientos recurrentes">
          <BulletList items={p.recurringThoughts} />
        </Card>
        <Card title="Respuestas emocionales frecuentes">
          <BulletList items={p.emotionalResponses} />
        </Card>
        <Card title="Preguntas para observarte">
          <BulletList items={p.selfObservationQuestions} />
        </Card>
      </div>
    </SectionShell>
  );
}

/** G · Fortalezas. */
export function StrengthsSection({ bundle, title = "Fortalezas" }: { bundle: TypeBundle; title?: string }) {
  const p = bundle.profile;
  return (
    <SectionShell title={title} intro="Recursos que este estilo suele ofrecer cuando se vive con flexibilidad.">
      <Card>
        <BulletList items={p.strengths} />
      </Card>
      <Card title="Patrones constructivos">
        <p>{p.constructivePatterns}</p>
      </Card>
      <Card title="En el trabajo y el liderazgo">
        <p>{p.atWork}</p>
        <p>{p.inLeadership}</p>
      </Card>
    </SectionShell>
  );
}

/** H · Dificultades, written without blame. */
export function DifficultiesSection({ bundle, title = "Dificultades" }: { bundle: TypeBundle; title?: string }) {
  const p = bundle.profile;
  return (
    <SectionShell
      title={title}
      intro="Tensiones que pueden aparecer. No son defectos ni sentencias: son el costo habitual de una fortaleza llevada al extremo."
    >
      <Card>
        <BulletList items={p.limitations} />
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Bajo presión">
          <p>{p.underPressure}</p>
        </Card>
        <Card title="En los conflictos">
          <p>{p.inConflict}</p>
        </Card>
        <Card title="En las relaciones">
          <p>{p.inRelationships}</p>
        </Card>
      </div>
      <p className="text-sm text-muted-foreground">
        Si algo de esto te resulta doloroso o agotador, hablarlo con un profesional de la psicología o con personas de confianza es una buena decisión.
      </p>
    </SectionShell>
  );
}

/** J · Dirección de crecimiento. */
export function GrowthSection({ bundle, title = "Dirección de crecimiento" }: { bundle: TypeBundle; title?: string }) {
  return (
    <SectionShell
      title={title}
      intro="Ideas suaves para probar si te hacen sentido. Elige una, sin exigirte, y observa qué cambia."
    >
      <Card>
        <BulletList items={bundle.profile.developmentPractices} />
      </Card>
      <p className="text-sm text-muted-foreground">
        Estas prácticas son sugerencias de autoobservación, no un tratamiento ni un plan terapéutico.
      </p>
    </SectionShell>
  );
}
