"use client";

import { useState } from "react";
import type { RelationshipContext, RelationshipLenses, RelationshipProfile } from "@/content/schema";
import { PairExplorer } from "./pair-explorer";
import { RelationshipGuide } from "./relationship-guide";
import type { HeadingLevel } from "./heading";

/** The guide of one type plus the pair explorer, sharing the chosen kind of bond. */
export function RelationshipsWorkspace({
  profile,
  lenses,
  level = 2,
}: {
  profile: RelationshipProfile;
  lenses: RelationshipLenses;
  level?: HeadingLevel;
}) {
  const [context, setContext] = useState<RelationshipContext>("friendship");
  return (
    <div className="space-y-10">
      <RelationshipGuide profile={profile} context={context} onContextChange={setContext} level={level} />
      <PairExplorer key={profile.type} self={profile} lenses={lenses} context={context} level={level} />
    </div>
  );
}
