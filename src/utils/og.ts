// Generisanje OG slika (1200×630 PNG) za deljenje na društvenim mrežama.
//
// Zašto ovako: svaki tekst mora imati sliku za deljenje, a ručno crtanje po
// jedne za svaki tekst se nikad ne bi radilo. Ovo se iscrtava na build-u, iz
// naslova, pa nikad ne može da se zaboravi ili razmimoiđe sa tekstom.
//
// SVG → PNG radi `sharp`, koji ionako dolazi uz Astro (koristi ga za
// optimizaciju slika), pa nema nove zavisnosti. ⚠️ `sharp` iscrtava tekst
// preko sistemskih fontova — u Docker build fazi (alpine) fontovi se moraju
// instalirati, inače naslov izađe prazan. Vidi `Dockerfile`.

import sharp from 'sharp';
import { LOGO_PATHS, LOGO_STROKE } from '../config/logo';

const WIDTH = 1200;
const HEIGHT = 630;
const PAD = 80;

// Boje su prepisane iz tamne teme u `global.css`.
const BG = '#0f1117';
const TEXT = '#e7e9ee';
const MUTED = '#99a0ae';
const ACCENT = '#79a8ff';

// DejaVu je ono što postoji u alpine slici, Helvetica na macOS-u za `npm run
// dev`. Oba pokrivaju č/ć/ž/š/đ.
const FONT = 'DejaVu Sans, Helvetica, Arial, sans-serif';

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Gruba procena širine teksta. Nemamo pristup metrikama fonta pre iscrtavanja,
 * a tačnost ovde ne mora biti velika — dovoljno je da prelom ne pobegne van
 * ivice slike.
 */
function textWidth(text: string, fontSize: number): number {
  let units = 0;
  for (const ch of text) {
    if (ch === ' ') units += 0.28;
    else if ('iljtfrI.,;:!|\'’'.includes(ch)) units += 0.32;
    else if ('mwMW—'.includes(ch)) units += 0.92;
    else if (ch === ch.toUpperCase() && ch !== ch.toLowerCase()) units += 0.68;
    else units += 0.56;
  }
  return units * fontSize;
}

function wrap(text: string, fontSize: number, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && textWidth(candidate, fontSize) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export interface OgOptions {
  title: string;
  /** Sitan tekst iznad naslova — npr. tema teksta. */
  kicker?: string;
  /** Ime sajta u podnožju slike. */
  siteName: string;
  /**
   * Širina izlazne slike. Crta se uvek na 1200×630 pa se smanjuje, da bi
   * kartica i slika za deljenje bile identične, samo različite veličine.
   */
  outputWidth?: number;
  /** WebP je znatno manji za kartice; deljenje traži PNG. */
  format?: 'png' | 'webp';
  /**
   * `share` nosi naslov, jer se na društvenim mrežama vidi sam.
   * `card` ga NE nosi — na kartici naslov stoji odmah ispod slike, pa bi se
   * ponavljao; uz to je tekst u slici neizbirljiv i neprevodiv.
   */
  variant?: 'share' | 'card';
  /** Iz ovoga se izvodi boja pločice, da svaka kartica ima svoju. */
  seed?: string;
}

/** Stabilna boja po tekstu — isti slug uvek daje istu nijansu. */
function hueFromSeed(seed: string): number {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) % 360;
  // Držimo se hladnog dela kruga (plavo–ljubičasto–tirkizno), da pločice
  // ostanu u porodici sa akcentnom bojom sajta.
  return 190 + (h % 90);
}

