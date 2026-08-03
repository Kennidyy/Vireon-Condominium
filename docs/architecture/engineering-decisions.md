# Engineering Decisions

This document records decisions in the current `v0.2.0` implementation. It is not a set of
retroactive architecture decision records: dates, alternatives, and outcomes
that are not supported by repository evidence are intentionally omitted.

The decisions describe the current development phase. Planned evolution is
identified explicitly and must not be read as implemented behavior.

## Modular monolith

**Context.** Identity, Auth, and Resident are implemented in one NestJS API.
They share one process, one composition root, and one PostgreSQL database.

**Decision.** Keep the backend as a modular monolith organized by bounded
context. [AppModule](../../src/apps/api/src/app.module.ts) composes the
[Identity module](../../src/apps/api/src/modules/identity/presentation/nestjs/identity.module.ts),
[Auth module](../../src/apps/api/src/modules/auth/presentation/auth.module.ts),
and [Resident module](../../src/apps/api/src/modules/resident/presentation/nestjs/resident.module.ts).

**Rationale.** A single deployable keeps development, local operation, and
cross-context integration manageable while the product and its contracts are
still changing.

**Consequences and limitations.** Contexts can evolve behind module boundaries
without introducing distributed-system operations. They still share runtime
failure modes and database infrastructure, and TypeScript import rules do not
enforce the boundaries. The current direct imports at some presentation and
composition boundaries therefore matter and are documented below.

## Identity, Auth, and Resident boundaries

**Context.** A user account, authentication, and a resident profile represent
related but different responsibilities.

**Decision.** Identity owns user identity and account data. Auth owns login,
token signing, JWT validation, and role enforcement. Resident owns resident
profile behavior, contacts, and profile-photo metadata. The
[Resident aggregate](../../src/apps/api/src/modules/resident/domain/entities/Resident.ts)
does not import or manipulate Identity's `User` entity.

Resident receives an authenticated identifier through its HTTP adapter and
passes it into its own application and domain types. The
[Resident controller](../../src/apps/api/src/modules/resident/presentation/nestjs/controllers/resident.controller.ts)
is the current integration point with Auth.

**Rationale.** Keeping `User` out of the Resident domain avoids making resident
business rules depend on Identity's entity model. Separating Auth from Identity
also makes authentication an explicit responsibility rather than a hidden part
of user management.

**Consequences and limitations.** The domain and application layers remain
separate from Identity and Auth entities. The presentation layer directly
imports `JwtAuthGuard`, `RolesGuard`, `Roles`, and `UserRole` from concrete Auth
paths, so it is coupled to Auth's internal layout rather than a stable public
module contract. Auth composition also uses Identity providers and password
hashing adapters, as shown in the [Auth module](../../src/apps/api/src/modules/auth/presentation/auth.module.ts).

## Temporary shared User and Resident identifier

**Status.** Confirmed as a temporary development decision.

**Context.** The current phase needs a simple one-to-one association between
Identity and Resident without introducing an additional Resident identity and
association lifecycle.

**Current decision.** In `v0.2.0`, `Resident.id` reuses the exact value of
`User.id`. The
[creation use case](../../src/apps/api/src/modules/resident/application/use-cases/CreateResidentUseCase.ts)
passes the authenticated user identifier to `Resident.create`, and the
[Resident entity](../../src/apps/api/src/modules/resident/domain/entities/Resident.ts)
currently exposes the same stored UUID as both `id` and `userId`. In the
[Prisma schema](../../src/apps/api/infrastructure/database/prisma/schema.prisma),
`Resident.id` is both the Resident primary key and the foreign key to `User.id`.

**Benefit.** Reusing one identifier reduces one-to-one integration and
persistence complexity during the current development phase.

**Consequence.** The identity cycles of `User` and `Resident` are coupled. Code
that addresses a resident by ID is implicitly addressing the associated user
identifier as well.

**Limitation.** Identity and Resident cannot have fully independent identities
or lifecycles. This identifier equality is an implementation simplification,
not a permanent domain invariant.

**Planned evolution.** Introduce an identity owned by Resident and preserve the
association to Identity through a separate `userId`. That change is planned,
not implemented in `v0.2.0`.

## Resident aggregate ownership and invariants

**Context.** Resident profile changes need a consistency boundary that owns the
rules for contacts and profile-photo metadata.

**Decision.** `Resident` is the aggregate root. `Contact` and `ProfilePhoto`
belong to that aggregate and are changed through Resident behavior. The
[Resident entity](../../src/apps/api/src/modules/resident/domain/entities/Resident.ts)
owns the collection and replacement operations; the
[Contact entity](../../src/apps/api/src/modules/resident/domain/entities/Contact.ts)
and [ProfilePhoto entity](../../src/apps/api/src/modules/resident/domain/entities/ProfilePhoto.ts)
encapsulate their local validation.

