# FlowMint SaaS: Professional Engineering, Cybersecurity & AI Protocol

## Project Identity
FlowMint is a high-availability, Multi-tenant SaaS for appointment management (beauty shops, barbershops, aesthetics centers).
- **Tenant Isolation:** Critical requirement. Every business (`Comercio`) is isolated via `comercio_id`.
- **Architectural Integrity:** NestJS (Modular Backend), React (Component-based Frontend), Prisma (Type-safe ORM), PostgreSQL (Supabase).

## Mandatory AI Operational Protocol
1. **Context-First:** Trace dependencies and read local modules before proposing code.
2. **Strategy-First:** Provide a technical plan. Wait for developer approval before any write operation.
3. **Reproduce Before Fix:** When fixing bugs, explain the root cause and why the proposed fix is stable.
4. **Professional Communication:** Concise, technical, and focused on rationale.

## Cybersecurity & Data Privacy Standards
1. **Multi-tenancy (The Golden Rule):** NEVER perform queries or mutations without a strict `comercio_id` filter. ALL repository/service methods receive `comercioId` from `req.user.comercio_id`. SUPERADMIN can bypass by passing `null`. Data leakage between tenants is a critical-severity vulnerability.
2. **Input Validation:** All backend inputs MUST be validated via DTOs and `class-validator` + `class-transformer`. `ValidationPipe` is global with `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`.
3. **Defensive Programming:** Always handle edge cases, null pointers, and potential race conditions (especially in booking logic).
4. **Information Leakage:** Error messages must NOT expose stack traces or internal DB structure in production. Use standard NestJS `HttpException` subclasses (`NotFoundException`, `ConflictException`, `BadRequestException`, `UnauthorizedException`, `ForbiddenException`).
5. **Least Privilege (RBAC):** Every endpoint must check roles and ownership via `@Roles()` decorator + `RolesGuard`.

## Role-Based Access Control (RBAC)
Three roles defined in `src/roles/entities/rol-nombre.enum.ts`:
| Role | Scope | Description |
|------|-------|-------------|
| `SUPERADMIN` | Cross-commerce | Full access, manages all Comercios (activate/suspend) |
| `DUENO` | Own commerce | Business owner, CRUD within their `comercio_id` |
| `EMPLEADO` | Own commerce | Limited employee access within their `comercio_id` |

Access flow: `JwtAuthGuard` (extracts user from Bearer/cookie) -> `RolesGuard` (checks `@Roles()` decorator against `req.user.rol.nombre`).

## Engineering Principles
- **SOLID & DRY:** Services for business logic, Controllers for routing. `PrismaService` is the single data access layer.
- **Conventional Commits:** `feat(turnos): implement overlap validation`, `fix(auth): handle token expiry`.
- **Clean Code:** Meaningful naming, small functions, Prettier/ESLint formatting.

## Database Schema (Prisma) - Full Model Reference

### Comercio (Tenant Root)
- `comercio_id` (PK, autoincrement, `Int`)
- `nombre`, `direccion?`, `telefono?`, `email?` (`@unique`)
- `activo` (`Boolean`, default `false`), `estado` (`String`: `pendiente` | `activo` | `suspendido`)
- `categoria?`, `logo_url?`
- `dueno_nombre?`, `dueno_apellido?`, `dueno_email?`, `dueno_telefono?`
- `fecha_solicitud`, `fecha_activacion?`, `fecha_suspension?`, `motivo_suspension?`
- `creado_en`, `actualizado_en`
- **Relations:** `hasMany` -> `Usuario`, `Cliente`, `Empleado`, `Servicio`, `Turno`

### Rol
- `rol_id` (PK), `nombre` (`@unique`: `SUPERADMIN` | `DUENO` | `EMPLEADO`)
- **Relations:** `hasMany` -> `Usuario`

### Usuario
- `usuario_id` (PK), `nombre`, `apellido`, `dni?`, `user?` (`@unique`), `pass?`, `googleId?` (`@unique`), `correo?` (`@unique`)
- `rol_id` (FK -> `Rol`, default `2` = DUENO)
- `estado` (`A`/`I`/`B`), `comercio_id?` (FK -> `Comercio`, nullable for SUPERADMIN)
- `email_verificado` (`Boolean`), `token_verificacion?` (`@unique`)
- **Soft delete:** `estado: 'A'` = active

### Cliente
- `cliente_id` (PK), `nombre`, `apellido`, `telefono?`, `email?`
- `estado` (`A`/`B` - soft delete), `comercio_id` (FK -> `Comercio`)
- `@@unique([email, comercio_id])`
- **Relations:** `hasMany` -> `Turno`

### Empleado
- `empleado_id` (PK), `nombre`, `apellido`, `puesto?`
- `estado` (`A`/`B` - soft delete), `comercio_id` (FK -> `Comercio`)
- **Relations:** `hasMany` -> `Turno`

### Servicio
- `servicio_id` (PK), `nombre`, `descripcion?`, `precio` (`Float`), `duracion` (`Int`, minutes)
- `estado` (`A`/`B` - soft delete), `comercio_id` (FK -> `Comercio`)
- **Relations:** `hasMany` -> `Turno`

