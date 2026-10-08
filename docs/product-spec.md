# Ghazara Sales App — Product Specification

## Goal

Provide an Arabic RTL operational MVP for managing charity fundraising through marketers, with a live view of donations, targets, achievements, and payroll.

## Roles and Access

| Role | Must be able to see | Must be able to do |
|---|---|---|
| Admin | All charities, marketers, donations, targets, payroll | Manage master data, review/export donations, set targets, approve payroll, mark payroll paid |
| Marketer | Own donations, assigned charities, own target/achievement, own payroll | Create a donation from the field and review personal performance |
| Charity representative | Own charity and its donation records | Review own charity donation activity |

Role filtering must be enforced in the context selectors and reflected in navigation. A hidden menu item is not an authorization boundary.

## Core Workflows

1. Admin opens dashboard, reviews total donations, achievement, active marketers, and active charities, then drills into operational lists.
2. Marketer creates a donation with charity, amount, date, donor/payment details, and notes; the system recalculates related totals.
3. Admin filters and exports donation records as CSV/Excel-compatible output.
4. Admin sets a monthly target per marketer; achievement percentage and status update from donations.
5. Payroll derives commission, bonus, deductions, and net salary; admin reviews, approves, and marks the month paid.
6. Charity representative sees only records belonging to their charity.
7. Users can ask the AI assistant about visible operational data; the assistant must not expose data outside the current role scope.

## Design Constraints

- Full RTL Arabic interface; use Arabic labels for user-facing content.
- Preserve the dark visual foundation: `#0A0A1A` background, `#6B21C8` purple, `#FF6B2B` orange action accent.
- Responsive mobile-first layout with accessible focus states, readable contrast, and touch-friendly controls.
- Keep tables usable on narrow screens; do not rely on hover-only actions.

## MVP Acceptance Criteria

- A fresh browser session loads usable seeded sample data.
- Creating a valid donation updates donation list, charity totals, marketer achievement, target progress, and payroll calculations consistently.
- Invalid or incomplete donation input is rejected with an Arabic validation message and no partial state update.
- Each role sees only its permitted records and actions.
- Payroll cannot move backwards from `paid` and cannot be marked paid without approval.
- Build and lint pass with `npm.cmd run build` and `npm.cmd run lint`.
