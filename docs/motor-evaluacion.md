# Motor de evaluación (v1.0.0)

Motor puro y determinista en TypeScript (sin React, Next ni base de datos).

- `src/domain/scoring/`: cálculo de afinidad por tipo (en el código sigue llamándose `compatibility`), ala, instinto, funcionamiento e inconsistencias.
- `src/domain/adaptive-engine/`: selección de la siguiente pregunta, criterios de parada, informe y driver de sesión.
- Contrato de datos: `src/domain/assessment/types.ts`.

## Advertencia principal

Todo `share` que produce el motor es una **afinidad relativa** entre alternativas. **No es una probabilidad calibrada**: no significa "tienes un 45 % de probabilidad de ser tipo 4". Los parámetros (pesos, discriminación, márgenes) son hipótesis de diseño, no valores estimados con datos reales.

## 1. Normalización de respuestas

Antes de puntuar, las respuestas se normalizan (`resolveAnswers`):

1. Se descartan ids de pregunta u opción desconocidos.
2. Se descartan respuestas a preguntas inactivas.
3. Si una pregunta se respondió varias veces, **la última reemplaza a las anteriores**.
4. Se ordenan por posición en el banco, por lo que el resultado **no depende del orden** en que llegaron las respuestas (los redondeos de punto flotante son idénticos).

## 2. Afinidad por tipo

Solo usa preguntas del módulo `type`.

```
raw_t   = Σ  question.weight × option.scores.types[t]
evidencia_t = nº de respuestas cuya opción da puntaje > 0 al tipo t
```

**Regla de desplazar y normalizar** (`relativeShares`):

```
shift     = min(0, min_t raw_t)          // elimina negativos
shifted_t = raw_t − shift
share_t   = (shifted_t + k) / (Σ shifted + 9·k),   k = 0.5 (suavizado)
```

- Sin evidencia todos los tipos valen 1/9.
- El suavizado `k` evita que un tipo quede en 0 por pocos datos.
- Los shares suman 1.
- Orden del ranking: `raw` descendente; **empates: menor número de tipo**.

## 3. Ala

Dado un tipo principal, se comparan sus dos vecinos (`wingsOf`, con envoltura 9↔1). Una pregunta del módulo `wing` sirve a un tipo principal si sus opciones puntúan **ambos** vecinos; así preguntas pensadas para otro tipo no contaminan.

```
margen = |sup − inf| / (sup + inf)
ala probable = vecino ganador si margen ≥ 0.20, si no null
confianza = margen × n / (n + 3)   (n = respuestas de ala con evidencia)
```

La `confianza` se encoge según la cantidad de evidencia: con pocas respuestas, aunque todas coincidan, no llega a 1 (con n = 3 vale 0.5). Es una heurística, no una probabilidad calibrada. El margen decide si se nombra un ala; la confianza solo indica cuánto fiarse.

El tipo principal es el primero del ranking. Sin evidencia de tipo no se informa ala.

## 4. Instinto

Mismo desplazar-y-normalizar sobre `sp/so/sx` (módulo `instinct`). Se informa **solo el instinto dominante**, y únicamente si `share_1 − share_2 ≥ 0.10`. El informe siempre declara `stackConfidence: "dominant-only"`: no se afirma el orden completo del stack porque unas pocas preguntas no lo sostienen.

## 5. Banda de funcionamiento

Desplazar-y-normalizar sobre `flexible / intermediate / maladaptive` (módulo `functioning`, ventana "últimas 4 semanas"). Se informa la banda más apoyada (empates: flexible > intermedia > maladaptiva), una marca `decided` (brecha ≥ 0.10) y la **incertidumbre** = entropía de Shannon normalizada (0 = certeza, 1 = sin información). Es un modelo interpretativo, no una medida clínica.

## 6. Inconsistencias

Dos preguntas respondidas con el mismo `equivalenceGroup` cuyas opciones elegidas tienen **distinto tipo con mayor puntaje** (empate interno: menor tipo) generan una `Inconsistency`. Las opciones sin puntaje de tipo se omiten.

## 7. Selección adaptativa

Módulos en orden fijo: **type → wing → instinct → functioning**. Un módulo termina según su decisión de parada (sección 8). En cada módulo, el conjunto elegible es: preguntas activas, sin responder, **cuyo `equivalenceGroup` no haya sido respondido**, y (en `wing`) que sirvan al tipo principal.

### Fase de cobertura (módulo type, mientras `respondidas < coverageQuestions`)

```
valor(q) = q.weight × Σ_{t tocado por q} 1 / (1 + evidencia_t)
```

Favorece preguntas amplias que suben la evidencia de los tipos menos evidenciados.

### Fase de discriminación

Candidatos = top `candidateCount` del ranking.

