import type { EditorialStatus } from "@/content/schema";

/** Small, unobtrusive marker shown while content has not been reviewed by a specialist. */
export function DraftNotice({ status }: { status: EditorialStatus }) {
  if (status !== "draft") return null;
  return (
    <p className="text-xs text-muted-foreground">
      <span className="rounded border border-border px-1.5 py-0.5">Borrador editorial</span>{" "}
      Contenido pendiente de revisión por especialistas; puede cambiar.
    </p>
  );
}
