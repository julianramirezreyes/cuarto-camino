import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = { title: "Antes de comenzar · Cuarto Camino" };

const points = [
  ["Qué es el eneagrama", "Un modelo que describe nueve patrones de motivación y atención. Es una forma de mirarte, no una verdad sobre ti."],
  ["Qué puede aportar", "Lenguaje y preguntas para observar tus reacciones habituales, tus motivaciones y tus recursos."],
  ["Qué no puede garantizar", "No es un diagnóstico ni una medida de salud mental. Su respaldo científico es limitado y tu resultado es provisional."],
  ["Cómo responder", "Elige lo más espontáneo, lo que haces con más frecuencia y no lo que te gustaría hacer. No hay respuestas buenas ni malas."],
  ["Puedes pausar", "Tu avance se guarda y puedes continuar después. Puedes cambiar respuestas antes de terminar."],
  ["Resultados ambiguos", "Puede que dos o más tipos queden cerca. Te lo diremos y te mostraremos cómo explorarlos."],
  ["Sobre el nombre", "«Cuarto Camino» alude a la tradición de Gurdjieff y Ouspensky, donde apareció el símbolo del eneagrama. Esta aplicación no está afiliada a esa escuela ni la representa, y los nueve tipos no son de Gurdjieff: vienen de autores posteriores."],
  ["Sobre los niveles", "Los niveles de desarrollo describen un funcionamiento más flexible o más rígido en las últimas semanas. No son una evaluación clínica."],
] as const;

export default function IntroductionPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 space-y-8 px-4 pb-16 pt-4">
        <h1 className="font-serif text-3xl md:text-4xl">Antes de comenzar</h1>
        <dl className="space-y-5">
          {points.map(([title, text]) => (
            <div key={title}>
              <dt className="font-medium">{title}</dt>
              <dd className="text-muted-foreground">{text}</dd>
            </div>
          ))}
        </dl>
        <Link
          href="/evaluacion"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-base font-medium text-primary-foreground hover:opacity-90"
        >
          Entiendo, continuar
        </Link>
      </main>
    </>
  );
}
