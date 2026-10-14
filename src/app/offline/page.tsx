import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sin conexión · Cuarto Camino",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-serif text-2xl">Sin conexión</h1>
      <p>
        No pudimos conectarnos. La evaluación necesita conexión a internet para guardar tus
        respuestas, así que por ahora no podemos continuarla.
      </p>
      <p>Revisa tu red e inténtalo de nuevo. Lo que ya habías guardado seguirá disponible cuando vuelvas.</p>
      <Link href="/" className="rounded-full border border-current px-5 py-2">
        Reintentar
      </Link>
    </main>
  );
}
