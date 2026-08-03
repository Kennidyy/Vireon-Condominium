# Identity Context

## Purpose

Identity manages application users and the data required to identify them. It owns the `User` entity, email and password representations, roles, user-management use cases, and user persistence.

## Current scope

**Implemented:**

- create, find, list, update, and delete users;
- normalize and validate email addresses;
- validate password complexity before hashing;
- hash passwords through an application port and Argon2 adapter;
- assign `USER` or `ADMIN` roles;
- persist users through a Prisma repository;
- expose user authentication data to Auth through `UserIdentityProvider`.

## Boundaries

Identity does not own:

- JWT creation, bearer-token validation, or route role guards; these belong to Auth;
- resident names, contacts, or profile-photo metadata; these belong to Resident;
- condominium, unit, or occupancy relationships; these are not implemented.

Auth currently imports Identity's concrete Argon2 adapter in module wiring, so the source-module separation is not a fully independent adapter boundary. This qualification is described in the [architecture overview](../../architecture/overview.md).

Resident does not import or manipulate the `User` entity. The two contexts are associated through an identifier. In `v0.2.0`, persistence temporarily reuses `User.id` as `Resident.id`; this is a transitional integration decision rather than an Identity invariant. See [Temporary shared identifier](resident.md#temporary-shared-identifier).

## Public API

Identity exposes administrator-only user-management routes and an authenticated `/identity/me` route. Login is exposed separately as `POST /auth/login`. See the [API route inventory](../../../src/apps/api/README.md#route-inventory) for the verified paths.

## Evidence

- [User entity](../../../src/apps/api/src/modules/identity/domain/entities/User.ts)
- [Identity application use cases](../../../src/apps/api/src/modules/identity/application/use-cases)
- [Identity controller](../../../src/apps/api/src/modules/identity/presentation/nestjs/controllers/identity.controller.ts)
- [Identity module wiring](../../../src/apps/api/src/modules/identity/presentation/nestjs/identity.module.ts)
- [Auth module wiring](../../../src/apps/api/src/modules/auth/presentation/auth.module.ts)

Return to the [documentation index](../../README.md).
