import type { RelationshipContext } from "@/content/schema";

export const CONTEXTS: readonly RelationshipContext[] = ["friendship", "partner", "family", "work"];

/** Button label of each kind of bond. */
export const CONTEXT_LABELS: Record<RelationshipContext, string> = {
  friendship: "Amistad",
  partner: "Pareja",
  family: "Familia",
  work: "Trabajo y sociedad",
};
