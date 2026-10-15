# New discriminating type questions (audit block A)

## Objective
Add choice questions that separate commonly confused types by MOTIVE (not behaviour), closing the gaps found in the audit: 7/8 had zero discriminating choice questions; 5/6, 5/9, 2/3 had 3 each.

## Scope / constraints
- src/content/questions/type-questions.ts + tests; BANK_VERSION -> 1.3.0-draft (once, at the end); docs.
- Keep earlier bias fixes: per-position balance of leading types, neutral-respondent mass spread, no type names in text, Spanish neutral Latin American, tuteo, honest rationale/refs (existing source ids only).
- Strict TDD. Commit to main. Wording and scores are hypotheses; a specialist must review.

## Tasks
- [x] A1 coverage test (pairs 7/8 >= 3, others in the audit list >= 4 choice questions with both types >= 1.5)
- [x] A2 add 8 audit candidates (refined) + 2-3 extra for 7/8 and 5/6, 5/9
- [x] A3 keep balances (positions, mass), bump bank 1.3.0-draft, docs, full verification, push

## Progress / evidence
(created 2026-10-14)
- A1-A3 done (delegated writer). Coverage 7/8 0->3, 5/6 3->6, 5/9 3->6, 2/3 3->5. Bank 1.3.0-draft (200). Synthetic wing recovery 268/270 (vs 267/270 before). Replaced brittle 3-seed wing assert by rate test (>=95% recovered, <=2% opposite). vitest 1440, E2E 124 pass.
- Block C (inline, small text edits): intro "Sobre el nombre" (no affiliation with the Gurdjieff school, types not from Gurdjieff) and a note in /biblioteca/clasificaciones separating enneagram "centros" from Gurdjieff's theory of centers. RED seen first; vitest 1442, eslint/typecheck clean, E2E smoke+responsive+a11y 54 pass.
