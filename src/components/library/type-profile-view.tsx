import Link from "next/link";
import { getWing } from "@/content/wings";
import { TYPE_PROFILES } from "@/content/types";
import {
  CENTERS,
  HARMONIC_GROUPS,
  HORNEVIAN_GROUPS,
  INTEGRATION,
  STRESS,
  TYPE_NAMES,
  wingsOf,
  type EnneagramType,
} from "@/domain/enneagram/structure";
import { BulletList, ClaimBlock, Section, SourceLinks } from "./common";
import { DraftNotice } from "./draft-notice";
import { ExpandableCard } from "./expandable-card";

function groupOf(groups: Record<string, readonly number[]>, labels: Record<string, string>, type: number) {
  const key = Object.keys(groups).find((k) => groups[k].includes(type));
  return key ? labels[key] : "";
}

const CENTER_LABELS = { instinctive: "Instintivo (visceral)", emotional: "Emocional", mental: "Mental" };
const HORNEY_LABELS = { assertive: "Asertivos", compliant: "Complacientes", withdrawn: "Retraídos" };
const HARMONIC_LABELS = { competency: "Competencia", positiveOutlook: "Perspectiva positiva", reactive: "Reactivos" };

export function TypeProfileView({ type }: { type: EnneagramType }) {
  const p = TYPE_PROFILES[type];
  const wings = wingsOf(type);

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-accent">Eneatipo</p>
        <h1 className="font-serif text-3xl md:text-4xl">Tipo {type} · {p.name}</h1>
        <p className="text-lg text-muted-foreground">{p.summary}</p>
        <DraftNotice status={p.status} />
      </header>

      <Section id="motivacion" title="Motivación, deseo y temor">
        <dl className="grid gap-3 sm:grid-cols-2">
          {[
            ["Motivación central", p.coreMotivation],
            ["Deseo básico", p.basicDesire],
            ["Temor básico", p.basicFear],
            ["Necesidad psicológica", p.psychologicalNeed],
          ].map(([term, text]) => (
            <div key={term} className="rounded-lg border border-border bg-card p-3">
              <dt className="text-sm text-muted-foreground">{term}</dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="pasion" title="Pasión, fijación y virtud">
        <p className="text-sm text-muted-foreground">
          Son conceptos de las tradiciones de Ichazo y Naranjo; cada escuela los define a su manera.
        </p>
        <ClaimBlock label="Pasión" claim={p.passion} />
        <ClaimBlock label="Fijación" claim={p.fixation} />
        <ClaimBlock label="Virtud" claim={p.virtue} />
      </Section>

      <Section id="autoimagen" title="Autoimagen y defensas">
        <p>{p.selfImage}</p>
        {p.defenseMechanisms.map((d, i) => (
          <ClaimBlock key={i} label={`Mecanismo de defensa ${p.defenseMechanisms.length > 1 ? i + 1 : ""}`.trim()} claim={d} />
        ))}
      </Section>

      <Section id="fortalezas" title="Fortalezas y límites">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-medium">Fortalezas posibles</h3>
            <BulletList items={p.strengths} />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Límites posibles</h3>
            <BulletList items={p.limitations} />
          </div>
        </div>
      </Section>

      <Section id="manifestaciones" title="Cómo puede manifestarse">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <h3 className="font-medium">Conductas habituales</h3>
            <BulletList items={p.habitualBehaviors} />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Pensamientos recurrentes</h3>
            <BulletList items={p.recurringThoughts} />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Respuestas emocionales</h3>
            <BulletList items={p.emotionalResponses} />
          </div>
        </div>
      </Section>

      <Section id="vida" title="En la vida cotidiana">
        <dl className="space-y-3">
          {[
            ["En las relaciones", p.inRelationships],
            ["En el trabajo", p.atWork],
            ["En el liderazgo", p.inLeadership],
            ["En el conflicto", p.inConflict],
            ["Bajo presión", p.underPressure],
            ["Patrones constructivos", p.constructivePatterns],
          ].map(([term, text]) => (
            <div key={term}>
              <dt className="font-medium">{term}</dt>
              <dd className="text-muted-foreground">{text}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="alas" title="Alas">
        <p className="text-muted-foreground">
          El ala es la influencia que se atribuye a uno de los tipos vecinos. Es una idea de escuela y no todos los autores la usan igual.
        </p>
        <div className="space-y-3">
          {wings.map((w) => {
            const wing = getWing(type, w);
            if (!wing) return null;
            return (
              <ExpandableCard key={w} title={`${wing.label} · con influencia del tipo ${w} (${TYPE_NAMES[w]})`}>
                <p>{wing.explanation}</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <h4 className="font-medium">Lo que comparte con el tipo base</h4>
                    <BulletList items={wing.similarities} />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-medium">Lo que cambia</h4>
                    <BulletList items={wing.differences} />
                  </div>
                </div>
                <p><strong className="font-medium">Motivaciones:</strong> {wing.motivations}</p>
                <p><strong className="font-medium">Frente a la otra ala:</strong> {wing.comparisonWithOtherWing}</p>
                <DraftNotice status={wing.status} />
              </ExpandableCard>
            );
          })}
        </div>
      </Section>

      <Section id="parecidos" title="Con qué puede confundirse">
        <ul className="space-y-3">
          {p.lookAlikes.map((l) => (
            <li key={l.type}>
              <Link href={`/biblioteca/tipos/${l.type}`} className="font-medium underline underline-offset-4">
                Tipo {l.type} · {TYPE_NAMES[l.type]}
              </Link>
              <p className="text-muted-foreground">{l.difference}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="autoobservacion" title="Para observarte">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <h3 className="font-medium">Preguntas</h3>
            <BulletList items={p.selfObservationQuestions} />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Ejemplos cotidianos</h3>
            <BulletList items={p.everydayExamples} />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Prácticas</h3>
            <BulletList items={p.developmentPractices} />
          </div>
        </div>
      </Section>

      <Section id="conexiones" title="Conexiones dentro del modelo">
        <dl className="grid gap-3 sm:grid-cols-2">
          <div><dt className="text-sm text-muted-foreground">Centro</dt><dd>{groupOf(CENTERS, CENTER_LABELS, type)}</dd></div>
          <div><dt className="text-sm text-muted-foreground">Grupo horneviano</dt><dd>{groupOf(HORNEVIAN_GROUPS, HORNEY_LABELS, type)}</dd></div>
          <div><dt className="text-sm text-muted-foreground">Grupo armónico</dt><dd>{groupOf(HARMONIC_GROUPS, HARMONIC_LABELS, type)}</dd></div>
          <div>
            <dt className="text-sm text-muted-foreground">Flechas tradicionales</dt>
            <dd>Integración hacia el {INTEGRATION[type]}; estrés hacia el {STRESS[type]}.</dd>
          </div>
        </dl>
        <p className="text-sm text-muted-foreground">
          Las flechas siguen la presentación clásica; las escuelas las interpretan de forma distinta.{" "}
          <Link href="/biblioteca/clasificaciones" className="underline underline-offset-4">Más sobre clasificaciones</Link>.
        </p>
      </Section>

      <Section id="autores" title="Diferencias entre autores">
        <p>{p.authorDifferences}</p>
        <p><SourceLinks keys={p.sources} /></p>
      </Section>
    </div>
  );
}
