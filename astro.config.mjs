import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://opameti.me',
  // Srpski je podrazumevan i stoji na korenu — `prefixDefaultLocale: false`
  // je zato obavezno, inače bi sve postojeće adrese dobile `/sr/` prefiks i
  // sajt bi izgubio pozicije u pretrazi. Detalji u `src/config/i18n.ts`.
  i18n: {
    defaultLocale: 'sr',
    locales: ['sr', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  // Slike za deljenje (/og/*.png) su tehnički fajlovi, ne stranice — nemaju
  // šta da traže u sitemapu.
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/og/'),
      // Sitemap sam upisuje `xhtml:link` veze između jezika za stranice koje
      // postoje na oba. Ovo NE zamenjuje `hreflang` u <head> — Google čita oba
      // izvora, a onaj u <head> je precizniji jer zna ima li prevoda uopšte.
      i18n: {
        defaultLocale: 'sr',
        locales: { sr: 'sr-RS', en: 'en' },
      },
    }),
  ],
});