export async function renderOgImage({
  title,
  kicker,
  siteName,
  outputWidth = WIDTH,
  format = 'png',
  variant = 'share',
  seed,
}: OgOptions): Promise<Buffer> {
  if (variant === 'card') {
    return renderCard({ kicker, siteName, seed: seed ?? title, outputWidth, format });
  }
  const maxWidth = WIDTH - PAD * 2;

  // Duži naslovi idu manjim slovima da bi stali u najviše 4 reda.
  let fontSize = 66;
  let lines = wrap(title, fontSize, maxWidth);
  while (lines.length > 4 && fontSize > 40) {
    fontSize -= 6;
    lines = wrap(title, fontSize, maxWidth);
  }
  lines = lines.slice(0, 4);

  const lineHeight = Math.round(fontSize * 1.25);
  // Naslov se centrira po visini, ali ostavlja mesta podnožju.
  const blockHeight = lines.length * lineHeight;
  const firstBaseline = Math.round((HEIGHT - 70 - blockHeight) / 2 + fontSize);

  const titleSpans = lines
    .map(
      (l, i) =>
        `<text x="${PAD}" y="${firstBaseline + i * lineHeight}" font-family="${FONT}" font-size="${fontSize}" font-weight="700" fill="${TEXT}">${escapeXml(l)}</text>`
    )
    .join('');

  const kickerSpan = kicker
    ? `<text x="${PAD}" y="${firstBaseline - blockHeight / lines.length - 28}" font-family="${FONT}" font-size="28" font-weight="700" fill="${ACCENT}" letter-spacing="2">${escapeXml(kicker.toUpperCase())}</text>`
    : '';

  // Podnožje: znak, pa ime sajta („.me" u akcentu, kao u zaglavlju), pa slogan.
  const footY = HEIGHT - 62;
  const markSize = 40;
  const dot = siteName.lastIndexOf('.');
  const stem = dot > 0 ? siteName.slice(0, dot) : siteName;
  const tld = dot > 0 ? siteName.slice(dot) : '';
  const nameX = PAD + markSize + 16;
  const tldX = nameX + textWidth(stem, 30);
  const taglineX = tldX + textWidth(tld, 30) + 20;

  const markScale = markSize / 32;
  const mark = `<g transform="translate(${PAD} ${footY - markSize + 8}) scale(${markScale})" fill="none" stroke="${TEXT}" stroke-width="${LOGO_STROKE}" stroke-linecap="round" stroke-linejoin="round">
    <path d="${LOGO_PATHS.roof}"/><path d="${LOGO_PATHS.chevron}"/><path d="${LOGO_PATHS.underscore}"/>
  </g>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <radialGradient id="glow" cx="88%" cy="12%" r="70%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>
  <rect x="0" y="0" width="10" height="${HEIGHT}" fill="${ACCENT}"/>
  ${kickerSpan}
  ${titleSpans}
  ${mark}
  <text x="${nameX}" y="${footY}" font-family="${FONT}" font-size="30" font-weight="700" fill="${TEXT}">${escapeXml(stem)}</text>
  <text x="${tldX}" y="${footY}" font-family="${FONT}" font-size="30" font-weight="700" fill="${ACCENT}">${escapeXml(tld)}</text>
  <text x="${taglineX}" y="${footY}" font-family="${FONT}" font-size="30" fill="${MUTED}">Pametan dom i Linux, objašnjeni jednostavno</text>
</svg>`;

  const img = sharp(Buffer.from(svg));
  if (outputWidth !== WIDTH) {
    img.resize(outputWidth, Math.round((outputWidth / WIDTH) * HEIGHT), {
      kernel: 'lanczos3',
    });
  }
  return format === 'webp'
    ? img.webp({ quality: 82 }).toBuffer()
    : img.png({ compressionLevel: 9 }).toBuffer();
}

/**
 * Pločica za karticu: znak sajta, tema teksta i boja izvedena iz sluga.
 * Bez naslova — on stoji odmah ispod slike, u pravom tekstu koji se može
 * izabrati, prevesti i pročitati čitačem ekrana.
 */
async function renderCard({
  kicker,
  siteName,
  seed,
  outputWidth,
  format,
}: {
  kicker?: string;
  siteName: string;
  seed: string;
  outputWidth: number;
  format: 'png' | 'webp';
}): Promise<Buffer> {
  const hue = hueFromSeed(seed);
  const tint = `hsl(${hue} 85% 62%)`;

  const markScale = 5.2;
  const markX = PAD + 6;
  const markY = HEIGHT / 2 - (32 * markScale) / 2 - 22;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <radialGradient id="g" cx="78%" cy="18%" r="80%">
      <stop offset="0%" stop-color="${tint}" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="${tint}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#g)"/>
  <rect x="0" y="0" width="12" height="${HEIGHT}" fill="${tint}"/>
  <g transform="translate(${markX} ${markY}) scale(${markScale})" fill="none" stroke="${tint}"
     stroke-width="${LOGO_STROKE}" stroke-linecap="round" stroke-linejoin="round">
    <path d="${LOGO_PATHS.roof}"/><path d="${LOGO_PATHS.chevron}"/><path d="${LOGO_PATHS.underscore}"/>
  </g>
  ${
    kicker
      ? `<text x="${markX + 4}" y="${markY + 32 * markScale + 62}" font-family="${FONT}" font-size="42" font-weight="700" fill="${TEXT}" letter-spacing="3">${escapeXml(kicker.toUpperCase())}</text>`
      : ''
  }
  <text x="${WIDTH - PAD}" y="${HEIGHT - 54}" text-anchor="end" font-family="${FONT}" font-size="34" font-weight="700" fill="${MUTED}">${escapeXml(siteName)}</text>
</svg>`;

  const img = sharp(Buffer.from(svg));
  if (outputWidth !== WIDTH) {
    img.resize(outputWidth, Math.round((outputWidth / WIDTH) * HEIGHT), {
      kernel: 'lanczos3',
    });
  }
  return format === 'webp'
    ? img.webp({ quality: 82 }).toBuffer()
    : img.png({ compressionLevel: 9 }).toBuffer();
}
