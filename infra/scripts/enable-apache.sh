#!/usr/bin/env bash
# Run ON penisland as sam, with a sudo password prompt:
#   cd ~/workspace/personal-website && bash infra/scripts/enable-apache.sh
#
# HTTP vhost first so certbot can answer HTTP-01. DNS for sammah.dad (and
# www if you want that name on the cert) must already point at 67.243.35.252
# before certbot will succeed.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APACHE="$REPO_ROOT/infra/apache"
EMAIL="${SAMMAH_CERTBOT_EMAIL:-smmahdad@gmail.com}"

sudo cp "$APACHE/sammah.dad.conf" /etc/apache2/sites-available/
sudo a2ensite sammah.dad.conf
sudo apachectl -t
sudo systemctl reload apache2

# Optional: install the hand-written SSL vhost after certs exist.
if [[ -f /etc/letsencrypt/live/sammah.dad/fullchain.pem ]]; then
  sudo cp "$APACHE/sammah.dad-ssl.conf" /etc/apache2/sites-available/
  sudo a2ensite sammah.dad-ssl.conf
fi

sudo certbot --apache -d sammah.dad -d www.sammah.dad \
  --non-interactive --agree-tos --redirect --email "$EMAIL" || true

sudo apachectl -t
sudo systemctl reload apache2
echo "Enabled sammah.dad (check certbot output if HTTPS is not live yet)"
