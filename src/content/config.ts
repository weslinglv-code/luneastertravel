import { defineCollection, z } from 'astro:content';

// Sveltia CMS writes empty strings for unset fields instead of omitting them.
// This preprocessor converts empty strings/null to undefined so Zod .optional() works.
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.preprocess(
      (val) => (val === '' || val === null) ? undefined : val,
      z.coerce.date()
    ),
    updatedDate: z.preprocess(
      (val) => (val === '' || val === null) ? undefined : val,
      z.coerce.date().optional()
    ),
    coverImage: z.string().optional(),
    coverAlt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    author: z.string().default('LuneAster'),
    readingTime: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    // New CMS-managed fields (all optional for backward compatibility)
    destination: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    metaKeywords: z.string().optional(),
  }),
});

export const collections = { blog };
