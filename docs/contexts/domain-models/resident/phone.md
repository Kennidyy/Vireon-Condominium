# Phone

## Classification

`Phone` is the Resident context's value object for Brazilian mobile-number Contact values.

## Creation and Format

`Phone.create(raw)` trims surrounding whitespace and validates the result with:

```text
^\+55\d{2}9\d{8}$
```

The accepted representation is therefore:

```text
+55 + two-digit area code + 9 + eight subscriber digits
```

For example, `+5511999999999` is valid. The current implementation does not accept punctuation, spaces inside the number, a missing country code, landlines, or non-Brazilian numbers.

## Behavior

| Operation       | Result                              |
| --------------- | ----------------------------------- |
| `create(raw)`   | Returns a trimmed, validated Phone. |
| `equals(other)` | Compares stored strings exactly.    |
| `value`         | Exposes the normalized string.      |

The constructor is private. There is no formatting or country-code conversion beyond trimming.

## Exceptions

| Exception                  | Code                | Condition                                                             |
| -------------------------- | ------------------- | --------------------------------------------------------------------- |
| `PhoneIsRequiredException` | `PHONE_IS_REQUIRED` | The trimmed value is empty.                                           |
| `InvalidPhoneException`    | `INVALID_PHONE`     | The value does not match the implemented Brazilian mobile expression. |

## Contact Integration

Contact delegates `PHONE` creation and value changes to Phone validation. The Contact then stores the trimmed string.

## Evidence

- [Source](../../../../src/apps/api/src/modules/resident/domain/value-objects/Phone.ts)
- [Tests](../../../../src/apps/api/src/modules/resident/domain/value-objects/Phone.spec.ts)
- [Contact integration](../../../../src/apps/api/src/modules/resident/domain/entities/Contact.ts)

See the [Resident bounded context](../../bounded-contexts/resident.md).
