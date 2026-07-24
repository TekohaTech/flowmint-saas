# FlowMint Sistem — Project Rules

## Stack

- **Backend**: NestJS 11 + Prisma 6 + PostgreSQL (Supabase)
- **Frontend**: React 18 + Vite + react-bootstrap + react-router-dom v6
- **Auth**: JWT (passport-jwt) + httpOnly cookies
- **AI**: Groq SDK (primary) + Cerebras SDK (fallback) via AI orchestrator
- **Email**: Nodemailer (SMTP)
- **Infra**: Docker + docker-compose

## Architecture

- Multi-tenant: all domain entities are scoped by `comercio_id`
- RBAC roles: SUPERADMIN, DUENO, EMPLEADO
- Soft delete pattern: `estado: 'A'` (active), `'I'` (inactive), `'B'` (deleted)
- JWT_SECRET is **required** — app refuses to start without it (no fallback)

## Conventions

- Backend modules follow `src/{domain}/` pattern: controller, service, module, DTOs, entities
- Frontend components live in `src/component/` (flat, not nested yet)
- API service layer in `src/services/api.js` — single source of truth for all API calls
- Use NestJS `Logger` instead of `console.*` in backend
- All API endpoints require JWT auth unless decorated with `@Public()`
- Roles are enforced via `@Roles()` decorator + `RolesGuard`
- DTOs validated with `class-validator` — `whitelist: true`, `forbidNonWhitelisted: true`

## Security Rules

- Never commit `.env` files — they are gitignored
- JWT_SECRET must be set in environment, no hardcoded fallbacks
- Swagger docs are only available in non-production environments
- CORS is configured per-frontend URL, never wildcard `*`
- Rate limiting: login 10/min, register 5/min, forgot-password 3/min, general 100/min
- Cookie `secure` flag is enabled in non-development environments

## Test Commands

```bash
# Backend
cd FlowMint-backend-nestjs
npm run build          # TypeScript build
npm test               # Jest unit tests
npm run test:e2e       # E2E tests

# Frontend
cd FlowMint-frontend
npx vite build         # Vite production build
```

## Deployment

- **Frontend**: https://flowmint.pages.dev/ (Cloudflare Pages)
- **Backend**: Render (NestJS service)
- **Database**: Supabase (PostgreSQL)

### Render Docker

- Render "Root Directory" = `FlowMint-backend-nestjs/` (where it looks for Dockerfile)
- Docker build context = **repo root** (NOT FlowMint-backend-nestjs/)
- All COPY paths in Dockerfile must use `FlowMint-backend-nestjs/` prefix
- Root `.dockerignore` excludes frontend and dev files from build context
- `prisma` is a devDependency — generated `.prisma/client` must be explicitly copied to final stage

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

- Frontend is JSX (no TypeScript) — migration planned
- No meaningful test coverage (only boilerplate specs deleted, need real tests)
