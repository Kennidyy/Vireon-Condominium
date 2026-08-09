# Development environment

Vireon uses Nix as the source of truth for its development toolchain and `just`
as the project command interface. The Dev Container is optional and only adds an
isolation boundary around the same Nix environment.

```text
Dev Container (optional isolation)
                |
                v
Nix Flake (toolchain and versions)
                |
                v
direnv (automatic activation)
                |
                v
just (project commands)
          /           \
         v             v
   Bun / Turbo    Docker Compose
```

This separation is intentional:

- `flake.nix` provides Bun, Node.js, Git, `just`, Docker and PostgreSQL clients,
  and the other command-line tools used by the project.
- `.envrc` activates the Flake automatically on machines with `direnv`.
- `justfile` describes repeatable project operations, not tool versions.
- Docker Compose runs infrastructure services, not the development toolchain.
- the Dev Container installs Nix, then delegates project setup to the Flake.

`flake.lock` is committed so every environment resolves the same Nix inputs.
Prisma remains a project dependency and is invoked with `bunx` from the API
workspace.

## Local setup

Install Nix with Flakes enabled, `direnv`, and Docker with Compose V2. After
cloning the repository, run:

```bash
direnv allow
just setup
just dev
```

`just setup` installs Bun dependencies, copies
`src/apps/api/.env.example` to the ignored `src/apps/api/.env` when necessary,
starts the development database, generates the Prisma client, applies committed
migrations, and runs the development seed. Review the generated local environment
file and replace its example secrets before using it outside local development.

If `direnv` is not installed, commands can be run explicitly through Nix:

```bash
nix develop --command just setup
nix develop --command just dev
```

## Dev Container

Open the repository with a Dev Container-compatible IDE and rebuild the
container. Its creation command runs `nix develop --command just setup`.

The host Docker socket is mounted so the Nix-provided Docker client can manage
the project's Compose services. The host must therefore provide Docker, and
access to the socket grants the container control over that Docker daemon.

The development PostgreSQL container publishes `DB_PORT` on the Docker host.
Inside a Dev Container, `localhost` refers to the Dev Container itself rather
than that host. The root `bun run dev` command and the database `just` recipes
therefore execute through
`src/apps/api/infrastructure/docker/run-with-database.sh`. The wrapper keeps the
committed `DATABASE_URL` convention (`localhost`) for normal host development,
but, when it detects a container, it probes the container gateway and
`host.docker.internal` and exports a process-local URL with the reachable host.
The Turborepo `dev` task explicitly passes this URL and the other runtime
configuration variables through to the API process. No values or secrets are
stored in `turbo.json`, and the wrapper does not rewrite `.env`.

Always start the application from the repository root with one of these
equivalent commands:

```bash
just dev
bun run dev
```

Running `bun run dev` directly inside `src/apps/api` bypasses the root wrapper
and is not supported from a Dev Container. If the database is unavailable, the
wrapper exits before NestJS starts and reports the unreachable published port,
instead of allowing every database-backed HTTP route to fail with `500`.

To diagnose connectivity without exposing credentials, run:

```bash
bash src/apps/api/infrastructure/docker/run-with-database.sh \
  bash -c 'value=${DATABASE_URL#*@}; printf "%s\n" "${value%%/*}"'
```

## Commands

Run `just` to list every recipe. The primary daily commands are:

| Command           | Purpose                                                 |
| ----------------- | ------------------------------------------------------- |
| `just dev`        | Start workspace development tasks                       |
| `just test`       | Run unit tests                                          |
| `just e2e`        | Run E2E tests against a disposable PostgreSQL container |
| `just check`      | Check formatting, lint, types, and unit tests           |
| `just ci`         | Reproduce the complete CI pipeline locally              |
| `just db-up`      | Start the local PostgreSQL service                      |
| `just db-down`    | Remove the local Compose stack                          |
| `just db-migrate` | Create and apply a development migration                |
| `just db-deploy`  | Apply committed migrations                              |
| `just db-seed`    | Seed the development database                           |
| `just db-reset`   | Reset the development database                          |
| `just db-studio`  | Open Prisma Studio                                      |

The GitHub Actions workflow installs Nix and runs the same entry point:

```bash
nix develop --command just ci
```

## Secrets

`.envrc` must contain only environment activation logic. Keep secrets in the
ignored `src/apps/api/.env` file and document safe placeholders in
`src/apps/api/.env.example`. Never commit a populated environment file.
