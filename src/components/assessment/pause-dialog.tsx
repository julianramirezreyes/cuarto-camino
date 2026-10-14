"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

export interface PauseDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PauseDialog({ open, onConfirm, onCancel }: PauseDialogProps) {
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
        aria-labelledby="pause-title"
        className="w-full max-w-md space-y-4 rounded-2xl border border-border bg-card p-6"
      >
        <h2 id="pause-title" className="font-serif text-2xl">
          ¿Quieres pausar?
        </h2>
        <p className="text-muted-foreground">Guardamos tu avance. Podrás continuar cuando quieras.</p>
        <div className="flex flex-col gap-3 sm:flex-row-reverse">
          <Button onClick={onConfirm}>Pausar y guardar</Button>
          <Button ref={cancelRef} variant="secondary" onClick={onCancel}>
            Seguir respondiendo
          </Button>
        </div>
      </div>
    </div>
  );
}
