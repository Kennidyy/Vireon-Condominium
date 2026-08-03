# PersonName

## Classification

`PersonName` is the value object used for a Resident's name.

## Creation and Normalization

`PersonName.create(raw)`:

1. Trims leading and trailing whitespace.
2. Collapses each internal whitespace sequence to one space.
3. Validates the normalized value.

## Rules

- The normalized value is required.
- Length must not exceed 255 characters.
- Accepted characters are Unicode letters, apostrophes, spaces, and hyphens.
- Numbers and other punctuation are rejected.
- Equality is case-sensitive and compares normalized values.

Examples accepted by the implemented expression include `Joao Silva`, `D'Avila`, and `Maria-Clara`. A value such as `Unit 12` is rejected because it contains digits.

## Operations

| Operation       | Result                                         |
| --------------- | ---------------------------------------------- |
| `create(raw)`   | Returns a normalized and validated PersonName. |
| `equals(other)` | Compares the stored values exactly.            |
| `value`         | Exposes the normalized string.                 |

The stored field is read-only and there is no mutation operation. Resident name changes replace the value object through `Resident.changeName`.

## Exceptions

| Exception                       | Code               | Condition                                                          |
| ------------------------------- | ------------------ | ------------------------------------------------------------------ |
| `PersonNameIsRequiredException` | `NAME_IS_REQUIRED` | The normalized value is empty.                                     |
| `InvalidPersonNameException`    | `INVALID_NAME`     | The value contains a character outside the implemented expression. |
| `PersonNameTooLargeException`   | `NAME_TOO_LARGE`   | The value contains more than 255 characters.                       |

Although application and aggregate code use `PersonName.create`, the class constructor is currently public and does not validate its argument. Direct constructor use can bypass these rules; this is an implementation limitation rather than intended domain behavior.

## Evidence

- [Source](../../../../src/apps/api/src/modules/resident/domain/value-objects/PersonName.ts)
- [Tests](../../../../src/apps/api/src/modules/resident/domain/value-objects/PersonName.spec.ts)
- [Aggregate usage](../../../../src/apps/api/src/modules/resident/domain/entities/Resident.ts)

See the [Resident bounded context](../../bounded-contexts/resident.md).
