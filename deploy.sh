#!/usr/bin/env bash
# Deploy na produkciju + čišćenje Cloudflare keša.
#
# Zona je proxied, pa edge kešira statiku — bez purge-a se posle deploy-a i
# dalje servira stara verzija fajlova kao robots.txt i sitemap.
#
# Purge je opcion: radi samo ako je postavljen CF_API_TOKEN (token sa
# ovlašćenjem "Zone → Cache Purge → Purge" za opameti.me). Token NIKAD ne ide
# u repo — drži ga u ~/.config/opameti/env i učitaj pre pokretanja:
#   set -a; . ~/.config/opameti/env; set +a; ./deploy.sh

set -euo pipefail

SERVER="root@168.119.53.13"
ZONE_ID="e3a7d3c7c242e26d3df32a8d820e7eb7"
SITE="https://opameti.me"

echo "→ Deploy na $SERVER"
ssh -o ConnectTimeout=15 "$SERVER" \
  'cd smartdom-guides && git pull -q && docker compose up -d --build 2>&1 | tail -2'

if [ -n "${CF_API_TOKEN:-}" ]; then
  echo "→ Čišćenje Cloudflare keša"
  curl -sS -X POST \
    "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache" \
    -H "Authorization: Bearer ${CF_API_TOKEN}" \
    -H "Content-Type: application/json" \
    --data '{"purge_everything":true}' \
    | grep -q '"success":true' \
    && echo "  keš očišćen" \
    || { echo "  ⚠️ purge nije uspeo"; exit 1; }
else
  echo "⚠️  CF_API_TOKEN nije postavljen — keš NIJE očišćen."
  echo "   Ako si menjao robots.txt, sitemap ili druge statične fajlove,"
  echo "   očisti keš ručno (Cloudflare panel → Caching → Purge Everything)."
fi

echo "→ Provera"
for p in / /blog/ /robots.txt /sitemap-index.xml; do
  printf '   %-20s %s\n' "$p" "$(curl -s -o /dev/null -m 15 -w '%{http_code}' "${SITE}${p}")"
done
