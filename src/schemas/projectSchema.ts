import { z } from "zod";

export const projectSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  technology_ids: z.array(z.string()).optional(),
  media_path: z
    .union([z.instanceof(File), z.string()])
    .refine(
      (val) =>
        (typeof val === "string" && val.trim().length > 0) ||
        (val instanceof File && val.size > 0),
      { message: "Image is required" }
    ),

  media_alt: z.string().optional(),
  project_link: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  github_link: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  status: z.boolean().default(true),
  sort_order: z.coerce.number().min(1, "Atleast 1"),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
