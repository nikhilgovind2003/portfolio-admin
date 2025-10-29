import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string()
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title must be less than 200 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  skills: z.string()
    .max(500, 'Skills must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  technologies: z.string()
    .max(500, 'Technologies must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  media_path: z.string()
    .optional()
    .or(z.literal('')),
  project_link: z.string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  github_link: z.string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
