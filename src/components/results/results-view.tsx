"use client";

import Link from "next/link";
import { lazy, Suspense, useCallback, useState } from "react";
import type { AssessmentReport } from "@/domain/adaptive-engine";
import { TYPE_NAMES, type EnneagramType } from "@/domain/enneagram/structure";
import { Button } from "@/components/ui/button";
import { ResetDialog } from "./reset-dialog";
import { ResultHeader } from "./result-header";
import { SectionTabs, type TabDef } from "./section-tabs";
import { AlternativesSection } from "./sections/alternatives-section";
import { InstinctSection } from "./sections/instinct-section";
import { PersonalitySection } from "./sections/personality-section";
import { DifficultiesSection, GrowthSection, PatternsSection, StrengthsSection } from "./sections/simple-sections";
import { WingSection } from "./sections/wing-section";
import type { AlternativeSummary, RelationshipsBundle, ResultMeta, TypeBundle } from "./types";

// Heavier sections are loaded only when their tab is opened.
const LevelsSection = lazy(() => import("./sections/levels-section").then((m) => ({ default: m.LevelsSection })));
const ConnectionsSection = lazy(() => import("./sections/connections-section").then((m) => ({ default: m.ConnectionsSection })));
const RelationshipsSection = lazy(() => import("./sections/relationships-section").then((m) => ({ default: m.RelationshipsSection })));
const HowSection = lazy(() => import("./sections/how-section").then((m) => ({ default: m.HowSection })));
const BibliographySection = lazy(() => import("./sections/bibliography-section").then((m) => ({ default: m.BibliographySection })));

export interface ResultsViewProps {
  assessmentId: string;
  report: AssessmentReport;
  meta: ResultMeta;
  /** Content of the probable type, pre-sliced on the server. */
  primary: TypeBundle;
  /** The two closest alternatives (positions 2 and 3 of the ranking). */
  alternatives: AlternativeSummary[];
  /** Relationship guide of the probable type and the structural lenses, pre-sliced on the server. */
  relationships: RelationshipsBundle;
}

const ALL_TABS: (TabDef & { ownOnly?: boolean })[] = [
  { id: "personality", label: "Tu personalidad" },
  { id: "alternatives", label: "Tus alternativas", ownOnly: true },
  { id: "wing", label: "Tu ala" },
  { id: "instincts", label: "Tus instintos" },
  { id: "state", label: "Tu estado actual" },
  { id: "patterns", label: "Patrones automáticos" },
  { id: "strengths", label: "Fortalezas" },
  { id: "difficulties", label: "Dificultades" },
  { id: "connections", label: "Conexiones" },
  { id: "relationships", label: "Relaciones" },
  { id: "growth", label: "Dirección de crecimiento" },
  { id: "how", label: "Cómo se obtuvo", ownOnly: true },
  { id: "bibliography", label: "Bibliografía" },
];

type Load = { status: "idle" } | { status: "loading"; type: EnneagramType } | { status: "error"; type: EnneagramType };
type Reset = "idle" | "confirm" | "deleting" | "done";

const Loading = () => <p className="text-muted-foreground">Cargando…</p>;

