# Password Value Object

## Responsibility

> Represents a user's credential according to Identity security rules.

The Password value object protects password creation and ensures that credentials are stored securely.

## Responsibilities

### On Creation

- Validate password strength
- Generate or receive a secure hash
- Prevent plain-text password storage

### On Comparison

- Verify a raw password against its stored hash

## Invariants

- Password cannot be stored as plain text
- Password must satisfy minimum security requirements
- Password hash must be generated using a secure algorithm
