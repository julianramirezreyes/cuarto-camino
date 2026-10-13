# MVP Autoconocimiento (Eneagrama)

Objective: adaptive enneagram assessment + interactive personal map (PWA, Next.js, Neon, Drizzle).
Strict TDD: enabled (runner: vitest). Delivery strategy: ask-on-risk. Route: delegated direct for content/UI, inline for scaffolding.

## Tasks
- [x] T1 Foundations: Next.js scaffold, Tailwind, lint/prettier, vitest, drizzle config, env example
- [~] T2 Domain model (structure done: arrows, wings, centers, groups; editorial content pending T8): types, 9 types, wings, connections, triads, instincts (typed content)
- [ ] T3 Scoring + adaptive engine (TDD, pure TS, versioned)
- [ ] T4 Question bank (typed, versioned, reviewed-flag)
- [ ] T5 DB schema + migrations + seeds + guest sessions + Better Auth
- [ ] T6 Assessment UX (landing, intro, questionnaire, persistence)
- [ ] T7 Interactive SVG enneagram + results report
- [ ] T8 Editorial content: 9 types, 27 subtypes, 18 wings, 81 levels (delegated writers)
- [ ] T9 PWA, security, a11y, Playwright E2E
- [x] T10 README, docs, pilot validation plan

## Notes
- Neon Auth (@neondatabase/auth 0.6.0-beta) is beta; using Better Auth + Drizzle adapter.
- No Neon credentials yet: build against .env.example; DB-backed flows verified only when DATABASE_URL exists.
