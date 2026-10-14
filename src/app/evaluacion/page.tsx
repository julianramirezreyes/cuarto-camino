import type { Metadata } from "next";
import { AssessmentFlow } from "@/components/assessment/assessment-flow";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = { title: "Evaluación · Cuarto Camino" };

export default function AssessmentPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-16 pt-4">
        <AssessmentFlow />
      </main>
    </>
  );
}
