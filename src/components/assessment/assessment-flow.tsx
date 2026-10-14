"use client";

import { ArrowLeft, Pause } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAssessment } from "@/hooks/use-assessment";
import { useRedirectOnDone } from "@/hooks/use-redirect-on-done";
import { ConsentForm } from "./consent-form";
import { PauseDialog } from "./pause-dialog";
import { ProgressHeader } from "./progress-header";
import { QuestionCard } from "./question-card";
import { ResumePrompt } from "./resume-prompt";

export function AssessmentFlow() {
  const router = useRouter();
  const { state, start, restart, select, back, pause, retry, continueExisting, dismissError } = useAssessment();
  const [pauseOpen, setPauseOpen] = useState(false);
  const { status, question, progress } = state;

  const goToResult = useCallback(() => router.push("/resultado"), [router]);
  useRedirectOnDone(status, goToResult);

  const questionVisible = (status === "question" || status === "submitting") && question && progress;

  // Escape opens the pause dialog (the dialog handles its own Escape to close).
  useEffect(() => {
    if (status !== "question" || pauseOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setPauseOpen(true);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [status, pauseOpen]);

  const closePause = useCallback(() => setPauseOpen(false), []);
  const confirmPause = useCallback(() => {
    setPauseOpen(false);
    pause();
  }, [pause]);

  let content;
  if (status === "idle" || status === "loading") {
    content = (
      <p role="status" className="text-muted-foreground">
        Cargando…
      </p>
    );
  } else if (status === "consent") {
    content = <ConsentForm onAccept={start} />;
  } else if (status === "resume" && progress) {
    content = <ResumePrompt progress={progress} onContinue={continueExisting} onRestart={restart} />;
  } else if (status === "paused") {
    content = (
      <div className="space-y-6">
        <h1 className="font-serif text-3xl md:text-4xl">Pausa guardada</h1>
        <p className="text-muted-foreground">
          Tu avance está a salvo. Tómate el tiempo que necesites: cuando quieras seguir, estará esperándote.
        </p>
        <Link
          href="/evaluacion"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-base font-medium text-primary-foreground hover:opacity-90"
        >
          Continuar más tarde
        </Link>
      </div>
    );
  } else if (status === "done") {
    content = (
      <p role="status" className="text-muted-foreground">
        Preparando tu resultado…{" "}
        <Link href="/resultado" className="underline">
          Ir al resultado
        </Link>
      </p>
    );
  } else if (status === "error") {
    content = (
      <div role="alert" className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <p>{state.error}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={retry}>Reintentar</Button>
          {question ? (
            <Button variant="ghost" onClick={dismissError}>
              Volver a la pregunta
            </Button>
          ) : null}
        </div>
      </div>
    );
  } else if (questionVisible) {
    content = (
      <div className="space-y-8">
        <ProgressHeader progress={progress} />
        <QuestionCard
          question={question}
          pendingOptionId={state.pendingOptionId}
          disabled={status === "submitting"}
          onSelect={select}
        />
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={back} disabled={status === "submitting" || progress.answered === 0}>
            <ArrowLeft aria-hidden="true" className="size-4" />
            Anterior
          </Button>
          <Button variant="ghost" onClick={() => setPauseOpen(true)} disabled={status === "submitting"}>
            <Pause aria-hidden="true" className="size-4" />
            Pausar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh]">
      {content}
      <PauseDialog open={pauseOpen} onConfirm={confirmPause} onCancel={closePause} />
    </div>
  );
}
