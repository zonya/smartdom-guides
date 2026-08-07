// Statička ruta: /og/<slug>.png za svaki tekst + /og/default.png za ostatak
// sajta (naslovna, „O sajtu", tag stranice…). Slike se iscrtavaju na build-u,
// vidi `src/utils/og.ts`.

import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { renderOgImage } from '../../utils/og';
import { site } from '../../config/site';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('posts');

  return [
    {
      params: { slug: 'default' },
      props: { title: site.tagline, kicker: undefined },
    },
    ...posts.map((post) => ({
      params: { slug: post.id },
      props: {
        title: post.data.title,
        kicker: post.data.tags[0],
      },
    })),
  ];
};

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgImage({
    title: props.title as string,
    kicker: props.kicker as string | undefined,
    siteName: site.name,
  });

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
