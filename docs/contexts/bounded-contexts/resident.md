# Resident Context

## Purpose

Responsible for managing resident profiles and personal information within the condominium.

---

## Responsibilities

- Manage resident profile information.
- Manage resident contacts.
- Manage resident profile photo.

---

## Aggregate

- Resident

---

## Domain Models

- Resident
- Contact
- ProfilePhoto
- PersonName
- ContactType
- UserId

---

## Exposes

### Commands

- Create Resident
- Update Resident
- Change Resident Name
- Add Contact
- Update Contact
- Remove Contact
- Replace Profile Photo

### Queries

- Find Resident by Id
- Find Resident by UserId

---

## Business Rules

- A resident must always have a valid name.
- A resident may have at most one profile photo.
- A resident may have up to ten contacts.

---

## Dependencies

### Identity Context

Uses:

- UserId

Reason:

Associates a resident with an authenticated user.

### Apartment Context *(planned)*

Reason:

Associates residents with apartments.

---

## Future Integrations

- Apartment Context
- Notification Context