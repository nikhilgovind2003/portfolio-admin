import { z } from "zod";

export const experienceSchema = z.object({
    company: z.string().min(2, "Company must be at least 2 characters"),
    role: z.string().min(2, "Role must be at least 2 characters"),
    location: z.string().optional(),
    start_date: z.string().nonempty("Start date is required"),
    end_date: z.string().optional(),
    is_current: z.boolean().default(false),
    description: z.string().min(10, "Description must be at least 10 characters"),
    media_path: z
        .union([z.instanceof(File), z.string()])
        .optional(),
    media_alt: z.string().optional(),
    status: z.boolean().default(true),
    sort_order: z.coerce.number().min(0, "Min 0"),
});

export type ExperienceFormData = z.infer<typeof experienceSchema>;
