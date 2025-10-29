import { z } from 'zod';

export const cmsSchema = z.object({
  title: z.string()
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title must be less than 200 characters'),
  slug: z.string()
    .min(2, 'Slug must be at least 2 characters')
    .max(200, 'Slug must be less than 200 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  type: z.enum(['page', 'post', 'article', 'section'], {
    required_error: 'Please select a type',
  }),
  status: z.enum(['draft', 'published', 'archived'], {
    required_error: 'Please select a status',
  }),
  content: z.string()
    .min(10, 'Content must be at least 10 characters')
    .max(5000, 'Content must be less than 5000 characters'),
  excerpt: z.string()
    .max(500, 'Excerpt must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  metaTitle: z.string()
    .max(60, 'Meta title must be less than 60 characters for SEO')
    .optional()
    .or(z.literal('')),
  metaDescription: z.string()
    .max(160, 'Meta description must be less than 160 characters for SEO')
    .optional()
    .or(z.literal('')),
});

export type CmsFormData = z.infer<typeof cmsSchema>;
