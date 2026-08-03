# Uuid

## Classification

`Uuid` is the Resident context's generic identifier value object. It is used by Resident, Contact, and ProfilePhoto.

The current implementation does not define semantic `ResidentId`, `UserId`, `ContactId`, or `ProfilePhotoId` wrappers.

## Creation

| Operation            | Behavior                                          |
| -------------------- | ------------------------------------------------- |
| `Uuid.generate()`    | Uses `crypto.randomUUID()` to create a new value. |
| `Uuid.create(value)` | Validates and wraps an existing UUID string.      |

The validation expression accepts UUID versions 1 through 5, hexadecimal characters in either case, and RFC-compatible variant digits `8`, `9`, `a`, or `b`. It requires the canonical hyphenated form.

## Properties

- The stored value is read-only.
- `value` exposes the string.
- `equals(other)` compares strings exactly, so differently cased representations are not equal even though both can pass validation.
- Invalid input raises `InvalidUuidException` with code `INVALID_UUID`.

## Current Resident Identifier Use

`Resident.create` receives a Uuid representing the associated User and stores it as the Resident's only identifier. Both `resident.id` and `resident.userId` expose that same value. Prisma also uses it as the Resident primary key and as a foreign key to `User.id`.

This use is temporary. See the canonical [shared-identifier decision](../../../architecture/engineering-decisions.md#temporary-shared-user-and-resident-identifier) for its rationale, limitations, and planned evolution.

## Evidence

- [Source](../../../../src/apps/api/src/modules/resident/domain/value-objects/Uuid.ts)
- [Tests](../../../../src/apps/api/src/modules/resident/domain/value-objects/Uuid.spec.ts)
- [Resident usage](../../../../src/apps/api/src/modules/resident/domain/entities/Resident.ts)
- [Prisma model](../../../../src/apps/api/infrastructure/database/prisma/schema.prisma)

See the [Resident bounded context](../../bounded-contexts/resident.md).
