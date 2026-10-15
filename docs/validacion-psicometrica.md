# Plan de validación del cuestionario

Que la app funcione técnicamente **no** significa que el cuestionario sea válido. Hoy el banco de 200 preguntas (versión `1.3.0-draft`), sus puntajes y los
criterios de parada son **hipótesis de diseño**. Las pruebas automáticas con respondientes simulados (`src/tests/engine-real-bank.test.ts`)
comprueban que el motor converge y que el cableado funciona; **no son evidencia de precisión psicológica**.

Este documento define cómo pasar de «funciona» a «tenemos evidencia razonable». Es un plan, no resultados. No se debe afirmar
ningún porcentaje de acierto hasta completar al menos las fases 1 a 4.

Contexto de evidencia: la literatura revisada sobre el eneagrama es limitada y mixta (ver `hook-2021` en
`src/content/sources.ts`, cuya cita hay que verificar). Esa cautela aplica también al modelo, no solo a nuestro instrumento.

## Fase 0 · Preparación (antes de invitar a nadie)

- Completar el aviso de consentimiento (responsable del tratamiento) y la política de privacidad (Ley 1581 de 2012).
- Etiquetar la versión como **piloto**: «prueba de investigación, resultado provisional».
- Congelar versiones: `engineVersion` y `BANK_VERSION` quedan registradas en cada resultado; no cambiar el banco durante una ronda.
- Definir el canal de retroalimentación (hoy **no existe** formulario dentro de la app; usar una encuesta externa breve).

## Fase 1 · Revisión de contenido por especialistas

Revisores: al menos dos personas con formación en eneagrama (tradición Naranjo / Riso-Hudson / Chestnut) y una con formación en
psicometría o psicología.

- Cada pregunta: ¿se entiende?, ¿evoca el tipo que dice evocar?, ¿es obvia (revela la respuesta)?, ¿sesgo cultural o de género?
- Cada ficha (tipos, alas, 27 subtipos, 81 niveles): contrastar con las fuentes. **Pendientes conocidos:** contratipos de los tipos 1,
  3 y 9; etiquetas tradicionales de subtipos; mecanismos de defensa por escuela; nombres canónicos de niveles (hoy `null`).
- Resultado: cada pregunta/ficha pasa de `draft` a `reviewed` (campos `reviewStatus` / `status`), con registro de qué cambió.

## Fase 2 · Entrevistas cognitivas (5 a 10 personas)

Pensar en voz alta mientras responden. Objetivo: detectar preguntas ambiguas, palabras que no se entienden, opciones que nadie
elige y preguntas que se perciben como moralmente cargadas. Entregable: lista de ajustes de redacción.

## Fase 3 · Piloto con usuarios (meta inicial: 100 a 200 evaluaciones completas)

Datos disponibles hoy en la base (con consentimiento): respuestas por pregunta, resultado completo (`assessment_results.report`),
versión del motor y del banco, fechas. **No** hay analítica de producto ni preguntas de retroalimentación integradas.

Análisis previstos:

1. **Abandono:** en qué pregunta/módulo se abandona; duración total. Meta de diseño de 18–36 preguntas de tipo (el tope subió de 28 a 36 en el motor 1.1.0); hoy una sesión real
   ronda los 35 a 55 en total entre módulos: confirmar si es tolerable.
2. **Calidad de ítems:** frecuencia de cada opción, ítems con una opción dominante (>85 %) o nunca elegida, correlación ítem-total,
   y comparación entre ítems del mismo `equivalenceGroup` (consistencia).
3. **Estabilidad del motor:** distribución del margen entre el 1.º y el 2.º tipo; porcentaje de resultados ambiguos; efecto de
   cambiar una sola respuesta (sensibilidad).
4. **Calibración de pesos y `discrimination`:** reestimar con datos reales; hoy son hipótesis.
5. **Criterios de parada:** revisar `stabilityMargin`, `minEvidencePerCandidate` y límites por módulo con los datos.

## Fase 4 · Autoidentificación y acuerdo

Pedir al participante, **después** del resultado y sin sesgarlo, con qué tipo se identifica (o «no sé») y cuánto lo describe el
informe (escala 1–5). Medir el acuerdo entre tipo calculado y tipo autoidentificado, y entre los dos tipos más cercanos. Es una
señal de validez aparente, no de validez criterial: la autoidentificación también puede estar sesgada.

