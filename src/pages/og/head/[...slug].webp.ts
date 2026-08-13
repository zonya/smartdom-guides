// Pločica za vrh teksta koji nema svoju sliku: /og/head/<slug>.webp
//
// Ista crtana pločica kao u karticama na naslovnoj (`variant: 'card'`, bez
// naslova — naslov stoji odmah iznad), samo šira, jer je stubac teksta 44rem
// ≈ 704px, a kartična pločica je 600px i vidno bi se razvlačila.
//
// Zašto uopšte: tekstovi bez `cover`-a su počinjali golim naslovom, dok svaka
// kartica na naslovnoj ima sliku — pa je stranica teksta delovala kao da joj
// nešto nedostaje. Prava fotografija hardvera i dalje pobeđuje ovo; ovo je
// samo pod.

import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { renderOgImage } from '../../../utils/og';
import { site } from '../../../config/site';

export const HEAD_WIDTH = 1000;
export const HEAD_HEIGHT = 525;

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('posts');
  // Tekstovi sa svojom naslovnom slikom ne dobijaju pločicu — ne bi je niko
  // ni tražio, a build bi crtao slike koje se nikad ne prikažu.
  return posts
    .filter((post) => !post.data.cover)
    .map((post) => ({
      params: { slug: post.id },
      props: { kicker: post.data.tags[0], seed: post.id },
    }));
};

export const GET: APIRoute = async ({ props }) => {
  const webp = await renderOgImage({
    title: '',
    kicker: props.kicker as string | undefined,
    siteName: site.name,
    outputWidth: HEAD_WIDTH,
    format: 'webp',
    variant: 'card',
    seed: props.seed as string,
  });

  return new Response(new Uint8Array(webp), {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
