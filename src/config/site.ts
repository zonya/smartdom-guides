// Centralna konfiguracija sajta i monetizacije.
// Sve što se menja "jednom pa se zaboravi" stoji ovde, da ne treba tražiti
// po komponentama.

export const site = {
  // Ime = domen. Namerno: „opameti me" je i igra reči na srpskom, pa ime
  // sajta, adresa i ono što sajt radi ostaju jedna ista stvar.
  name: 'opameti.me',
  tagline: 'Pametan dom i Linux, objašnjeni jednostavno',
  description:
    'Praktični, jednostavni vodiči za Home Assistant i Linux za početnike.',
  url: 'https://opameti.me',
  // Cloudflare Email Routing prosleđuje ovu adresu na marko.dusic@gmail.com
  // (pravilo „kontakt → gmail" na zoni opameti.me). Domen NIŠTA ne šalje —
  // DMARC je p=reject, pa svaki budući izvor slanja mora prvo u SPF/DKIM.
  email: 'kontakt@opameti.me',
  nav: [
    { href: '/blog', label: 'Vodiči' },
    { href: '/o-sajtu', label: 'O sajtu' },
  ],
  // Firma koja stoji iza sajta. `url` je namerno prazan dok nextit.rs ne
  // proradi (zona je na Cloudflare-u, ali NS još nisu prebačeni).
  company: { name: 'NextIT', url: '' },
};

export const analytics = {
  // Cloudflare Web Analytics — besplatan, bez kolačića, ne traži cookie
  // banner. Token se dobija na Cloudflare → Analytics & Logs → Web Analytics
  // → Add a site (opameti.me); iz ponuđenog snippeta prepiši samo vrednost
  // "token". Dok je prazno, nikakva skripta se ne učitava.
  // Sajt „opameti.me" u Web Analytics, site_tag 93e1b97deaae443e88dc78e11ac0f532.
  // auto_install je namerno isključen — zona je DNS-only (sivi oblak), pa
  // Cloudflare ne može sam da ubaci beacon; ide kroz ovaj token.
  cloudflareToken: '8c6dffbd517a451a8a3d3ac7628913ae',
};

export const monetization = {
  // Oglasi se ne prikazuju dok se ovo ne uključi. Kad AdSense nalog bude
  // odobren: enabled: true + upiši client/slot ID-jeve i stavi ads.txt
  // u public/ (fajl public/ads.txt već postoji kao šablon).
  ads: {
    enabled: false,
    // npr. 'ca-pub-1234567890123456'
    client: '',
    // ID-jevi pojedinačnih jedinica iz AdSense panela
    slots: {
      inArticle: '',
      belowArticle: '',
      list: '',
    },
  },

  affiliate: {
    // AliExpress Portals, nalog odobren 09.08.2026. Tracking ID se vidi u
    // portalu (Account → Tracking ID) i služi samo kao podsetnik koji je
    // nalog u igri — linkovi se NE sklapaju ovde, nego se u frontmatter
    // teksta lepi gotov link iz portala (Link Generator).
    aliexpressTrackingId: '',
    // Tekst obaveštenja koji se po zakonu/pravilima mreža prikazuje kad
    // tekst sadrži affiliate linkove. Po jeziku teksta — engleski čitalac je
    // do 12.08.2026. dobijao srpsku rečenicu.
    disclosure: {
      sr: 'Neki linkovi u ovom tekstu su affiliate linkovi — ako preko njih kupiš proizvod, sajt dobija malu proviziju, bez dodatnog troška za tebe. Preporučujemo samo ono što bismo i sami koristili.',
      en: 'Some links in this article are affiliate links — if you buy through them, the site earns a small commission at no extra cost to you. We only recommend things we would use ourselves.',
    },
  },
};
