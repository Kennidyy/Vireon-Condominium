# Email

## Classification

`Email` is the Resident context's value object for validating email Contact values. It is separate from the similarly named value object in Identity.

## Creation and Normalization

`Email.create(raw)` rejects an empty input string, then trims surrounding whitespace, converts the value to lowercase, and validates it with:

```text
^[^\s@]+@[^\s@]+\.[^\s@]+$
```

The expression requires non-whitespace content before and after `@` and at least one dot in the domain portion. It is intentionally simpler than full RFC email-address parsing.

## Behavior

| Operation       | Result                                         |
| --------------- | ---------------------------------------------- |
| `create(raw)`   | Returns the normalized value after validation. |
| `equals(other)` | Compares normalized values exactly.            |
| `value`         | Exposes the normalized string.                 |

The stored field is read-only and the constructor is private.

## Exceptions

| Exception                     | Code                   | Condition                                                       |
| ----------------------------- | ---------------------- | --------------------------------------------------------------- |
| `EmailIsRequiredException`    | `EMAIL_IS_REQUIRED`    | The raw input is the empty string or otherwise falsy.           |
| `InvalidEmailFormatException` | `INVALID_EMAIL_FORMAT` | The normalized input does not match the implemented expression. |

Direct `Email.create` treats whitespace-only input as invalid format because the required check occurs before normalization. `Contact.create` trims first, so a whitespace-only email Contact raises `EmailIsRequiredException` instead.

## Contact Integration

Contact invokes `Email.create` to validate an `EMAIL` value. Contact stores its own trimmed raw string rather than Email's normalized lowercase value, so the Contact entity does not currently guarantee lowercase email storage.

## Evidence

- [Source](../../../../src/apps/api/src/modules/resident/domain/value-objects/Email.ts)
- [Tests](../../../../src/apps/api/src/modules/resident/domain/value-objects/Email.spec.ts)
- [Contact integration](../../../../src/apps/api/src/modules/resident/domain/entities/Contact.ts)

See the [Resident bounded context](../../bounded-contexts/resident.md).
