// iOS ne ume SVG ikonicu — kad se sajt doda na početni ekran traži PNG na
// fiksnoj adresi `/apple-touch-icon.png`. Bez njega Safari napravi zamućen
// snimak stranice. Crta se iz istog znaka kao favicon.

import type { APIRoute } from 'astro';
import sharp from 'sharp';
import { tileSvg } from '../config/logo';

export const GET: APIRoute = async () => {
  const png = await sharp(Buffer.from(tileSvg(180)))
    .resize(180, 180)
    .png({ compressionLevel: 9 })
    .toBuffer();

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=604800',
    },
  });
};
