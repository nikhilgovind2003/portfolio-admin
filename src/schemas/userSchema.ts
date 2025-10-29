import { z } from 'zod';

export const userSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  role: z.enum(['admin', 'moderator', 'user'], {
    required_error: 'Please select a role',
  }),
  status: z.enum(['active', 'inactive'], {
    required_error: 'Please select a status',
  }),
});

export type UserFormData = z.infer<typeof userSchema>;
