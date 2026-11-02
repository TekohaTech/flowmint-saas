# FlowMint Sistem — Project Rules

> Last synced with code: 2026-11-02 (commit `7b4132b`).
> `ai.md` is the extended reference; this file is the short, authoritative rule set.
> When behavior changes, update this file in the same commit.

## Stack

- **Backend**: NestJS 11 + Prisma 6 + PostgreSQL (Supabase)
- **Frontend**: React 18 + Vite (plain JSX, **no TypeScript**) + react-bootstrap + react-router-dom v6
- **Auth**: JWT (passport-jwt) + httpOnly cookies. No OAuth strategy is implemented
  (`passport-google-oauth20` is installed but unused — do not assume Google login exists)
- **AI**: Groq SDK (primary) + Cerebras SDK (fallback) with real failover in
  `AiOrchestratorService`, SSE streaming
- **Email**: Brevo HTTP API (`fetch`) with Nodemailer SMTP fallback
- **Charts / calendar**: Chart.js + react-chartjs-2, react-big-calendar (date-fns, not moment)
- **Infra**: Docker + docker-compose

## Architecture

- Multi-tenant: every domain entity is scoped by `comercio_id`
- **Golden rule**: every query and mutation must filter by `comercio_id`, taken from
  `req.user.comercio_id`. `SUPERADMIN` is the only one allowed to bypass with `null`.
  Cross-tenant leakage is a critical-severity vulnerability
- RBAC roles: `SUPERADMIN` (cross-commerce), `DUENO` (own commerce), `EMPLEADO` (own commerce)
- Soft delete: `Cliente`, `Empleado`, `Servicio`, `Usuario` use `estado` (`A` active, `I` inactive,
  `B` deleted). `Turno` uses hard delete. `Comercio` uses lifecycle states
  (`pendiente` | `activo` | `suspendido`)
- Global API prefix `/api`; Swagger at `/api/docs` only when `NODE_ENV !== 'production'`
- Public health probe: `GET /api/health` (service + DB readiness, no JWT)
- `JWT_SECRET` is **required** — the app throws at startup if missing (no fallback). JWT TTL is `1d`

### Backend modules (`src/app.module.ts`)

14 imports: `PrismaModule` (global), `RolesModule`, `UsuariosModule`, `AuthModule`,
`ClientesModule`, `EmpleadosModule`, `ServiciosModule`, `TurnosModule`, `GananciasModule`,
`AiModule`, `ComerciosModule`, `NotificacionesModule`, `EmailModule` (`@Global`), `HealthModule`.

### Auth endpoints (`/api/auth`)

| Method | Path | Access |
| --- | --- | --- |
| POST | `/login` | public, 10/min |
| POST | `/logout` | authenticated |
| POST | `/register` | public, 5/min |
| POST | `/completar-registro` | public, 5/min |
| POST | `/activar-pin` | public, 10/min |
| GET | `/me` | authenticated |
| GET | `/verificar-email` | public |
| POST | `/forgot-password` | public, 3/min |
| POST | `/reset-password` | public, 5/min |

- Password reset tokens are **single-use**: the JWT carries a fingerprint of the current password
  hash, so changing the password burns the token (no replay within the 15-min window)
- Employee accounts are created by the owner with a **6-digit PIN**; the employee activates with
  `/activar-pin` (validates PIN, sets own password, returns the normal JWT)
- Hard limit: **2 employee accounts per commerce** (`MAX_EMPLEADOS_CUENTA`)

## Business Rules (Data Retention)

Full source of truth: see `ai.md` → "Business Rules — Data Retention & Deletion".

- **No orphan commerces**: a `Comercio` must never remain active without a linked owner account
- **Deleting a user cleans its commerce**: `UsuariosService.remove()` runs in a transaction. If the
  commerce is empty it is **hard-deleted**; if it still holds clients/employees/services/turnos it is
  **suspended, not deleted**, to preserve history
- **Inactive / non-paying tenants**: prior notice is sent to `dueno_email`; data is permanently
  deleted after the notice period
- **Legal**: reference law is Argentina **Ley 25.326**. The contract wording must be validated by
  legal counsel

## Conventions

- Backend modules follow `src/{domain}/` pattern: controller, service, module, DTOs
- Frontend components live in `src/component/` (flat). Shared hooks/helpers in
  `src/component/shared/` (`useCrud.js`, `numericUtils.js`)
