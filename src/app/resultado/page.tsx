import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { buildAlternativeSummaries, buildTypeBundle } from "@/app/api/content/type-bundle";
import { RELATIONSHIP_LENSES, RELATIONSHIP_PROFILES } from "@/content/relationships";
import { SiteHeader } from "@/components/layout/site-header";
import { ResultEmpty } from "@/components/results/result-empty";
import { ResultsView } from "@/components/results/results-view";
import { loadLatestResult } from "./load-result";
import { createServerLoaderDeps } from "./server-deps";

export const metadata: Metadata = {
  title: "Tu resultado · Cuarto Camino",
  // Personal, per-visitor content.
  robots: { index: false, follow: false },
};

async function ResultContent() {
  await connection(); // per-user data: never prerender at build time
  const loaded = await loadLatestResult(createServerLoaderDeps());

  let content;
  if (loaded.status === "ready" && loaded.report.primaryType !== null) {
    // Only the slices this report needs are serialized to the client: the main type's bundle
    // and light summaries of the two closest alternatives. Other types load lazily on demand.
    const primary = buildTypeBundle(loaded.report.primaryType);
    const alternatives = buildAlternativeSummaries(
      primary.profile,
      loaded.report.alternatives.slice(1, 3).map((a) => a.type),
    );
    content = (
      <ResultsView
        assessmentId={loaded.assessmentId}
        report={loaded.report}
        meta={loaded.meta}
        primary={primary}
        alternatives={alternatives}
        relationships={{ profile: RELATIONSHIP_PROFILES[loaded.report.primaryType], lenses: RELATIONSHIP_LENSES }}
      />
    );
  } else {
    content = <ResultEmpty reason={loaded.status === "insufficient" ? "insufficient" : "empty"} />;
  }

  return content;
}

export default function ResultPage() {
  // Cache Components: the per-visitor data is read inside Suspense so the static shell can prerender.
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-16 pt-4">
        <Suspense fallback={<p className="py-10 text-center text-muted-foreground">Preparando tu resultado…</p>}>
          <ResultContent />
        </Suspense>
      </main>
    </>
  );
}
