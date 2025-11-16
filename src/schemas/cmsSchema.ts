import { z } from 'zod';

export const cmsSchema = z.object({
  super_title: z.string()
    .min(2, 'Super title must be at least 2 characters')
    .max(100, 'Super title must be less than 100 characters'),
  
  title: z.string()
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title must be less than 200 characters'),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  
  btn_one_text: z.string()
    .min(1, 'Button text is required')
    .max(50, 'Button text must be less than 50 characters'),
  
  btn_one_link: z.string()
    .min(1, 'Button link is required')
    .max(200, 'Link must be less than 200 characters'),
  
  btn_two_text: z.string()
    .min(1, 'Button text is required')
    .max(50, 'Button text must be less than 50 characters'),
  
  btn_two_link: z.string()
    .min(1, 'Button link is required')
    .max(200, 'Link must be less than 200 characters'),
  
  media_path: z.union([
    z.instanceof(File),
    z.string()
  ]).optional().or(z.literal('')),
  
  media_alt: z.string()
    .max(200, 'Alt text must be less than 200 characters')
    .optional()
    .or(z.literal('')),
  
  project_title: z.string()
    .min(2, 'Project title must be at least 2 characters')
    .max(100, 'Project title must be less than 100 characters'),
  
  skills_title: z.string()
    .min(2, 'Skills title must be at least 2 characters')
    .max(100, 'Skills title must be less than 100 characters'),
  
  about_title: z.string()
    .min(2, 'About title must be at least 2 characters')
    .max(100, 'About title must be less than 100 characters'),
  
  about_description: z.string()
    .min(10, 'About description must be at least 10 characters')
    .max(1000, 'About description must be less than 1000 characters'),
  
  contact_title: z.string()
    .min(2, 'Contact title must be at least 2 characters')
    .max(100, 'Contact title must be less than 100 characters'),
});

export type CmsFormData = z.infer<typeof cmsSchema>;