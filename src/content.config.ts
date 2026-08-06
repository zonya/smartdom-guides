import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()).default([]),
    // Opciono: proizvodi koji se prikazuju u boksu na dnu teksta.
    // Linkovi dobijaju rel="sponsored nofollow" i obaveštenje o proviziji.
    affiliate: z
      .array(
        z.object({
          title: z.string(),
          url: z.string().url(),
          note: z.string().optional(),
          price: z.string().optional(),
        })
      )
      .optional(),
  }),
});

export const collections = { posts };
