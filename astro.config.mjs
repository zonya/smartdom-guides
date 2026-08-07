import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://opameti.me',
  // Slike za deljenje (/og/*.png) su tehnički fajlovi, ne stranice, a /logo/ je
  // radna stranica za izbor logoa — ništa od toga nema šta da traži u sitemapu.
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/og/') && !page.includes('/logo/'),
    }),
  ],
});
