# Contact

## Classification

`Contact` is an entity owned by the [`Resident`](resident.md) aggregate.

## Responsibility

A Contact represents one communication channel. It keeps a stable identifier and type while allowing its validated value and primary status to change.

## State

| Member       | Type                             | Mutability                            |
| ------------ | -------------------------------- | ------------------------------------- |
| `#id`        | [`Uuid`](uuid.md)                | Fixed                                 |
| `#type`      | [`ContactType`](contact-type.md) | Fixed                                 |
| `#value`     | `string`                         | Changed through `changeValue`         |
| `#isPrimary` | `boolean`                        | Changed through `changePrimaryStatus` |

## Creation

`Contact.create(type, raw, isPrimary = false)` trims the value, validates it according to the selected type, and generates a UUID.

- `EMAIL` delegates validation and normalization to [`Email`](email.md).
- `PHONE` delegates validation to [`Phone`](phone.md).
- A newly added Contact is non-primary unless the caller explicitly supplies `true`.

The Contact stores the trimmed input string. For email input, `Contact.create` validates through Email but does not store Email's lowercase normalized value. An uppercase email can therefore remain uppercase in Contact state even though validation is case-insensitive in practice.

## Restoration

`Contact.restore(id, type, value, isPrimary)` validates only the UUID and otherwise trusts persistence data. It does not trim or revalidate the value and does not validate the enum at runtime.

## Operations

| Operation                    | Behavior                                                             |
| ---------------------------- | -------------------------------------------------------------------- |
| `changeValue(rawValue)`      | Trims and validates a new value against the Contact's existing type. |
| `changePrimaryStatus(value)` | Sets the primary flag to the supplied boolean.                       |

There is no operation to change a Contact's type. Replacing an email contact with a phone contact requires removing it and adding another Contact.

## Aggregate Rules

- Resident limits its collection to ten contacts on aggregate creation and addition.
- Resident raises `ContactNotFoundException` when a mutation targets an unknown Contact ID.
- `Resident.setPrimaryContact` clears all flags before selecting one Contact.
- Contact itself does not enforce uniqueness of primary status across the collection.
- Contact belongs to Resident by aggregate ownership and by the Prisma `residentId` foreign key; Contact does not store the parent identifier inside the domain entity.

## Possible Exceptions

- `EmailIsRequiredException`
- `InvalidEmailFormatException`
- `PhoneIsRequiredException`
- `InvalidPhoneException`
- `InvalidUuidException` during restoration

At the HTTP boundary, these Resident exceptions currently fall through to a generic `500` response because the global exception filter recognizes a different bounded context's base exception class.

## Persistence

The Prisma `Contact` row stores `id`, `residentId`, `type`, `value`, and `isPrimary`. The relation cascades on Resident deletion. Aggregate updates currently delete every Contact row for the Resident and recreate the aggregate's current contact list.

## Evidence

- [Source](../../../../src/apps/api/src/modules/resident/domain/entities/Contact.ts)
- [Tests](../../../../src/apps/api/src/modules/resident/domain/entities/Contact.spec.ts)
- [Aggregate behavior](../../../../src/apps/api/src/modules/resident/domain/entities/Resident.ts)
- [Persistence mapper](../../../../src/apps/api/src/modules/resident/infrastructure/mappers/ResidentMapper.ts)

See the [Resident bounded context](../../bounded-contexts/resident.md).
