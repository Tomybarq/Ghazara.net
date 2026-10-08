# Ghazara Sales App

Arabic RTL MVP for Ghazara Trading & Marketing to manage charity fundraising operations: charities, marketers, donations, monthly targets, payroll, exports, and role-scoped views.

## Stack

React 19 + TypeScript + Vite + Tailwind CSS. The current MVP uses seeded mock data and browser `localStorage`; it is not a production multi-user backend.

## Run locally on Windows

```powershell
npm.cmd install
npm.cmd run dev
```

Validation and testing commands:

```powershell
npm.cmd run test
npm.cmd run lint
npm.cmd run build
```

## Demo scope & Roles

The app includes three primary roles accessible via the top-header role selector:
- **مدير النظام (`admin`):** Full operational visibility, donation recording, targets, and payroll lifecycle management (`draft` -> `reviewed` -> `approved` -> `paid`).
- **مسوق ميداني (`marketer`):** Isolated view of personal donations, personal monthly targets, and personal payslips.
- **ممثل جمعية (`charity_rep`):** Isolated view of designated charity campaigns and donations; marketer commission rates and payroll records are hidden.

### Resetting Demo Data
Use the **"إعادة تعيين البيانات التجريبية"** button in the header to safely restore the initial state in `localStorage` at any time.

## Development handoff

Read these files before changing the app:

1. `AGENTS.md` — universal rules and restart protocol.
2. `docs/product-spec.md` — product scope and acceptance criteria.
3. `docs/architecture.md` — current structure and data invariants.
4. `docs/development-workflow.md` — Antigravity execution process.
5. `docs/antigravity-enhancement-plan.md` — phased implementation plan.
6. `docs/release-checklist.md` — multi-role release verification & operational runbook.

Start from the first unchecked task in the enhancement plan. Do not treat localStorage as secure, synchronized, or suitable for production deployment.
