import type { Metadata } from "next";
import { DraftNotice } from "@/components/library/draft-notice";
import { LibraryShell } from "@/components/library/library-shell";
import { SubtypeComparison } from "@/components/library/subtype-comparison";
import { TypeNav } from "@/components/library/type-nav";
import { TypeSubnav } from "@/components/library/type-subnav";
import { SUBTYPE_PROFILES } from "@/content/subtypes";
import { TYPE_NAMES } from "@/domain/enneagram/structure";
import { parseTypeParam, typeStaticParams, type TypeParams } from "../../../_lib/parse-type";

export function generateStaticParams() {
  return typeStaticParams();
}

export async function generateMetadata({ params }: TypeParams): Promise<Metadata> {
  const type = parseTypeParam((await params).n);
  return {
    title: `Subtipos del tipo ${type}: ${TYPE_NAMES[type]} · Biblioteca · Cuarto Camino`,
    description: `Los tres subtipos instintivos del tipo ${type} (conservación, social y sexual) y sus diferencias.`,
  };
}

export default async function TypeSubtypesPage({ params }: TypeParams) {
  const type = parseTypeParam((await params).n);
  const subtypes = SUBTYPE_PROFILES.filter((s) => s.type === type);
  const status = subtypes.every((s) => s.status === "reviewed") ? "reviewed" : "draft";
  return (
    <LibraryShell
      crumbs={[
        { label: "Biblioteca", href: "/biblioteca" },
        { label: "Tipos", href: "/biblioteca/tipos" },
        { label: `Tipo ${type}`, href: `/biblioteca/tipos/${type}` },
        { label: "Subtipos" },
      ]}
    >
      <TypeSubnav type={type} current="/subtipos" />
      <header className="space-y-3">
        <h1 className="font-serif text-3xl md:text-4xl">Subtipos del tipo {type} · {TYPE_NAMES[type]}</h1>
        <p className="text-lg text-muted-foreground">
          Tres variantes según el instinto que más colorea al tipo. Son descripciones de escuela (Naranjo, Chestnut) para explorar, no etiquetas: el nombre de cada subtipo es descriptivo y propio de esta biblioteca.
        </p>
        <DraftNotice status={status} />
      </header>
      <SubtypeComparison subtypes={subtypes} />
      <TypeNav type={type} section="/subtipos" />
    </LibraryShell>
  );
}
