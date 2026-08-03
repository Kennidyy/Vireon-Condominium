# Changelog

This changelog records public project deliveries. Vireon is still in initial
development, so its API, architecture, and domain model may change
incompatibly before `1.0.0`.

## v0.2.0 — Prepared for publication

This delivery introduces the implemented Resident bounded context and records
the current architectural limitations that remain before publication.

### Added

- The [Resident aggregate](src/apps/api/src/modules/resident/domain/entities/Resident.ts),
  including owned contacts and profile-photo metadata, typed domain errors, and
  value validation for names, UUIDs, email addresses, Brazilian mobile phone
  numbers, and supported image metadata.
- Resident application operations for creation, lookup, listing, deletion,
  name changes, profile-photo metadata replacement, and contact management in
  the [application layer](src/apps/api/src/modules/resident/application/).
- The [Resident HTTP API](src/apps/api/src/modules/resident/presentation/nestjs/controllers/resident.controller.ts),
  with authentication and role checks on protected operations.
- A [Resident repository port](src/apps/api/src/modules/resident/application/ports/ResidentRepository.ts),
  a [Prisma adapter](src/apps/api/src/modules/resident/infrastructure/repositories/PrismaResidentRepository.ts),
  and an in-memory adapter for tests.
- PostgreSQL persistence for residents, contacts, and profile-photo metadata in
  the [Prisma schema](src/apps/api/infrastructure/database/prisma/schema.prisma)
  and related migrations.
- Unit tests across the Resident domain, application, infrastructure, and
  presentation layers.
- A documented initial-development versioning policy and consolidated
  [engineering decisions](docs/architecture/engineering-decisions.md).

### Changed

- Authentication responsibilities were separated from Identity into the
  [Auth module](src/apps/api/src/modules/auth/presentation/auth.module.ts).
  Identity remains the source of user data used during authentication.
- Resident errors were changed from generic errors to typed domain and
  application exceptions.
- Docker Compose commands and configuration were reorganized around the
  current infrastructure layout.
- Project deliveries now use `0.MINOR.PATCH`: `MINOR` for relevant functional
  deliveries during initial development and `PATCH` for compatible fixes
  within the same delivery.

### Fixed

- Corrected the Resident repository filename and its imports.
- Corrected Resident creation and value-validation error paths and added tests
  for the resulting typed exceptions.

### Removed

- Removed the incomplete object-storage service, commands, and environment
  configuration. The current
  [Compose configuration](src/apps/api/infrastructure/docker/docker-compose.yaml)
  starts PostgreSQL only.
- Removed the previous Identity E2E specification. An E2E configuration file
  remains, but no replacement E2E specification is currently present.

### Known limitations

- `Resident.id` currently reuses `User.id`. This simplifies the present
  one-to-one association but couples the identities and lifecycles of the two
  concepts. This is temporary and is not a permanent domain invariant.
- Profile-photo operations accept and persist metadata such as `storageKey`,
  content type, and size; they do not upload, read, verify, or delete an object
  in external storage.
- Resident domain and application exceptions extend a Resident-specific base,
  while the current
  [global exception filter](src/apps/api/src/modules/identity/presentation/nestjs/filters/GlobalExceptionFilter.ts)
  recognizes Identity's exception base. Resident exceptions can therefore fall
  through to the generic `500` response instead of the intended domain-error
  response.
- Resident application use cases use NestJS dependency-injection decorators.
  The domain is framework-independent, but the application layer is not fully
  framework-agnostic.
- The Resident presentation layer imports Auth guards, role metadata, and the
  Auth role enum through concrete Auth paths. Domain and application code remain
  separated from Auth, but the HTTP adapter is coupled to Auth's current module
  layout.
- The Prisma relation permits a resident without a profile-photo row, while the
  current domain and repository paths expect one and treat its absence as
  corrupted persisted data.
- Contact mutation routes allow both `USER` and `ADMIN` roles to address a
  resident by path identifier, but they do not compare that identifier with the
  authenticated user's identifier. Resident ownership is therefore not yet
  enforced on those routes.
- No current E2E specification verifies the complete HTTP, authorization, and
  PostgreSQL flow.
