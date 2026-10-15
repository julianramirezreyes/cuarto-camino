# Question bank bias fixes (audit block B)

## Objective
Reduce measurable response biases in the question bank found by the 3-lens audit (2026-10-14), without adding new discriminating content (that is block A, later). Result stays a provisional relative-affinity reading.

## Scope / constraints
- Bank content only: src/content/questions/*, tests, docs/validacion-psicometrica.md, BANK_VERSION -> 1.2.0-draft (once, at the end).
- Spanish question wording (neutral Latin American, tuteo), no type names in question text, no clinical language.
- Strict TDD (RED -> GREEN). Runner: `npx vitest run`. Commit directly to main (user rule), Conventional Commits, no attribution.
- Findings are hypotheses from same-model auditors; verified: all-agree sums (4:16.25 ... 9:10.75). Needs a human specialist before final.

## Tasks
- [x] B1 type: add reverse-keyed scale items (agreement = less of the type), keep equivalence groups consistent
- [x] B2 type: equalize secondary (spillover) mass so all-agree total per type is within +-10% of the mean
- [x] B3 type: reduce social desirability and split double-barreled items (TYPE_LIKERT_INTERVENE_AGAINST_ABUSE, TYPE_INT_AUTHENTIC_OWN_STAMP, TYPE_LIKERT_ANTICIPATE_NEEDS, TYPE_INT_NEED_BACKING, TYPE_INT_DRAINED_BY_AVAILABILITY)
- [x] B4 wing: rewrite neutral 0.3/0.3 options so they are not the main type's typical behaviour
- [x] B5 instinct: balance valence, drop redundant items (INST_LIKERT_INTENSITY_OVER_QUANTITY, INST_LIKERT_HOME_MONEY_HEALTH_SAFE), add non-couple sx / non-material sp / positive so items, 1-2 reverse items, split doubles
- [x] B6 functioning: soften caricatured extreme options (FUNC_SCENARIO_HURTFUL_COMMENT, _OWN_MISTAKE, _PRESSURE_WEEK), remove moral loading
- [x] B7 bump BANK_VERSION 1.2.0-draft, docs, full verification, push

## Acceptance
All unit tests, lint, typecheck green; E2E for questionnaire/results green; new balance tests in bank.test.ts.

## Progress / evidence
(created 2026-10-14)
- B1-B3 done (route: delegated writer, trigger: 2+ non-trivial files), commit 4a3022f. Evidence: vitest 1398 pass, typecheck+eslint green; all-agree totals now {1:13,2:13,3:13,4:13.5,5:13.5,6:13,7:13.5,8:13.5,9:13.25}; RED seen first. Not pushed yet (bank version bump pending B7).
- B4 done (delegated writer), commit a996b6e. vitest 1401 pass; RED on neutral wording + length ratio seen first. Caveat: 'depende' neutrals still score 0.3/0.3.
- B5-B6 done (delegated writer), commit b51a05c. vitest 1413 pass; instinct mass spread <=5% (test). Review: INST_FORCED_TEND_TO_NEGLECT scores a blind spot (design decision, unsourced).
- B7 done: BANK 1.2.0-draft (188 questions), docs updated, full E2E 124 pass, vitest/eslint/typecheck green.
