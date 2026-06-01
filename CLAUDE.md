# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Start dev server at http://localhost:3000
npm run build            # Production build
npm run lint             # ESLint via Next.js
npm run db:generate      # Regenerate Prisma client (lib/generated/prisma)
npm run db:migrate       # Run Prisma migrations in development (npx prisma migrate dev)
npm run doc              # Serve MkDocs documentation (requires /documentation dir)
```

No test runner is configured.

## Architecture

**Process-Flow** is a BPMN-based workflow management platform with team collaboration and gamification. Users design process diagrams in a visual editor, and the database drives execution of those processes.

### Routing

Next.js 14 App Router. The main team workspace lives under the `[teamId]` dynamic segment:

```
src/app/
├── page.tsx                # Landing page
├── authenticate/           # Supabase auth
├── dashboard/              # Teams overview
├── [teamId]/               # Team workspace
│   ├── editor/             # BPMN process editor
│   ├── monitoring/         # Running instance tracking
│   ├── tasks/              # User task queue
│   ├── team/               # Member & role management
│   └── statistics/         # Gamification stats
├── instance/               # Process instance execution (iframe tasks)
├── docs/                   # Integrated Fumadocs documentation site
└── api/                    # API routes (task webhooks)
```

### State Management

- **Zustand** (`src/stores/store.ts`) — editor-only: holds ReactFlow nodes/edges and graph utilities (`getPreviousNodes`, `getChildren`, `getAvailableVariableNames`, etc.).
- **Undo/Redo** (`src/stores/UndoRedoStore.ts`) with `useUndoRedo` hook (Ctrl+Z / Ctrl+Shift+Z).
- All other state is server-fetched. Mutations go through Next.js Server Actions (`src/actions/`).

### Database / Server Actions

- **PostgreSQL + Prisma** — self-hosted DB, Prisma ORM. Client singleton: `lib/prisma.ts`. Generated types: `lib/generated/prisma/`.
- Schema: `prisma/schema.prisma`. Migrations: `prisma/migrations/` (two initial migrations: schema tables + process engine SQL functions/triggers).
- Server Actions in `src/actions/` handle all DB operations. Naming convention: `create-*`, `get-*`, `update-*`, `delete-*`.
- DB types (manual): `src/model/database/database.types.ts` — row types for all tables plus enum types.
- **Auth**: `better-auth` via `lib/auth.ts` (server) and `lib/auth-client.ts` (browser). Session helper: `lib/session.ts` — `requireSession()` in server actions. API route: `src/app/api/auth/[...all]/route.ts`.
- The process engine lives in PostgreSQL triggers/functions (see migration 2). The `execute_created_flow_element_instance` trigger sets automatic activities to 'In Progress'; the app-layer `lib/dispatch-automatic-activities.ts` makes the HTTP call to the external service.

### Process Editor (ReactFlow)

The BPMN editor (`src/components/processEditor/`) uses ReactFlow with custom node types:
- `ActivityNode`, `GatewayNode`, `StartNode`, `EndNode`, `AndSplitNode`, `AndJoinNode`
- Node types are enumerated in `src/model/NodeTypes.ts`.
- Each node carries `ActivityNodeData` with gamification config, inputs/outputs, and an **options structure** (`src/model/OptionsModel.ts`) that drives dynamic configuration UIs.
- BPMN export to XML: `src/utils/editor/ExportUtils.ts`.

### Custom Node Shop

Users can create and share reusable node definitions. Shop operations live in `src/actions/shop/` and utilities in `src/utils/shop/`.

### Gamification

Tracked per node action: experience points, coins, badges. Models: `src/model/GamificationOptions.ts`, `BadgeType.ts`, `ChallengeType.ts`, `PointsType.ts`.

### Internationalization

`next-intl` with message files in `src/i18n/`. Server components use `getTranslations()`; client components use `useTranslations()`. The docs site also supports i18n via Fumadocs.

### UI Components

- Shadcn-style wrappers in `src/components/ui/` (Radix UI primitives under the hood).
- `cn()` helper for class merging: `src/lib/utils.ts`.
- Framer Motion for animations; Recharts for charts.

## Key Conventions

- All DB mutations are **Server Actions** using `prisma` — never call the DB from client components.
- Auth in server actions: `const session = await requireSession()` from `@/lib/session`.
- `"use client"` is explicit; components are Server Components by default.
- Path alias `@/*` maps to `src/*` (tsconfig). `lib/` is at the project root (not inside `src/`).
- Tailwind CSS variables drive theming; see `tailwind.config.js` for the custom theme.
- BigInt IDs: Prisma returns `BigInt` for `bigint` DB columns — use `Number(id)` when passing to client components or JSON responses.
