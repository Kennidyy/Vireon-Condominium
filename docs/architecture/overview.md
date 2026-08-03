# Architecture Overview

## Current style

Vireon is implemented as a modular monolith: one NestJS application composes Identity, Auth, and Resident modules and connects them to one PostgreSQL database. The modules run in the same process and deployment unit; there are no service-to-service protocols or independently deployed microservices in the current repository.

The code uses domain-oriented modules and a ports-and-adapters structure. These terms describe observable dependency boundaries rather than a claim of complete architectural purity.

## Runtime and dependency flow

![Current Vireon backend architecture and dependency flow](../../assets/architecture.svg)

The diagram distinguishes an application dependency from domain ownership. Auth consumes identity data through an application-facing provider, its infrastructure implements JWT signing and request security, and Resident presentation consumes Auth guards. The Resident domain itself does not import `User`, JWT, NestJS, or Prisma.

## Layer responsibilities

| Layer          | Current responsibility                                                                 | Concrete Resident elements                                                    |
| -------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Presentation   | HTTP routing, request DTO validation, authentication/role guards, and response mapping | `ResidentController`, request DTOs, `ResidentResponseMapper`                  |
| Application    | Use-case orchestration and repository port definition                                  | command objects, eleven use cases, `ResidentRepository`                       |
| Domain         | Aggregate state, behavior, validation, and typed domain failures                       | `Resident`, `Contact`, `ProfilePhoto`, `Uuid`, `PersonName`, `Email`, `Phone` |
| Infrastructure | Persistence, relational/domain mapping, and test adapters                              | `PrismaResidentRepository`, `ResidentMapper`, `FakeResidentRepository`        |

The intended inward flow is Presentation to Application to Domain. Infrastructure implements the repository contract defined by Application and is selected in `ResidentModule` through the `ResidentRepository` injection token.

## Module boundaries

### Identity

Identity owns the `User` entity, authentication email, password representation, role, user persistence, and user-management use cases. It exports a provider that Auth can use to obtain authentication data. See [Identity context](../contexts/bounded-contexts/identity.md).

### Auth

Auth owns login orchestration, token signing and validation, and route-level role guards. It currently reuses the Identity Argon2 adapter through NestJS module wiring. Auth is a distinct source module, but its cryptographic adapter boundary is not fully independent from Identity.

### Resident

Resident owns the resident profile aggregate, its contacts, and profile-photo metadata. It receives a user identifier at its application/presentation boundary but does not manipulate the Identity `User` entity. The current shared primary-key association is documented as a temporary integration decision, not a permanent domain rule. See [Resident context](../contexts/bounded-contexts/resident.md).

## Persistence boundary

Prisma and PostgreSQL are infrastructure concerns. The Prisma schema represents storage constraints and relations; it is not the domain model. `ResidentMapper` converts between Prisma records and the Resident aggregate, while `PrismaResidentRepository` includes contacts and photo metadata when restoring the aggregate.

Current relational details that affect architecture:

- `residents.id` is both the Resident primary key and a foreign key to `users.id`.
- deleting a Resident cascades to its contacts and profile-photo row.
- deleting a User is restricted while the matching Resident exists.
- the relational profile-photo relation is nullable, although the domain and repository require a photo.
- all modules share the same database and Prisma client.

## Testing boundary

Resident application tests use `FakeResidentRepository`, an in-memory implementation of the same port used by the Prisma adapter. Mapper, DTO, controller, entity, and value-object behavior are covered by co-located unit specifications. The current tree contains no active PostgreSQL integration specification or end-to-end API specification.

## Current architectural qualifications

- Application use cases import NestJS `@Injectable` and `@Inject`, so only the domain layer is framework-independent today.
- Resident presentation imports Auth infrastructure guards and role metadata directly.
- Auth module wiring imports Identity's concrete `Argon2PasswordHasher`.
- `UserRole` is duplicated in Identity, Auth, and Resident source, although the Resident controller uses the Auth enum.
- The registered global exception filter imports Identity's `DomainException`; the separately declared Resident exception hierarchy is not translated by that branch.
- Profile-photo metadata has a domain and persistence model, but no object-storage adapter or file-transfer workflow exists.

These are current implementation facts and planned improvement areas, not hidden corrections. The rationale and trade-offs are recorded in [Engineering Decisions](engineering-decisions.md).

## Evidence

- [Application composition](../../src/apps/api/src/app.module.ts)
- [API bootstrap and global facilities](../../src/apps/api/src/main.ts)
- [Resident module wiring](../../src/apps/api/src/modules/resident/presentation/nestjs/resident.module.ts)
- [Resident repository port](../../src/apps/api/src/modules/resident/application/ports/ResidentRepository.ts)
- [Prisma Resident adapter](../../src/apps/api/src/modules/resident/infrastructure/repositories/PrismaResidentRepository.ts)
- [Prisma schema](../../src/apps/api/infrastructure/database/prisma/schema.prisma)

Return to the [documentation index](../README.md).
