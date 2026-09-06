#!/usr/bin/env bash
# From the laptop: git pull --ff-only on penisland2, then rebuild.
#
#   SAMMAH_SSH_HOST     default: sam_user@penisland2
#   SAMMAH_REMOTE_DIR   default: /home/sam_user/workspace/personal-website
set -euo pipefail

HOST="${SAMMAH_SSH_HOST:-sam_user@penisland2}"
REMOTE="${SAMMAH_REMOTE_DIR:-/home/sam_user/workspace/personal-website}"

REMOTE_CD="cd $(printf '%q' "$REMOTE") && "
REMOTE_BODY='bash infra/scripts/server-compose-up.sh'
# shellcheck disable=SC2029
exec ssh "$HOST" "${REMOTE_CD}${REMOTE_BODY}"
