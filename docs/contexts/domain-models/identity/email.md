# Email Value Object

## Responsibility

> Represents a valid email address used as a user's main authentication identifier.

The Email value object guarantees that every email stored by the Identity context follows the required format and normalization rules.

## Responsibilities

### On Creation

- Normalize the email value
- Validate email format
- Ensure the value is not empty

### On Comparison

- Compare emails using their normalized value

## Invariants

- Email cannot be empty
- Email must follow a valid email format
- Email is stored in lowercase
- Leading and trailing spaces are removed
