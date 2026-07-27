# Vireon Condominium

A condominium management platform built with a modular monorepo architecture.

---

# Current Version

**Version:** v0.0.1

**Status:** Stable baseline

This release establishes the initial backend foundation of the system, including:

- Identity bounded context
- Authentication and authorization
- User management
- Database infrastructure
- CI pipeline
- Domain-driven architecture foundation

---

# Project Status — v0.0.1

## Implemented Features

## Identity Module

**Status:** ✅ Completed

Implemented:

- User entity
- Email value object
- Password value object
- Role management
- User CRUD operations
- Authentication flow
- JWT-based authorization
- Password hashing using Argon2
- Domain exceptions
- Global exception handling
- Request validation
- Repository abstraction using ports

---

## Infrastructure

**Status:** ✅ Functional

Implemented:

- PostgreSQL database
- Prisma ORM
- Database migrations
- Docker-based database environment
- Environment configuration
- GitHub Actions CI pipeline
- Automated formatting validation
- Static analysis
- Type checking
- Automated tests

---

## Testing

Current test suite:

```text
Test Suites: 17
Tests: 91
```

Environment status:

| Environment | Status |
|---|---|
| Fedora workstation | ✅ Passing |
| GitHub Actions CI | ✅ Passing |
| Ubuntu 22.04 clean environment | ⚠️ Compatibility issue under investigation |

The Ubuntu environment validation was documented separately:

- Environment Compatibility Audit — v0.0.1

---

# Architecture

The project follows:

- Domain-Driven Design (DDD)
- Hexagonal Architecture
- Modular Monolith approach

The dependency direction is:

```text
Presentation
      ↓
Application
      ↓
Domain
```

Infrastructure implements application-defined ports:

```text
Application Ports
        ↑
Infrastructure Adapters
```

Core business rules remain independent from frameworks and external technologies.

---

# Monorepo Structure

Current repository structure:

```text
Vireon-Condominium
│
├── apps
│    └── api
│
├── packages
│   ├── ui
│   ├── eslint-config
│   └── typescript-config
│
└── turbo.json
```

Current development focus:

```text
apps/api
```

---

# Technology Stack

## Backend

- NestJS 11
- TypeScript
- Bun
- Prisma ORM
- PostgreSQL 17
- JWT Authentication
- Passport
- Argon2 Password Hashing

## Development Environment

- Docker
- Docker Compose
- GitHub Actions
- TurboRepo
- ESLint
- Prettier

---

# Known Limitations

The following items were intentionally postponed:

- Automated database seed
- Production deployment pipeline
- Complete infrastructure automation
- Development containers
- Terraform provisioning
- Ansible configuration management
- Additional bounded contexts
- Advanced integration testing

These items are tracked as future improvements.

---

# Version History

## v0.0.1 — Foundation Release

Delivered:

- Initial project structure
- Backend application foundation
- Identity bounded context
- Authentication system
- Authorization system
- Database integration
- CI pipeline
- Testing foundation

This version validates the core architecture before expanding the domain.

---

# Next Version Goals — v0.0.2

The next iteration will focus on expanding the business domain.

## Resident Module

Planned:

- Resident entity
- Resident profile
- Resident management CRUD
- Relationship between users and residents
- Domain rules for resident lifecycle

---

## Condominium Domain

Planned:

- Condominium entity
- Tower management
- Apartment/unit management
- Resident-property relationships

---

## Infrastructure Improvements

Planned:

- Complete environment documentation
- Database seed
- Improved onboarding process
- Environment validation scripts
- Better development reproducibility

---

# Development Setup

For API-specific setup instructions:

```text
src/apps/api/README.md
```

---

# Documentation

Project documentation includes:

- Architecture decisions
- Bounded context documentation
- Environment audits
- Development notes

Location:

```text
docs/
```

---

# License

MIT