Current creation and mutation paths enforce these rules:

- a resident name is normalized, required, limited to 255 characters, and
  restricted to the implemented character set;
- a resident can contain at most ten contacts when created or when a contact is
  added;
- setting a primary contact clears the primary flag from the other contacts;
- contact values are validated as either email addresses or Brazilian mobile
  phone numbers according to their type;
- newly created profile-photo metadata requires a storage key, accepts PNG or
  JPEG, and rejects sizes above 5 MiB;
- a profile photo is replaced as one aggregate-owned value rather than mutated
  field by field.

**Consequences and limitations.** Business validation is concentrated in the
domain instead of controllers or Prisma. Enforcement is not yet uniform across
every construction path: restoration does not recheck the contact-count,
single-primary-contact, contact-value, profile-photo-type, size, or storage-key
rules. The database also allows a nullable profile-photo relation, while
Resident creation supplies a default and the Prisma repository treats a missing
photo as corrupted persisted data. These are current model-alignment gaps, not
additional domain decisions.

## Ports, adapters, and dependency direction

**Context.** Resident use cases need persistence without depending directly on
Prisma.

**Decision.** The application layer defines the
[`ResidentRepository` port](../../src/apps/api/src/modules/resident/application/ports/ResidentRepository.ts).
Infrastructure supplies the
[Prisma adapter](../../src/apps/api/src/modules/resident/infrastructure/repositories/PrismaResidentRepository.ts)
and an [in-memory adapter](../../src/apps/api/src/modules/resident/infrastructure/mock/FakeResidentRepository.ts).
The [Resident module](../../src/apps/api/src/modules/resident/presentation/nestjs/resident.module.ts)
binds the `ResidentRepository` injection token to the Prisma implementation.

The intended dependency direction is Presentation to Application to Domain.
Infrastructure depends inward on the application port and domain model, while
the outer NestJS module performs composition.

**Benefit.** Use cases can be tested against an in-memory implementation, and
Prisma-specific mapping remains outside the domain.

**Consequences and limitations.** Persistence dependency inversion is present,
but the application layer imports `Inject` and `Injectable` from NestJS, as seen
in the [Resident creation use case](../../src/apps/api/src/modules/resident/application/use-cases/CreateResidentUseCase.ts).
The domain is framework-independent; describing the entire application core as
framework-independent would be inaccurate in the current implementation.

## Separate creation and restoration paths

**Context.** Creating a new domain object and reconstructing persisted state
have different identity requirements.

**Decision.** Entities expose explicit `create` and `restore` factories.
Creation generates or accepts the identity required for a new object and
applies new-input validation. Restoration accepts persisted identifiers and is
called by the
[Resident mapper](../../src/apps/api/src/modules/resident/infrastructure/mappers/ResidentMapper.ts)
when converting Prisma records back into domain objects.

Examples include
[`Resident.create` and `Resident.restore`](../../src/apps/api/src/modules/resident/domain/entities/Resident.ts),
[`Contact.create` and `Contact.restore`](../../src/apps/api/src/modules/resident/domain/entities/Contact.ts),
and
[`ProfilePhoto.create` and `ProfilePhoto.restore`](../../src/apps/api/src/modules/resident/domain/entities/ProfilePhoto.ts).

**Benefit.** Persistence can preserve identity without pretending that a loaded
record is a newly created entity.

**Consequences and limitations.** The restoration paths currently trust several
persisted fields and bypass validations performed during creation. UUIDs and the
resident name are reconstructed through value objects, but contacts and
profile-photo metadata are not fully revalidated. Database constraints and
repository checks therefore carry part of the integrity responsibility.

## Value objects for validated domain values

**Context.** Identifiers, names, email addresses, and phone numbers require
normalization and validation that should not be repeated across controllers and
use cases.

**Decision.** Represent these concepts with
[`Uuid`](../../src/apps/api/src/modules/resident/domain/value-objects/Uuid.ts),
[`PersonName`](../../src/apps/api/src/modules/resident/domain/value-objects/PersonName.ts),
[`Email`](../../src/apps/api/src/modules/resident/domain/value-objects/Email.ts),
and [`Phone`](../../src/apps/api/src/modules/resident/domain/value-objects/Phone.ts).
Typed exceptions describe invalid domain input.

**Benefit.** Normalization and validation have named, reusable domain homes, and
equality can be expressed by value.

**Consequences and limitations.** `Contact` uses `Email` and `Phone` to validate
input but stores the resulting value as a string, so the validated type is not
retained in its internal state. `PersonName` also has a public constructor, even
though current application and restoration paths use `PersonName.create`;
direct construction can bypass its normalization and validation. These are
current encapsulation gaps.

