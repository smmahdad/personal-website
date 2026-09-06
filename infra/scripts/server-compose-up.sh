#!/usr/bin/env bash
# Run ON penisland2 in the personal-website git checkout.
# Pulls origin/main (or SAMMAH_GIT_REF), then rebuilds the static nginx image.
#
#   cd ~/workspace/personal-website
#   bash infra/scripts/server-compose-up.sh
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
INFRA="$REPO_ROOT/infra"
KEY="${SAMMAH_DEPLOY_KEY:-$HOME/.ssh/personal_website_deploy}"
REF="${SAMMAH_GIT_REF:-main}"

cd "$REPO_ROOT"

if [[ -f "$KEY" ]]; then
  eval "$(ssh-agent -s)"
  ssh-add "$KEY"
fi

if [[ -d .git ]]; then
  git fetch origin
  git checkout "$REF"
  git pull --ff-only origin "$REF"
fi

cd "$INFRA"
docker compose up -d --build
echo "sammah.dad rebuilt from $(git -C "$REPO_ROOT" rev-parse --short HEAD)"