```
dispersión(q) = media sobre opciones de (máx − mín del puntaje de los candidatos)
valor(q) = discrimination × weight × dispersión × (1 + 0.25 × candidatos con poca evidencia que q toca)
```

Desempate: valor de cobertura, luego posición en el banco. Esto hace la selección determinista.

### Wing, instinct, functioning

`discrimination × weight × dispersión` entre los dos vecinos / instintos / bandas que van arriba.

## 8. Criterios de parada (`shouldStop`)

Orden de evaluación por módulo:

1. `max-reached`: respondidas ≥ max.
2. `bank-exhausted`: no quedan preguntas elegibles (aunque no se llegue al mínimo).
3. `min-not-reached`: respondidas < min.
4. `stable`: ver abajo.
5. `continue`.

Estabilidad del módulo **type** (las tres condiciones):

- `share_1 − share_2 ≥ stabilityMargin`.
- Cada uno de los `candidateCount` primeros tiene `evidenceCount ≥ minEvidencePerCandidate`.
- **Leave-one-out**: quitando cualquier respuesta individual, el mismo tipo 1 sigue superando al 2 por al menos `ambiguityMargin`. Garantiza que nunca se pare por una sola respuesta decisiva.

Wing, instinct y functioning paran con `stable` cuando su resultado está decidido (ala probable, instinto dominante, banda con brecha suficiente) tras alcanzar el mínimo; si no, siguen hasta el máximo o hasta agotar el banco.

## 9. Informe (`buildReport`)

Incluye: `engineVersion`, `primaryType` (null sin evidencia), `ranking` (9 tipos), `alternatives` (top 3), `ambiguous` (brecha entre 1.º y 2.º < `ambiguityMargin`, o sin evidencia), `inconsistencies`, `moduleCounts`, `wing`, `instinct`, `functioning`, `stop` y `explanation` (frases en español que describen cómo se derivó el resultado e incluyen la aclaración de afinidad relativa).

## 10. Parámetros por defecto (`DEFAULT_ENGINE_CONFIG`)

| Parámetro | Valor |
|---|---|
| `engineVersion` | `1.0.0` |
| tipo (min–max) | 18–28 |
| ala | 4–6 |
| instinto | 6–10 |
| funcionamiento | 8–12 |
| `coverageQuestions` | 8 |
| `candidateCount` | 3 |
| `stabilityMargin` | 0.12 |
| `minEvidencePerCandidate` | 3 |
| `ambiguityMargin` | 0.05 |

Constantes internas (`scoring/params.ts`): suavizado `k = 0.5`, `WING_MARGIN = 0.20`, `INSTINCT_MARGIN = 0.10`, `FUNCTIONING_MARGIN = 0.10`.

## 11. Reanudación y versionado

El motor no guarda estado: la siguiente pregunta es función pura de `(banco, respuestas, config)`. Reproducir las respuestas guardadas (en cualquier orden, salvo respuestas cambiadas sobre la misma pregunta) devuelve la misma pregunta siguiente. Todo informe lleva `engineVersion`; un cambio de fórmulas o parámetros debe subir esa versión.

## 12. Pruebas y limitaciones

- Las pruebas cubren determinismo, consistencia de puntajes, respuestas ausentes o cambiadas, empates, ambigüedad, banco incompleto o agotado, criterios de parada, no repetición de grupos de equivalencia, versionado y reanudación.
- Las pruebas de **estabilidad sintética** simulan respondientes que prefieren mecánicamente un tipo sobre un banco artificial (`src/tests/fixtures/mini-bank.ts`). Verifican que la aritmética del motor converge; **no son evidencia de validez psicológica** ni de confiabilidad del banco real ni del modelo.
- Los pesos, la discriminación y los márgenes no están calibrados con datos reales. Hace falta un estudio empírico (muestras, análisis de ítems, estabilidad test-retest) antes de afirmar precisión.
- El Eneagrama no tiene validación científica sólida como taxonomía de la personalidad; el resultado es una herramienta de autoconocimiento y reflexión, no un diagnóstico.
- Las flechas de integración/estrés y la banda de funcionamiento son modelos interpretativos y varían según la escuela.

## Nota de terminología

Hasta octubre de 2026 la interfaz y las frases del informe decían «compatibilidad relativa». Se cambió a **«afinidad relativa»** para
reservar la palabra «compatibilidad» (que sugiere una predicción sobre parejas) y no mezclarla con la sección de Relaciones, que la
evita a propósito (ver `docs/relaciones.md`). El cambio es solo de redacción: **no cambia ningún cálculo**, por eso `engineVersion` sigue
siendo `1.0.0`. Los identificadores internos (`computeCompatibility`, `Compatibility`) conservan el nombre antiguo. Los informes ya
guardados son inmutables y conservan las frases con la redacción de cuando se generaron.
