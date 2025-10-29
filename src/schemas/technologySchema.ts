import { z } from 'zod';

export const technologySchema = z.object({
  name: z.string()
    .min(2, 'Technology name must be at least 2 characters')
    .max(100, 'Technology name must be less than 100 characters'),
  category: z.string()
    .min(2, 'Category must be at least 2 characters')
    .max(100, 'Category must be less than 100 characters'),
});

export type TechnologyFormData = z.infer<typeof technologySchema>;
