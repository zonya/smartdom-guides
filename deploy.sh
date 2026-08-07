#!/usr/bin/env bash
# Deploy na produkciju + čišćenje Cloudflare keša.
#
# Zona je proxied. robots.txt, ads.txt, rss.xml i sitemap*.xml su izuzeti iz
# edge keša Cache Rule-om ("Ne kesiraj metapodatke"), pa se za njih purge više
# ne traži. Purge ostaje kao sigurnosna mreža za sve ostalo.
#
# Purge je opcion: radi samo ako je postavljen CF_API_TOKEN (token sa
# ovlašćenjem "Zone → Cache Purge → Purge" za opameti.me). Token NIKAD ne ide
# u repo — skripta ga sama učita iz ~/.config/opameti/env (ili iz fajla na koji
# pokazuje OPAMETI_ENV), a može i da se prosledi kao promenljiva okruženja.

set -euo pipefail

ENV_FILE="${OPAMETI_ENV:-$HOME/.config/opameti/env}"
if [ -z "${CF_API_TOKEN:-}" ] && [ -r "$ENV_FILE" ]; then
  set -a; . "$ENV_FILE"; set +a
fi

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
  echo "ℹ️  CF_API_TOKEN nije postavljen ($ENV_FILE) — keš nije očišćen."
  echo "   Metapodaci (robots/sitemap/rss/ads) su Cache Rule-om izuzeti iz keša,"
  echo "   pa je to obično u redu. Za ostalo: Cloudflare → Caching → Purge Everything."
fi

echo "→ Provera"
for p in / /blog/ /robots.txt /sitemap-index.xml; do
  printf '   %-20s %s\n' "$p" "$(curl -s -o /dev/null -m 15 -w '%{http_code}' "${SITE}${p}")"
done
