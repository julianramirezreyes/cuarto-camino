# Grupos en el diagrama y sección de relaciones

Objective: (1) show the three-triad groupings subtly on every enneagram diagram; (2) research whether the enneagram has
relationship/"compatibility" frameworks and, if sound, add an honest "Relaciones" section (friendship, society/work, family,
partner) to the results and library.
Strict TDD: enabled (vitest). Delivery: direct commits to main (user's standing preference). Route: inline for the diagram,
delegated read-only research, delegated writers for content.

## Tasks
- [x] T1 Groups on the diagram: centers as arcs (contiguous), Hornevian/harmonic as markers, legend, switcher, a11y labels, tokens
- [x] T2 Research: relationship frameworks in the enneagram tradition + empirical evidence (read-only agent)
- [x] T3 Domain: pure pair-dynamics derived from structure (shared/different groups, arrows, wings) + tests
- [ ] T4 Content: per-type relationship profiles (friendship, work/society, family, partner), draft, sourced
- [ ] T5 UI: "Relaciones" tab in results + library section; pair explorer via the diagram
- [ ] T6 E2E + docs + README

## Notes
- The three groupings: centers (8,9,1 / 2,3,4 / 5,6,7), Hornevian (3,7,8 / 1,2,6 / 4,5,9), harmonic (1,3,5 / 2,7,9 / 4,6,8).
- Only centers are contiguous on the circle (arcs); the other two need per-node markers. Never rely on color alone.
- No ranking of "most compatible" types; no deterministic claims; present as conversation starters.

## Research findings (2026-10-14, verified by fetch where noted)
- Tradition: Palmer 1995 (book on love and work relationships; catalog data only), Enneagram Institute pair pages (verified: no pairing blessed
  or doomed; health level and instincts matter more than type).
- Evidence: no peer-reviewed study found that the pair of types predicts satisfaction. Carpenter 2015 (Walden Ph.D., 324 couples,
  verified): no difference by type; secure attachment mattered. Hook et al. 2021 review: limited evidence for the model, little for wings/arrows.
- Popular "compatible pairs" charts contradict each other (no consensus, no data) -> never rank pairs, never show 9x9 green/red grids.
- Design: descriptive per-type relationship guides (4 contexts) + structural overlay from groups/arrows/wings; reflection questions; disclaimers.
