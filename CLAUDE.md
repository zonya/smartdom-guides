# opameti.me

Ime sajta je **opameti.me** (isto kao domen; „opameti me" je i igra reči).
Ranije se zvao „SmartDom Guides" — ako to negde iskoči, to je ostatak.
Repo i npm paket su i dalje `smartdom-guides`, to je namerno neizmenjeno.

## Gde smo stali (10.08.2026)

Sajt je uživo na `https://opameti.me`. **7 srpskih + 1 engleski tekst**, uz
„O sajtu" i „Politiku privatnosti" na oba jezika. Analitika, RSS, sitemap, pošta, logo i
slike rade. Sajt je od 10.08. **dvojezičan** — vidi „Dvojezičnost".

**10.08.2026:** napisan tekst „Kako da instaliraš Home Assistant na svom Linux
serveru (Docker)" (1.535 reči), ilustrovan ✅. Nema affiliate potencijala
(softver), ali hvata pretragu koju HA OS tekst ne pokriva.

⚠️ **Terminologija ispravljena uz proveru na živom HA 2026.8.1:** ono što se
zvalo **add-ons** sada se zove **Apps**, i stavka „Apps" **postoji** u
Podešavanjima i u Container instalaciji — otvara objašnjenje da aplikacije
zahtevaju HA OS. Tekst je prvo tvrdio da stavke nema, što bi svakog čitaoca
koji uporedi sa svojim ekranom navelo da je tekst pogrešan. Slike
(`ha-docker-apps.png`, `ha-docker-about.png`) su iz demo instance, koja je i
sama običan `docker run`, pa dokazuju tvrdnju umesto da je samo iznose.

**Ko-fi (09.08.2026):** `ko_fi: zonya2026` + sekcija „Podrži"/„Support" u svih
8 javnih repoa. `sendspin-cinema-webos` je imao badge sa `TVOJ_USERNAME` →
mrtav link, ispravljeno. 4 repoa bila bez ijednog topica → dodati.
⚠️ Ko-fi **API ključ nije potreban** za dugme (samo za webhookove).

**09.08.2026:** napisan tekst „Najbolji jeftini Zigbee senzori i utičnice za
početak" (1.650 reči) — prvi tekst pisan sa affiliate linkovima u vidu.
⚠️ **Frontmatter `affiliate:` je namerno prazan.** Nema još AliExpress naloga,
a linkovi bez tracking ID-ja bi se ionako prepisivali — pa u tekstu nema
nijednog spoljnog linka na proizvod, samo oznake modela. **Kad nalog bude
napravljen, prvo se dopunjava ovaj tekst.** Modeli koje treba linkovati:
ZBDongle-E, SLZB-06, S26R2ZB, Nous A1Z, SNZB-04P, SNZB-03P, SNZB-02D,
SNZB-05P, Aqara P1, ZBMINIR2, USB produžni kabl.

**Urađeno 07-08.08.2026 (da se ne radi dvaput):**
- ime sajta → `opameti.me` (bilo „SmartDom Guides")
- logo — krov nad promptom `>_`; favicon i iOS ikonica se generišu iz istog
  izvora (`src/config/logo.ts`)
- OG slike za deljenje + pločice za kartice, obe generisane na build-u
- prerada izgleda: mreža kartica dobila kolone, liste puštene na 64rem
- nov tekst „Prvih 5 automatizacija" (1.400 reči)
- 15 slika u tekstovima, iz čiste demo instance HA (bez Markovih uređaja)
- ispravljen korak 1 u tekstu o instalaciji — bio netačan za Imager 2.0.6
- pravila o licu i obraćanju čitaocu (vidi „Ton i stil sadržaja")

**Sledeće na redu, po važnosti:**
1. **Još tekstova.** Jedino što stvarno pomera stvar; sve ostalo čeka na
   saobraćaj. Sledeći je „Najbolji jeftini Zigbee senzori i utičnice za
   početak" — prvi tekst gde affiliate linkovi imaju smisla.
2. **Affiliate nalog — AliExpress pre Amazona.** Amazon Associates gasi nalog
   bez 3 prodaje u 180 dana, a ova publika sa Amazona ne kupuje. Dobro bi bilo
   da nalog postoji **pre** nego što se napiše tekst o senzorima.
3. **AdSense — ne prijavljivati još.** Sa 5 tekstova i jedva nešto poseta,
   prijava se odbija kao „low value content". Prag je oko 20-30 tekstova i
   nešto organskog saobraćaja.

**Slike — dokle se stiglo sa demo instancom (10.08.2026):**
Demo je iscrpljen za ono čemu je mogao da posluži. Sirovi snimci su prebačeni
u `~/opameti-slike/ha-demo-2026-08-10/` da prežive gašenje kontejnera; u repou
ostaje samo ono što je zaista upotrebljeno (`tools/ha-shots-docker/` je u
`.gitignore`).
- Iskorišćeno: `apps` i `about` za Docker tekst.
- Neupotrebljivo: **History i Logbook su prazni** — demo nema podataka, a
  prazan ekran je gori od nikakve slike.
- Sačuvano za budući tekst o entitetima: `04-states.png`
  (Developer tools → States, sa popunjenim automatizacijama).
- ⚠️ **„Zigbee vs Z-Wave" i „Jeftini Zigbee senzori" NE mogu iz demo instance** —
  njima trebaju **fotografije stvarnog hardvera**, a to mora Marko.
- „Šta je Home Assistant" je 366 reči i konceptualan; slika mu ne bi pomogla,
  pa je namerno ostao bez nje.

**Sitnije, kad se ukaže prilika:**
- Naslovna bi mogla da izdvoji jedan tekst kao veliku karticu, a
  „Dobrodošli na opameti.me" (najava od 85 reči) da izađe iz liste — sada
  stoji ravnopravno sa pravim vodičima. **Predloženo, nije odrađeno.**
- Fotografija Raspberry Pi-ja za korak 2 teksta o instalaciji — jedina koju
  niko još nije napravio.
- Video za YouTube: prvi prolaz postoji (`~/opameti-slike/ha-prolaz.mp4`), ali
  je grub — kadrovi se hvataju samo na promenu ekrana, pa nema pauza za
  čitanje. Treba prolaz sa namernim pauzama.

**Nezavršeno oko infrastrukture:**
- ⏰ **`ha-demo` kontejner i dalje radi na Hetzneru** (`root@168.119.53.13`).
  Marko je tražio da ostane, uz podsetnik. Gašenje:
  `docker rm -f ha-demo && rm -rf /root/ha-demo`.
- `CF_API_TOKEN` za `deploy.sh` nije napravljen. Cache Rule pokriva sve fajlove
  sa stalnim imenom koje danas imamo, ali purge treba kad se doda nov takav
  fajl — dotle ide kroz `cloudflare-api` MCP.
- Google Search Console: domen i sitemap prijavljeni; **indeksiranje još nije
  provereno**.

**Monetizacija — dogovoreno 07.08.2026:** najveći potencijal sajta nije AdSense
nego to što dovodi klijente **NextIT-u**. Jedan posao postavljanja pametnog
doma vredi koliko dve godine oglasa na ovakvom saobraćaju. To ne menja plan
sadržaja, ali kad dođe vreme za monetizaciju, prioritet je stranica usluga i
poziv na kontakt, ne bolji raspored oglasa.

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
- **Širina:** `.wrap` je `--max-width` (44rem, širina za čitanje). Stranice sa
  mrežom kartica (naslovna, `/blog`, `/tag/*`) šalju `wide` u `BaseLayout` i
  dobijaju `--wide-width` (64rem). Tekstovi ostaju uski, namerno.
- **Kartice** (`PostCard`) ne koriste naslovnu sliku teksta nego generisanu
  pločicu `/og/card/<slug>.webp` — znak, tema i boja izvedena iz sluga, **bez
  naslova** (naslov stoji ispod, kao pravi tekst). Razlog: nemaju svi tekstovi
  `cover`, pa je mreža bila rasklimana, a screenshot na širini kartice je
  nečitljiv i blješti u tamnoj temi. `cover` se i dalje koristi na vrhu teksta.
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
- **Keš fajlova sa stalnim imenom rešen je Cache Rule-om** (07.08.2026). Na
  zoni postoji ruleset u fazi `http_request_cache_settings`, pravilo „Ne
  kesiraj fajlove sa stalnim imenom" sa `set_cache_settings → cache:false` za
  `/robots.txt`, `/ads.txt`, `/rss.xml`, `/favicon.svg`,
  `/apple-touch-icon.png`, `/sitemap*.xml` i sve pod `/og/`.
- ⚠️ **Pravilo se mora dopuniti kad god se doda fajl sa stalnim imenom.**
  Astro hešira imena za CSS/JS/slike, pa se oni sami obnavljaju — ali sve
  ručno imenovano (ikonice, `manifest.json`, `.well-known/…`) se zaglavi na
  edge-u. Ovo nas je već uhvatilo sa `favicon.svg` posle promene logoa.
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

**Lice:**
- Autor govori u **prvom licu množine** — „preporučujemo", „pišemo posebno",
  „kad smo prvi put sklapali". Nikad u jednini.
- Čitaocu se obraćamo sa **„ti"** — „ako nemaš Raspberry Pi", „podesi zonu".
  To je namerno, jer je publika početnička; ne prelaziti na „vi".

⚠️ **Zamka: pisanje Marku umesto čitaocu.** Tekstovi nastaju iz Markovog
setupa, pa se lako provuče rečenica koja važi samo za njega. Uhvaćeno
08.08.2026: „na istom onom serveru na kom hostuješ ovaj sajt" i „dobio si
`person.marko`" (čitalac se ne zove Marko). Pre objave proveriti: **da li je
ovo tačno za nekoga ko me nikad nije sreo?**

Imena entiteta u primerima **jesu** iz Markove kuće i to je u redu — ali mora
bar jednom u tekstu pisati da su primeri i da čitalac svoja imena vidi u
Developer tools → States.

## Plan sadržaja

Objavljeno (7, uključujući uvodnu najavu):
- Dobrodošli na opameti.me *(najava, 85 reči — kandidat za sklanjanje sa liste)*
- Šta je Home Assistant i da li ti uopšte treba?
- Home Assistant za apsolutne početnike — instalacija za 30 minuta ✅ ilustrovan
- Koji hardver ti treba za pametan dom: Zigbee vs Z-Wave vs WiFi
- Prvih 5 automatizacija koje svako treba da napravi ✅ ilustrovan
- Najbolji jeftini Zigbee senzori i utičnice za početak ⏳ čeka affiliate linkove
- Kako da instaliraš Home Assistant na svom Linux serveru (Docker)

Engleski (`/en/`, projekti — ne prevodi):
- Sidecar Travel: use an iPad as a headless Mac's display ✅

U planu (redosled po prioritetu):
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

## Dvojezičnost (10.08.2026)

Srpski je podrazumevan i **stoji na korenu** (`/blog/…`), engleski ide pod
`/en/`. Sve postojeće srpske adrese su nedirnute — to je bio uslov, jer je
promena putanje jedina stvar koja košta pozicije u pretrazi.

⚠️ **Geo targeting se NE koristi i ne treba ga uvoditi.** Jezik po IP adresi
znači da Google (koji crawluje sa američkih adresa) vidi samo englesku verziju,
a srpska — koja je ceo saobraćaj — ispada iz pretrage. Odvojene adrese +
`hreflang` + dugme u zaglavlju.

**Kako se dodaje engleski tekst:** `.md` u isti folder (`src/content/posts/`),
uz `lang: en` u frontmatter-u. Bez `lang`, tekst je srpski. Fajlovi su u
zajedničkom, ravnom prostoru imena, pa su slugovi automatski jedinstveni.

**Ako tekst ima prevod:** upiši `translationOf: <id-drugog-teksta>` na **jednoj**
strani para. Veza se čita u oba smera (`findTranslation`), i iz nje se izvode
`hreflang` oznake i cilj dugmeta za jezik.

- `src/config/i18n.ts` — jezici, tekstovi interfejsa (`ui`), `localePath()`,
  navigacija po jeziku. **Svaki nov tekst interfejsa ide ovde, ne u komponentu.**
- `BaseLayout` prima `lang` i `altHref`. `hreflang` se emituje **samo kad
  `altHref` postoji** — lažna veza između nepovezanih stranica je gore od
  nikakve. Mora biti **uzajaman**: ako engleska strana pokazuje na srpsku, i
  srpska mora na englesku, inače Google ignoriše obe oznake.
- `altHref` uvek piši sa **kosom crtom na kraju** (`/en/blog/`), da `hreflang`
  gađa kanonsku adresu.
- Rute: `src/pages/en/{index,blog/index,blog/[slug],tag/[tag],rss.xml.js}`.
- `PostCard` prima `locale` (format datuma + adrese tema).
- OG slike rade same — generatori koriste `getAllPosts()` (svi jezici).

Stranice koje nisu tekstovi imaju **ručno prevedene slugove** — `/o-sajtu/` ↔
`/en/about/`, `/privatnost/` ↔ `/en/privacy/`. Par se drži na jednom mestu, u
`pagePaths` u `i18n.ts`; `navFor()` i podnožje čitaju odatle. Kad se dodaje nova
takva stranica, prvo par u `pagePaths`, pa onda ruta.

ℹ️ **Sitemap pari samo stranice sa istim slugom** (`/blog/` ↔ `/en/blog/`), pa
`/o-sajtu/` ↔ `/en/about/` u sitemapu **nisu** povezane — plugin ne zna za ručne
prevode slugova. To nije greška i ne treba je „popravljati": `hreflang` u
`<head>` te parove pokriva, i on je izvor koji Google uzima kao merodavan.

**Otvoreno:**
- Naslovna `/en/` je pisana za projekte, ne za vodiče — to je namerno (odluka
  10.08.2026: prevodi vodiča ne bi rangirali, engleske stranice projekata
  hoće, jer za njih nema konkurencije).

## Logo

Znak je **krov (kuća) nad promptom `>_` (terminal)** — dve teme sajta u jednom
potezu. Izabran 07.08.2026 iz četiri predloga.

**Geometrija stoji samo u `src/config/logo.ts`** i odatle je koriste sva četiri
mesta: zaglavlje (`BaseLayout.astro`), favicon (`pages/favicon.svg.ts`), iOS
ikonica (`pages/apple-touch-icon.png.ts`) i slike za deljenje (`utils/og.ts`).
Ako se menja znak, menja se tu i propagira svuda. `public/favicon.svg` više ne
postoji — favicon je generisana ruta, ne statičan fajl.

- U zaglavlju je znak **linijski, u `currentColor`**, pa sam prati temu.
- Favicon i iOS ikonica su **puna pločica** (`LOGO_TILE`, `#1d5cf0`) sa belim
  znakom — traka kartica ima nepoznatu boju pozadine, linijski znak bi na
  jednoj od tema nestao.
- Ime se piše u dva dela: `opameti` u boji teksta, `.me` u akcentnoj
  (`.logo__tld`). Isto važi i na OG slikama.

## Slike

Odluka (07.08.2026), u dva sloja:

**1. Slika za deljenje — automatska, za svaki tekst.** `/og/<slug>.png`
(1200×630) se iscrtava na build-u iz naslova teksta:
`src/pages/og/[...slug].png.ts` + `src/utils/og.ts`. Ne traži nikakav ručni
rad i ne može da se zaboravi. Ostatak sajta koristi `/og/default.png`.
Crta se SVG-om koji `sharp` rasterizuje — `sharp` ionako dolazi uz Astro, pa
nema nove zavisnosti.
⚠️ `sharp` tekst crta **sistemskim fontovima**. Zato `Dockerfile` u build fazi
instalira `fontconfig font-dejavu`. Ako se to ukloni, build **neće pući** —
slike će samo izaći bez teksta. Posle izmena tu obavezno pogledati sliku.

**2. Slike u tekstu — ručno, i samo prave.** Screenshotovi iz stvarnog Home
Assistant-a i fotografije hardvera koji zaista imamo. **Stock fotografije se ne
koriste** — generički „pametan dom" iz banke slika je tačno ono po čemu se
prepoznaju sajtovi bez vrednosti, a to je i ono što AdSense odbija.

Kako se dodaje naslovna slika:
- fajl u `src/assets/posts/` (ne u `public/` — tamo Astro ne optimizuje),
- u frontmatter: `cover: ../../assets/posts/ime.jpg` i `coverAlt: "opis"`.
- `coverAlt` je **obavezan uz `cover`** — bez njega build pada (provera je u
  `src/content.config.ts`). Namerno: slika bez opisa je propust koji se lako
  previdi.
- Slika se pojavljuje na vrhu teksta i kao sličica u karticama (16:9).
- Slike unutar teksta idu običnim markdown-om; stil je u `global.css`
  (`.prose img`).

### SEO

- `src/pages/rss.xml.js` → `/rss.xml` (link u `<head>` i u podnožju).
- `@astrojs/sitemap` → `/sitemap-index.xml`, na koji upućuje
  `public/robots.txt`. Sitemap prijaviti u Google Search Console.
