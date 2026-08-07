import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/posts' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string(),
        pubDate: z.date(),
        tags: z.array(z.string()).default([]),
        // Naslovna slika teksta. Fajl stoji u `src/assets/posts/`, a ovde se
        // piše relativna putanja (npr. `../../assets/posts/ime.jpg`). Astro je
        // sam optimizuje i pravi više veličina. Ako je nema, tekst se prikazuje
        // bez nje — slika za deljenje se ionako uvek generiše iz naslova.
        cover: image().optional(),
        // Opis slike za čitače ekrana i kad se slika ne učita.
        coverAlt: z.string().optional(),
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
      })
      // Slika bez opisa je greška u pristupačnosti koju je lako previdеti, pa
      // neka build padne odmah umesto da se objavi takva.
      .refine((data) => !data.cover || !!data.coverAlt, {
        message: 'Uz `cover` mora ići i `coverAlt` (opis slike).',
        path: ['coverAlt'],
      }),
});

export const collections = { posts };
