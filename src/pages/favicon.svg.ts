// Favicon se generiše iz iste geometrije kao znak u zaglavlju
// (`src/config/logo.ts`), da ne mogu da se raziđu.
//
// Zašto puna pločica, a ne linijski znak kao u zaglavlju: favicon se crta na
// traci kartica čija boja zavisi od teme pretraživača i nije nam poznata.
// Linijski znak bi na jednoj od njih nestao; pločica ima svoju pozadinu, pa je
// vidljiva uvek.

import type { APIRoute } from 'astro';
import { tileSvg } from '../config/logo';

export const GET: APIRoute = () =>
  new Response(tileSvg(), {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=604800',
    },
  });
