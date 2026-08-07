# opameti.me

Ime sajta je **opameti.me** (isto kao domen; „opameti me" je i igra reči).
Ranije se zvao „SmartDom Guides" — ako to negde iskoči, to je ostatak.
Repo i npm paket su i dalje `smartdom-guides`, to je namerno neizmenjeno.

## Gde smo stali (07.08.2026)

Sajt je uživo na `https://opameti.me` i radi. Objavljena 4 teksta + stranice
„O sajtu" i „Politika privatnosti". Analitika, RSS, sitemap i pošta rade.

**Sledeće na redu:**
1. Slike u tekstovima — nema nijedne. Odluka nije doneta: HA screenshotovi /
   fotografije stvarnog hardvera / stock.
2. Tekst „Prvih 5 automatizacija koje svako treba da napravi".
3. Affiliate nalozi (Amazon Associates, AliExpress) — nisu napravljeni; kad
   budu, linkovi idu u `affiliate` frontmatter (vidi Monetizaciju).
4. AdSense — tek kad bude više sadržaja i posete.

**Nezavršeno oko infrastrukture:**
- `CF_API_TOKEN` za `deploy.sh` još nije napravljen, ali više nije hitno —
  vidi Cache Rule ispod (metapodaci se ne keširaju, pa purge nije potreban).
- Google Search Console: domen i sitemap prijavljeni; indeksiranje se još
  nije proverilo.

Sajt sa vodičima za Home Assistant i Linux za početnike, na srpskom (ekavica).
Cilj: da zarađuje malo preko affiliate linkova i/ili oglasa, uz trošak koji
ostaje ispod prihoda (server + domen su ukupno ~5-6€/mesec).

## Stack

- Astro 7, static output (nema backend/bazu).
- Sadržaj: content collections, `src/content/posts/*.md`, definisan u
  `src/content.config.ts`. Frontmatter: `title`, `description`, `pubDate`,
  `tags` (array), opciono `affiliate` (lista proizvoda, vidi Monetizaciju).
- Layout: `src/layouts/BaseLayout.astro`. Stranice: `src/pages/index.astro`
  (početna, poslednjih 5 tekstova), `src/pages/blog/index.astro` (svi
  tekstovi), `src/pages/blog/[slug].astro` (pojedinačan tekst, slug = ime
  fajla bez ekstenzije), `src/pages/tag/[tag].astro` (tekstovi po temi).
- Komponente: `src/components/` — `PostCard`, `AdSlot`, `AffiliateBox`.
  Pomoćne funkcije (sortiranje, vreme čitanja): `src/utils/posts.ts`.
- Konfiguracija: `src/config/site.ts` — ime/tagline/nav + sve monetizacijske
  zastavice na jednom mestu.
- Stil: `src/styles/global.css`, bez CSS frameworka — namerno minimalno.
  Tema: `prefers-color-scheme` + ručno dugme u zaglavlju (`data-theme` na
  `<html>`, pamti se u `localStorage`, inline skripta u `<head>` da nema
  bljeska pogrešne boje).

## Deploy

- Hetzner Cloud CX23, Ubuntu 24.04, IP `168.119.53.13`.
- Domen `opameti.me` (+ wildcard `*.opameti.me`), DNS na Cloudflare,
  **proxied (oranž oblak)**. Caddy na originu i dalje ima svoj Let's Encrypt
  sertifikat, a SSL režim je **Full (strict)**, pa taj cert mora biti važeći —
  ako istekne, sajt pada sa greškom 526.
- **Keš metapodataka je rešen Cache Rule-om** (07.08.2026). Na zoni postoji
  ruleset u fazi `http_request_cache_settings`, pravilo „Ne kesiraj
  metapodatke (robots/sitemap/rss/ads)" sa `set_cache_settings → cache:false`
  za `/robots.txt`, `/ads.txt`, `/rss.xml` i `/sitemap*.xml`. Provereno:
  `cf-cache-status: DYNAMIC` na sve četiri putanje. Purge posle deploy-a se
  za njih više ne traži.
- HTML se ionako ne kešira na edge-u (nema „Cache Everything" pravila), pa je
  purge sada samo sigurnosna mreža. `deploy.sh` ga i dalje radi ako je
  postavljen `CF_API_TOKEN`.
- `Dockerfile` (multi-stage: Node build → Caddy serve), `docker-compose.yml`,
  `Caddyfile` (čita domen iz `DOMAIN` env varijable).
- Na serveru: `~/smartdom-guides`, `.env` sadrži `DOMAIN=opameti.me`.
- **Update na produkciji** — `./deploy.sh` (deploy + purge keša + provera), ili ručno:
  ```sh
  ssh root@168.119.53.13
  cd smartdom-guides && git pull && docker compose up -d --build
  ```
  Skripta sama učita `~/.config/opameti/env` (ili fajl iz `OPAMETI_ENV`) ako
  postoji; token NIKAD ne ide u repo. Bez tokena deploy prolazi normalno, samo
  se preskoči purge.
- ⚠️ Token za purge se **ne može napraviti kroz `cloudflare-api` MCP** — ta
  sesija je OAuth i nema pravo nad `/user/tokens` (`9109 Unauthorized`).
  Pravi se ručno u panelu: Custom Token → Zone → Cache Purge → Purge, samo
  zona `opameti.me`.
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

## Monetizacija

Mesta za oglase i affiliate blokovi **postoje u kodu ali su isključeni** —
ništa se ne renderuje dok se ne uključi u `src/config/site.ts`.

### Oglasi (AdSense)

- Sve se pali iz `monetization.ads` u `src/config/site.ts`:
  `enabled: true` + `client` (`ca-pub-…`) + `slots` ID-jevi iz AdSense panela.
- Postojeće pozicije (`<AdSlot slot="…" />`): `inArticle` (odmah ispod
  naslova teksta), `belowArticle` (ispod teksta, iznad prev/next),
  `list` (dno naslovne, liste vodiča i tag stranica).
- Za proveru izgleda bez naloga: `<AdSlot slot="list" preview />` iscrta
  isprekidan okvir sa natpisom.
- `public/ads.txt` je šablon — AdSense ne servira oglase dok se ne popuni.
- Skripta AdSense-a se učitava samo kad je `enabled` — dok je isključeno,
  sajt nema nijedan eksterni zahtev.

### Affiliate

- Nalozi (Amazon Associates / AliExpress) još nisu napravljeni.
- Proizvodi se dodaju u frontmatter teksta, ne u telo:
  ```yaml
  affiliate:
    - title: "Sonoff Zigbee 3.0 USB Dongle Plus"
      url: "https://…"
      price: "~25€"
      note: "Obavezno preko USB produžnog kabla."
  ```
  `AffiliateBox` ih iscrta na dnu teksta, sa `rel="sponsored nofollow"` i
  obaveštenjem o proviziji (tekst u `monetization.affiliate.disclosure`).
- Linkovi mogu i dalje da idu inline u markdown gde je prirodno; boks je za
  zbirnu preporuku hardvera.

### Analitika

- **Cloudflare Web Analytics** — besplatan, bez kolačića, ne traži cookie
  banner. Kod je na mestu, čeka samo token: Cloudflare → Analytics & Logs →
  Web Analytics → Add a site (`opameti.me`), pa iz snippeta prepiši vrednost
  `token` u `analytics.cloudflareToken` (`src/config/site.ts`). Dok je
  prazno, nikakva skripta se ne učitava.

### SEO

- `src/pages/rss.xml.js` → `/rss.xml` (link u `<head>` i u podnožju).
- `@astrojs/sitemap` → `/sitemap-index.xml`, na koji upućuje
  `public/robots.txt`. Sitemap prijaviti u Google Search Console.
