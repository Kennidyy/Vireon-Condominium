# ProfilePhoto

## Type

Entity

## Purpose

Represents the resident's profile image metadata.

## Properties

| Name        | Type           |
| ----------- | -------------- |
| id          | ProfilePhotoId |
| storageKey  | string         |
| contentType | string         |
| size        | number         |
| uploadedAt  | Date           |

## Business Rules

- A resident may have at most one profile photo.
- Maximum file size must respect the configured limit.
- Only image content types are accepted.

## Behaviors

- replace()

## Invariants

- storageKey is immutable after creation.