### Turno (Transaction Hub)
- `turno_id` (PK), `fecha_hora` (`DateTime`)
- `estado` (`pendiente` | `confirmado` | `cancelado`)
- `comercio_id` (FK -> `Comercio`), `cliente_id` (FK -> `Cliente`), `empleado_id` (FK -> `Empleado`), `servicio_id` (FK -> `Servicio`)

### RegistroIP (Rate-limiting)
- `id` (PK), `ip`, `correo`, `intento` (`DateTime`)
- `@@index([ip, intento])`

### Soft Delete Pattern
`Cliente`, `Empleado`, `Servicio` use `estado: 'A'` (active) / `'B'` (deleted). `findAll()` and `findOne()` always filter by `estado: 'A'`. `Turno` uses hard delete. `Comercio` uses lifecycle states (`pendiente` -> `activo` | `suspendido`).

## Backend Architecture (`FlowMint-backend-nestjs/`)

### Module Inventory (11 feature + 1 global)
| Module | Responsibility | Key Files |
|--------|---------------|-----------|
| **PrismaModule** | Global PrismaClient singleton | `src/prisma/prisma.service.ts`, `prisma.module.ts` |
| **AuthModule** | JWT + Local auth, Google OAuth, guards, decorators | `src/auth/auth.service.ts`, `jwt.strategy.ts`, `local.strategy.ts`, `jwt-auth.guard.ts`, `roles.guard.ts`, `roles.decorator.ts`, `public.decorator.ts` |
| **RolesModule** | CRUD roles (SUPERADMIN/DUENO/EMPLEADO) | `src/roles/roles.service.ts`, `roles.controller.ts` |
| **UsuariosModule** | CRUD users, exports UsuariosService for AuthModule | `src/usuarios/usuarios.service.ts`, `usuarios.controller.ts` |
| **ComerciosModule** | Tenant lifecycle, activate/suspend, SUPERADMIN-only | `src/comercios/comercios.service.ts`, `comercios.controller.ts` |
| **ClientesModule** | CRUD clients (soft delete), commerce-scoped | `src/clientes/clientes.service.ts`, `clientes.controller.ts` |
| **EmpleadosModule** | CRUD employees (soft delete), commerce-scoped | `src/empleados/empleados.service.ts`, `empleados.controller.ts` |
| **ServiciosModule** | CRUD services (soft delete), commerce-scoped | `src/servicios/servicios.service.ts`, `servicios.controller.ts` |
| **TurnosModule** | Appointments with **time-overlap conflict detection** | `src/turnos/turnos.service.ts`, `turnos.controller.ts` |
| **GananciasModule** | Revenue analytics (daily/weekly/monthly/annual, by service/employee, summary) | `src/ganancias/ganancias.service.ts`, `ganancias.controller.ts` |
| **AiModule** | AI chat with dual-provider orchestrator + SSE streaming | `src/ai/ai-orchestrator.service.ts`, `groq.service.ts`, `cerebras.service.ts`, `ai.controller.ts`, `ai.service.ts` |
| **EmailModule** | `@Global()` - Nodemailer verification emails | `src/email/email.service.ts` |

### Authentication Flow
```
POST /api/auth/login
  -> LocalAuthGuard (validates user+pass via bcrypt)
  -> AuthService.login() generates JWT (payload: { username, sub, rol, comercio_id })
  -> Sets httpOnly cookie + returns JSON { access_token, user }

Other endpoints
  -> JwtAuthGuard (extracts JWT from Bearer header OR access_token cookie)
  -> RolesGuard (if present, checks req.user.rol.nombre against @Roles())
  -> Controller receives req.user with full profile
```

**Key decorators:**
- `@Public()` - bypasses JWT entirely (for login, register, etc.)
- `@Roles(RolNombre.SUPERADMIN, RolNombre.DUENO)` - restricts endpoint

### AI Module (Groq + Cerebras Orchestrator)
- **GroqService:** SDK `groq-sdk`, model `llama-3.3-70b-versatile`
- **CerebrasService:** SDK `@cerebras/cerebras_cloud_sdk`, model `llama3.1-8b`
- **AiOrchestratorService:** On init, pushes Groq first (primary), Cerebras second (fallback). `chat()`/`chatStream()` defaults to `providers[0]` (Groq). If no providers configured, returns fallback message.
- **SSE Streaming:** `POST /api/ai/chat/stream` -> `Content-Type: text/event-stream`, chunks as `data: {"content":"..."}\n\n`, final `data: [DONE]\n\n`.
- **System prompts:** Two variants - one for salon-specific chat (`AiService`), one for general FlowMint assistance (`AiOrchestratorService`).

### Rate Limiting (3 layers)
1. **Global Throttler:** 100 requests / 60s via `APP_GUARD`
2. **Per-endpoint Throttle:** Login (10/60s), Register (5/60s)
3. **IP-based `RegistroIP` table:** Blocks same IP/email for 2 hours after registration

