# opameti.me

Statican Astro sajt sa vodicima za Home Assistant i Linux za pocetnike.

## Razvoj

```sh
npm install
npm run dev       # http://localhost:4321
```

Novi tekst: dodaj `.md` fajl u `src/content/posts/` sa frontmatter-om:

```md
---
title: "Naslov"
description: "Kratak opis za SEO."
pubDate: 2026-08-06
tags: ["home-assistant"]
---

Sadrzaj teksta...
```

## Deploy (Hetzner + Docker)

Na serveru:

```sh
git clone https://github.com/zonya/smartdom-guides.git
cd smartdom-guides
cp .env.example .env   # upisi pravi domen
docker compose up -d --build
```

Caddy automatski pribavlja Let's Encrypt sertifikat za domen iz `.env`
(portovi 80/443 moraju biti otvoreni i domen mora pokazivati na server pre
prvog pokretanja).

## Update

```sh
git pull
docker compose up -d --build
```
