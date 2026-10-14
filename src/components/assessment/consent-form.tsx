"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { LEGAL } from "@/config/legal";
import { LegalNotice } from "@/components/legal/legal-notice";

export function ConsentForm({ onAccept, busy = false }: { onAccept: () => void; busy?: boolean }) {
  const [accepted, setAccepted] = useState(false);
  const checkboxId = useId();

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (accepted && !busy) onAccept();
      }}
    >
      <h1 className="font-serif text-3xl md:text-4xl">Antes de empezar</h1>
      {LEGAL.isPilot ? (
        <div
          role="note"
          aria-label="Versión de prueba"
          className="rounded-2xl border border-accent bg-card p-4 text-sm text-muted-foreground"
        >
          <p className="font-medium text-foreground">Versión de prueba</p>
          <p>
            Estás probando una versión en desarrollo: el contenido es un borrador pendiente de revisión por especialistas y
            el cuestionario no ha sido validado. Tu resultado es una pista para explorar, no una medición confiable.
          </p>
        </div>
      ) : null}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-5 text-muted-foreground">
        <section>
          <h2 className="font-medium text-foreground">Qué guardamos</h2>
          <p>
            Solo tus respuestas y tu avance, para poder calcular tu resultado y dejarte continuar después. No te
            pedimos nombre, correo ni documento para responder.
          </p>
        </section>
        <section>
          <h2 className="font-medium text-foreground">Por qué</h2>
          <p>Únicamente para mostrarte tu resultado y permitirte retomar la evaluación donde la dejaste.</p>
        </section>
        <section>
          <h2 className="font-medium text-foreground">Puedes eliminarlo</h2>
          <p>Puedes pausar, empezar de nuevo y eliminar tus respuestas cuando quieras.</p>
        </section>
        <section>
          <h2 className="font-medium text-foreground">Un resultado provisional</h2>
          <p>
            Lo que obtengas es una hipótesis para explorar, es provisional. No es un diagnóstico ni una evaluación
            clínica.
          </p>
        </section>
        <LegalNotice />
      </div>
      <div className="flex items-start gap-3">
        <input
          id={checkboxId}
          type="checkbox"
          checked={accepted}
          disabled={busy}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-1 size-6 shrink-0 accent-primary"
        />
        <label htmlFor={checkboxId} className="text-base">
          Entiendo lo anterior y autorizo el tratamiento de mis respuestas con este fin.
        </label>
      </div>
      <Button type="submit" disabled={!accepted || busy}>
        {busy ? "Preparando…" : "Comenzar"}
      </Button>
    </form>
  );
}