## Repository abstraction with Prisma and PostgreSQL

**Context.** The current backend requires relational persistence while keeping
Prisma out of the domain model.

**Decision.** Use PostgreSQL as the database and Prisma as the production
repository adapter. The
[Prisma schema](../../src/apps/api/infrastructure/database/prisma/schema.prisma)
defines relational models, while the
[Resident mapper](../../src/apps/api/src/modules/resident/infrastructure/mappers/ResidentMapper.ts)
translates between Prisma records and domain entities. Local infrastructure runs
PostgreSQL through [Docker Compose](../../src/apps/api/infrastructure/docker/docker-compose.yaml).

**Benefit.** Prisma handles relational access and migrations without leaking
generated persistence types into the Resident domain. The repository port keeps
use cases independent of the production adapter.

**Consequences and limitations.** The relational schema is not the domain
model. It currently encodes the shared User/Resident primary key, cascade
deletion for contacts and profile photos, and a nullable profile-photo relation.
The adapter rewrites the contact collection during aggregate updates and throws
a generic infrastructure error if persisted Resident data has no profile photo.

## Incomplete object storage removed and postponed

**Context.** An object-storage service was added to local infrastructure before
an end-to-end upload, read, authorization, and cleanup flow existed.

**Decision.** Remove the incomplete object-storage runtime configuration and do
not present object storage as operational in `v0.2.0`. The current
[Compose file](../../src/apps/api/infrastructure/docker/docker-compose.yaml)
contains PostgreSQL only. `ProfilePhoto` and the
[update use case](../../src/apps/api/src/modules/resident/application/use-cases/UpdateProfilePhotoUseCase.ts)
currently manage metadata supplied by the caller; they do not store binary
content.

**Benefit.** The shipped infrastructure and public documentation do not claim a
capability that lacks a complete application flow.

**Consequences and limitations.** A storage key can be persisted without proof
that an object exists. The API does not upload, retrieve, authorize access to,
replace, or delete stored files, and it cannot coordinate database rollback with
object cleanup.

**Planned evolution.** Reintroduce storage only through a complete authenticated
upload/read lifecycle with rollback and object cleanup. The future design is
outside `v0.2.0`; no object-storage adapter is operational today.

## Versioning during initial development

**Status.** Confirmed by the project owner beginning with `v0.2.0`.

**Context.** The API, architecture, and domain model can still undergo
incompatible changes, so declaring stable `1.x` public contracts would be
premature.

**Decision.** Use `0.MINOR.PATCH` during initial development:

- increment `MINOR` for a relevant functional delivery;
- increment `PATCH` for compatible fixes and adjustments within the same
  functional delivery;
- use `1.0.0` only after the product and its public contracts reach explicitly
  defined stability;
- do not create retroactive releases merely to fill skipped version numbers.

The current delivery is documented as `v0.2.0` in the
[changelog](../../CHANGELOG.md).

**Consequences and limitations.** Consumers must expect incompatible changes
between pre-1.0 functional deliveries. Documentation must distinguish current,
planned, postponed, and removed behavior and must not describe `v0.2.0` as
stable or production-ready.

## Current cross-cutting trade-offs

The following implementation details qualify the architectural direction above
and should remain visible until resolved:

1. **NestJS in the application layer.** Resident use cases use NestJS
   decorators and string injection tokens. Persistence is inverted, but the
   application layer is coupled to the framework's dependency-injection model.
2. **Auth coupling at the HTTP boundary.** The Resident controller imports
   guards, role metadata, and `UserRole` from Auth implementation paths. This
   keeps Auth out of the Resident domain while coupling the presentation adapter
   to Auth's current structure.
3. **Context-specific exception bases with one Identity-owned filter.** Resident
   exceptions extend
   [Resident's `DomainException`](../../src/apps/api/src/modules/resident/domain/exceptions/DomainException.ts),
   but the
   [application bootstrap](../../src/apps/api/src/main.ts)
   globally registers an Identity-owned
   [filter](../../src/apps/api/src/modules/identity/presentation/nestjs/filters/GlobalExceptionFilter.ts)
   that tests with `instanceof` against
   [Identity's `DomainException`](../../src/apps/api/src/modules/identity/domain/exceptions/DomainException.ts).
   Despite identical shapes, these are different runtime classes. Resident
   exceptions therefore bypass the filter's domain-error branch and can be
   returned as generic `500` responses.
4. **No operational object storage.** Profile-photo metadata exists in the
   domain and database, but no binary storage adapter or file lifecycle exists.
5. **Restoration and persistence gaps.** Some invariants are applied only during
   creation or mutation, and Prisma permits a missing profile-photo row that the
   repository rejects at runtime.

These trade-offs are observations of the current implementation. Recording them
does not authorize implementation changes or imply that a specific correction
has already been selected.
