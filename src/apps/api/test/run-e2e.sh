#!/usr/bin/env bash

set -euo pipefail

API_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="$API_DIR/infrastructure/docker/docker-compose.yaml"
ENV_FILE="$API_DIR/.env"
E2E_PROJECT="vireon-e2e"

database_host() {
  local port="$1"

  if [[ -n "${E2E_DB_HOST:-}" ]]; then
    printf '%s\n' "$E2E_DB_HOST"
    return
  fi

  if [[ ! -f /.dockerenv ]]; then
    printf '%s\n' 'localhost'
    return
  fi

  local gateway
  gateway="$(ip route show default | awk 'NR == 1 { print $3 }')"

  local candidates=()
  if [[ -n "$gateway" ]]; then
    candidates+=("$gateway")
  fi
  if getent hosts host.docker.internal >/dev/null 2>&1; then
    candidates+=('host.docker.internal')
  fi
  candidates+=('localhost')

  local candidate
  for candidate in "${candidates[@]}"; do
    if timeout 2 bash -c 'exec 3<>"/dev/tcp/$1/$2"' _ "$candidate" "$port" 2>/dev/null; then
      printf '%s\n' "$candidate"
      return
    fi
  done

  printf 'Could not reach the E2E database on published port %s from this container.\n' "$port" >&2
  return 1
}

cleanup() {
  docker compose --env-file "$ENV_FILE" --project-name "$E2E_PROJECT" --file "$COMPOSE_FILE" --profile e2e down --volumes
}

trap cleanup EXIT

cd "$API_DIR"

docker compose --env-file "$ENV_FILE" --project-name "$E2E_PROJECT" --file "$COMPOSE_FILE" --profile e2e up --detach --wait database-e2e
E2E_DB_ADDRESS="$(docker compose --env-file "$ENV_FILE" --project-name "$E2E_PROJECT" --file "$COMPOSE_FILE" --profile e2e port database-e2e 5432)"
E2E_DB_PORT="${E2E_DB_ADDRESS##*:}"
E2E_DB_HOST="$(database_host "$E2E_DB_PORT")"
export DATABASE_URL="postgresql://vireon_e2e:vireon_e2e@$E2E_DB_HOST:$E2E_DB_PORT/vireon_e2e"

bunx prisma migrate deploy
bun run infrastructure/database/prisma/seed.ts
bun run test:e2e
