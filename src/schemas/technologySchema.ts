import { z } from "zod";

export const technologySchema = z.object({
  name: z
    .string()
    .min(2, "Technology name must be at least 2 characters")
    .max(100, "Technology name must be less than 100 characters"),
  status: z.boolean().default(true),
  sort_order: z.coerce.number().min(1, "Atleast 1"),
});

export type TechnologyFormData = z.infer<typeof technologySchema>;
