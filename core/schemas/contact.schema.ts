import { z } from "zod";

export const createContactSchema = z.object({
    name: z
        .string()
        .min(1, "Contact name is required")
        .max(150, "Name must not exceed 150 characters"),
    role: z
        .string()
        .max(100, "Role must not exceed 100 characters")
        .optional()
        .nullable(),
    email: z
        .string()
        .email("Invalid email address")
        .optional()
        .nullable()
        .or(z.literal("")),
    phone: z
        .string()
        .max(50, "Phone number must not exceed 50 characters")
        .optional()
        .nullable()
        .or(z.literal("")),
    linkedinUrl: z
        .string()
        .url("Must be a valid URL")
        .optional()
        .nullable()
        .or(z.literal("")),
    companyId: z
        .string()
        .uuid("Invalid company ID")
        .optional()
        .nullable()
        .or(z.literal("")),
    notes: z
        .string()
        .max(2000, "Notes must not exceed 2000 characters")
        .optional()
        .nullable(),
});

export const updateContactSchema = createContactSchema.partial();

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
