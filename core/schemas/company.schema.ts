import { z } from "zod";

export const createCompanySchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Company name must be at least 2 characters")
        .max(100, "Company name must be at most 100 characters"),

    logoUrl: z
        .string()
        .url("Invalid logo URL")
        .optional()
        .or(z.literal("")),

    websiteUrl: z
        .string()
        .url("Invalid website URL")
        .optional()
        .or(z.literal("")),

    linkedinUrl: z
        .string()
        .url("Invalid LinkedIn URL")
        .optional()
        .or(z.literal("")),

    location: z
        .string()
        .trim()
        .max(100, "Location must be at most 100 characters")
        .optional()
        .or(z.literal("")),

    industry: z
        .string()
        .trim()
        .max(100, "Industry must be at most 100 characters")
        .optional()
        .or(z.literal("")),

    notes: z
        .string()
        .trim()
        .max(2000, "Notes must be at most 2000 characters")
        .optional()
        .or(z.literal("")),
});

export const updateCompanySchema = createCompanySchema.partial();

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;