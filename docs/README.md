# Vireon Documentation

This directory describes the repository state prepared for `v0.2.0`. The project remains in pre-1.0 development, so API contracts, architecture, and domain boundaries may change incompatibly.

Documentation distinguishes four states:

- **Implemented**: observable in current source, schema, wiring, or tests.
- **Partially implemented**: a usable portion exists, with explicit missing behavior.
- **Planned**: future direction with no claim of operational code.
- **Removed or postponed**: intentionally absent from the current runtime.

## Start here

| Question                                       | Document                                                          |
| ---------------------------------------------- | ----------------------------------------------------------------- |
| What is Vireon and how do I run it?            | [Project README](../README.md)                                    |
| How is the backend structured?                 | [Architecture overview](architecture/overview.md)                 |
| Why were the current trade-offs chosen?        | [Engineering decisions](architecture/engineering-decisions.md)    |
| What does Resident own and expose?             | [Resident bounded context](contexts/bounded-contexts/resident.md) |
| What does Identity own?                        | [Identity bounded context](contexts/bounded-contexts/identity.md) |
| What are the API-specific commands and routes? | [API README](../src/apps/api/README.md)                           |
| What is included in `v0.2.0`?                  | [Changelog](../CHANGELOG.md)                                      |

## Architecture

- [Architecture overview](architecture/overview.md) — runtime composition, dependency flow, module boundaries, persistence, and current qualifications.
- [Engineering decisions](architecture/engineering-decisions.md) — versioning, modular-monolith shape, aggregate boundaries, repository abstraction, shared identifiers, and postponed storage.

## Bounded contexts and modules

- [Identity](contexts/bounded-contexts/identity.md) — user identity and persistence boundary.
- [Resident](contexts/bounded-contexts/resident.md) — authoritative purpose, aggregate, use cases, HTTP API, persistence, authorization, testing, and limitations.
- Auth is currently documented in the [architecture overview](architecture/overview.md) and [API README](../src/apps/api/README.md); it does not yet have a dedicated bounded-context document.

## Resident domain model

- [Resident](contexts/domain-models/resident/resident.md) — aggregate root and supported operations.
- [Contact](contexts/domain-models/resident/contact.md) and [ContactType](contexts/domain-models/resident/contact-type.md) — resident-owned communication channels.
- [ProfilePhoto](contexts/domain-models/resident/profile-photo.md) — photo metadata and validation; not binary storage.
- [Uuid](contexts/domain-models/resident/uuid.md) — generic UUID value object used by the Resident model.
- [PersonName](contexts/domain-models/resident/person-name.md) — normalization and validation.
- [Email](contexts/domain-models/resident/email.md) and [Phone](contexts/domain-models/resident/phone.md) — contact-value validation.

The current implementation has no dedicated `ResidentId` or `UserId` value-object classes. Identifier coupling and its planned evolution are documented in the [Resident context](contexts/bounded-contexts/resident.md#temporary-shared-identifier).

## API and local execution

The [API README](../src/apps/api/README.md) covers environment variables, database startup, Prisma commands, application startup, quality commands, and a concise route inventory. The detailed Resident contract remains in one place: [Resident Public API](contexts/bounded-contexts/resident.md#public-api).

The local Bruno collection is ignored by Git and is therefore not part of the public documentation set.

## Testing

Resident unit specifications are co-located with the source under [`src/apps/api/src/modules/resident`](../src/apps/api/src/modules/resident). They cover domain behavior, application orchestration through the in-memory repository, persistence mapping, request DTOs, response mapping, and controller delegation.

There is no active integration or end-to-end specification in the current tree. The CI workflow starts PostgreSQL and deploys migrations before running the same workspace test command; that does not make the unit suite a database integration suite.

## Releases

- [`v0.2.0` delivery notes](../CHANGELOG.md)
- Versioning rules are recorded under [Versioning during initial development](architecture/engineering-decisions.md#versioning-during-initial-development).

Skipped version numbers are not backfilled, and `1.0.0` is reserved for explicitly defined product and public-contract stability.

## Documentation sources of truth

When documentation conflicts with implementation, use this evidence order:

1. controllers, DTOs, module wiring, and application use cases for the HTTP/application contract;
2. domain entities, value objects, exceptions, and their tests for business behavior;
3. Prisma schema and migrations for relational persistence behavior;
4. package scripts, Compose configuration, and CI workflow for operational commands;
5. documentation and historical notes for explanation, never as proof of unimplemented behavior.

Return to the [project README](../README.md).
