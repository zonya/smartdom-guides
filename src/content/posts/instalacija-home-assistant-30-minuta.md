---
title: "Home Assistant za apsolutne početnike — instalacija za 30 minuta"
description: "Korak po korak: kako da instaliraš Home Assistant OS na Raspberry Pi i pristupiš mu iz browsera, bez prethodnog iskustva."
pubDate: 2026-08-06
tags: ["home-assistant", "instalacija", "raspberry-pi"]
---

Ne treba ti Linux iskustvo ni programiranje da bi pokrenuo Home Assistant. Najlakši put je **Home Assistant OS** — gotov sistem koji se flash-uje na SD karticu ili SSD, kao instaliranje aplikacije na telefon.

## Šta ti treba

- **Raspberry Pi 4 ili 5** (4GB RAM je dovoljno; 5 je brži ako planiraš više uređaja i integracija) — ili bilo koji mini PC/stari laptop.
- **MicroSD kartica (min 32GB, klasa A2)** ili SSD preko USB-a (SSD je pouzdaniji na duge staze).
- **Kabl za struju i mrežni kabl** (žično je stabilnije od wifi-ja za server koji radi 24/7).
- Računar sa koga instaliraš — Windows, Mac ili Linux, svejedno.

## Korak 1 — Flash-uj Home Assistant OS

1. Skini i instaliraj **Raspberry Pi Imager** (zvanični alat, besplatan).
2. Ubaci SD karticu/SSD u računar.
3. U Imager-u izaberi: *Choose OS → Other specific-purpose OS → Home Assistant → Home Assistant OS* (izaberi verziju za tvoj model Raspberry Pi-ja).
4. Izaberi svoju SD karticu/SSD kao cilj i klikni **Write**. Ovo obriše sve što je prethodno bilo na kartici.

## Korak 2 — Prvo pokretanje

1. Ubaci SD karticu/SSD u Raspberry Pi, poveži mrežni kabl i struju.
2. Sačekaj 5-10 minuta — sistem se prvi put priprema, nemoj da ga isključuješ u međuvremenu.
3. Sa drugog računara na istoj mreži, otvori u browseru: `http://homeassistant.local:8123`
   - Ako to ne radi, proveri IP adresu Raspberry Pi-ja preko rutera i otvori `http://<ta-ip-adresa>:8123`

## Korak 3 — Kreiranje naloga

Otvoriće se čarobnjak za podešavanje:

1. Kreiraj korisničko ime i lozinku (ovo je tvoj glavni admin nalog).
2. Unesi lokaciju (koristi se za automatizacije vezane za izlazak/zalazak sunca, vremensku prognozu).
3. Home Assistant automatski skenira mrežu i predlaže uređaje koje je pronašao — možeš ih dodati odmah ili kasnije.

## Korak 4 — Šta sad?

Imaš radan sistem. Sledeći logičan korak je da dodaš prvi pravi uređaj (pametnu utičnicu ili Zigbee senzor) i napraviš prvu automatizaciju — to pokrivamo u sledećem vodiču.

**Napomena:** ako nemaš Raspberry Pi, Home Assistant možeš pokrenuti i u Docker kontejneru na bilo kom Linux serveru (npr. na istom onom na kom hostuješ ovaj sajt) — o tome pišemo posebno, jer instalacija tada ima par dodatnih koraka oko mrežnog podešavanja.
