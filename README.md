# Vision Giants — Website Backend

REST API powering the Vision Giants software house website (public site + admin panel).

**Stack:** Node.js · Express · PostgreSQL (raw SQL, no ORM) · JWT auth · Docker

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Architecture Notes](#architecture-notes)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js 22 |
| Framework | Express 5 |
| Database | PostgreSQL 16 |
| DB Access | Raw SQL via `node-postgres` (no ORM, by design) |
| Auth | JWT, single admin role |
| Validation | Zod |
| Containerization | Docker + Docker Compose |

## Project Structure

```
src/
├── app.js               # Express app config, middleware, route mounting
├── server.js            # Entry point, process lifecycle handling
├── db/
│   ├── index.js         # PG connection pool
│   ├── migrate.js       # Migration runner
│   └── seedAdmin.js     # One-off admin user seeding script
├── migrations/           # Plain .sql migration files, applied in order
├── schemas/              # Zod validation schemas, one per resource
├── controllers/          # Route handlers
├── queries/               # Raw SQL, one file per resource
├── routes/                # Express routers
└── middleware/
    ├── auth.js           # JWT verification
    ├── validate.js        # Zod request validation
    ├── errorHandler.js    # Centralized error handling
    └── rateLimiter.js      # Rate limiting for public write endpoints
```

## Getting Started

### Option A — Docker (recommended)

Requires only Docker installed — no local Node.js or Postgres needed.

```bash
cp .env.example .env
# fill in JWT_SECRET and DB_PASSWORD in .env

docker compose up --build
```

API available at `http://localhost:5000`. Migrations run automatically on container start.

Seed an admin user:
```bash
docker compose exec api node src/db/seedAdmin.js <email> <password> <name>
```

Stop:
```bash
docker compose down          # keep DB volume
docker compose down -v       # wipe DB volume too
```

### Option B — Local (Node + Postgres installed manually)

```bash
npm install
cp .env.example .env
# fill in DATABASE_URL, JWT_SECRET, FRONTEND_URL

npm run migrate
node src/db/seedAdmin.js <email> <password> <name>
npm run dev
```

### Verify it's running

```bash
curl http://localhost:5000/health
# → { "status": "ok" }
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes (local only) | Postgres connection string. Not needed with Docker — Compose builds it from `DB_PASSWORD`. |
| `JWT_SECRET` | Yes | Signing secret for admin auth tokens. Use a long random string in production. |
| `FRONTEND_URL` | Yes | Allowed CORS origin. Must match the frontend's actual URL exactly. |
| `PORT` | No (default `5000`) | Port the API listens on. |
| `NODE_ENV` | No (default `development`) | Set to `production` on deploy — affects SSL handling and error verbosity. |
| `DB_PASSWORD` | Docker only | Postgres password used inside `docker-compose.yml`. |


## API Reference

All responses follow a consistent envelope:

```json
// success
{ "success": true, "data": { ... }, "error": null }

// failure
{ "success": false, "data": null, "error": "message" }
```

### Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | — | `{ email, password }` → `{ token, admin }`. Token valid 7 days, sent as `Authorization: Bearer <token>`. |

### Resources

Public routes require no auth header. Admin routes require `Authorization: Bearer <token>`.

| Resource | Method | Path | Auth | Notes |
|---|---|---|---|---|
| Services | `GET` | `/api/services` | Public | List all |
| | `GET` | `/api/services/:slug` | Public | Single |
| | `POST` `PUT` `DELETE` | `/api/services` `/:id` | Admin | CRUD |
| Portfolio | `GET` | `/api/portfolio` | Public | List all |
| | `GET` | `/api/portfolio/:slug` | Public | Single |
| | `POST` `PUT` `DELETE` | `/api/portfolio` `/:id` | Admin | CRUD |
| Blog | `GET` | `/api/blog` | Public | Published only |
| | `GET` | `/api/blog/admin/all` | Admin | Includes drafts |
| | `GET` | `/api/blog/:slug` | Public | Single |
| | `POST` `PUT` `DELETE` | `/api/blog` `/:id` | Admin | CRUD |
| Team | `GET` | `/api/team` | Public | List all |
| | `POST` `PUT` `DELETE` | `/api/team` `/:id` | Admin | CRUD |
| Testimonials | `GET` | `/api/testimonials` | Public | List all |
| | `POST` `PUT` `DELETE` | `/api/testimonials` `/:id` | Admin | CRUD |
| Jobs | `GET` | `/api/jobs` | Public | Active only |
| | `GET` | `/api/jobs/admin/all` | Admin | All postings |
| | `GET` | `/api/jobs/:slug` | Public | Single |
| | `POST` `PUT` `DELETE` | `/api/jobs` `/:id` | Admin | CRUD |
| Applications | `GET` | `/api/applications` | Admin | Applicant data — sensitive |
| | `POST` | `/api/applications` | Public | Submit (rate-limited) |
| | `DELETE` | `/api/applications/:id` | Admin | |
| Leads | `GET` | `/api/leads` | Admin | Contact submissions |
| | `POST` | `/api/leads` | Public | Submit (rate-limited) |
| | `PATCH` | `/api/leads/:id/status` | Admin | `new` / `contacted` / `closed` |

### Example — authenticated request

```bash
curl -X POST http://localhost:5000/api/services \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Web Development","slug":"web-development","image":"https://..."}'
```

## Architecture Notes

- **No ORM, intentionally.** Raw SQL via `pg`, one `queries/` file per resource — chosen for full query control and to avoid Prisma's known cold-start/binary issues on Railway.
- **Migrations are plain `.sql` files**, tracked in a `migrations` table and applied in filename order — no migration framework.
- **Single admin, no RBAC.** Matches actual usage; not built for multiple admin roles.
- **`asyncHandler` wraps all controllers** so thrown/rejected errors always reach `errorHandler` instead of crashing the process.
- **Process-level safety nets** in `server.js`: `unhandledRejection` and `uncaughtException` are caught and logged rather than left to crash silently; `SIGTERM` triggers a graceful shutdown (drains the connection pool before exit) — matters on Railway, which sends `SIGTERM` before redeploys.
- **File uploads are not yet implemented.** Image/resume fields (`image`, `photo`, `cover_image`, `resume_url`) expect a pre-hosted URL string. Cloudinary integration is planned but not built.
