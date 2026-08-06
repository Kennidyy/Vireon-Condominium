#!/usr/bin/env bash

set -euo pipefail

API_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="$API_DIR/infrastructure/docker/docker-compose.yaml"
ENV_FILE="$API_DIR/.env"
E2E_PROJECT="vireon-e2e"

cleanup() {
  docker compose --env-file "$ENV_FILE" --project-name "$E2E_PROJECT" --file "$COMPOSE_FILE" down --volumes
}

trap cleanup EXIT

cd "$API_DIR"

docker compose --env-file "$ENV_FILE" --project-name "$E2E_PROJECT" --file "$COMPOSE_FILE" up --detach --wait database-e2e
E2E_DB_ADDRESS="$(docker compose --env-file "$ENV_FILE" --project-name "$E2E_PROJECT" --file "$COMPOSE_FILE" port database-e2e 5432)"
E2E_DB_PORT="${E2E_DB_ADDRESS##*:}"
export DATABASE_URL="postgresql://vireon_e2e:vireon_e2e@localhost:$E2E_DB_PORT/vireon_e2e"

bunx prisma migrate deploy
bun run infrastructure/database/prisma/seed.ts
bun run test:e2e
