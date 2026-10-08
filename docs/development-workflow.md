# Antigravity Development Workflow

## Start Every Session

1. Read `AGENTS.md`, this file, and `docs/antigravity-enhancement-plan.md`.
2. Inspect the current source tree and working diff; do not trust an old task summary.
3. Run `npm.cmd run build` and `npm.cmd run lint`; record baseline failures separately from regressions.
4. Select exactly one smallest incomplete task from the plan.

## Implement Each Task

1. State the user-visible behavior and affected files before editing.
2. Add or update a pure testable function first when business logic changes.
3. Preserve existing Arabic RTL UI and role behavior unless the task explicitly changes it.
4. Keep changes focused; avoid broad rewrites while correctness work is in progress.
5. Verify with targeted checks, then run full build and lint.
6. Update the plan checkbox and write a short note if an assumption or limitation was discovered.

## Stop Conditions

Stop and report instead of guessing when a task requires backend credentials, production authentication, payment, destructive data migration, or a product decision not covered by the spec.

## Definition of Done

A phase is complete only when its acceptance criteria pass, build and lint pass, the affected flow has been manually checked at mobile and desktop widths, and the plan records remaining limitations.

## Restart / Recovery

If work is interrupted, begin with the first unchecked task. Re-run baseline checks, inspect the files named by that task, and repair incomplete partial changes before starting new work. Never mark a task complete based only on an earlier chat message.
