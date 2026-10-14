import type { AssessmentReport } from "@/domain/adaptive-engine";
import { BulletList, Card, SectionShell } from "../common";
import type { ResultMeta } from "../types";
import { modernizeLegacyWording } from "../legacy-wording";

const MODULE_ES = { type: "Tipo", wing: "Ala", instinct: "Instinto", functioning: "Funcionamiento" } as const;

const LIMITATIONS = [
  "Es un cuestionario breve y de autoinforme: refleja cómo te viste al responder, en un momento concreto.",
  "Los puntajes internos no son probabilidades calibradas: no miden “qué tan probable” es que seas de un tipo.",
  "El contenido editorial está en revisión y las lecturas varían entre escuelas del eneagrama.",
  "No es un diagnóstico ni una evaluación clínica, y no sustituye la mirada de un profesional.",
];

/** K · Cómo se obtuvo tu resultado. */
export function HowSection({ report, meta }: { report: AssessmentReport; meta: ResultMeta }) {
  const date = new Date(meta.completedAt).toLocaleDateString("es", { dateStyle: "long", timeZone: "UTC" });
  return (
    <SectionShell title="Cómo se obtuvo tu resultado" intro="Transparencia sobre el proceso y sus límites.">
      <Card title="Resumen del proceso">
        <ul className="space-y-1.5">
          {report.explanation.map((rawLine) => {
            const line = modernizeLegacyWording(rawLine);
            return <li key={line}>{line}</li>;
          })}
        </ul>
      </Card>
      <Card title="Respuestas por módulo">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-muted-foreground">
              <th scope="col" className="py-1 font-medium">Módulo</th>
              <th scope="col" className="py-1 font-medium">Respuestas</th>
            </tr>
          </thead>
          <tbody>
            {(Object.keys(MODULE_ES) as (keyof typeof MODULE_ES)[]).map((m) => (
              <tr key={m} className="border-t border-border">
                <th scope="row" className="py-1.5 font-normal">{MODULE_ES[m]}</th>
                <td className="py-1.5 tabular-nums">{report.moduleCounts[m]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {report.inconsistencies.length > 0 ? (
        <Card title="Inconsistencias detectadas">
          <ul className="space-y-1.5">
            {report.inconsistencies.map((i) => (
              <li key={i.groupId}>{i.note}</li>
            ))}
          </ul>
        </Card>
      ) : null}
      <Card>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Limitaciones</h3>
        <BulletList items={LIMITATIONS} />
      </Card>
      <p className="text-sm text-muted-foreground">
        Completado el {date} · motor {meta.engineVersion} · banco {meta.bankVersion}.
      </p>
    </SectionShell>
  );
}
