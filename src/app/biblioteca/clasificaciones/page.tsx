import type { Metadata } from "next";
import Link from "next/link";
import { LibraryShell } from "@/components/library/library-shell";
import {
  CENTERS,
  HARMONIC_GROUPS,
  HORNEVIAN_GROUPS,
  INTEGRATION,
  STRESS,
  TYPE_NAMES,
  ENNEAGRAM_TYPES,
} from "@/domain/enneagram/structure";

export const metadata: Metadata = {
  title: "Clasificaciones del eneagrama · Biblioteca · Cuarto Camino",
  description: "Centros, grupos horneviano y armónico, flechas de integración y estrés, y una nota educativa sobre tritipos.",
};

const typeList = (list: readonly number[]) => list.map((n) => `${n}`).join(", ");

const TABLES = [
  {
    id: "centros",
    title: "Centros",
    question: "¿Desde dónde reacciono?",
    rows: [
      ["Instintivo (visceral)", CENTERS.instinctive],
      ["Emocional", CENTERS.emotional],
      ["Mental", CENTERS.mental],
    ],
  },
  {
    id: "horneviano",
    title: "Grupos hornevianos",
    question: "¿Cómo busco lo que necesito? Basados en la idea de Horney de ir hacia, contra o lejos de los demás.",
    rows: [
      ["Asertivos", HORNEVIAN_GROUPS.assertive],
      ["Complacientes", HORNEVIAN_GROUPS.compliant],
      ["Retraídos", HORNEVIAN_GROUPS.withdrawn],
    ],
  },
  {
    id: "armonico",
    title: "Grupos armónicos",
    question: "¿Cómo respondo a la frustración o al conflicto?",
    rows: [
      ["Competencia", HARMONIC_GROUPS.competency],
      ["Perspectiva positiva", HARMONIC_GROUPS.positiveOutlook],
      ["Reactivos", HARMONIC_GROUPS.reactive],
    ],
  },
] as const;

export default function ClassificationsPage() {
  return (
    <LibraryShell crumbs={[{ label: "Biblioteca", href: "/biblioteca" }, { label: "Clasificaciones" }]}>
      <header className="space-y-3">
        <h1 className="font-serif text-3xl md:text-4xl">Clasificaciones</h1>
        <p className="text-lg text-muted-foreground">
          Distintas maneras de agrupar los nueve tipos. Cada agrupación responde a una pregunta diferente y ninguna está demostrada empíricamente.
        </p>
      </header>

      {TABLES.map((t) => (
        <section key={t.id} aria-labelledby={t.id} className="space-y-3">
          <h2 id={t.id} className="font-serif text-2xl">{t.title}</h2>
          <p className="text-muted-foreground">{t.question}</p>
          <ul className="space-y-1.5">
            {t.rows.map(([label, types]) => (
              <li key={label}>
                <strong className="font-medium">{label}:</strong> tipos {typeList(types)}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section aria-labelledby="flechas" className="space-y-3">
        <h2 id="flechas" className="font-serif text-2xl">Flechas de integración y estrés</h2>
        <p className="text-muted-foreground">
          La presentación clásica asigna a cada tipo una dirección de integración (crecimiento) y otra de estrés. Estas lecturas varían entre escuelas: algunas sostienen que ambas direcciones pueden mostrar rasgos sanos y poco sanos, y otras las discuten.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
            <caption className="sr-only">Flechas tradicionales por tipo</caption>
            <thead>
              <tr>
                <th scope="col" className="border-b border-border p-2">Tipo</th>
                <th scope="col" className="border-b border-border p-2">Integración hacia</th>
                <th scope="col" className="border-b border-border p-2">Estrés hacia</th>
              </tr>
            </thead>
            <tbody>
              {ENNEAGRAM_TYPES.map((n) => (
                <tr key={n}>
                  <th scope="row" className="border-b border-border p-2 font-medium">{n} · {TYPE_NAMES[n]}</th>
                  <td className="border-b border-border p-2">{INTEGRATION[n]} · {TYPE_NAMES[INTEGRATION[n]]}</td>
                  <td className="border-b border-border p-2">{STRESS[n]} · {TYPE_NAMES[STRESS[n]]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="tritipos" className="space-y-3">
        <h2 id="tritipos" className="font-serif text-2xl">Nota opcional: tritipos</h2>
        <p className="text-muted-foreground">
          Algunos autores proponen el tritipo, la combinación de un tipo preferido en cada centro. Es una idea educativa y discutida, que se incluye aquí solo como información. La evaluación básica de esta aplicación no infiere un tritipo.
        </p>
      </section>

      <p className="text-sm text-muted-foreground">
        Para el contexto de estas ideas, consulta la <Link href="/biblioteca/historia" className="underline underline-offset-4">historia</Link> y la{" "}
        <Link href="/biblioteca/bibliografia" className="underline underline-offset-4">bibliografía</Link>.
      </p>
    </LibraryShell>
  );
}
