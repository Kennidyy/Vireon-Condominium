# Vireon Condominium API

This NestJS application contains the current backend for Vireon Condominium. It is a modular monolith with Identity, Auth, and Resident modules sharing Prisma and PostgreSQL infrastructure.

The documented product delivery is `v0.2.0`, a pre-1.0 development delivery. Public routes and domain contracts may still change incompatibly.

## Module responsibilities

| Module   | Current responsibility                                                                           |
| -------- | ------------------------------------------------------------------------------------------------ |
| Identity | User creation, lookup, update, deletion, email/password rules, roles, and user persistence       |
| Auth     | Login orchestration, JWT signing/validation, bearer-token guards, and role guards                |
| Resident | Resident profile aggregate, contacts, profile-photo metadata, use cases, routes, and persistence |

Resident is documented in detail in the [Resident bounded-context document](../../../docs/contexts/bounded-contexts/resident.md). The [architecture overview](../../../docs/architecture/overview.md) explains the module and layer boundaries.

## Source layout

```text
src/apps/api/
├── infrastructure/
│   ├── database/prisma/       Schema, migrations, and seed source
│   └── docker/                Local PostgreSQL Compose service
├── src/
│   ├── config/                App, auth, and database configuration
│   ├── infrastructure/        Shared Prisma module and service
│   └── modules/
│       ├── identity/
│       ├── auth/
│       └── resident/
└── test/                      Jest E2E configuration; no active E2E spec
```

Within Resident, presentation calls application use cases; use cases coordinate domain behavior through the `ResidentRepository` port; and infrastructure supplies Prisma and in-memory adapters. The domain source has no NestJS or Prisma imports. Application use cases currently use NestJS dependency-injection decorators, so framework independence applies to the domain layer rather than the whole core.

## Requirements

- Bun `1.3.14`
- Docker with Docker Compose V2
- PostgreSQL `17` through the repository Compose file, or a compatible external database

## Environment

From the repository root:

```bash
cp src/apps/api/.env.example src/apps/api/.env
```

Do not commit `.env`.

| Variable            | Required              | Default       | Purpose                             |
| ------------------- | --------------------- | ------------- | ----------------------------------- |
| `DATABASE_URL`      | Yes                   | None          | Prisma/PostgreSQL connection string |
| `POSTGRES_USER`     | Yes for local Compose | None          | PostgreSQL user                     |
| `POSTGRES_PASSWORD` | Yes for local Compose | None          | PostgreSQL password                 |
| `POSTGRES_DB`       | Yes for local Compose | None          | PostgreSQL database                 |
| `DB_PORT`           | Yes for local Compose | None          | Host PostgreSQL port                |
| `JWT_SECRET`        | Yes                   | None          | JWT signing and validation secret   |
| `JWT_EXPIRES_IN`    | No                    | `15m`         | Access-token lifetime               |
| `PORT`              | No                    | `3000`        | HTTP listener port                  |
| `NODE_ENV`          | No                    | `development` | Runtime environment label           |

## Database setup

Start PostgreSQL from the repository root:

```bash
bun run db:up
```

Prisma commands must run from `src/apps/api`, where `prisma.config.ts` defines the schema and migration paths:

```bash
cd src/apps/api
bunx prisma generate
bunx prisma migrate dev
```

From the repository root, the development seed can be applied with:

```bash
just db-seed
```

For a non-development environment, use the migration deployment command appropriate to that environment:

```bash
bunx prisma migrate deploy
```

`just setup` starts the development database, applies committed migrations, and
runs this seed automatically.

## Run the API

From `src/apps/api`:

```bash
bun run dev
```

The default base URL is `http://localhost:3000`.

From the repository root, `bun run dev` starts the Turborepo development task instead.
It also resolves the database host automatically when invoked inside the
optional Dev Container. Prefer this root command (or `just dev`) there; running
the API workspace's `bun run dev` directly bypasses the container-aware database
wrapper. The local `.env` should continue to use `localhost` so it remains valid
for host development.

## Authentication

Login uses the Auth controller, not Identity:

```http
POST /auth/login
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "Example123!"
}
```

A successful request returns:

```json
{
  "accessToken": "<jwt>"
}
```

Send the token to protected routes:

```http
Authorization: Bearer <jwt>
```

## Route inventory

### Auth and Identity

| Method   | Route                 | Access        | Purpose                                             |
| -------- | --------------------- | ------------- | --------------------------------------------------- |
| `POST`   | `/auth/login`         | Public        | Authenticate an email/password pair and issue a JWT |
| `GET`    | `/identity/users`     | `ADMIN`       | List users, or search by email with `?email=...`    |
| `GET`    | `/identity/users/:id` | `ADMIN`       | Find a user by identifier                           |
| `POST`   | `/identity/users`     | `ADMIN`       | Create a user                                       |
| `PATCH`  | `/identity/users/:id` | `ADMIN`       | Update optional email, password, or role fields     |
| `DELETE` | `/identity/users/:id` | `ADMIN`       | Delete a user                                       |
| `GET`    | `/identity/me`        | Authenticated | Return the JWT subject identifier and role          |

