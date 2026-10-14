"use client";

import { useId, useState } from "react";
import { DraftNotice } from "@/components/library/draft-notice";
import { ExpandableCard } from "@/components/library/expandable-card";
import type { RelationshipContext, RelationshipProfile } from "@/content/schema";
import { TYPE_NAMES } from "@/domain/enneagram/structure";
import { ContextLists } from "./context-lists";
import { ContextSelector } from "./context-selector";
import { Heading, below, type HeadingLevel } from "./heading";

/**
 * How one type tends to relate to others, by kind of bond. The context can be controlled by the parent
 * (so the pair reading follows it) or left uncontrolled.
 */
export function RelationshipGuide({
  profile,
  context,
  onContextChange,
  level = 2,
}: {
  profile: RelationshipProfile;
  context?: RelationshipContext;
  onContextChange?: (context: RelationshipContext) => void;
  level?: HeadingLevel;
}) {
  const [inner, setInner] = useState<RelationshipContext>("friendship");
  const uid = useId();
  const active = context ?? inner;
  const change = (next: RelationshipContext) => {
    setInner(next);
    onContextChange?.(next);
  };
  const titleId = `${uid}-title`;

  return (
    <section aria-labelledby={titleId} className="space-y-5">
      <header className="space-y-2">
        <Heading level={level} id={titleId} className="font-serif text-2xl">
          Cómo se relaciona el tipo {profile.type} · {TYPE_NAMES[profile.type]}
        </Heading>
        <p className="text-muted-foreground">{profile.summary}</p>
        <DraftNotice status={profile.status} />
      </header>

      <ContextSelector value={active} onChange={change} />
      <ContextLists guide={profile.contexts[active]} level={below(level)} />

      <ExpandableCard title="Para quien se relaciona con este tipo y preguntas para conversar" subtitle="Incluye qué ayuda saber y qué pasa entre dos personas del mismo tipo">
        <div className="space-y-4">
          <div className="space-y-2">
            <Heading level={below(level)} className="font-medium">Qué ayuda saber</Heading>
            <ul className="list-disc space-y-1.5 pl-5 marker:text-accent">
              {profile.forOthers.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <Heading level={below(level)} className="font-medium">Preguntas para reflexionar o conversar</Heading>
            <ul className="list-disc space-y-1.5 pl-5 marker:text-accent">
              {profile.reflectionQuestions.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <Heading level={below(level)} className="font-medium">Si ambas personas son del tipo {profile.type}</Heading>
            <p>{profile.sameTypeNote}</p>
          </div>
        </div>
      </ExpandableCard>

      <div className="space-y-1 rounded-xl border border-border bg-card p-4">
        <Heading level={below(level)} className="font-medium">Lo que pesa más que el tipo</Heading>
        <p>{profile.caveats}</p>
      </div>
    </section>
  );
}
