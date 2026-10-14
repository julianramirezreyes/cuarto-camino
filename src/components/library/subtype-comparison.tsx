import type { SubtypeProfile } from "@/content/schema";
import type { Instinct } from "@/domain/enneagram/structure";
import { BulletList } from "./common";
import { DraftNotice } from "./draft-notice";
import { ExpandableCard } from "./expandable-card";

export const INSTINCT_LABEL: Record<Instinct, string> = {
  sp: "Conservación",
  so: "Social",
  sx: "Sexual (uno a uno)",
};

const ROWS: [string, (s: SubtypeProfile) => string][] = [
  ["Qué lo mueve", (s) => s.motivations[0]],
  ["Cómo se nota por fuera", (s) => s.outerManifestations[0]],
  ["Qué necesita", (s) => s.needs[0]],
  ["Qué teme", (s) => s.fears[0]],
  ["Dificultad posible", (s) => s.difficulties[0]],
];

export function SubtypeComparison({ subtypes }: { subtypes: SubtypeProfile[] }) {
  return (
    <div className="space-y-8">
      <section aria-labelledby="comparacion-title" className="space-y-3">
        <h2 id="comparacion-title" className="font-serif text-2xl">Diferencias lado a lado</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <caption className="pb-2 text-left text-muted-foreground">
              Un rasgo representativo de cada subtipo. Despliega las fichas para ver el detalle.
            </caption>
            <thead>
              <tr>
                <th scope="col" className="border-b border-border p-2"><span className="sr-only">Aspecto</span></th>
                {subtypes.map((s) => (
                  <th key={s.instinct} scope="col" className="border-b border-border p-2 align-bottom">
                    {INSTINCT_LABEL[s.instinct]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([label, pick]) => (
                <tr key={label}>
                  <th scope="row" className="border-b border-border p-2 align-top font-medium">{label}</th>
                  {subtypes.map((s) => (
                    <td key={s.instinct} className="border-b border-border p-2 align-top text-muted-foreground">{pick(s)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="fichas-title" className="space-y-3">
        <h2 id="fichas-title" className="font-serif text-2xl">Fichas de los tres subtipos</h2>
        <div className="space-y-3">
          {subtypes.map((s) => (
            <ExpandableCard
              key={s.instinct}
              title={`${INSTINCT_LABEL[s.instinct]} · ${s.name}`}
              subtitle={s.countertype.isCountertype ? "Contratipo en la tradición de Naranjo" : undefined}
            >
              <p>{s.description}</p>
              <p className="text-sm text-muted-foreground">{s.countertype.note}</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5"><h4 className="font-medium">Motivaciones</h4><BulletList items={s.motivations} /></div>
                <div className="space-y-1.5"><h4 className="font-medium">Por fuera</h4><BulletList items={s.outerManifestations} /></div>
                <div className="space-y-1.5"><h4 className="font-medium">Por dentro</h4><BulletList items={s.innerBehaviors} /></div>
                <div className="space-y-1.5"><h4 className="font-medium">Necesidades</h4><BulletList items={s.needs} /></div>
                <div className="space-y-1.5"><h4 className="font-medium">Temores</h4><BulletList items={s.fears} /></div>
                <div className="space-y-1.5"><h4 className="font-medium">Fortalezas</h4><BulletList items={s.strengths} /></div>
                <div className="space-y-1.5"><h4 className="font-medium">Dificultades</h4><BulletList items={s.difficulties} /></div>
                <div className="space-y-1.5"><h4 className="font-medium">Prácticas de autoobservación</h4><BulletList items={s.selfObservationPractices} /></div>
              </div>
              <p><strong className="font-medium">Frente a los otros subtipos:</strong> {s.differencesFromOtherSubtypes}</p>
              <p><strong className="font-medium">En las relaciones:</strong> {s.inRelationships}</p>
              <p><strong className="font-medium">En el trabajo:</strong> {s.atWork}</p>
              <DraftNotice status={s.status} />
            </ExpandableCard>
          ))}
        </div>
      </section>
    </div>
  );
}
