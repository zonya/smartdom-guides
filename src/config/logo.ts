// Znak sajta: krov (kuća) nad promptom (`>_`, terminal) — dve teme o kojima
// sajt piše, u jednom potezu.
//
// Geometrija stoji na jednom mestu jer se isti znak crta na četiri: u
// zaglavlju (`BaseLayout.astro`), kao favicon (`pages/favicon.svg.ts`), kao
// ikonica za iOS (`pages/apple-touch-icon.png.ts`) i na slikama za deljenje
// (`utils/og.ts`). Ako se ovo menja, menja se svuda odjednom.

/** Sve putanje su u koordinatnom sistemu 32×32. */
export const LOGO_PATHS = {
  roof: 'M5 13 L16 4.5 L27 13',
  chevron: 'M11 18.5 L15 22 L11 25.5',
  underscore: 'M18 25.5 L23 25.5',
} as const;

export const LOGO_STROKE = 2.4;

/**
 * Boja pločice na favicon-u i iOS ikonici. Ovo je jedino mesto gde je marka
 * vezana za konkretnu boju — u zaglavlju znak nasleđuje boju teksta, pa se sam
 * prilagođava temi.
 */
export const LOGO_TILE = '#1d5cf0';

/**
 * Znak na punoj pločici: isti potezi, samo uvučeni da imaju vazduha oko sebe.
 * `scale` se primenjuje oko centra, pa geometrija ostaje ista.
 */
export function markGroup(color: string, scale = 0.74): string {
  const paths = Object.values(LOGO_PATHS)
    .map((d) => `<path d="${d}"/>`)
    .join('');
  return `<g transform="translate(16 16) scale(${scale}) translate(-16 -16)" fill="none" stroke="${color}" stroke-width="${LOGO_STROKE / scale}" stroke-linecap="round" stroke-linejoin="round">${paths}</g>`;
}

/** Ceo favicon/ikonica kao SVG — pločica u boji marke + beli znak. */
export function tileSvg(size = 32): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="${LOGO_TILE}"/>
  ${markGroup('#fff')}
</svg>`;
}
