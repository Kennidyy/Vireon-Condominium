# ContactType

## Classification

`ContactType` is the enumeration that selects validation and persistence behavior for a [`Contact`](contact.md).

## Implemented Values

| Value   | Meaning                         | Validator           |
| ------- | ------------------------------- | ------------------- |
| `EMAIL` | Email communication channel     | [`Email`](email.md) |
| `PHONE` | Brazilian mobile-number channel | [`Phone`](phone.md) |

No `Mobile`, `Home`, `Work`, `WhatsApp`, `Telegram`, or `Other` values exist in the current enum.

## Behavior

Contact type is supplied at creation and is immutable afterward. `Contact.changeValue` always validates against the original type.

The domain enum stores `EMAIL` and `PHONE`, and Prisma defines matching enum values. `ResidentMapper` translates those values explicitly when restoring persisted contacts.

## HTTP Boundary Limitation

`AddContactRequest` uses `@IsString()` for `type` rather than enum validation. `AddContactUseCase` indexes `ContactType` dynamically and casts the result. An unsupported string can therefore reach `Contact.create` as an undefined runtime value, skip both validation branches, and fail only when Prisma attempts to persist the invalid enum.

Clients should send exactly `EMAIL` or `PHONE`; the request boundary still needs explicit enum validation.

## Evidence

- [Enum](../../../../src/apps/api/src/modules/resident/domain/enum/ContactType.ts)
- [Validation selection](../../../../src/apps/api/src/modules/resident/domain/entities/Contact.ts)
- [Request DTO](../../../../src/apps/api/src/modules/resident/presentation/nestjs/dto/AddContactRequest.ts)
- [Application mapping](../../../../src/apps/api/src/modules/resident/application/use-cases/AddContactUseCase.ts)

See the [Resident bounded context](../../bounded-contexts/resident.md).
