# Ghazara Sales App

Arabic RTL MVP for Ghazara Trading & Marketing to manage charity fundraising operations: charities, marketers, donations, monthly targets, payroll, exports, and role-scoped views.

## Stack

React 19 + TypeScript + Vite + Tailwind CSS. The current MVP uses seeded mock data and browser `localStorage`; it is not a production multi-user backend.

## Run locally on Windows

```powershell
npm.cmd install
npm.cmd run dev
```

Validation commands:

```powershell
npm.cmd run build
npm.cmd run lint
```

## Demo scope

The app includes admin, marketer, and charity representative demo roles. Use the in-app role switcher to exercise each role and verify that data remains scoped.

## Development handoff

Read these files before changing the app:

1. `AGENTS.md` — universal rules and restart protocol.
2. `docs/product-spec.md` — product scope and acceptance criteria.
3. `docs/architecture.md` — current structure and data invariants.
4. `docs/development-workflow.md` — Antigravity execution process.
5. `docs/antigravity-enhancement-plan.md` — phased implementation plan.

Start from the first unchecked task in the enhancement plan. Do not treat localStorage as secure, synchronized, or suitable for production deployment.
