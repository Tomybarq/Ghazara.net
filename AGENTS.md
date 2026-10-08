# Ghazara Sales App

Arabic RTL sales and charity-fundraising MVP for Ghazara Trading & Marketing, built with React, TypeScript, Vite, and Tailwind CSS.

## Quick Reference

- **Package manager:** npm (`npm.cmd` on this Windows device)
- **Start:** `npm.cmd run dev`
- **Build:** `npm.cmd run build`
- **Lint:** `npm.cmd run lint`
- **Current persistence:** browser `localStorage` mock data; no backend yet

## Remote Repository & Git Synchronization

- **Remote URL:** `https://github.com/Tomybarq/Ghazara.net.git`
- **Default Branch:** `main` (tracking `origin/main`)
- **Push Rule:** After completing each task or phase, verify with build and lint, stage changes, commit with conventional commit messages (`feat:`, `fix:`, `refactor:`, `docs:`), and push upstream to `origin/main`.

## Universal Rules

1. Preserve Arabic copy and RTL behavior unless a requirement explicitly changes them.
2. Keep all three role boundaries enforced in both navigation and data selectors: `admin`, `marketer`, `charity_rep`.
3. Treat derived values as calculated data, not hand-edited UI state: donations drive targets, achievements, commissions, and payroll.
4. Do not add real authentication, payment, or production data integrations without an explicit specification and security review.
5. Before each change, inspect the affected existing component/context/types; after each phase run build and lint.
6. Do not hide errors with `any`, silent fallbacks, or disabled checks. Document known MVP limitations.
7. Always keep the repository synchronized with the remote GitHub repository at `https://github.com/Tomybarq/Ghazara.net.git`.

## Agent Goal Loop Contract

When running autonomous long-running execution loops (`/goal`):

- **Objective:** Fulfill the designated task/phase from the enhancement plan or user instruction.
- **Read first:** `AGENTS.md`, `docs/product-spec.md`, `docs/architecture.md`, `docs/antigravity-enhancement-plan.md`
- **Constraints:** Preserve Arabic RTL layout; strictly enforce 3 roles; never use `any` types; no unverified production integrations.
- **Validate:** `npm.cmd run build && npm.cmd run lint` after every atomic modification.
- **Document:** Write concise, targeted documentation for all changes in `docs/` or `AGENTS.md`.
- **Checkpoints:** Work in atomic checkpoints, verify builds, commit, and push upstream to `origin/main`.
- **Stop when:** All phase targets are verified green, OR when architecture/product clarification is needed from the user.

## Detailed Guidance

- [Product requirements](docs/product-spec.md)
- [Architecture and data rules](docs/architecture.md)
- [Antigravity development workflow](docs/development-workflow.md)
- [Enhancement plan](docs/antigravity-enhancement-plan.md)

## Restart Protocol

When resuming or restarting work, read this file and the enhancement plan first, inspect the current tree and `git diff` if Git is available, identify the first incomplete phase, and continue from the smallest unfinished task. Never assume a prior attempt completed a task without verifying its files and checks.
