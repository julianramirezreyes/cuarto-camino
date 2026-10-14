import Link from "next/link";
import { HeroDiagram } from "@/components/enneagram/hero-diagram";
import { SiteHeader } from "@/components/layout/site-header";

const linkButton =
  "inline-flex min-h-12 items-center justify-center rounded-full px-6 text-base font-medium transition-colors";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto grid w-full max-w-5xl flex-1 gap-10 px-4 pb-16 pt-6 md:grid-cols-2 md:items-center">
        <section className="space-y-6">
          <p className="text-sm uppercase tracking-[0.2em] text-accent">Autoconocimiento</p>
          <h1 className="font-serif text-4xl leading-tight md:text-5xl">
            Descubre tus patrones. Comprende tus motivaciones.
          </h1>
          <p className="text-lg text-muted-foreground">
            Una evaluación adaptativa basada en el eneagrama que se ajusta a tus respuestas y termina en un mapa
            interactivo para explorar tu tipo, tu ala, tus instintos y tu momento actual.
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Tipos afines y por qué aparecen</li>
            <li>• Alas, instintos y niveles de funcionamiento</li>
            <li>• Conexiones, tríadas y preguntas de autoobservación</li>
          </ul>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/introduccion" className={`${linkButton} bg-primary text-primary-foreground hover:opacity-90`}>
              Comenzar mi descubrimiento
            </Link>
            <Link href="/biblioteca" className={`${linkButton} border border-control bg-card text-foreground hover:bg-muted`}>
              Explorar la biblioteca
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            Duración estimada: 15 a 25 minutos, con opción de pausar. No necesitas cuenta. El resultado es una
            interpretación provisional, no un diagnóstico, y el eneagrama es un modelo con evidencia científica limitada.
          </p>
        </section>
        <section aria-label="Símbolo interactivo del eneagrama">
          <HeroDiagram />
        </section>
      </main>
    </>
  );
}
