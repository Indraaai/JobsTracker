import { z } from "zod";

const applicationStatusSchema = z.enum([
    "SAVED",
    "APPLIED",
    "SCREENING",
    "ASSESSMENT",
    "INTERVIEW",
    "OFFER",
    "ACCEPTED",
    "REJECTED",
    "WITHDRAWN",
]);

export const createApplicationSchema = z.object({
    companyId: z
        .string()
        .uuid("Invalid company ID"),

    position: z
        .string()
        .trim()
        .min(2, "Position must be at least 2 characters")
        .max(150, "Position must be at most 150 characters"),

    status: applicationStatusSchema
        .default("SAVED"),

    jobUrl: z
        .string()
        .url("Invalid job URL")
        .optional()
        .or(z.literal("")),

    employmentType: z
        .string()
        .trim()
        .max(50)
        .optional()
        .or(z.literal("")),

    location: z
        .string()
        .trim()
        .max(100)
        .optional()
        .or(z.literal("")),

    salaryMin: z
        .number()
        .int()
        .nonnegative()
        .optional(),

    salaryMax: z
        .number()
        .int()
        .nonnegative()
        .optional(),

    currency: z
        .string()
        .trim()
        .length(3, "Currency must be 3 characters")
        .default("IDR"),

    appliedAt: z
        .coerce
        .date()
        .optional(),

    deadline: z
        .coerce
        .date()
        .optional(),

    notes: z
        .string()
        .trim()
        .max(2000)
        .optional()
        .or(z.literal("")),
});

export const updateApplicationSchema =
    createApplicationSchema.partial();

export type CreateApplicationInput =
    z.infer<typeof createApplicationSchema>;

export type UpdateApplicationInput =
    z.infer<typeof updateApplicationSchema>;