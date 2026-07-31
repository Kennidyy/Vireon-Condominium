# PersonName

## Type

Value Object

## Purpose

Represents a resident's full legal or preferred name.

## Properties

| Name  | Type   | Required |
| ----- | ------ | -------- |
| value | string | Yes      |

## Business Rules

- Cannot be empty.
- Leading and trailing whitespace must be removed.
- Consecutive spaces must be normalized.
- Must satisfy the application's name validation rules.
- Immutable.

## Behaviors

- create(value)
- equals(other)

## Invariants

- A PersonName instance is always valid.