### Input Validation (DTOs)
All DTOs use `class-validator` decorators (`@IsString()`, `@IsInt()`, `@IsEmail()`, `@IsNotEmpty()`, `@MinLength()`, `@Matches()`, `@Min(0)`, `@IsOptional()`, `@Type(() => Date)`). Update DTOs extend `PartialType(CreateXDto)`. Password regex: `@Matches(/^(?=.*[A-Z])(?=.*\d)/)`.

## Frontend Architecture (`FlowMint-frontend/`)

### Tech Stack
- **Framework:** React 18 + Vite (plain JSX, no TypeScript)
- **UI Library:** React Bootstrap v2.10 (Bootstrap 5.3.2)
- **Icons:** lucide-react v0.553, react-icons v5.5, react-bootstrap-icons
- **Animation:** framer-motion v12
- **Calendar:** react-big-calendar v1.13 + moment v2.30
- **Charts:** chart.js v4.5 + react-chartjs-2 v5.3 + chartjs-plugin-datalabels v2.2
- **CSS:** Custom retro-neon theme (`index.css`, 1349 lines) with neon colors, glow effects, scanlines
- **Routing:** React Router DOM v6

### State Management
No global state library. Uses:
- `localStorage` for persistence (`token`, `user`, `isLoggedIn`)
- `useState`/`useEffect` per component
- `hooks/useAuth.js` - decodes JWT, checks expiry, provides `login()`/`logout()`

### API Layer (`src/services/api.js`)
THE ONLY source of truth for API communication. Axios-based, `withCredentials: true`.
- **Request interceptor:** Skips auth header for public endpoints; attaches `Bearer <token>` for all others
- **Response interceptor:** On 401, clears localStorage and redirects

**API modules exported:** `authAPI`, `usersAPI`, `rolesAPI`, `clientsAPI`, `employeesAPI`, `servicesAPI`, `appointmentsAPI`, `comerciosAPI`, `revenueAPI`.

### Routing
```
/                      -> Landing.jsx (public)
/login                 -> Login.jsx
/registro              -> Registros.jsx
/completar-registro    -> CompletarRegistro.jsx
/pendiente-activacion  -> PendienteActivacion.jsx
/verificar-email       -> VerificarEmail.jsx
/dashboard (protected) -> Dashboard.jsx (shell: inline sidebar + topbar + Outlet)
  /dashboard           -> DashboardHome.jsx (stats cards)
  /dashboard/clientes  -> Clientes.jsx (CRUD + modal)
  /dashboard/empleados -> Empleados.jsx (CRUD + modal)
  /dashboard/servicios -> Servicios.jsx (CRUD + modal)
  /dashboard/turnos    -> Turnos.jsx (react-big-calendar)
  /dashboard/usuarios  -> Usuarios.jsx (CRUD + modal)
  /dashboard/ganancias -> Ganancias.jsx (Chart.js revenue reports)
  /dashboard/comercios -> Comercios.jsx (SuperAdmin)
*                      -> NotFound.jsx
```

### Key Components
| Component | Purpose |
|-----------|---------|
| `AIChat.jsx` | AI Chat modal, POST to `/api/ai/chat`, quick-action badges, message templates with copy-to-clipboard |
| `Turnos.jsx` | Calendar appointment scheduling with react-big-calendar |
| `Ganancias.jsx` | Revenue reports with Chart.js (daily, weekly, monthly, annual, by service, by employee) |

### Legacy / Dead Code (DO NOT USE)
- `src/servicios/servicios.js` - old fetch-based API client, not imported
- `src/component/Layout.jsx` - replaced by Dashboard.jsx shell
- `src/component/Sidebar.jsx` - replaced by inline sidebar in Dashboard.jsx
- `src/component/CustomNavbar.jsx` - replaced by inline navbar in Dashboard.jsx
- `src/component/Home.jsx` - replaced by Landing.jsx

## Infrastructure
| Component | Tech | Notes |
|-----------|------|-------|
| **Database** | PostgreSQL via Supabase (local:54322 or cloud) | Docker compose for local dev |
| **Backend** | NestJS on :3000 | Docker multi-stage build (node:22) |
| **Frontend** | Vite dev server on :5173 | Built as static files |
| **Docker** | `docker-compose.yml` for PostgreSQL + `docker-compose-db.yml` | See root and backend |

## Project Root Files
| File | Purpose |
|------|---------|
| `package.json` | Root-level deps (axios, bcrypt, chart.js, supabase CLI) |
| `PROYECTO-COMPLETO.md` | Detailed SaaS overview with deployment strategy ($0 cost) |
| `.gitignore` | Blocks .env, node_modules, dist, logs, prisma migrations |
| `docker-compose.yml` / `docker-compose-db.yml` | Local PostgreSQL/Supabase infra |

## Tooling & Scripts
- **Backend:** `npm run start:dev` | `npx prisma migrate dev` | `npx prisma studio` | `npm run test` | `npm run test:e2e`
- **Frontend:** `npm run dev`
- **Infrastructure:** `docker-compose up -d` (PostgreSQL + Supabase)
- **Supabase:** `supabase start` (local: postgres:54322, api:54321, studio:54323, inbucket:54324)
