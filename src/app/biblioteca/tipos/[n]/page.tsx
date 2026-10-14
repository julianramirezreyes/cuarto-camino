import type { Metadata } from "next";
import { LibraryShell } from "@/components/library/library-shell";
import { TypeNav } from "@/components/library/type-nav";
import { TypeProfileView } from "@/components/library/type-profile-view";
import { TypeSubnav } from "@/components/library/type-subnav";
import { TYPE_PROFILES } from "@/content/types";
import { TYPE_NAMES } from "@/domain/enneagram/structure";
import { parseTypeParam, typeStaticParams, type TypeParams } from "../../_lib/parse-type";

export function generateStaticParams() {
  return typeStaticParams();
}

export async function generateMetadata({ params }: TypeParams): Promise<Metadata> {
  const type = parseTypeParam((await params).n);
  return {
    title: `Tipo ${type}: ${TYPE_NAMES[type]} · Biblioteca · Cuarto Camino`,
    description: TYPE_PROFILES[type].summary,
  };
}

export default async function TypePage({ params }: TypeParams) {
  const type = parseTypeParam((await params).n);
  return (
    <LibraryShell
      crumbs={[
        { label: "Biblioteca", href: "/biblioteca" },
        { label: "Tipos", href: "/biblioteca/tipos" },
        { label: `Tipo ${type}` },
      ]}
    >
      <TypeSubnav type={type} current="" />
      <TypeProfileView type={type} />
      <TypeNav type={type} section="" />
    </LibraryShell>
  );
}
