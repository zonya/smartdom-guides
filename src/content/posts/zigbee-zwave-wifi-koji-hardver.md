---
title: "Koji hardver ti treba za pametan dom: Zigbee vs Z-Wave vs WiFi"
description: "Šta je razlika između Zigbee, Z-Wave i WiFi uređaja, koji protokol da izabereš za početak i koji hardver ti stvarno treba."
pubDate: 2026-08-07
tags: ["home-assistant", "hardver", "zigbee", "z-wave"]
---

Kad počneš da kupuješ pametne uređaje, prva prepreka nije cena nego skraćenice. Ista pametna utičnica postoji u Zigbee, Z-Wave i WiFi verziji, po sličnoj ceni, a razlika je velika — i najlakše je pogrešiti baš na početku, dok kupuješ prvih pet uređaja.

Kratak odgovor za nestrpljive: **za većinu ljudi je Zigbee najbolji izbor**, uz jedan USB dongle na serveru. Evo i zašto.

## WiFi uređaji

Povezuju se direktno na tvoj ruter, kao telefon ili laptop. Ne treba ti nikakav dodatni hardver — kupiš utičnicu, uparis je preko aplikacije i radi.

- **Dobro:** najjeftiniji ulazak, nema dongle-a, ima ih svuda (Tuya, Sonoff, Shelly).
- **Loše:** svaki uređaj troši jednu adresu na ruteru. Kućni ruteri se guše negde oko 30-50 uređaja, a ti ćeš do toga stići brže nego što misliš.
- **Loše:** veći uređaji često rade preko cloud-a proizvođača — ako padne internet ili se firma ugasi, utičnica postaje glupa.
- **Loše:** baterijski senzori na WiFi-ju traju kratko (nedelje do par meseci), jer je WiFi energetski skup.

WiFi ima smisla za uređaje koji su stalno na struji i rade lokalno — **Shelly** moduli iza prekidača su ovde izuzetak koji vredi znati, jer rade potpuno lokalno i odlično se uklapaju u Home Assistant.

## Zigbee

Poseban bežični protokol, ne ide preko rutera. Treba ti **koordinator** — mali USB dongle koji ubodeš u server na kom radi Home Assistant.

- **Dobro:** mala potrošnja — baterijski senzori traju **1-2 godine** na jednoj bateriji.
- **Dobro:** *mesh* mreža — svaki uređaj na struji (utičnica, sijalica) prosleđuje signal dalje. Što više uređaja, to je mreža jača, i lako pokriva ceo stan bez pojačivača.
- **Dobro:** ne opterećuje WiFi i radi 100% lokalno, bez cloud-a.
- **Dobro:** najveći izbor jeftinih uređaja (Aqara, Sonoff, IKEA, Tuya).
- **Loše:** treba ti dongle (jednokratno, oko 20-30€) i koristi isti 2.4GHz opseg kao WiFi, pa kanale treba razdvojiti.

## Z-Wave

Ista ideja kao Zigbee — poseban protokol, mesh mreža, svoj USB dongle — ali na drugoj frekvenciji (868MHz u Evropi), gde nema gužve od WiFi-ja.

- **Dobro:** bolji domet kroz debele zidove i nema smetnji sa WiFi-jem.
- **Dobro:** stroža sertifikacija, pa uređaji različitih brendova pouzdanije rade zajedno.
- **Loše:** **osetno skuplje**, često dvostruko u odnosu na Zigbee ekvivalent.
- **Loše:** manji izbor kod nas i teže se nabavlja.

Z-Wave je razuman izbor ako imaš staru kuću sa debelim zidovima i budžet ti nije prva briga. Za stan — teško da ti se isplati.

## Šta da kupiš za početak

Ako kreneš od nule, ovo je kombinacija koja se najređe ispostavi kao greška:

1. **Zigbee koordinator (USB dongle)** — obavezno preko **USB produžnog kabla**, nikako direktno u server. Dongle pored USB 3.0 porta hvata smetnje i mreža ti radi loše bez očiglednog razloga.
2. **Dve-tri Zigbee utičnice** — one su i uređaji i pojačivači mreže, pa postavi ih tako da pokriju stan.
3. **Senzor pokreta i senzor otvaranja vrata** — najjeftiniji delovi, a najviše automatizacija kreće baš od njih.
4. Po potrebi **Shelly modul** iza postojećeg prekidača, ako želiš da ti obični zidni prekidač i dalje radi normalno.

Ne kupuj sve odjednom. Uzmi dongle i tri uređaja, napravi prve automatizacije, pa onda proširuj — mnogo ćeš bolje znati šta ti stvarno treba nakon mesec dana.

## Da li mogu da mešam?

Mogu, i to je uobičajeno. Home Assistant sve protokole prikazuje isto — kad je uređaj jednom dodat, nema veze da li je Zigbee, Z-Wave ili WiFi. Automatizacija mirno može da ima Zigbee senzor kao okidač i WiFi utičnicu kao rezultat. Poenta izbora protokola nije "ili-ili", nego da ti većina uređaja bude na nečemu što je jeftino, lokalno i štedi bateriju.

Ako još nemaš instaliran Home Assistant, kreni odavde: [instalacija za 30 minuta](/blog/instalacija-home-assistant-30-minuta/).