export function ResultsView({ assessmentId, report, meta, primary, alternatives, relationships }: ResultsViewProps) {
  const [active, setActive] = useState("personality");
  const [viewed, setViewed] = useState<EnneagramType>(primary.type);
  const [bundles, setBundles] = useState<Partial<Record<EnneagramType, TypeBundle>>>({ [primary.type]: primary });
  const [load, setLoad] = useState<Load>({ status: "idle" });
  const [reset, setReset] = useState<Reset>("idle");
  const [resetError, setResetError] = useState<string | null>(null);

  const exploring = viewed !== primary.type;
  const bundle = bundles[viewed] ?? primary;
  const tabs = ALL_TABS.filter((t) => !(exploring && t.ownOnly));
  const activeId = tabs.some((t) => t.id === active) ? active : "personality";

  const selectType = useCallback(
    async (type: EnneagramType) => {
      if (bundles[type]) {
        setViewed(type);
        setLoad({ status: "idle" });
        return;
      }
      setLoad({ status: "loading", type });
      try {
        const res = await fetch(`/api/content/type/${type}`);
        if (!res.ok) throw new Error("load_failed");
        const loaded = (await res.json()) as TypeBundle;
        setBundles((prev) => ({ ...prev, [type]: loaded }));
        setViewed(type);
        setLoad({ status: "idle" });
      } catch {
        setLoad({ status: "error", type });
      }
    },
    [bundles],
  );

  /** From the header or the alternatives tab: show everything about that type, starting at its personality. The page does not scroll: the header already marks the type being read. */
  const exploreType = useCallback(
    (type: EnneagramType) => {
      setActive("personality");
      void selectType(type);
    },
    [selectType],
  );

  const cancelReset = useCallback(() => {
    setReset("idle");
    setResetError(null);
  }, []);

  async function confirmReset() {
    setReset("deleting");
    setResetError(null);
    try {
      const res = await fetch(`/api/assessments/${assessmentId}`, { method: "DELETE" });
      if (res.status !== 204 && !res.ok) throw new Error("delete_failed");
      setReset("done");
    } catch {
      setReset("confirm");
      setResetError("No pudimos reiniciar la evaluación. Tu resultado sigue guardado; inténtalo de nuevo en unos minutos.");
    }
  }

  if (reset === "done") {
    return (
      <div className="space-y-4 py-10 text-center">
        <h1 className="font-serif text-3xl">Evaluación eliminada</h1>
        <p className="text-muted-foreground">Tu resultado y tus respuestas se eliminaron. Puedes empezar de nuevo cuando quieras.</p>
        <Link
          href="/evaluacion"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-base font-medium text-primary-foreground hover:opacity-90"
        >
          Empezar una nueva evaluación
        </Link>
      </div>
    );
  }

  const title = (base: string) => (exploring ? `${base} · tipo ${bundle.type}` : base);

  function renderPanel(id: string) {
    switch (id) {
      case "personality":
        return <PersonalitySection bundle={bundle} title={exploring ? `Personalidad del tipo ${bundle.type}` : "Tu personalidad"} />;
      case "alternatives":
        return <AlternativesSection bundle={primary} report={report} alternatives={alternatives} onExplore={exploreType} />;
      case "wing":
        return <WingSection
            key={bundle.type}
            bundle={bundle}
            wing={exploring ? undefined : report.wing}
            title={title("Tu ala")}
            explorerNote={
              exploring
                ? `Las preguntas de ala se hicieron para tu tipo (${primary.type}), no para el tipo ${bundle.type}, así que no hay una estimación de ala para este tipo. Compara las dos alas y elige la que te resuene.`
                : undefined
            }
          />;
      case "instincts":
        return <InstinctSection key={bundle.type} bundle={bundle} instinct={report.instinct} title={title("Tus instintos")} />;
      case "state":
        return (
          <Suspense fallback={<Loading />}>
            <LevelsSection key={bundle.type} bundle={bundle} functioning={report.functioning} title={title("Tu estado actual")} />
          </Suspense>
        );
      case "patterns":
        return <PatternsSection bundle={bundle} />;
      case "strengths":
        return <StrengthsSection bundle={bundle} />;
      case "difficulties":
        return <DifficultiesSection bundle={bundle} />;
      case "connections":
        return (
          <Suspense fallback={<Loading />}>
            <ConnectionsSection bundle={bundle} onSelectType={selectType} />
          </Suspense>
        );
      case "relationships":
        return (
          <Suspense fallback={<Loading />}>
            <RelationshipsSection type={bundle.type} mainProfile={relationships.profile} lenses={relationships.lenses} />
          </Suspense>
        );
      case "growth":
        return <GrowthSection bundle={bundle} />;
      case "how":
        return (
          <Suspense fallback={<Loading />}>
            <HowSection report={report} meta={meta} />
          </Suspense>
        );
      case "bibliography":
        return (
          <Suspense fallback={<Loading />}>
            <BibliographySection sources={bundle.sources} />
          </Suspense>
        );
      default:
        return null;
    }
  }

  return (
    <div className="space-y-8">
      <ResultHeader
        report={report}
        bundle={primary}
        alternatives={alternatives}
        viewed={viewed}
        onSelectType={exploreType}
        onExplore={() => setActive("connections")}
        onReset={() => setReset("confirm")}
      />
      {exploring ? (
        <div
          role="status"
          aria-label="Explorando otro eneatipo"
          className="flex flex-col gap-3 rounded-xl border border-accent bg-muted p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p>
            Estás explorando el tipo {bundle.type} · {TYPE_NAMES[bundle.type]}. Esto no es tu resultado.
          </p>
          <Button variant="secondary" onClick={() => void selectType(primary.type)}>
            Volver a mi resultado
          </Button>
        </div>
      ) : null}
      {load.status === "loading" ? (
        <p role="status" className="text-muted-foreground">
          Cargando el tipo {load.type}…
        </p>
      ) : null}
      {load.status === "error" ? (
        <div role="alert" className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
          <p>No pudimos cargar el tipo {load.type}. Tu resultado no cambió.</p>
          <Button variant="secondary" onClick={() => void selectType(load.type)}>
            Reintentar
          </Button>
        </div>
      ) : null}
      <SectionTabs tabs={tabs} active={activeId} onChange={setActive} renderPanel={renderPanel} />
      <ResetDialog
        open={reset === "confirm" || reset === "deleting"}
        busy={reset === "deleting"}
        error={resetError}
        onConfirm={() => void confirmReset()}
        onCancel={cancelReset}
      />
    </div>
  );
}
