# Vireon Condominium API

Backend API responsible for the business logic and application services of Vireon Condominium.

This application follows:

- Domain-Driven Design (DDD)
- Hexagonal Architecture
- Modular Monolith architecture

---

# Technology Stack

## Runtime

- Bun 1.3+
- TypeScript

## Framework

- NestJS 11

## Database

- PostgreSQL 17
- Prisma ORM

## Security

- JWT Authentication
- Passport
- Argon2 password hashing

## Validation

- class-validator
- class-transformer

---

# Architecture

The API is organized by bounded contexts.

Current bounded context:

```
src/modules/

└── identity/

    ├── domain/
    │   ├── entities
    |   ├── enum
    |   ├── exceptons
    │   └── value-objects
    │
    ├── application/
    │   ├── dto
    |   ├── exceptions
    |   ├── ports
    |   ├── types
    |   └── use-cases
    │
    ├── infrastructure/
    │   ├── auth
    │   ├── crypto
    │   ├── database
    |   ├── mappers
    │   └── mocks
    │
    └── presentation/
        └── nestjs
            ├── controllers
            ├── dto
            └── filters
```

Dependency direction:

```
Presentation
      ↓
Application
      ↓
Domain
```

Infrastructure implements application contracts.

---

# Requirements

Before running the API, install:

- Bun 1.3+
- Docker
- Docker Compose V2

Verify:

```bash
bun --version
docker --version
docker compose version
```

---

# Environment Configuration

Create the environment file:

```bash
cp .env.example .env
```

Required variables:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vireon_db"

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=vireon_db
DB_PORT=5432

JWT_SECRET=change_this_secret
```

---

# Database Setup

Start PostgreSQL:

From repository root:

```bash
bun run db:up
```

Generate Prisma client:

```bash
bunx prisma generate
```

Run migrations:

```bash
bunx prisma migrate dev
```

---

# Running the API

Development mode:

```bash
bun run dev
```

The API will start at:

```
http://localhost:3000
```

---

# Testing

Run unit tests:

```bash
bun run test
```

Current test status:

```
Test Suites: 17
Tests: 91
```

---

# Identity Module

The Identity module provides:

- User management
- Authentication
- Authorization
- Password security

---

# Authentication Flow

## Login

Endpoint:

```
POST /identity/login
```

Request:

```json
{
  "email": "admin@vireon.com",
  "password": "Password123@"
}
```

Response:

```json
{
  "accessToken": "jwt-token"
}
```

The returned token must be sent using:

```
Authorization: Bearer <token>
```

---

# Users API

## Create User

```
POST /identity/users
```

Authentication:

```
ADMIN role required
```

---

## Get User By ID

```
GET /identity/users/:id
```

Authentication:

```
ADMIN role required
```

---

## Get User By Email

```
GET /identity/users/email/:email
```

Authentication:

```
ADMIN role required
```

---

## Get All Users

```
GET /identity/all
```

Authentication:

```
ADMIN role required
```

---

## Update User

```
PATCH /identity/users/:id
```

Authentication:

```
ADMIN role required
```

---

## Delete User

```
DELETE /identity/users/:id
```

Authentication:

```
ADMIN role required
```

---

## Current User

```
GET /identity/me
```

Authentication:

```
JWT required
```

---

# Error Handling

The API uses a global exception filter.

All errors follow this structure:

```json
{
  "statusCode": 400,
  "code": "INVALID_EMAIL_FORMAT",
  "message": "Invalid email format"
}
```

---

# Domain Exceptions

Examples:

| Exception                   | HTTP Status | Code                 |
| --------------------------- | ----------- | -------------------- |
| InvalidEmailFormatException | 400         | INVALID_EMAIL_FORMAT |
| EmailIsRequiredException    | 400         | EMAIL_IS_REQUIRED    |
| PasswordMinLengthException  | 400         | PASSWORD_MIN_LENGTH  |
| EmailAlreadyInUseException  | 400         | EMAIL_ALREADY_IN_USE |
| UserNotFoundException       | 400         | USER_NOT_FOUND       |
| InvalidCredentialException  | 401         | INVALID_CREDENTIALS  |

---

# Database Commands

Create migration:

```bash
bunx prisma migrate dev --name migration_name
```

Reset database:

```bash
bunx prisma migrate reset
```

---

# Development Notes

Known future improvements:

- Database seed
- OpenAPI / Swagger documentation
- Integration tests with real PostgreSQL
- Additional bounded contexts
- Production configuration
- Containerized development environment

---

# Related Documentation

Project documentation:

```
/docs
```
