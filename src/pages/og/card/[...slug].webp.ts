// Manja varijanta OG slike, za sličice u karticama: /og/card/<slug>.webp
//
// Zašto ne screenshot: screenshot Home Assistant-a smanjen na širinu kartice
// je nečitljiv, visok, i u tamnoj temi je blještava bela ploča. Ova slika je
// crtana, ista u obe teme, i čitljiva na 400px jer nosi samo naslov.
//
// Zašto ne ista slika kao za deljenje: ona je 1200px i ~70 kB po komadu; na
// naslovnoj ih ima pet. Ovo je 600px WebP, oko četiri puta manje.

import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { renderOgImage } from '../../../utils/og';
import { site } from '../../../config/site';

export const CARD_WIDTH = 600;
export const CARD_HEIGHT = 315;

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('posts');
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { title: post.data.title, kicker: post.data.tags[0], seed: post.id },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const webp = await renderOgImage({
    title: props.title as string,
    kicker: props.kicker as string | undefined,
    siteName: site.name,
    outputWidth: CARD_WIDTH,
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
