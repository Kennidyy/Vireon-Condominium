# ResidentId

## Type

Value Object

---

## Purpose

Represents the unique identifier of a `Resident` aggregate.

---

## Properties

| Property | Type |
| -------- | ---- |
| value    | UUID |

---

## Behaviors

- Generate a new identifier.
- Compare identifiers for equality.

---

## Business Rules

- Must be immutable.
- Must uniquely identify a `Resident`.

---

## Invariants

- A `ResidentId` value never changes after creation.
- Two `ResidentId` instances are equal if their values are equal.

---

## Notes

`ResidentId` exists to provide semantic meaning and type safety within the domain. Although its underlying representation is a UUID string, it should not be replaced with a plain `string` in domain models.
