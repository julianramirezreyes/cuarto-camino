"use client";

import { useEffect } from "react";
import { RelationshipDisclaimers } from "@/components/relationships/relationship-disclaimers";
import { RelationshipsWorkspace } from "@/components/relationships/relationships-workspace";
import { useRelationshipContent } from "@/components/relationships/use-relationship-content";
import { Button } from "@/components/ui/button";
import type { RelationshipLenses, RelationshipProfile } from "@/content/schema";
import type { EnneagramType } from "@/domain/enneagram/structure";
import { SectionShell } from "../common";

/**
 * Relaciones. `type` is the perspective: the user's type, or the explored one in explorer mode. The server sends
 * only the main type's profile and the lenses; any other perspective is fetched lazily from the public endpoint.
 */
export function RelationshipsSection({
  type,
  mainProfile,
  lenses,
}: {
  type: EnneagramType;
  mainProfile: RelationshipProfile;
  lenses: RelationshipLenses;
}) {
  const content = useRelationshipContent({ profiles: { [mainProfile.type]: mainProfile }, lenses });
  const { load } = content;
  useEffect(() => {
    load(type);
  }, [load, type]);

  const profile = content.profiles[type];
  const status = content.statusOf(type);

  return (
    <SectionShell
      title="Relaciones"
      intro="Cómo suele vivir cada tipo la amistad, la pareja, la familia y el trabajo, y qué pistas dan los grupos del símbolo cuando dos personas se encuentran. Es una guía para conversar, no una medida."
    >
      <RelationshipDisclaimers disclaimers={lenses.disclaimers} level={3} />
      {profile ? (
        <RelationshipsWorkspace profile={profile} lenses={lenses} level={3} />
      ) : status === "error" ? (
        <div role="alert" className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
          <p>No pudimos cargar las relaciones del tipo {type}.</p>
          <Button variant="secondary" onClick={() => load(type)}>
            Reintentar
          </Button>
        </div>
      ) : (
        <p role="status" className="text-muted-foreground">
          Cargando el tipo {type}…
        </p>
      )}
    </SectionShell>
  );
}
