# SmartDom Guides

Sajt sa vodičima za Home Assistant i Linux za početnike, na srpskom (ekavica).
Cilj: da zarađuje malo preko affiliate linkova i/ili oglasa, uz trošak koji
ostaje ispod prihoda (server + domen su ukupno ~5-6€/mesec).

## Stack

- Astro 7, static output (nema backend/bazu).
- Sadržaj: content collections, `src/content/posts/*.md`, definisan u
  `src/content.config.ts`. Frontmatter: `title`, `description`, `pubDate`,
  `tags` (array).
- Layout: `src/layouts/BaseLayout.astro`. Stranice: `src/pages/index.astro`
  (početna, poslednjih 5 tekstova), `src/pages/blog/index.astro` (svi
  tekstovi), `src/pages/blog/[slug].astro` (pojedinačan tekst, slug = ime
  fajla bez ekstenzije).
- Stil: `src/styles/global.css`, light/dark automatski
  (`prefers-color-scheme`), bez CSS frameworka — namerno minimalno.

## Deploy

- Hetzner Cloud CX23, Ubuntu 24.04, IP `168.119.53.13`.
- Domen `opameti.me` (+ wildcard `*.opameti.me`), DNS na Cloudflare
  (trenutno DNS-only/siv oblak — Caddy sam pribavlja Let's Encrypt sertifikat;
  proxy/oranž oblak može da se uključi kasnije za CDN/DDoS).
- `Dockerfile` (multi-stage: Node build → Caddy serve), `docker-compose.yml`,
  `Caddyfile` (čita domen iz `DOMAIN` env varijable).
- Na serveru: `~/smartdom-guides`, `.env` sadrži `DOMAIN=opameti.me`.
- **Update na produkciji:**
  ```sh
  ssh root@168.119.53.13
  cd smartdom-guides && git pull && docker compose up -d --build
  ```
- Repo je javan (public) — kloniranje/push ne traži autentikaciju.

## Radni tok za nov tekst

1. Dodaj `.md` fajl u `src/content/posts/` sa frontmatter-om.
2. `npm run build` lokalno da proveriš da nema grešaka.
3. Commit + push na `main`.
4. Deploy na server (komanda gore) kad je spreman za objavu.

## Ton i stil sadržaja

Srpski (ekavica), jednostavno, bez žargona, korak-po-korak, za ljude koji
tek počinju. Postojeći tekstovi su dobar primer stila.

## Plan sadržaja

Objavljeno:
- Šta je Home Assistant i da li ti uopšte treba?
- Home Assistant za apsolutne početnike — instalacija za 30 minuta
- Koji hardver ti treba za pametan dom: Zigbee vs Z-Wave vs WiFi

U planu (redosled po prioritetu, prva 3 su prirodno mesto za affiliate
linkove ka hardveru):
- Prvih 5 automatizacija koje svako treba da napravi
- Najbolji jeftini Zigbee senzori i utičnice za početak
- Kako da instaliraš Home Assistant na svom Linux serveru (Docker)
- Home Assistant vs gotova rešenja (Google Home, Alexa, Tuya)
- Koji Linux distro da izabereš
- Osnove terminala — 20 komandi koje ti stvarno trebaju
- Zaštita pametnog doma — osnove bezbednosti

## Monetizacija (još nije podešeno)

- Amazon Associates / AliExpress affiliate — nalozi još nisu napravljeni.
- Cloudflare Web Analytics — još nije uključen (razmatran, besplatan, bez
  cookie-ja).
- Kad affiliate nalozi budu spremni, linkove ubacivati direktno u markdown
  tekstove; nema posebnog sistema za to za sada (namerno, dok ne bude
  potrebno).
