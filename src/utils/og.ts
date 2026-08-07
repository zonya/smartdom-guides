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
}

export async function renderOgImage({
  title,
  kicker,
  siteName,
}: OgOptions): Promise<Buffer> {
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
  <text x="${PAD}" y="${HEIGHT - 62}" font-family="${FONT}" font-size="30" font-weight="700" fill="${TEXT}">${escapeXml(siteName)}</text>
  <text x="${PAD}" y="${HEIGHT - 62}" dx="${textWidth(siteName, 30) + 18}" font-family="${FONT}" font-size="30" fill="${MUTED}">Pametan dom i Linux, objašnjeni jednostavno</text>
</svg>`;

  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}