## Fase 5 · Test-retest

Repetir la evaluación a 2–4 semanas en una submuestra (≥ 40). Medir la estabilidad del tipo principal y de las puntuaciones relativas
(p. ej. kappa para el tipo, correlaciones para las puntuaciones). El módulo de funcionamiento actual **no** debe ser estable por
diseño (mide las últimas 4 semanas): no usarlo como criterio de estabilidad.

## Fase 6 · Validez convergente (si es legítimo)

Comparar con instrumentos existentes **solo si se tiene licencia/permiso** de uso. No copiar ni parafrasear ítems propietarios.

## Fase 7 · Sesgos y equidad

Comparar el desempeño por grupos (edad, género, nivel educativo, país) para detectar funcionamiento diferencial de ítems y
diferencias sistemáticas en la distribución de tipos. Requiere una muestra suficiente y datos demográficos opcionales con
consentimiento explícito (hoy no se recogen).

## Criterios para decir «listo para uso público»

Todos, no solo algunos:

- [ ] Contenido revisado por especialistas (fase 1) y fuentes verificadas.
- [ ] Ajustes de entrevistas cognitivas aplicados (fase 2).
- [ ] Piloto analizado: abandono aceptable, ítems sin defectos graves, resultados ambiguos informados con honestidad (fase 3).
- [ ] Estabilidad test-retest aceptable según un umbral definido **antes** de ver los datos (fase 5).
- [ ] Política de privacidad y tratamiento de datos publicados y revisados legalmente.
- [ ] El informe sigue diciendo «interpretación provisional» y nunca anuncia porcentajes de precisión.

## Ética y datos

- Participación voluntaria, consentimiento explícito, derecho a borrar (la cuenta y los datos se pueden eliminar; ver
  `docs/retencion-y-limites.md`).
- Los invitados caducan a los 30 días de inactividad: **exportar o anonimizar antes** los datos que se quieran analizar, con consentimiento
  específico para investigación (hoy el consentimiento cubre solo calcular y mostrar el resultado).
- No inferir ni mostrar nada de salud mental; el informe lo declara y las fichas de niveles llevan su advertencia.

## Auditoría de sesgos del banco (banco 1.2.0-draft)

En octubre de 2026 se auditó el banco con tres revisiones automáticas (discriminación entre tipos parecidos; ala, instinto y funcionamiento; redacción y estructura). Las hicieron modelos de lenguaje, **no especialistas**: sus hallazgos son hipótesis y los datos numéricos son aritmética sobre la matriz de puntajes, no datos de personas reales.

Cambios aplicados (versión `1.2.0-draft`):

- **Aquiescencia:** las escalas de tipo apuntaban todas en el mismo sentido y el puntaje secundario favorecía a unos tipos. Se añadieron 9 ítems inversos y se igualó el puntaje secundario: quien responde "de acuerdo" a todo suma entre 13 y 13,5 a cada tipo (antes entre 10,75 y 16,25). Hay una prueba que lo exige.
- **Ala:** la opción neutra ya no repite la conducta típica del tipo principal; es un "depende" real.
- **Instinto:** menos extremos en las opciones de social y sexual, sin suponer pareja, dos ítems redundantes reemplazados, ítems inversos y masa de puntaje equilibrada (±5 %).
- **Funcionamiento:** opciones extremas menos caricaturescas y sin carga moral.

Preguntas nuevas (versión `1.3.0-draft`, 12 de elección en el módulo de tipo): preguntan por el *motivo* detrás de conductas parecidas (retirarse, ceder, cumplir normas, reaccionar al fracaso o a la intimidación). Cobertura de preguntas que enfrentan a cada par, antes y después: 7/8 de 0 a 3; 5/6 y 5/9 de 3 a 6; 2/3 de 3 a 5. El motor las usa solo si ayudan a separar los tipos más cercanos de cada persona.

Pendiente: la revisión de un especialista humano, que es lo único que puede validar los puntajes y textos nuevos. Que el motor converja con respondientes sintéticos (la prueba pasa en 268 de 270 corridas para el ala) solo comprueba el cableado, no la validez.
