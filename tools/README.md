# Alat za slike i video iz Home Assistant-a

Pravi slike za tekstove i kadrove za video vodeći **čist HA** kroz Chrome
DevTools Protocol. Poenta je da na slikama nema nijednog stvarnog kućnog
uređaja — demo instanca se diže na serveru, gde je mreža prazna.

## Kako se koristi

1. Digni demo HA (bilo koji Linux server sa Dockerom):

   ```sh
   docker run -d --name ha-demo \
     -v /root/ha-demo/config:/config -e TZ=Europe/Belgrade \
     -p 127.0.0.1:8124:8123 ghcr.io/home-assistant/home-assistant:stable
   ```

   Port je namerno vezan za `127.0.0.1` — HA bez lozinke ne sme na internet.

2. Tunel do njega: `ssh -f -N -L 8124:127.0.0.1:8124 root@<server>`

3. **Nalog se pravi ručno**, kroz pretraživač na `http://localhost:8124`.

4. Da bi alat mogao da uđe bez kucanja lozinke, u `configuration.yaml`:

   ```yaml
   homeassistant:
     auth_providers:
       - type: trusted_networks
         trusted_networks: [172.16.0.0/12]   # docker gateway
         allow_bypass_login: true
       - type: homeassistant
   ```

5. `python3 scenario2.py` → slike u `ha-shots/`, kadrovi u `ha-shots/_frames/`.

6. Video (ffmpeg ne mora da postoji lokalno):

   ```sh
   docker run --rm -v "$PWD/_frames:/w" -w /w linuxserver/ffmpeg \
     -y -framerate 10 -pattern_type glob -i "f*.jpg" \
     -vf "scale=1440:-2:flags=lanczos,format=yuv420p" \
     -c:v libx264 -preset slow -crf 20 -movflags +faststart /w/out.mp4
   ```

## Šta je naučeno na teži način

- **Ne klikaj kroz čarobnjak.** HA komponente ne reaguju na `element.click()`
  iz JS-a, a i sa pravim CDP klikom se biraču okidača nije dalo da se otvori.
  Umesto toga upiši gotove automatizacije u `automations.yaml` i slikaj ih
  **popunjene** — ionako je bolja slika za čitaoca.
- **`configuration.yaml` ne prepisuj u celosti.** HA pri prvom pokretanju sam
  doda `automation: !include automations.yaml` (+ `script`, `scene`). Bez tih
  linija automatizacije se ne učitavaju, ali ih UI editor i dalje prikazuje —
  pa deluje kao da sve radi.
- **Napravi lažne entitete** (`template:` senzori) za sve što automatizacije
  gađaju, inače svaka kartica nosi narandžasto „Unknown entity".
- **`text_present` laže** — obilazi i skriveni DOM, pa vraća „ima ga" i kad se
  ništa ne vidi. Za proveru koristi sliku.
- Klik ume da otkači CDP sesiju; `hadrive.py` se zato sam ponovo kači.
