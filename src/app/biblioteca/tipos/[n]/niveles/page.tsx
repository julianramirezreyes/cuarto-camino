import type { Metadata } from "next";
import { DraftNotice } from "@/components/library/draft-notice";
import { LevelStrip } from "@/components/library/level-strip";
import { LibraryShell } from "@/components/library/library-shell";
import { TypeNav } from "@/components/library/type-nav";
import { TypeSubnav } from "@/components/library/type-subnav";
import { LEVEL_PROFILES } from "@/content/levels";
import { TYPE_NAMES } from "@/domain/enneagram/structure";
import { parseTypeParam, typeStaticParams, type TypeParams } from "../../../_lib/parse-type";

export function generateStaticParams() {
  return typeStaticParams();
}

export async function generateMetadata({ params }: TypeParams): Promise<Metadata> {
  const type = parseTypeParam((await params).n);
  return {
    title: `Niveles del tipo ${type}: ${TYPE_NAMES[type]} · Biblioteca · Cuarto Camino`,
    description: `Nueve niveles de funcionamiento del tipo ${type}, de más flexible a más rígido. Modelo interpretativo sin validación clínica.`,
  };
}

export default async function TypeLevelsPage({ params }: TypeParams) {
  const type = parseTypeParam((await params).n);
  const levels = LEVEL_PROFILES.filter((l) => l.type === type);
  const status = levels.every((l) => l.status === "reviewed") ? "reviewed" : "draft";
  return (
    <LibraryShell
      crumbs={[
        { label: "Biblioteca", href: "/biblioteca" },
        { label: "Tipos", href: "/biblioteca/tipos" },
        { label: `Tipo ${type}`, href: `/biblioteca/tipos/${type}` },
        { label: "Niveles" },
      ]}
    >
      <TypeSubnav type={type} current="/niveles" />
      <header className="space-y-3">
        <h1 className="font-serif text-3xl md:text-4xl">Niveles del tipo {type} · {TYPE_NAMES[type]}</h1>
        <p className="text-lg text-muted-foreground">
          Una forma de describir cuánta flexibilidad o rigidez puede tener un mismo patrón en distintos momentos. Es un lenguaje para reflexionar, no una medida de ti.
        </p>
        <DraftNotice status={status} />
      </header>
      <LevelStrip levels={levels} />
      <TypeNav type={type} section="/niveles" />
    </LibraryShell>
  );
}
