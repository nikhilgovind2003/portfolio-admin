import { z } from "zod";

export const skillSchema = z.object({
  name: z
    .string()
    .min(2, "Skill name must be at least 2 characters")
    .max(100, "Skill name must be less than 100 characters"),
  
  media_path: z
    .union([z.instanceof(File), z.string()])
    .refine(
      (val) =>
        (typeof val === "string" && val.trim().length > 0) ||
        (val instanceof File && val.size > 0),
      { message: "Image is required" }
    ),

  media_alt: z.string().nonempty("Image alt is required"),
  status: z.boolean().default(true),
  sort_order: z.coerce.number().min(1, "Atleast 1"),
});

export type SkillFormData = z.infer<typeof skillSchema>;