### Resident

| Method   | Route                                        | Access          | Purpose                                                     |
| -------- | -------------------------------------------- | --------------- | ----------------------------------------------------------- |
| `POST`   | `/residents`                                 | `USER`, `ADMIN` | Create the authenticated user's Resident profile            |
| `PATCH`  | `/residents`                                 | `USER`, `ADMIN` | Rename the authenticated user's Resident profile            |
| `GET`    | `/residents/search?name=...`                 | Public          | Search residents by name fragment (case-insensitive)        |
| `GET`    | `/residents`                                 | `ADMIN`         | List residents; `403` for `USER`, `401` without credentials |
| `GET`    | `/residents/:id`                             | `ADMIN`         | Get one resident                                            |
| `DELETE` | `/residents/:id`                             | `ADMIN`         | Delete a resident                                           |
| `PATCH`  | `/residents/:id/photo`                       | `ADMIN`         | Replace profile-photo metadata                              |
| `POST`   | `/residents/:id/contacts`                    | `USER`, `ADMIN` | Add a contact; `USER` must be the owner (else `403`)        |
| `PATCH`  | `/residents/:id/contacts/:contactId`         | `USER`, `ADMIN` | Change a contact value; `USER` must be the owner            |
| `PATCH`  | `/residents/:id/contacts/:contactId/primary` | `USER`, `ADMIN` | Make one contact primary; `USER` must be the owner          |
| `DELETE` | `/residents/:id/contacts/:contactId`         | `USER`, `ADMIN` | Remove a contact; `USER` must be the owner                  |

The concise inventory is not a substitute for the [Resident Public API contract](../../../docs/contexts/bounded-contexts/resident.md#public-api), which records bodies, responses, errors, and current ownership behavior.

## Validation and error behavior

The global `ValidationPipe` removes unknown fields, rejects non-whitelisted fields, and transforms supported values. DTO validation failures are NestJS HTTP exceptions and normally return `400`.

The registered global exception filter emits `{ statusCode, message, path, requestId, code? }` for every non-2xx response:

| Failure                                    | Current HTTP behavior                                                         |
| ------------------------------------------ | ----------------------------------------------------------------------------- |
| Invalid or missing bearer token            | `401` through Passport/NestJS                                                 |
| Authenticated user without a required role | `403` through NestJS                                                          |
| DTO validation                             | `400` with the DTO message                                                    |
| Domain/application exception               | Its mapped status (e.g. `400`, `404`, `409`, `403`) with its code and message |
| `ResidentAccessDenied`                     | `403` with `code: RESIDENT_ACCESS_DENIED`                                     |
| Unexpected error                           | `500` with the generic message `Internal server error`                        |

The response always carries `requestId`, which the server generates unless a client supplies a valid `X-Request-Id` header (max 64 characters in `[A-Za-z0-9._:-]`). Every response also repeats the identifier in the `x-request-id` header.

## Request logging

Each request is logged on completion as `METHOD path status durationMs requestId=...` using NestJS's logger. For manual debugging enable the Nest logger in your terminal.

## Profile-photo scope

Resident validates and persists `storageKey`, content type, and byte size. The API accepts JSON metadata; it does not accept multipart file uploads. A resident without photo metadata is valid at the domain level and responses then return the default `defaults/profile.jpg` avatar. The current repository has no MinIO/S3 service, object-storage adapter, signed-read endpoint, or binary cleanup flow.

## Tests and quality commands

From `src/apps/api`:

```bash
TMPDIR=/tmp bun run test
bun run check-types
bun run lint
bun run build
bash test/run-e2e.sh
```

`TMPDIR=/tmp` avoids a known WSL failure when Jest inherits an unavailable Windows temporary-directory path. It is harmless on a normal Linux shell and is not required by the GitHub Actions environment.

Run only Resident unit specifications:

```bash
TMPDIR=/tmp bun run test -- --runInBand --testPathPatterns=modules/resident
```

Resident and Identity have domain, application, mapper, in-memory repository, DTO, and controller unit specifications. The use-case tests use `FakeResidentRepository`; they do not exercise PostgreSQL. `test/run-e2e.sh` boots an ephemeral PostgreSQL container (applying migrations and seed), runs the suite at `test/`, and then tears the container down; it covers login (including a corrupted-hash `401`), identity administration, resident flows, ownership `403`s, the error contract, and the OpenAPI document.

The API `lint` script includes `--fix`, so it can rewrite TypeScript files. Use it with an intentionally clean or reviewed worktree.

## Related documentation

- [Project README](../../../README.md)
- [Documentation index](../../../docs/README.md)
- [Architecture overview](../../../docs/architecture/overview.md)
- [Engineering decisions](../../../docs/architecture/engineering-decisions.md)
- [Resident bounded context](../../../docs/contexts/bounded-contexts/resident.md)
- [Changelog](../../../CHANGELOG.md)
