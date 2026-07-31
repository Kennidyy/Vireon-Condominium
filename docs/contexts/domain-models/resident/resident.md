# Resident

## Type

Aggregate Root

## Purpose

Represents a resident within the condominium.

## Properties

- ResidentId
- PersonName
- UserId
- Contacts
- ProfilePhoto

## Behaviors

- changeName()
- addContact()
- removeContact()
- replaceProfilePhoto()

## Business Rules

- Maximum of 10 contacts.
- Maximum of one profile photo.
- PersonName is mandatory.

## Relationships

- Owns Contacts.
- Owns ProfilePhoto.
- References UserId from Identity Context.
