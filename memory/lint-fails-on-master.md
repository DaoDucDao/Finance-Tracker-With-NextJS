---
name: lint-fails-on-master
description: This repo's npm run lint already fails on master; treat next build as the real gate.
metadata:
  type: project
---

`npm run lint` exits 1 on a clean `master` checkout. The React-Compiler ESLint rules
(`react-hooks/set-state-in-effect`, `react-hooks/purity`) flag pre-existing code in
`src/hooks/useLocalStorage.ts`, `src/components/transactions/TransactionForm.tsx`, and
an unused-var warning in `src/app/transactions/page.tsx`.

**Why:** Lint was never clean here, so a non-zero lint exit doesn't mean your changes broke something.
**How to apply:** Use `npm run build` (Turbopack, runs `tsc`) as the pass/fail gate. Keep *new* files
lint-clean — e.g. wrap `Date.now()`/`Math.random()` in plain util functions (not component bodies) to
satisfy the purity rule, and prefer `useSyncExternalStore` over a mount effect for external state like theme.
