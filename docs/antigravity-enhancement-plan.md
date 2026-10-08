# Ghazara Sales App Enhancement Plan

> **For agentic workers:** Read `AGENTS.md`, `docs/product-spec.md`, and `docs/architecture.md` before implementation. Execute one task at a time, verify it, and continue from the first unchecked task after any restart.

**Goal:** Turn the current seeded React prototype into a reliable, testable Arabic RTL MVP without prematurely introducing a backend.

**Architecture:** Stabilize the existing context-driven client architecture first by extracting pure domain calculations, validation, and current-period logic. Then harden role-scoped workflows and responsive UX. Keep persistence behind a small repository boundary so a future API can replace localStorage without rewriting feature views.

**Tech stack:** React 19, TypeScript, Vite, Tailwind CSS, Lucide React, browser localStorage during MVP.

**Spec:** `docs/product-spec.md`

## Global Constraints

- Preserve Arabic RTL and the existing dark/purple/orange visual language.
- Keep role boundaries enforced in data selectors, actions, and navigation.
- No production auth, payment, or backend integration in this plan.
- Use `npm.cmd run build` and `npm.cmd run lint` on Windows.
- Do not use hard-coded October 2026 period logic after Phase 1.

## Review Focus

- Invalid donation input or unknown charity/marketer: reject atomically with no partial updates.
- Cross-role data access: verify marketer and charity representative never receive unscoped records.
- Payroll lifecycle: paid records cannot be reverted or paid without approval.
- New month/year: targets and payroll use the active period, not hard-coded `10/2026`.
- Mobile RTL interaction: modal, table, navigation, and forms remain usable at narrow widths.

---

## Phase 0 — Baseline and recovery

### Task 0.1: Establish a verified baseline

**Files:** no source changes; update this plan’s Notes section.

- [x] Run `npm.cmd run build`.
- [x] Run `npm.cmd run lint`.
- [x] Record exact failures and classify each as pre-existing or introduced.
- [x] Start the app with `npm.cmd run dev` and manually verify seeded dashboard, role switcher, donation modal, and mobile navigation.

**Exit:** baseline is recorded and the first failing behavior is identified.

## Phase 1 — Domain correctness

### Task 1.1: Extract period and financial calculations

**Files:**
- Create: `src/domain/period.ts`
- Create: `src/domain/finance.ts`
- Modify: `src/context/AppContext.tsx`
- Modify: `src/types/index.ts` only if a missing domain type is required

- [x] Add `getActivePeriod(date: Date): { month: number; year: number }`.
- [x] Add pure functions `calculateAchievement(achieved: number, target: number): number`, `getTargetStatus(percentage: number): MonthlyTarget['status']`, `calculatePayroll(input): Pick<PayrollRecord, 'commissionAmount' | 'bonusAmount' | 'netSalary'>`.
- [x] Centralize the existing bonus thresholds and preserve the current business values unless product clarification changes them.
- [x] Replace every hard-coded `month === 10 && year === 2026` mutation path with the active-period helper.
- [x] Add focused tests for zero/negative target, 0%, 100%, 110%, and 115% achievement boundaries.
- [x] Run build, lint, and the focused tests.

**Exit:** one source of truth exists for period, achievement, commission, bonus, and net salary calculations.

### Task 1.2: Add atomic donation validation and mutation preparation

**Files:**
- Create: `src/domain/donations.ts`
- Modify: `src/context/AppContext.tsx`
- Modify: `src/components/donations/NewDonationModal.tsx`

- [x] Add `validateDonationInput(input, state): string[]` covering amount, charity, marketer, and charity assignment.
- [x] Add `prepareDonation(input, now, sequence): Donation` with deterministic receipt generation.
- [x] Validate before any state setter runs; invalid submissions show Arabic errors and leave all arrays unchanged.
- [x] Ensure receipt IDs cannot collide after deletions or reloads.
- [x] Add tests for valid input, invalid amount, invalid references, and marketer/charity mismatch.
- [x] Run build, lint, and focused tests.

**Exit:** donation creation is all-or-nothing and its identifiers are stable enough for the MVP.

## Phase 2 — Access and lifecycle hardening

### Task 2.1: Make role-scoped capabilities explicit

**Files:**
- Create: `src/domain/access.ts`
- Modify: `src/context/AppContext.tsx`
- Modify: `src/components/layout/Sidebar.tsx`
- Modify: `src/components/layout/MobileNavbar.tsx`

