# Contact

## Type

Entity

## Purpose

Represents a communication channel belonging to a resident.

## Properties

| Name      | Type        |
| --------- | ----------- |
| id        | ContactId   |
| type      | ContactType |
| value     | string      |
| isPrimary | boolean     |

## Business Rules

- A resident may have at most 10 contacts.
- Only one contact may be primary.
- Contact value must match its type validation.
- Contact belongs to exactly one resident.

## Behaviors

- changeValue()
- changeType()
- setPrimary()

## Invariants

- Contact is always associated with one resident.
