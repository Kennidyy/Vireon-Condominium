# User Entity

## Responsibility

> The User entity is responsible for creating and managing a unique identity that can be referenced by other bounded contexts.

## Responsibilities

### On Creation

- Generate a unique identifier (UUID)
- Ensure unique email
- Store the user's hashed password using Argon2id

### On Update

- Maintain the same unique identifier
- Allow user identity updates
- Allow credential changes through proper password hashing

## Invariants

- A user must always have a unique identifier
- A user email must be unique
- A password must never be stored in plain text
- A user's identity cannot be changed after creation
