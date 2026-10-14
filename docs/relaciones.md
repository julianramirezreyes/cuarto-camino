# Relaciones

Sección «Relaciones» del resultado (pestaña) y de la biblioteca (`/biblioteca/relaciones` y `/biblioteca/relaciones/[n]`).
Es una guía **descriptiva**: cómo suele vivir cada tipo la amistad, la pareja, la familia y el trabajo, y qué pistas dan los grupos
del símbolo cuando dos personas se encuentran.

## Qué es y qué no es

| Es | No es |
| --- | --- |
| Una guía por tipo y por tipo de vínculo (aporta, necesita, fricciones, sugerencias). | Una medición, una prueba ni una predicción. |
| Una lectura de dos tipos juntos: grupos compartidos, dónde difieren, flechas y alas, siempre como tendencias. | Un puntaje, un porcentaje, un ranking ni una cuadrícula verde/roja de «combinaciones». |
| Preguntas abiertas para conversar. | Una razón para empezar o terminar una relación. |

La interfaz **nunca** muestra puntajes, porcentajes, «mejor/peor pareja», corazones, ni las palabras compatibilidad, compatible,
incompatible, alma gemela o media naranja. Una prueba recorre el texto de todos los componentes y páginas nuevos y falla si aparecen
(`src/tests/forbidden-words.ts`, usada por `forbidden-words.test.tsx`, `pair-panel.test.tsx`, la sección de resultados, las páginas de la
biblioteca y `e2e/11-relaciones.spec.ts`). Las negaciones («esta herramienta no hace un ranking») están permitidas.

## Resumen de la investigación

Fuentes verificadas (todas en `src/content/sources.ts` y en la bibliografía de la biblioteca):

- **The Enneagram Institute, «Relationship Type Combinations»** (Riso y Hudson; consultada el 2026-10-14). Sostiene, en paráfrasis,
  que ningún emparejamiento de tipos es afortunado ni condenado y que el nivel de salud y los instintos informan más que el tipo.
- **Carpenter (2015)**, tesis doctoral, Walden University. 324 parejas casadas: **sin diferencias significativas de satisfacción
  entre tipos**; mayor satisfacción cuando al menos una persona tenía apego seguro. No revisada por pares, estudio transversal.
- **Hook, Hall, Davis, Van Tongeren y Conner (2021)**, revisión sistemática en *Journal of Clinical Psychology*: respaldo empírico
  limitado para el modelo y aún menor para alas y flechas. Verificar los datos de la cita antes de publicar.
- **Palmer (1995)**, *The Enneagram in Love and Work*: tradición narrativa. **Contenido interno sin verificar**; solo se confirmaron
  los datos bibliográficos por catálogos secundarios.

Conclusiones: (1) la propia tradición dice que ninguna pareja de tipos está bendecida ni condenada; (2) **no hay evidencia
revisada por pares y verificada** de que la combinación de tipos prediga la satisfacción; (3) los esquemas populares de
«compatibilidad» se contradicen entre sí.

## Decisiones de diseño

1. **Descriptivo, sin veredictos.** El dominio (`src/domain/enneagram/pair.ts`) devuelve solo hechos estructurales (grupos
   compartidos, flechas, vecindad). No existe un campo de puntaje que se pueda mostrar por error.
2. **Sin ranking.** Ordenar combinaciones sería inventar un dato que ni la tradición ni la investigación sostienen, y los esquemas
   populares ni siquiera coinciden entre sí.
3. **Marco honesto siempre visible.** `RelationshipDisclaimers` («Antes de leer esto», los seis avisos de `lenses.disclaimers`) va
   cerca del inicio, con borde, y **nunca** dentro de una región plegada.
4. **Respaldo limitado explícito.** Los textos de flechas y alas dicen que tienen poco respaldo empírico.
5. **Color nunca es la única señal.** Los grupos del diagrama usan además patrón de trazo, leyenda y nombre accesible.
6. **Contenido fuera del paquete del cliente.** En resultados el servidor solo envía el perfil del tipo principal y las lentes;
   cualquier otro perfil se pide a demanda a los endpoints públicos y se guarda en estado.

## Flujo de datos

```
src/content/relationships/   perfiles por tipo + lentes (borrador editorial)
        │
        ├─ /api/content/relationships/[n]      → { profile }   (Cache-Control: public, max-age=3600; 404 si n no es 1..9)
        ├─ /api/content/relationships/lenses   → RelationshipLenses
        │
        ├─ /resultado (servidor) ──► ResultsView ──► RelationshipsSection  (perfil principal + lentes como props)
        └─ /biblioteca/relaciones/[n] (estático, generateStaticParams 1..9) ──► RelationshipsWorkspace
                                                                                  ├─ RelationshipGuide   (4 vínculos, 4 listas)
                                                                                  └─ PairExplorer        (diagrama → fetch del otro perfil)
                                                                                        └─ PairPanel     (describePair + lentes)
```

- `useRelationshipContent` guarda en estado los perfiles ya pedidos: elegir de nuevo un tipo no vuelve a pedirlo; muestra carga y
  error con «Reintentar».
- En modo exploración (resultados) la pestaña usa el **tipo explorado** como perspectiva, no el del resultado.
- El vínculo elegido (amistad, pareja, familia, trabajo y sociedad) se comparte entre la guía y la lectura del par.

## Cómo ampliarlo

- **Texto de un tipo:** editar `src/content/relationships/type-N.ts`; las pruebas de contenido validan la forma y las palabras
  prohibidas. Mantener el marco de tendencia, nunca de predicción.
- **Una lente nueva** (otro sistema de grupos): añadir el sistema a `GROUP_SYSTEMS` y los textos `shared`/`different` a
  `lenses.ts` (la clave de pares sale de `groupPairKey`); `PairPanel` itera los sistemas, así que no hay que tocar la interfaz.
- **Revisión editorial:** el contenido es `draft`; al pasar a `reviewed` desaparece el aviso «Borrador editorial».
- **Un vínculo nuevo:** ampliar `RelationshipContext` en `src/content/schema.ts` y `src/components/relationships/labels.ts`.
- Si algo nuevo muestra texto, debe pasar la prueba de palabras prohibidas.

## Límites

- Contenido en borrador, pendiente de revisión por especialistas.
- Sin comprobación en dispositivos reales; la accesibilidad se verificó con axe y navegación por teclado.
