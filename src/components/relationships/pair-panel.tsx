import { useId, type ReactNode } from "react";
import { GROUP_LABELS } from "@/components/enneagram/groups";
import type { GroupSystemKey, RelationshipContext, RelationshipLenses, RelationshipProfile } from "@/content/schema";
import { describePair, groupPairKey } from "@/domain/enneagram/pair";
import { GROUP_SYSTEMS, type EnneagramType, type GroupSystem } from "@/domain/enneagram/structure";
import { ContextLists } from "./context-lists";
import { Heading, below, type HeadingLevel } from "./heading";
import { CONTEXT_LABELS } from "./labels";

const SYSTEM_TITLES: Record<GroupSystem, string> = {
  centers: "Centros",
  hornevian: "Estilos hornevianos",
  harmonic: "Grupos armónicos",
};
const SYSTEMS = Object.keys(GROUP_SYSTEMS) as GroupSystem[];
const QUESTIONS_SHOWN = 3;

function Block({ title, level, children }: { title: string; level: HeadingLevel; children: ReactNode }) {
  const id = useId();
  return (
    <section aria-labelledby={id} className="space-y-3">
      <Heading level={level} id={id} className="font-medium">
        {title}
      </Heading>
      {children}
    </section>
  );
}

function Fact({ label, text }: { label: string; text: string }) {
  return (
    <li className="space-y-1 rounded-xl border border-border bg-card p-4">
      <p className="font-medium">{label}</p>
      <p>{text}</p>
    </li>
  );
}

/**
 * Reads two types side by side. Purely descriptive: it lists the groupings they share, where they differ, and the
 * traditional arrows, each with the lens text that frames it as a tendency. No score, rank or verdict.
 */
export function PairPanel({
  self,
  other,
  lenses,
  context,
  level = 3,
}: {
  self: RelationshipProfile;
  other: RelationshipProfile;
  lenses: RelationshipLenses;
  context: RelationshipContext;
  level?: HeadingLevel;
}) {
  const uid = useId();
  const facts = describePair(self.type, other.type);
  const a = self.type;
  const b = other.type;
  const titleId = `${uid}-title`;
  const sub = below(level);
  const subsub = below(sub);

  if (facts.sameType) {
    return (
      <section aria-labelledby={titleId} className="space-y-5">
        <Heading level={level} id={titleId} className="font-serif text-xl">
          Tipo {a} con tipo {b}
        </Heading>
        <Block title="Dos personas del mismo tipo" level={sub}>
          <p>{self.sameTypeNote}</p>
          <p>{lenses.sameType}</p>
        </Block>
        <Questions profiles={[self]} level={sub} />
      </section>
    );
  }

  const sharedSystems = SYSTEMS.filter((s) => facts.shared[s] !== null);
  const differentSystems = SYSTEMS.filter((s) => facts.shared[s] === null);
  const arrowFacts: { label: string; text: string }[] = [];
  const arrowName = { integration: "integración", stress: "estrés" } as const;
  for (const [from, to, relation] of [
    [a, b, facts.arrows.aToB],
    [b, a, facts.arrows.bToA],
  ] as [EnneagramType, EnneagramType, "integration" | "stress" | null][]) {
    if (relation) {
      arrowFacts.push({
        label: `Del tipo ${from} hacia el tipo ${to}: dirección de ${arrowName[relation]} tradicional`,
        text: lenses.arrows[relation],
      });
    }
  }
  const hasArrowsOrWing = arrowFacts.length > 0 || facts.adjacent;

  return (
    <section aria-labelledby={titleId} className="space-y-6">
      <Heading level={level} id={titleId} className="font-serif text-xl">
        Tipo {a} con tipo {b}
      </Heading>
      <p className="text-muted-foreground">
        Lo que sigue son pistas para conversar, no un veredicto sobre esta relación.
      </p>

      <Block title="Puntos en común y diferencias" level={sub}>
        <div className="space-y-5">
          <Block title="Puntos en común" level={subsub}>
            {sharedSystems.length > 0 ? (
              <ul className="space-y-3">
                {sharedSystems.map((s) => {
                  const key = facts.shared[s]!;
                  return (
                    <Fact
                      key={s}
                      label={`${SYSTEM_TITLES[s]}: ambos pertenecen al grupo «${GROUP_LABELS[s][key]}»`}
                      text={lenses.shared[s as GroupSystemKey][key]}
                    />
                  );
                })}
              </ul>
            ) : (
              <p>
                En ninguno de los tres sistemas de agrupación comparten grupo. Eso no dice nada sobre lo que sí tienen en común como personas.
              </p>
            )}
          </Block>

          {differentSystems.length > 0 ? (
            <Block title="Dónde pueden diferir" level={subsub}>
              <ul className="space-y-3">
                {differentSystems.map((s) => {
                  const [ka, kb] = facts.groups[s];
                  return (
                    <Fact
                      key={s}
                      label={`${SYSTEM_TITLES[s]}: tipo ${a} es «${GROUP_LABELS[s][ka]}» y tipo ${b} es «${GROUP_LABELS[s][kb]}»`}
                      text={lenses.different[s as GroupSystemKey][groupPairKey(s, ka, kb)]}
                    />
                  );
                })}
              </ul>
            </Block>
          ) : null}

          {hasArrowsOrWing ? (
            <Block title="Flechas y ala" level={subsub}>
              <ul className="space-y-3">
                {arrowFacts.map((f) => (
                  <Fact key={f.label} label={f.label} text={f.text} />
                ))}
                {facts.adjacent ? <Fact label={`Los tipos ${a} y ${b} son vecinos en el círculo`} text={lenses.adjacent} /> : null}
              </ul>
            </Block>
          ) : null}
        </div>
      </Block>

      <Block title={`Cómo suele vivir el tipo ${b} este vínculo: ${CONTEXT_LABELS[context]}`} level={sub}>
        <p className="text-sm text-muted-foreground">
          Cambia el tipo de vínculo en la guía de arriba. Son tendencias de este tipo, no una descripción de la persona.
        </p>
        <ContextLists guide={other.contexts[context]} level={subsub} />
      </Block>

      <Questions profiles={[self, other]} level={sub} />
    </section>
  );
}

function Questions({ profiles, level }: { profiles: RelationshipProfile[]; level: HeadingLevel }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {profiles.map((p) => (
        <Block key={p.type} title={`Preguntas del tipo ${p.type}`} level={level}>
          <ul className="list-disc space-y-1.5 pl-5 marker:text-accent">
            {p.reflectionQuestions.slice(0, QUESTIONS_SHOWN).map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </Block>
      ))}
    </div>
  );
}
