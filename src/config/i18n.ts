// Dvojezičnost sajta.
//
// Srpski je podrazumevan i stoji na korenu (`/blog/…`) — namerno, da se
// postojeće adrese ne menjaju. Engleski ide pod prefiksom (`/en/blog/…`).
//
// ⚠️ Jezik se NIKAD ne bira po IP adresi. Googlebot crawluje sa američkih
// adresa, pa bi sadržaj po lokaciji značio da Google vidi samo englesku
// verziju, a srpska — koja je ceo saobraćaj — prestaje da postoji u pretrazi.
// Jezici stoje na odvojenim adresama, vezani `hreflang` oznakama, a posetilac
// ga menja dugmetom u zaglavlju.

export const DEFAULT_LOCALE = 'sr';
export const LOCALES = ['sr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const localeMeta: Record<
  Locale,
  {
    /** Vrednost `lang` atributa na <html>. */
    htmlLang: string;
    /** `og:locale` za deljenje. */
    ogLocale: string;
    /** Za `toLocaleDateString`. */
    dateLocale: string;
    /** Ime jezika na tom jeziku (za `aria-label` i title). */
    name: string;
    /** Kratka oznaka na dugmetu. */
    short: string;
    /** Koren jezika. */
    home: string;
  }
> = {
  sr: {
    htmlLang: 'sr',
    ogLocale: 'sr_RS',
    dateLocale: 'sr-Latn-RS',
    name: 'Srpski',
    short: 'SR',
    home: '/',
  },
  en: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    dateLocale: 'en-GB',
    name: 'English',
    short: 'EN',
    home: '/en/',
  },
};

/** Prefiks jezika: srpski nema nijedan, engleski ima `/en`. */
export function localeBase(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '' : `/${locale}`;
}

/** Adresa unutar jezika: `path` se piše kao da je jezik podrazumevan. */
export function localePath(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${localeBase(locale)}${clean}`;
}

/** Jezik izveden iz putanje — koristi se samo tamo gde prop nije prosleđen. */
export function localeFromPath(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'sr';
}

/** Drugi jezik (sajt ih ima dva; ako ih bude više, ovo postaje spisak). */
export function otherLocale(locale: Locale): Locale {
  return locale === 'sr' ? 'en' : 'sr';
}

type UiStrings = {
  skipToContent: string;
  themeToggle: string;
  langToggle: (name: string) => string;
  /** Ime drugog jezika, na jeziku ove strane — za `aria-label`. */
  otherLangName: string;
  navGuides: string;
  navAbout: string;
  builtBy: string;
  privacy: string;
  minRead: string;
  allGuides: string;
  allGuidesArrow: string;
  latest: string;
  otherPosts: string;
  prevPost: string;
  nextPost: string;
  topic: string;
  postsCount: (n: number) => string;
  backToAll: string;
};

export const ui: Record<Locale, UiStrings> = {
  sr: {
    skipToContent: 'Preskoči na sadržaj',
    themeToggle: 'Promeni temu (svetla/tamna)',
    langToggle: (name) => `Pređi na ${name}`,
    otherLangName: 'engleski',
    navGuides: 'Vodiči',
    navAbout: 'O sajtu',
    builtBy: 'Izradio',
    privacy: 'Privatnost',
    minRead: 'min čitanja',
    allGuides: 'Svi vodiči',
    allGuidesArrow: 'Svi vodiči →',
    latest: 'Najnoviji tekstovi',
    otherPosts: 'Ostali tekstovi',
    prevPost: '← Prethodni tekst',
    nextPost: 'Sledeći tekst →',
    topic: 'Tema',
    postsCount: (n) => `${n} tekstova, najnoviji prvi.`,
    backToAll: '← Svi vodiči',
  },
  en: {
    skipToContent: 'Skip to content',
    themeToggle: 'Toggle theme (light/dark)',
    langToggle: (name) => `Switch to ${name}`,
    otherLangName: 'Serbian',
    navGuides: 'Articles',
    navAbout: 'About',
    builtBy: 'Built by',
    privacy: 'Privacy',
    minRead: 'min read',
    allGuides: 'All articles',
    allGuidesArrow: 'All articles →',
    latest: 'Latest',
    otherPosts: 'More articles',
    prevPost: '← Previous',
    nextPost: 'Next →',
    topic: 'Topic',
    postsCount: (n) => `${n} articles, newest first.`,
    backToAll: '← All articles',
  },
};

/** Navigacija po jeziku. Engleski nema „O sajtu" dok se ne napiše. */
export function navFor(locale: Locale) {
  const t = ui[locale];
  const items = [{ href: localePath(locale, '/blog'), label: t.navGuides }];
  if (locale === 'sr') {
    items.push({ href: '/o-sajtu', label: t.navAbout });
  }
  return items;
}
