import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date(),
    category: z.enum(['announcement', 'changelog', 'guide']).default('guide'),
    level: z.enum(['minor', 'major', 'event']).default('minor'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { docs };
