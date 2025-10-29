import { z } from 'zod';

export const skillSchema = z.object({
  name: z.string()
    .min(2, 'Skill name must be at least 2 characters')
    .max(100, 'Skill name must be less than 100 characters'),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert'], {
    required_error: 'Please select a proficiency level',
  }).optional(),
  category: z.string()
    .max(100, 'Category must be less than 100 characters')
    .optional()
    .or(z.literal('')),
});

export type SkillFormData = z.infer<typeof skillSchema>;