- API service layer in `src/services/api.js` — single source of truth for all API calls
  (`authAPI`, `usersAPI`, `clientsAPI`, `employeesAPI`, `servicesAPI`, `comerciosAPI`,
  `revenueAPI`, `aiAPI`, `notificationsAPI`). There is no `rolesAPI`; don't invent one
- Use NestJS `Logger` instead of `console.*` in backend
- All API endpoints require JWT auth unless decorated with `@Public()`
- Roles are enforced via `@Roles()` decorator + `RolesGuard`
- DTOs validated with `class-validator` — `whitelist: true`, `forbidNonWhitelisted: true`,
  `transform: true`
- Error messages must not expose stack traces or DB internals in production

## Security Rules

- Never commit `.env` files — they are gitignored
- `JWT_SECRET` must be set in the environment, never a hardcoded fallback
- Swagger is only available in non-production environments
- CORS is an explicit allowlist (`FRONTEND_URL` + localhost), never wildcard `*`,
  `credentials: true`
- `helmet()` is enabled
- Cookies: `httpOnly: true`; outside `development` they use `secure: true` + `sameSite: 'none'`
  (cross-site auth); in `development` they use `sameSite: 'lax'`
- Rate limiting: global 100/min; login 10/min; activar-pin 10/min; register 5/min;
  completar-registro 5/min; forgot-password 3/min; reset-password 5/min
- `RegistroIP` blocks the same IP/email for 2 hours after a registration attempt (enforced only
  when `NODE_ENV === 'production'`)

## Environment Variables

- **Required**: `DATABASE_URL`, `JWT_SECRET`
- **Optional**: `PORT` (default 3000), `NODE_ENV`, `FRONTEND_URL`
- **AI**: `GROQ_API_KEY`, `CEREBRAS_API_KEY`
- **Email**: `BREVO_API_KEY`, `EMAIL_FROM`; legacy fallback `SMTP_HOST`, `SMTP_PORT`,
  `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`
- Backend `.env` lives in `FlowMint-backend-nestjs/.env`; Prisma scripts load it via `dotenv-cli`

## Test Commands

```bash
# Backend
cd FlowMint-backend-nestjs
npm run build          # TypeScript build
npm test               # Jest unit tests (src/**/*.spec.ts)
npm run test:cov       # Jest with coverage
npm run test:e2e       # E2E (test/jest-e2e.json)

# Frontend
cd FlowMint-frontend
npx vite build         # Vite production build
npm run lint           # ESLint (max-warnings 0)
```

### Actual test coverage (do not overstate it)

- Real unit tests: `src/auth/auth.service.spec.ts` (reset-password flow) and
  `src/ai/ai-orchestrator.service.spec.ts` (provider fallback)
- `test/app.e2e-spec.ts` is still Nest boilerplate (`Hello World`) and will not reflect real API behavior
- **The frontend has no test runner installed** (no `test` script, no Jest/Vitest). Do not invent
  frontend test commands; add a runner explicitly if tests are requested

## Deployment

- **Frontend**: https://flowmint.pages.dev/ (Cloudflare Pages)
- **Backend**: Render (NestJS service)
- **Database**: Supabase (PostgreSQL)

### Render Docker

- Render "Root Directory" = `FlowMint-backend-nestjs/` (where it looks for the Dockerfile)
- Docker build context = **repo root** (NOT `FlowMint-backend-nestjs/`)
- All `COPY` paths in the Dockerfile must use the `FlowMint-backend-nestjs/` prefix
- Root `.dockerignore` excludes frontend and dev files from the build context
- `prisma` is a devDependency — the generated `.prisma/client` must be explicitly copied to the
  final stage
- Final image runs as a non-root user and starts `node dist/src/main`

```bash
# Test Docker build locally
docker build -f FlowMint-backend-nestjs/Dockerfile -t flowmint-backend-test .
```

## Docker

```bash
# Full stack
docker-compose up -d

# Database only
docker-compose -f docker-compose-db.yml up -d
```

## Known Tech Debt

- Frontend is JSX (no TypeScript) — migration planned; keep new code consistent with JSX for now
- Test coverage is thin: 2 real unit specs, boilerplate e2e, and no frontend tests
- Docs drift is the real risk here: `ai.md` sat ~2 months stale before the 2026-11-02 sync.
  `PROYECTO-COMPLETO.md` is marketing-level and must not be used as a technical reference.
  When docs and code disagree, the code wins — and update the docs in the same commit
