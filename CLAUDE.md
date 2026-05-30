# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev               # Start dev server (uses PORT from .env)
npm run build             # prisma generate + nuxt build → .output/
npm run preview           # Preview production build

# Code quality
npm run lint              # ESLint check
npm run lint:fix          # ESLint auto-fix
npm run format            # Prettier format all files

# Database
npm run prisma:migrate    # Run pending migrations (prisma migrate dev)
npm run prisma:generate   # Regenerate Prisma client
npm run prisma:seed       # Seed all data
npm run db:seed:requests  # Seed only requests
npm run prisma:studio     # Open Prisma Studio GUI
npm run db:reset          # prisma migrate reset --force (destroys data)

# Recommended initial setup order
npm run nuxt:prepare && npm run prisma:migrate && npm run prisma:seed

# Docker
docker compose up --build                        # Dev (uses Supabase DB)
docker compose -f docker-compose.prod.yml up --build  # Production
```

## Architecture overview

Full-stack Nuxt 4 app (Nitro server + Vue frontend) for managing design-request workflows: Sales → Design → Quality → Delivery.

### Environment & config

All env vars are validated via Joi in `config/env.ts`. Nuxt will fail to start if any required variable is missing or invalid. Copy `.env.example` to `.env` before running. The `SUPABASE_DB_URL` must use the **Supavisor Session pooler** (`pooler.supabase.com:5432`) with `sslmode=require&uselibpqcompat=true`.

### Frontend (`app/`)

**Routing is not file-based.** Routes are imported manually in `app/router.options.ts` from each feature module's `routes/` folder (`app/presentation/<feature>/routes/<feature>.routes.ts`). When adding a new page, register its route there.

Feature modules live under `app/presentation/<feature>/` with this internal structure:

- `view/` — page-level Vue components (assembled from `components/`)
- `components/` — domain-specific UI pieces
- `composables/` — Vue composables with TanStack Query calls
- `services/` — HTTP service functions calling `$apiClient`
- `stores/` — feature-scoped Pinia stores
- `routes/` — route definitions
- `interfaces/` — TypeScript interfaces for that domain

Shared UI is in `app/presentation/shared/` (layout + UI components, shared composables). Global types in `app/types/`, utilities in `app/utils/`.

**HTTP client**: Axios instance injected as `$apiClient` (plugin `app/plugins/api-client.ts`). It auto-attaches the `access_token` cookie as Bearer token and redirects to `/login?reason=session-expired` on 401. Use `useNuxtApp().$apiClient` in service functions.

**Notifications**: `$appToast` (plugin `app/plugins/app-toast.ts`) wraps vue-sonner.

**Theme**: Light/dark mode persisted in `localStorage('app-theme-mode')`. A critical inline script in `nuxt.config.ts` applies the class before hydration to prevent flash.

### Auth

Client-side: `app/middleware/auth.global.ts` (runs only on client) checks the `access_token` cookie JWT. Expired or role-less tokens are cleared and redirect to `/login`. Role codes determine the home path:

| Role code        | Home path           |
| ---------------- | ------------------- |
| `vendedor`       | `/solicitudes`      |
| `disenador_jefe` | `/requests/design`  |
| `disenador`      | `/requests/design`  |
| `calidad`        | `/requests/quality` |
| default          | `/dashboard`        |

Server-side: `server/utils/require-permission.util.ts` provides `requireSession()` and `requirePermission()`. Note: `requireRole()` is currently disabled (returns `true` unconditionally).

### Backend (`server/`)

Nitro/H3 API handlers follow the pattern: `server/api/<domain>/<method>.ts`.

Request lifecycle per API endpoint:

1. Parse & validate DTO via Joi schemas in `server/api/dtos/<domain>/`
2. Authenticate/authorize via `requireSession()` or `requirePermission()`
3. Call a service in `server/services/`
4. Service calls a repository in `server/repositories/`
5. Repository accesses Prisma singleton from `server/database/prisma.ts`

TypeScript interfaces for domain entities, repositories, and services are in `server/interfaces/`.

API docs available in dev at `GET /api/docs` (Swagger UI) and `GET /api/openapi.json`.

### Domain model (Prisma)

Core workflow: `DesignRequest` → `DesignRequestVersion` → `RequestDesignerAssignment` / `QualityReview` / `RequestFile` / `RequestWorkflowEvent`.

Request status flow: `CREATED → PENDING_DESIGN_REVIEW → ASSIGNED_TO_DESIGNER → IN_DESIGN → SENT_TO_QUALITY → QUALITY_REJECTED | QUALITY_APPROVED → DELIVERED_TO_SALES`.

Each revision creates a new `DesignRequestVersion`. The active version is tracked via `DesignRequest.currentVersionId`.

### Styles

CSS custom properties define the theme tokens. Theme files: `app/assets/styles/themes/light/theme.css` and `themes/dark/theme.css`. Tailwind config at `tailwind.config.ts`. Global base styles in `app/assets/styles/base/globals.css`.
