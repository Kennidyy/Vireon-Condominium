# Resident

## Classification

`Resident` is the aggregate root of the Resident bounded context.

## Responsibility

Resident protects the condominium-facing profile associated with a system identity. It owns the resident name, profile-photo metadata, and Contact collection. Application use cases must change Contact and ProfilePhoto state through the aggregate rather than through independent repositories.

## State

| Member          | Domain type                        | Exposure                          | Notes                                                            |
| --------------- | ---------------------------------- | --------------------------------- | ---------------------------------------------------------------- |
| `#id`           | [`Uuid`](uuid.md)                  | `id: string` and `userId: string` | One stored UUID; both accessors currently return the same value. |
| `#name`         | [`PersonName`](person-name.md)     | `name: string`                    | Mutable through `changeName`.                                    |
| `#profilePhoto` | [`ProfilePhoto`](profile-photo.md) | Metadata copy                     | Required by the current domain constructor.                      |
| `#contacts`     | [`Contact[]`](contact.md)          | Read-only projection              | Mutable only through Resident operations.                        |

The accessors return primitive projections rather than the mutable internal objects or array.

## Identifier Model

The current source does not define dedicated `ResidentId` or `UserId` value-object classes. `Resident.create` receives a `Uuid` named `userId` and stores it directly as `#id`; the `id` and `userId` accessors consequently expose the same UUID.

This behavior is temporary, not a permanent aggregate invariant. Its context, trade-offs, and planned replacement are recorded in [Temporary shared User and Resident identifier](../../../architecture/engineering-decisions.md#temporary-shared-user-and-resident-identifier).

## Creation

`Resident.create(userId, name, profilePhoto, contacts = [])`:

1. Rejects an initial collection containing more than ten contacts.
2. Reuses `userId` as the Resident identifier.
3. Retains the supplied PersonName, ProfilePhoto, and Contact objects.

The application `CreateResidentUseCase` constructs the identifier through `Uuid.create`, constructs the name through `PersonName.create`, and supplies `ProfilePhoto.default()`.

## Restoration

`Resident.restore(id, name, profilePhoto, contacts)` reconstructs a persisted aggregate. It validates the identifier through `Uuid.create` and the name through `PersonName.create`, then accepts the supplied photo and contact collection.

Restoration does not repeat the ten-contact limit. It assumes that the persistence adapter has already restored valid Contact and ProfilePhoto objects.

## Operations

| Operation                                 | Behavior                                                              | Possible typed exceptions                                            |
| ----------------------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `changeName(newName)`                     | Normalizes and validates a new PersonName.                            | Name exceptions                                                      |
| `changeProfilePhoto(newPhoto)`            | Replaces the current ProfilePhoto reference.                          | None directly; callers normally create and validate the photo first. |
| `addContact(contact)`                     | Appends a Contact when fewer than ten exist.                          | `ResidentMaxContactsExceededException`                               |
| `changeContactValue(contactId, newValue)` | Finds the Contact and validates the new value against its fixed type. | `ContactNotFoundException`; email or phone exceptions                |
| `setPrimaryContact(contactId)`            | Clears every primary flag and marks the selected Contact as primary.  | `ContactNotFoundException`                                           |
| `removeContact(contactId)`                | Removes the selected Contact.                                         | `ContactNotFoundException`                                           |

## Rules and Caveats

- Adding an eleventh Contact is rejected.
- The aggregate can contain zero contacts; no operation requires a primary Contact.
- `setPrimaryContact` leaves exactly one current Contact marked primary, but creation and restoration do not independently reject an input collection with multiple primary flags.
- Contacts are identified within the aggregate by UUID strings.
- Profile-photo replacement changes metadata in memory; no domain service uploads or removes a stored object.
- The domain always constructs Resident with a ProfilePhoto, although the Prisma relationship is nullable.

## Ownership

Resident owns Contact and ProfilePhoto lifecycle from the domain perspective. Prisma enforces the relational ownership with `residentId` foreign keys and cascade deletion for both child models.

## Evidence

- [Source](../../../../src/apps/api/src/modules/resident/domain/entities/Resident.ts)
- [Domain tests](../../../../src/apps/api/src/modules/resident/domain/entities/Resident.spec.ts)
- [Creation use case](../../../../src/apps/api/src/modules/resident/application/use-cases/CreateResidentUseCase.ts)
- [Mapper](../../../../src/apps/api/src/modules/resident/infrastructure/mappers/ResidentMapper.ts)

See the [Resident bounded-context reference](../../bounded-contexts/resident.md) for commands, routes, persistence, authorization, and current limitations.
