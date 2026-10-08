# Architecture and Data Rules

## Current Structure

- `src/App.tsx`: application shell, active-view routing, global modals.
- `src/context/AppContext.tsx`: current user, mock persistence, mutations, derived role-scoped selectors.
- `src/types/index.ts`: domain contracts for users, charities, marketers, donations, targets, and payroll.
- `src/data/mockData.ts`: demo users and seeded records.
- `src/components/*`: feature views and layout components.
- `src/utils/*`: formatting and export helpers.

## Current Runtime Model

The MVP is client-side React state backed by `localStorage`. It is suitable for demos, not multi-user production. Do not describe localStorage data as secure or synchronized.

## Required Invariants

1. Donation amount must be finite and greater than zero.
2. A donation must reference an existing charity and marketer allowed for that charity.
3. `targetAmount > 0`; achievement percentage is `achievedAmount / targetAmount * 100` rounded only for display/storage policy.
4. Commission is derived from the achieved amount and commission rate; bonus thresholds must be centralized, not duplicated across components.
5. Net salary is `baseSalary + commissionAmount + bonusAmount - deductionsAmount`.
6. A paid payroll record is immutable through ordinary status actions.
7. Role-scoped selectors are the source for role views and AI context; components must not read the unfiltered arrays for user-visible records.
8. Date/month calculations must use a single current-period helper instead of hard-coded `10/2026` values.
9. All state updates that represent one business action must be atomic from the user’s perspective: invalid input causes no partial updates.

## Planned Evolution

Keep UI components thin. Move calculations and validation into pure domain utilities, then replace the context’s localStorage repository with an API/repository boundary when a backend is introduced. Keep the same domain types and acceptance tests across both implementations.
