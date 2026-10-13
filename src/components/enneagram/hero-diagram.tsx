"use client";

import { useState } from "react";
import { TYPE_NAMES, type EnneagramType } from "@/domain/enneagram/structure";
import { EnneagramDiagram } from "./enneagram-diagram";

export function HeroDiagram() {
  const [selected, setSelected] = useState<EnneagramType | null>(null);
  return (
    <div className="flex flex-col items-center gap-4">
      <EnneagramDiagram selected={selected} onSelect={setSelected} arrows="both" />
      <p aria-live="polite" className="min-h-6 text-center text-sm text-muted-foreground">
        {selected
          ? `Tipo ${selected}: ${TYPE_NAMES[selected]}. Las líneas muestran sus conexiones tradicionales.`
          : "Toca un número para explorar el símbolo."}
      </p>
    </div>
  );
}
