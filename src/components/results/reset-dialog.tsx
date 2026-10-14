"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

export interface ResetDialogProps {
  open: boolean;
  busy: boolean;
  error: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Confirmation before deleting the assessment (the DELETE itself is done by the caller). */
export function ResetDialog({ open, busy, error, onConfirm, onCancel }: ResetDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    cancelRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus?.();
    };
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 p-4 backdrop-blur-sm sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-title"
        aria-describedby="reset-desc"
        className="w-full max-w-md space-y-4 rounded-2xl border border-border bg-card p-6"
      >
        <h2 id="reset-title" className="font-serif text-2xl">
          ¿Reiniciar la evaluación?
        </h2>
        <p id="reset-desc" className="text-muted-foreground">
          Se eliminará este resultado y tus respuestas. Podrás hacer una evaluación nueva cuando quieras. Esta acción no se puede deshacer.
        </p>
        {error ? (
          <p role="alert" className="text-sm text-foreground">
            {error}
          </p>
        ) : null}
        <div className="flex flex-col gap-3 sm:flex-row-reverse">
          <Button onClick={onConfirm} disabled={busy}>
            {busy ? "Reiniciando…" : "Sí, reiniciar"}
          </Button>
          <Button ref={cancelRef} variant="secondary" onClick={onCancel} disabled={busy}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
