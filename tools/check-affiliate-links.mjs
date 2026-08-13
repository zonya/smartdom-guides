// Provera pred build: affiliate linkovi u telu teksta moraju nositi
// rel="sponsored".
//
// Zašto skripta a ne rehype plugin: plugin bi `rel` dodavao sam, ali
// `rehypePlugins` u Astru 7 vuku ceo markdown na `unified` procesor, a on
// srpske navodnike ili prepravi po engleskim pravilima („ovako“ → „ovako”)
// ili ih, sa isključenim smartypants-om, ostavi kao proste `"`. Oba su vidljiv
// nazadak u svakom postojećem tekstu, pa procesor ostaje podrazumevani, a
// linkovi se pišu kao običan HTML u markdownu.
//
// Nemarkiran affiliate link Google tretira kao šemu linkova. To je kazna koju
// ne vidiš dok ne padneš u pretrazi — zato build pada odmah.

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const POSTS = new URL('../src/content/posts/', import.meta.url).pathname;
const AFFILIATE = 's.click.aliexpress.com';

const problems = [];

for (const name of await readdir(POSTS)) {
  if (!name.endsWith('.md')) continue;
  const body = await readFile(join(POSTS, name), 'utf8');
  // Frontmatter ne diramo — `AffiliateBox` tamošnjim linkovima sam dodaje rel.
  const text = body.replace(/^---\n[\s\S]*?\n---\n/, '');

  // 1) markdown oblik `[tekst](url)` — nema gde da mu stane rel
  for (const m of text.matchAll(/\[[^\]]*\]\((https?:\/\/[^)]*s\.click[^)]*)\)/g)) {
    problems.push(`${name}: markdown link na ${AFFILIATE} ne može da nosi rel — piši ga kao <a … rel="sponsored nofollow noopener">.\n    ${m[1]}`);
  }

  // 2) HTML oblik bez rel="sponsored"
  for (const m of text.matchAll(/<a\s[^>]*href="[^"]*s\.click[^"]*"[^>]*>/g)) {
    if (!/rel="[^"]*sponsored/.test(m[0])) {
      problems.push(`${name}: affiliate link bez rel="sponsored".\n    ${m[0]}`);
    }
  }
}

if (problems.length) {
  console.error('\nAffiliate linkovi nisu ispravno označeni:\n');
  for (const p of problems) console.error('  • ' + p);
  console.error('');
  process.exit(1);
}
