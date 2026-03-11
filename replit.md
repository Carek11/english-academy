# English Academy – replit.md

## Overview

English Academy is an Italian-language English learning platform targeted at Italian speakers who want to learn English, with a special focus on technical nautical/naval English for the Italian Navy (Marina Militare). The platform includes:

- Multiple course pages covering beginner through advanced levels
- Interactive quizzes with daily/monthly limits (enforced via localStorage)
- A naval glossary with 70+ bilingual terms organized by category
- A dedicated Marina Militare section with ship types, naval components, and images
- User authentication (register/login) with session management
- A personal statistics dashboard tracking quiz performance per topic
- A contact form and team/about page

The app is a full-stack TypeScript monorepo with a React frontend and Express backend, targeting Italian learners.

---

## User Preferences

Preferred communication style: Simple, everyday language.

---

## System Architecture

### Frontend Architecture

- **Framework:** React 18 with TypeScript, built with Vite
- **Routing:** Custom single-page routing managed in `App.tsx` via a `PageType` union type and state — no React Router. Pages are conditionally rendered based on `currentPage` state.
- **UI Components:** shadcn/ui component library (New York style) built on Radix UI primitives, styled with Tailwind CSS
- **State & Data Fetching:** TanStack React Query (`@tanstack/react-query`) for server state; local component state for UI
- **Form Handling:** react-hook-form with Zod resolvers for validation
- **Theming:** CSS custom properties (HSL-based) for light/dark mode support; custom Tailwind color tokens (`academy-blue`, `academy-gold`, etc.) extending the default theme
- **Fonts:** Google Fonts (Architects Daughter, DM Sans, Fira Code, Geist Mono) loaded via HTML `<link>` tags

**Key Pages:**
| Page | File | Purpose |
|---|---|---|
| Home | `pages/home.tsx` | Landing, stats, feature highlights |
| Courses | `pages/courses.tsx` | Course catalog with modal detail views |
| Marina | `pages/marina.tsx` | Naval section with ship types and images |
| Quiz | `pages/quiz.tsx` | Interactive quizzes with daily limits |
| Glossary | `pages/glossary.tsx` | Searchable/filterable bilingual glossary |
| Stats | `pages/stats.tsx` | Per-topic quiz stats dashboard |
| Auth | `pages/auth.tsx` | Login and registration forms |
| Team | `pages/team.tsx` | About/team story page |
| Contacts | `pages/contacts.tsx` | Contact form |

**Trial System:** `App.tsx` implements a 5-minute free trial timer (`TRIAL_DURATION = 5 * 60 * 1000`). After the timer expires, a modal prompts guest users to register.

### Backend Architecture

- **Runtime:** Node.js with Express 5
- **Language:** TypeScript, run via `tsx` in development; compiled with esbuild for production
- **Entry Point:** `server/index.ts` creates the HTTP server and registers middleware
- **Routing:** `server/routes.ts` registers all API endpoints (`/api/register`, `/api/login`, `/api/logout`, `/api/me`, `/api/contact`)
- **Session Management:** `express-session` with `memorystore` — sessions are stored in memory (not persisted to disk or database)
- **Static Files:** In production, `server/static.ts` serves the Vite-built frontend from `dist/public` with SPA fallback. In development, Vite middleware (`server/vite.ts`) handles HMR.

**Build:** `script/build.ts` runs both Vite (client) and esbuild (server) sequentially. Server dependencies in an allowlist are bundled; others are externalized.

### Data Storage

- **Current Storage:** `server/storage.ts` uses an in-memory `MemStorage` class (a `Map<string, User>`) — **data does not persist across server restarts**.
- **Database Schema:** `shared/schema.ts` defines a `users` table using Drizzle ORM with `drizzle-zod` for schema validation. The schema targets PostgreSQL (`dialect: "postgresql"` in `drizzle.config.ts`).
- **Migration Path:** Drizzle is configured for PostgreSQL via `DATABASE_URL`. Running `db:push` will sync the schema. To enable persistence, replace `MemStorage` with a Drizzle/PostgreSQL implementation of the `IStorage` interface.
- **Client-side Persistence:** Quiz statistics and daily/monthly quiz counts are stored in `localStorage` via `client/src/lib/statsStorage.ts`.

### Authentication & Authorization

- **Mechanism:** Session-based authentication using `express-session`
- **Session Store:** In-memory `memorystore` (not Redis or DB-backed)
- **Password Handling:** Passwords are currently stored as plain text — **no hashing is implemented yet**
- **Session Cookie:** 7-day max age, `secure: false` (suitable for HTTP development)
- **Auth Check:** `/api/me` endpoint returns the current user from session; frontend uses React Query to check auth state

### Shared Code

- `shared/schema.ts` is imported by both client and server via the `@shared/*` path alias, providing shared TypeScript types and Zod validation schemas.

---

## External Dependencies

### Frontend Libraries
| Library | Purpose |
|---|---|
| `@radix-ui/*` | Accessible headless UI primitives for all shadcn/ui components |
| `@tanstack/react-query` | Server state management and API data fetching |
| `react-hook-form` + `@hookform/resolvers` | Form state and validation |
| `zod` | Schema validation (shared with backend) |
| `tailwind-merge` + `clsx` | Conditional className utilities |
| `class-variance-authority` | Component variant styling |
| `embla-carousel-react` | Carousel/slider component |
| `date-fns` | Date formatting utilities |
| `lucide-react` | Icon set |
| `recharts` | Chart components (used in stats) |
| `vaul` | Drawer component |
| `cmdk` | Command palette component |
| `input-otp` | OTP input component |

### Backend Libraries
| Library | Purpose |
|---|---|
| `express` v5 | HTTP server framework |
| `express-session` | Session middleware |
| `memorystore` | In-memory session store |
| `drizzle-orm` | ORM for PostgreSQL |
| `drizzle-zod` | Auto-generate Zod schemas from Drizzle tables |
| `drizzle-kit` | Database migration tooling |
| `pg` | PostgreSQL client |
| `connect-pg-simple` | PostgreSQL session store (available but not currently active) |
| `nanoid` | ID generation |
| `zod` + `zod-validation-error` | Request body validation |

### Database
- **PostgreSQL** — required via `DATABASE_URL` environment variable
- Currently unused at runtime (storage is in-memory), but schema and config are in place

### Build & Dev Tools
| Tool | Purpose |
|---|---|
| `vite` + `@vitejs/plugin-react` | Frontend dev server and bundler |
| `esbuild` | Server-side bundler for production |
| `tsx` | TypeScript execution for development server |
| `@replit/vite-plugin-runtime-error-modal` | Runtime error overlay in Replit |
| `@replit/vite-plugin-cartographer` | Replit dev tool |
| `@replit/vite-plugin-dev-banner` | Replit dev tool |

### Environment Variables Required
| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (required for `drizzle-kit`) |
| `SESSION_SECRET` | Secret for signing session cookies (falls back to a hardcoded default — should be set in production) |
| `NODE_ENV` | `development` or `production` to toggle Vite middleware vs. static serving |