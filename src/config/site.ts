// Centralna konfiguracija sajta i monetizacije.
// Sve što se menja "jednom pa se zaboravi" stoji ovde, da ne treba tražiti
// po komponentama.

export const site = {
  name: 'SmartDom Guides',
  tagline: 'Pametan dom i Linux, objašnjeni jednostavno',
  description:
    'Praktični, jednostavni vodiči za Home Assistant i Linux za početnike.',
  url: 'https://opameti.me',
  nav: [
    { href: '/blog', label: 'Vodiči' },
  ],
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
    // Tekst obaveštenja koji se po zakonu/pravilima mreža prikazuje kad
    // tekst sadrži affiliate linkove.
    disclosure:
      'Neki linkovi u ovom tekstu su affiliate linkovi — ako preko njih kupiš proizvod, sajt dobija malu proviziju, bez dodatnog troška za tebe. Preporučujemo samo ono što bismo i sami koristili.',
  },
};
