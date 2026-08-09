set shell := ["bash", "-euo", "pipefail", "-c"]

api_dir := "src/apps/api"
compose_file := api_dir + "/infrastructure/docker/docker-compose.yaml"
env_file := api_dir + "/.env"

default:
    @just --list

install:
    bun install

install-frozen:
    bun install --frozen-lockfile

setup-env:
    @if [[ ! -f "{{env_file}}" ]]; then cp "{{api_dir}}/.env.example" "{{env_file}}"; echo "Created {{env_file}} from the example file"; fi

setup: install setup-env db-up db-generate db-deploy db-seed

dev:
    bun run dev

build:
    bun run build

lint:
    bun run lint

format:
    bun run format

format-check:
    bun run format:check

typecheck:
    bun run check-types

test:
    bun run test

e2e: setup-env
    bash {{api_dir}}/test/run-e2e.sh

check: format-check lint typecheck test

ci: install-frozen setup-env db-generate check e2e build

infra-up: setup-env
    docker compose --env-file {{env_file}} --file {{compose_file}} up --detach

infra-down: setup-env
    docker compose --env-file {{env_file}} --file {{compose_file}} down

infra-logs: setup-env
    docker compose --env-file {{env_file}} --file {{compose_file}} logs --follow

db-up: setup-env
    docker compose --env-file {{env_file}} --file {{compose_file}} up --detach --wait database

db-down: setup-env
    docker compose --env-file {{env_file}} --file {{compose_file}} down

db-stop: setup-env
    docker compose --env-file {{env_file}} --file {{compose_file}} stop database

db-logs: setup-env
    docker compose --env-file {{env_file}} --file {{compose_file}} logs --follow database

db-reset: setup-env
    cd {{api_dir}} && bash infrastructure/docker/run-with-database.sh bunx prisma migrate reset

db-migrate: setup-env
    cd {{api_dir}} && bash infrastructure/docker/run-with-database.sh bunx prisma migrate dev

db-deploy: setup-env
    cd {{api_dir}} && bash infrastructure/docker/run-with-database.sh bunx prisma migrate deploy

db-seed: setup-env
    cd {{api_dir}} && bash infrastructure/docker/run-with-database.sh bun run infrastructure/database/prisma/seed.ts

db-generate:
    cd {{api_dir}} && bunx prisma generate

db-studio: setup-env
    cd {{api_dir}} && bash infrastructure/docker/run-with-database.sh bunx prisma studio --port 5555 --browser none

clean:
    rm -rf node_modules packages/ui/node_modules src/apps/api/node_modules .turbo src/apps/api/dist