- [x] Add pure selectors/capability checks for each role.
- [x] Route all user-visible lists and AI context through scoped selectors.
- [x] Hide or disable actions that the role cannot perform, while retaining context-level guards.
- [x] Add tests proving marketer and charity representative isolation.
- [x] Remove raw collections from the public `AppContext` value so Views cannot consume them accidentally.
- [x] Resolve an invalid or stale `activeTab` to the first tab allowed for the current role.

**Exit:** access behavior is centralized, testable, and consistent across desktop/mobile navigation.

### Task 2.2: Enforce payroll state transitions

**Files:**
- Create: `src/domain/payroll.ts`
- Modify: `src/context/AppContext.tsx`
- Modify: `src/components/payroll/PayrollView.tsx`

- [x] Add `canTransitionPayroll(from, to)` and reject invalid transitions.
- [x] Require `approved` before `paid`; make `paid` terminal for ordinary UI actions.
- [x] Ensure bulk actions use the same transition function as row actions.
- [x] Add tests for draft→reviewed→approved→paid and rejected reverse transitions.

**Exit:** payroll lifecycle rules are enforced uniformly.

## Phase 3 — Persistence and UX reliability

### Task 3.1: Introduce a typed local repository boundary

**Files:**
- Create: `src/storage/appRepository.ts`
- Modify: `src/context/AppContext.tsx`
- Create: `src/storage/appRepository.test.ts` if test tooling is available

- [ ] Wrap localStorage reads/writes with typed keys, JSON parse fallback, and versioned state.
- [ ] Add a reset-demo-data action for development/demo recovery.
- [ ] Prevent malformed localStorage from crashing first render.
- [ ] Keep repository interfaces independent of React so a future API adapter can replace it.

**Exit:** persistence failures recover safely and the context no longer owns raw storage details.

### Task 3.2: Improve responsive and accessible interaction

**Files:**
- Modify: `src/components/donations/NewDonationModal.tsx`
- Modify: `src/components/donations/DonationsView.tsx`
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/Sidebar.tsx`
- Modify: `src/index.css` and/or `src/App.css`

- [ ] Verify keyboard focus, Escape close, labels, error announcements, and focus-visible states.
- [ ] Verify tables have a narrow-screen strategy and do not require hover.
- [ ] Verify mobile bottom navigation does not cover content or modal actions.
- [ ] Verify Arabic text, currency formatting, and RTL ordering at mobile and desktop widths.
- [ ] Run a manual smoke checklist and build/lint.

**Exit:** core workflows are usable without mouse hover and at mobile widths.

## Phase 4 — Operational completeness

### Task 4.1: Harden exports and dashboard consistency

**Files:**
- Modify: `src/utils/exportUtils.ts`
- Modify: `src/components/donations/DonationsView.tsx`
- Modify: `src/components/dashboard/DashboardView.tsx`

- [ ] Ensure export uses the currently role-scoped and filtered dataset.
- [ ] Normalize dates, currency, and Arabic column labels in exported output.
- [ ] Reconcile dashboard KPI calculations with the same domain selectors used by lists.
- [ ] Add tests for filters and export row counts.

**Exit:** displayed KPIs and exported data agree for each role.

### Task 4.2: Add a release smoke checklist and document MVP limits

**Files:**
- Modify: `README.md`
- Create: `docs/release-checklist.md`

- [ ] Document setup, demo roles, reset behavior, and localStorage limitations.
- [ ] Add a repeatable checklist for admin, marketer, and charity representative flows.
- [ ] Record known limitations: no real auth, no server sync, no audit log, and demo-only AI behavior unless separately implemented.
- [ ] Run final build and lint and attach the output to the release note.

**Exit:** another developer can run and verify the MVP without relying on chat history.

## Definition of Done

- [ ] All phase exit criteria pass.
- [ ] `npm.cmd run build` passes.
- [ ] `npm.cmd run lint` passes.
- [ ] Focused domain/access/lifecycle tests pass if test tooling has been added.
- [ ] Manual smoke checklist passes for all three roles at mobile and desktop widths.
- [ ] No task is marked complete without verified files and checks.

## Notes

- Baseline captured during restart: direct `npm` invocation was blocked because PowerShell execution policy rejected `npm.ps1`; use `npm.cmd`.
- Verified baseline: `npm.cmd run build` passes; `npm.cmd run lint` cannot run because the `oxlint` executable is not installed or available on PATH.
- The repository currently has no `.git` directory and no prior `AGENTS.md`; do not assume commit history or previous agent state exists.
