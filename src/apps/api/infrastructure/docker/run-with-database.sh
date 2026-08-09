#!/usr/bin/env bash

set -euo pipefail

API_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ENV_FILE="$API_DIR/.env"

set -a
source "$ENV_FILE"
set +a

database_host() {
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
    if timeout 2 bash -c 'exec 3<>"/dev/tcp/$1/$2"' _ "$candidate" "$DB_PORT" 2>/dev/null; then
      printf '%s\n' "$candidate"
      return
    fi
  done

  printf 'Could not reach the development database on port %s.\n' "$DB_PORT" >&2
  return 1
}

DB_HOST="$(database_host)"
DATABASE_URL="${DATABASE_URL/@localhost:/@$DB_HOST:}"
export DATABASE_URL

exec "$@"
