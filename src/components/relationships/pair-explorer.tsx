"use client";

import { useId, useState } from "react";
import { EnneagramDiagram } from "@/components/enneagram/enneagram-diagram";
import { GroupSwitcher } from "@/components/enneagram/group-switcher";
import type { GroupMode } from "@/components/enneagram/groups";
import { Button } from "@/components/ui/button";
import type { RelationshipContext, RelationshipLenses, RelationshipProfile } from "@/content/schema";
import type { EnneagramType } from "@/domain/enneagram/structure";
import { Heading, below, type HeadingLevel } from "./heading";
import { PairPanel } from "./pair-panel";
import { useRelationshipContent } from "./use-relationship-content";

/**
 * Pick the other person's type on the diagram (groups visible) to read the pair. The other profile (and the
 * lenses, when not provided) are fetched lazily from the public content endpoints and cached.
 */
export function PairExplorer({
  self,
  lenses: providedLenses,
  context,
  level = 2,
}: {
  self: RelationshipProfile;
  lenses?: RelationshipLenses;
  context: RelationshipContext;
  level?: HeadingLevel;
}) {
  const uid = useId();
  const [other, setOther] = useState<EnneagramType | null>(null);
  const [groups, setGroups] = useState<GroupMode>("centers");
  const content = useRelationshipContent({ profiles: { [self.type]: self }, lenses: providedLenses });

  function select(type: EnneagramType) {
    setOther(type);
    content.load(type);
  }

  const status = other === null ? "idle" : content.statusOf(other);
  const otherProfile = other === null ? undefined : content.profiles[other];
  const lenses = content.lenses;
  const titleId = `${uid}-title`;

  return (
    <section aria-labelledby={titleId} className="space-y-5">
      <header className="space-y-2">
        <Heading level={level} id={titleId} className="font-serif text-2xl">
          Explora el vínculo con otro tipo
        </Heading>
        <p className="text-muted-foreground">
          Elige en el símbolo el tipo de la otra persona; si es el mismo que el tuyo, elige también ese. Las líneas y los trazos agrupan los tipos
          según tres sistemas tradicionales. Sirve para conversar, no para evaluar a nadie.
        </p>
      </header>

      <div className="grid items-start gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <GroupSwitcher value={groups} onChange={setGroups} />
          <EnneagramDiagram selected={other} onSelect={select} groups={groups} className="mx-auto" />
        </div>
        <div className="space-y-4" aria-live="polite">
          {other === null ? (
            <p className="rounded-xl border border-dashed border-border p-4 text-muted-foreground">
              Toca un punto del símbolo para ver cómo se leen juntos el tipo {self.type} y el tipo que elijas.
            </p>
          ) : null}
          {status === "loading" ? <p role="status" className="text-muted-foreground">Cargando el tipo {other}…</p> : null}
          {status === "error" && other !== null ? (
            <div role="alert" className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
              <p>No pudimos cargar el tipo {other}. Lo que ya estabas leyendo no cambió.</p>
              <Button variant="secondary" onClick={() => content.load(other)}>
                Reintentar
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      {status === "idle" && otherProfile && lenses ? (
        <PairPanel self={self} other={otherProfile} lenses={lenses} context={context} level={below(level)} />
      ) : null}
    </section>
  );
}
