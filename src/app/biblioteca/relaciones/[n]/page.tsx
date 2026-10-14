import type { Metadata } from "next";
import Link from "next/link";
import { LibraryShell } from "@/components/library/library-shell";
import { TypeNav } from "@/components/library/type-nav";
import { RelationshipDisclaimers } from "@/components/relationships/relationship-disclaimers";
import { RelationshipsWorkspace } from "@/components/relationships/relationships-workspace";
import { RELATIONSHIP_LENSES, getRelationship } from "@/content/relationships";
import { TYPE_NAMES } from "@/domain/enneagram/structure";
import { parseTypeParam, typeStaticParams, type TypeParams } from "../../_lib/parse-type";

export function generateStaticParams() {
  return typeStaticParams();
}

export async function generateMetadata({ params }: TypeParams): Promise<Metadata> {
  const type = parseTypeParam((await params).n);
  return {
    title: `Tipo ${type}: ${TYPE_NAMES[type]} en las relaciones · Biblioteca · Cuarto Camino`,
    description: getRelationship(type).summary,
  };
}

export default async function TypeRelationshipsPage({ params }: TypeParams) {
  const type = parseTypeParam((await params).n);
  const profile = getRelationship(type);
  return (
    <LibraryShell
      crumbs={[
        { label: "Biblioteca", href: "/biblioteca" },
        { label: "Relaciones", href: "/biblioteca/relaciones" },
        { label: `Tipo ${type}` },
      ]}
    >
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-accent">Relaciones</p>
        <h1 className="font-serif text-3xl md:text-4xl">
          Tipo {type} · {TYPE_NAMES[type]} en las relaciones
        </h1>
        <p className="text-lg text-muted-foreground">
          Tendencias de este tipo en la amistad, la pareja, la familia y el trabajo. No describen a ninguna persona en particular.
        </p>
      </header>
      <RelationshipDisclaimers disclaimers={RELATIONSHIP_LENSES.disclaimers} />
      <RelationshipsWorkspace profile={profile} lenses={RELATIONSHIP_LENSES} />
      <p className="text-sm text-muted-foreground">
        El perfil completo del tipo está en{" "}
        <Link href={`/biblioteca/tipos/${type}`} className="underline underline-offset-4">
          Tipo {type} · {TYPE_NAMES[type]}
        </Link>
        .
      </p>
      <TypeNav type={type} section="" base="/biblioteca/relaciones" />
    </LibraryShell>
  );
}
