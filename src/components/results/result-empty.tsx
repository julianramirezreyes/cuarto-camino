import Link from "next/link";

const COPY = {
  empty: {
    title: "Todavía no tienes un resultado",
    body: "Cuando completes la evaluación, tu interpretación aparecerá aquí. Puedes pausarla y retomarla cuando quieras.",
    cta: "Hacer la evaluación",
  },
  insufficient: {
    title: "Aún no podemos ofrecer una lectura",
    body: "Con tus respuestas no hubo evidencia suficiente para ordenar los tipos. No inventamos un resultado: puedes intentarlo de nuevo con calma.",
    cta: "Empezar una nueva evaluación",
  },
} as const;

/** Friendly state for /resultado when there is nothing (valid) to show. */
export function ResultEmpty({ reason }: { reason: keyof typeof COPY }) {
  const c = COPY[reason];
  return (
    <div className="space-y-4 py-10 text-center">
      <h1 className="font-serif text-3xl">{c.title}</h1>
      <p className="mx-auto max-w-md text-muted-foreground">{c.body}</p>
      <Link
        href="/evaluacion"
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-base font-medium text-primary-foreground hover:opacity-90"
      >
        {c.cta}
      </Link>
    </div>
  );
}
