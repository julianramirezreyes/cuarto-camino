# Plan de validación del cuestionario

Que la app funcione técnicamente **no** significa que el cuestionario sea válido. Hoy el banco de 150 preguntas, sus puntajes y los
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

1. **Abandono:** en qué pregunta/módulo se abandona; duración total. Meta de diseño de 18–28 preguntas de tipo; hoy una sesión real
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
