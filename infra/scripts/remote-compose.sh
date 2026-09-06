#!/usr/bin/env bash
# Run `docker compose` for sammah.dad on penisland2 over SSH.
#
#   bash infra/scripts/remote-compose.sh ps
#   bash infra/scripts/remote-compose.sh logs -f web
set -euo pipefail

HOST="${SAMMAH_SSH_HOST:-sam_user@penisland2}"
REMOTE="${SAMMAH_REMOTE_DIR:-/home/sam_user/workspace/personal-website}"

if [[ $# -eq 0 ]]; then
  echo "Usage: $0 <docker compose args...>" >&2
  exit 1
fi

REMOTE_CD="cd $(printf '%q' "$REMOTE")/infra && "
# shellcheck disable=SC2029
exec ssh "$HOST" "${REMOTE_CD}docker compose $(printf '%q ' "$@")"
