# MVP Autoconocimiento (Eneagrama)

Objective: adaptive enneagram assessment + interactive personal map (PWA, Next.js, Neon, Drizzle).
Strict TDD: enabled (runner: vitest). Delivery strategy: ask-on-risk. Route: delegated direct for content/UI, inline for scaffolding.

## Tasks
- [x] T1 Foundations: Next.js scaffold, Tailwind, lint/prettier, vitest, drizzle config, env example
- [x] T2 Domain model: types, 9 types, wings, connections, triads, instincts (typed content)
- [x] T3 Scoring + adaptive engine (TDD, pure TS, versioned)
- [x] T4 Question bank (typed, versioned, reviewed-flag)
- [~] T5 DB schema/migrations/seeds/guest/auth factory DONE; claim transaction + Neon verification PENDING
- [x] T6 Assessment UX (landing, intro, questionnaire, persistence)
- [x] T7 Interactive SVG enneagram + results report
- [x] T8 Editorial content: 9 types, 27 subtypes, 18 wings, 81 levels (delegated writers)
- [~] T9 PWA + security headers + account done; a11y partial (contrast fixed, no Lighthouse/screen reader); Playwright E2E NOT done
- [ ] T10 README, env docs, deployment guide, pilot validation plan (NOT done: README is still the create-next-app default; wrongly checked earlier by an over-broad sed)

## Notes
- Neon Auth (@neondatabase/auth 0.6.0-beta) is beta; using Better Auth + Drizzle adapter.
- No Neon credentials yet: build against .env.example; DB-backed flows verified only when DATABASE_URL exists.

## Evidence
- Engine + real bank (synthetic respondents, wiring only): 35-40 questions/session; wing module gets 3 questions (target 4-6) -> add wing questions.
- All editorial content is draft; countertypes for 1/3/9 unresolved; sources need verification.
- Commits: 1fc0451 db, c421690 engine, 097a24b bank, 906e1cd wings, 8d47ecc types, a0aa7de subtypes, 4672fa2 levels
- Neon project `cuarto-camino` (id late-poetry-51140321, aws-us-east-1, PG18) created via Neon MCP. Migration 0000_init applied (17 tables) and registered in drizzle.__drizzle_migrations.
- Verified on real Postgres (rolled-back DO block): single_owner, consent_required, completed_at/status, token_hash shape CHECKs; FK; unique answer; guest->assessments->answers cascade. Not yet verified: seed script, Drizzle repository SQL via the app, Better Auth sign-up.
- Blocked: agent cannot write .env.local (permission settings). User must create it with DATABASE_URL, AUTH_SECRET, BETTER_AUTH_URL, APP_URL.
