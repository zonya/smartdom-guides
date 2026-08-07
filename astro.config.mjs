import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://opameti.me',
  // Slike za deljenje (/og/*.png) su tehnički fajlovi, ne stranice — nemaju
  // šta da traže u sitemapu.
  integrations: [sitemap({ filter: (page) => !page.includes('/og/') })],
});
