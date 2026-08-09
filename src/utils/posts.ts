import { getCollection, type CollectionEntry } from 'astro:content';
import { DEFAULT_LOCALE, localePath, type Locale } from '../config/i18n';

export type Post = CollectionEntry<'posts'>;

/** Svi tekstovi svih jezika, najnoviji prvi. Za OG slike i slična mesta. */
export async function getAllPosts(): Promise<Post[]> {
  const posts = await getCollection('posts');
  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}

/** Tekstovi jednog jezika, najnoviji prvi. */
export async function getSortedPosts(
  lang: Locale = DEFAULT_LOCALE
): Promise<Post[]> {
  return (await getAllPosts()).filter((p) => p.data.lang === lang);
}

/**
 * Prevod datog teksta, ako postoji. Veza se piše samo na jednoj strani para
 * (`translationOf`), pa se traži u oba smera.
 */
export async function findTranslation(post: Post): Promise<Post | null> {
  const all = await getAllPosts();
  const target = post.data.translationOf;
  if (target) {
    const hit = all.find((p) => p.id === target);
    if (hit) return hit;
  }
  return all.find((p) => p.data.translationOf === post.id) ?? null;
}

/** Adresa teksta na njegovom jeziku. */
export function postPath(post: Post): string {
  return localePath(post.data.lang, `/blog/${post.id}/`);
}

/** Gruba procena vremena čitanja, ~200 reči u minutu, minimum 1. */
export function readingTime(body: string | undefined): number {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
