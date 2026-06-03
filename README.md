# 💵 FinTracker — Personal Finance Manager

A modern personal finance tracker built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and **shadcn/ui**. Track income & expenses, set monthly budgets, work toward savings goals, and visualize everything with interactive charts.

## Features

- **Dashboard** — balance / income / expense / savings-rate stat cards, monthly overview bar chart, category donut charts, budget & goal snapshots.
- **Transactions** — full CRUD with search, type/category/month filters, and CSV export.
- **Budgets** — monthly spending limits per category with animated progress bars and over-budget warnings.
- **Savings Goals** — progress rings, fund contributions, deadlines, and a confetti burst when a goal is reached. 🎉
- **Categories** — customizable income/expense categories with icons and colors.
- **Reports** — balance-trend area chart and monthly breakdown table.
- **Settings** — light/dark theme toggle, JSON data export/import, and reset.

## Tech Stack

| Area | Choice |
|------|--------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, shadcn/ui (`class-variance-authority`, `tailwind-merge`) |
| Charts | Recharts |
| Persistence | **Currently: browser `localStorage`** (see roadmap below) |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Demo data is seeded automatically on first load.

## Current Architecture

The app is presently **100% client-side**. All data is persisted in the browser via the `useLocalStorage` hook under these keys:

| Key | Data |
|-----|------|
| `finance-transactions` | transactions |
| `finance-categories` | categories |
| `finance-budgets` | budgets |
| `finance-goals` | savings goals |
| `finance-theme` | dark/light preference |

This means data is per-browser/per-device and not shared. The Settings → Export/Import JSON is the only way to move it between browsers.

---

## 🛣️ Roadmap: Node.js Backend

> **Status: planned — not yet implemented.** This section is the agreed implementation plan to replace `localStorage` with a real server + database.

### Decisions

| Question | Choice |
|----------|--------|
| Backend style | **Next.js Route Handlers** (`app/api/...`) — one app, no separate server |
| Database | **Postgres** (Neon or Supabase) via **Drizzle ORM** |
| Driver | `postgres` (postgres.js) — works with any Postgres connection string |
| localStorage | **Replaced** by the API (theme preference stays client-side) |

### Dependencies to add

```bash
npm install drizzle-orm postgres
npm install -D drizzle-kit tsx dotenv
```

### Environment

Create `.env.local` (and commit a `.env.example` placeholder):

```bash
# Neon: https://neon.tech  ·  Supabase: https://supabase.com (use the connection string / pooler URL)
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
```

### Planned database schema (`src/db/schema.ts`)

All amounts stored as `double precision`; dates kept as ISO strings to match the existing TS types.

- **categories** — `id` (text PK, keeps `cat-*` ids for defaults), `name`, `type` (`income`|`expense`), `color`, `icon`
- **transactions** — `id`, `type`, `amount`, `categoryId`, `description`, `date`, `createdAt`
- **budgets** — `id`, `categoryId`, `amount`, `createdAt`
- **goals** — `id`, `name`, `targetAmount`, `currentAmount`, `color`, `icon`, `deadline?`, `createdAt`

`categoryId` is a plain text column (no hard FK) so deleting a category leaves transactions showing "Unknown", matching current behavior.

### Planned API endpoints (Route Handlers)

| Method | Route | Purpose |
|--------|-------|---------|
| `GET` / `POST` | `/api/transactions` | list / create |
| `PATCH` / `DELETE` | `/api/transactions/[id]` | update / delete |
| `GET` / `POST` | `/api/categories` | list / create |
| `PATCH` / `DELETE` | `/api/categories/[id]` | update / delete |
| `GET` / `POST` | `/api/budgets` | list / create |
| `PATCH` / `DELETE` | `/api/budgets/[id]` | update / delete |
| `GET` / `POST` | `/api/goals` | list / create (contributions via `PATCH currentAmount`) |
| `PATCH` / `DELETE` | `/api/goals/[id]` | update / delete |
| `POST` / `DELETE` | `/api/import` | replace-all (restore backup) / wipe-all (reset) |

### Planned npm scripts

```jsonc
"db:push":   "drizzle-kit push",      // sync schema to the DB
"db:generate":"drizzle-kit generate", // generate SQL migrations
"db:seed":   "tsx src/db/seed.ts"     // seed default categories + demo data
```

### Setup steps (once implemented)

```bash
# 1. set DATABASE_URL in .env.local
npm run db:push     # create tables
npm run db:seed     # load default categories + demo data
npm run dev
```

### Implementation checklist

- [ ] Install deps + add db scripts to `package.json`
- [ ] `drizzle.config.ts`, `src/db/schema.ts`, `src/db/index.ts` (db client), `.env.example`
- [ ] `src/db/seed.ts` reusing the existing generators in `src/utils/seed.ts`
- [ ] Route handlers for transactions / categories / budgets / goals
- [ ] `/api/import` (POST restore, DELETE reset) for the Settings backup feature
- [ ] Refactor `useTransactions` / `useCategories` / `useBudgets` / `useGoals` to fetch the API (keep return shapes stable; add async loading/error states)
- [ ] Remove client-side seeding calls from Dashboard / Budgets / Goals pages
- [ ] Point Settings export/import/reset at the API
- [ ] `next build` verification

> **Note:** This repo runs a non-standard build of Next.js — consult `node_modules/next/dist/docs/` before changing framework code (see `AGENTS.md`).
