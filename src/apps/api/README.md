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

For a non-development environment, use the migration deployment command appropriate to that environment:

```bash
bunx prisma migrate deploy
```

The repository contains a development seed source, but it is not wired to a package script or Prisma seed entry. Inspect the file and its credentials before choosing to run it manually.

## Run the API

From `src/apps/api`:

```bash
bun run dev
```

The default base URL is `http://localhost:3000`.

From the repository root, `bun run dev` starts the Turborepo development task instead.

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

| Method   | Route                       | Access        | Purpose                                             |
| -------- | --------------------------- | ------------- | --------------------------------------------------- |
| `POST`   | `/auth/login`               | Public        | Authenticate an email/password pair and issue a JWT |
| `GET`    | `/identity/users?email=...` | `ADMIN`       | Find a user by email                                |
| `GET`    | `/identity/users/:id`       | `ADMIN`       | Find a user by identifier                           |
| `POST`   | `/identity/users`           | `ADMIN`       | Create a user                                       |
| `PATCH`  | `/identity/users/:id`       | `ADMIN`       | Update optional email, password, or role fields     |
| `DELETE` | `/identity/users/:id`       | `ADMIN`       | Delete a user                                       |
| `GET`    | `/identity/all`             | `ADMIN`       | List users                                          |
| `GET`    | `/identity/me`              | Authenticated | Return the JWT subject identifier and role          |

### Resident

| Method   | Route                                        | Access          | Purpose                                          |
| -------- | -------------------------------------------- | --------------- | ------------------------------------------------ |
| `POST`   | `/residents`                                 | `USER`, `ADMIN` | Create the authenticated user's Resident profile |
| `PATCH`  | `/residents`                                 | `USER`, `ADMIN` | Rename the authenticated user's Resident profile |
| `GET`    | `/residents?name=...`                        | Public          | Search residents by name                         |
| `GET`    | `/residents/all`                             | `ADMIN`         | List residents                                   |
| `GET`    | `/residents/:id`                             | `ADMIN`         | Get one resident                                 |
| `DELETE` | `/residents/:id`                             | `ADMIN`         | Delete a resident                                |
| `PATCH`  | `/residents/:id/photo`                       | `ADMIN`         | Replace profile-photo metadata                   |
| `POST`   | `/residents/:id/contacts`                    | `USER`, `ADMIN` | Add a contact                                    |
| `PATCH`  | `/residents/:id/contacts/:contactId`         | `USER`, `ADMIN` | Change a contact value                           |
| `PATCH`  | `/residents/:id/contacts/:contactId/primary` | `USER`, `ADMIN` | Make one contact primary                         |
| `DELETE` | `/residents/:id/contacts/:contactId`         | `USER`, `ADMIN` | Remove a contact                                 |

The concise inventory is not a substitute for the [Resident Public API contract](../../../docs/contexts/bounded-contexts/resident.md#public-api), which records bodies, responses, errors, and current ownership behavior.

## Validation and error behavior

The global `ValidationPipe` removes unknown fields, rejects non-whitelisted fields, and transforms supported values. DTO validation failures are NestJS HTTP exceptions and normally return `400`.

The registered global exception filter currently behaves as follows:

| Failure                                    | Current HTTP behavior                               |
| ------------------------------------------ | --------------------------------------------------- |
| Invalid or missing bearer token            | `401` through Passport/NestJS                       |
| Authenticated user without a required role | `403` through NestJS                                |
| DTO or other `HttpException`               | Original HTTP status with `{ statusCode, message }` |
| Identity `DomainException`                 | `400` with `{ statusCode, code, message }`          |
| Unexpected error                           | `500` with a generic message                        |

Two important limitations remain:

- Resident declares a separate `DomainException` class, so Resident typed exceptions do not match the Identity exception class imported by the global filter and currently fall through to generic `500` responses.
- `LoginUserUseCase` currently throws a generic `Error` for wrong credentials, so its dedicated `401` filter branch is not reached.

These are implementation facts; this documentation does not redefine the current HTTP contract.

## Profile-photo scope

Resident validates and persists `storageKey`, content type, and byte size. The API accepts JSON metadata; it does not accept multipart file uploads. The current repository has no MinIO/S3 service, object-storage adapter, signed-read endpoint, or binary cleanup flow.

## Tests and quality commands

From `src/apps/api`:

```bash
TMPDIR=/tmp bun run test
bun run check-types
bun run lint
bun run build
```

`TMPDIR=/tmp` avoids a known WSL failure when Jest inherits an unavailable Windows temporary-directory path. It is harmless on a normal Linux shell and is not required by the GitHub Actions environment.

Run only Resident unit specifications:

```bash
TMPDIR=/tmp bun run test -- --runInBand --testPathPatterns=modules/resident
```

Resident has domain, application, mapper, in-memory repository, DTO, and controller unit specifications. Controller tests exercise response mapping indirectly; there is no dedicated `ResidentResponseMapper` specification. The use-case tests use `FakeResidentRepository`; they do not exercise PostgreSQL. The `test/jest-e2e.json` configuration remains, but no active E2E specification is present.

The API `lint` script includes `--fix`, so it can rewrite TypeScript files. Use it with an intentionally clean or reviewed worktree.

## Related documentation

- [Project README](../../../README.md)
- [Documentation index](../../../docs/README.md)
- [Architecture overview](../../../docs/architecture/overview.md)
- [Engineering decisions](../../../docs/architecture/engineering-decisions.md)
- [Resident bounded context](../../../docs/contexts/bounded-contexts/resident.md)
- [Changelog](../../../CHANGELOG.md)
