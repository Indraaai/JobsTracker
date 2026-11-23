import { z } from "zod";

export const taskPrioritySchema = z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
    "URGENT",
]);

export const createTaskSchema = z.object({
    applicationId: z
        .string()
        .uuid("Invalid application ID")
        .optional()
        .or(z.literal(""))
        .nullable(),

    title: z
        .string()
        .trim()
        .min(2, "Title must be at least 2 characters")
        .max(200, "Title must be at most 200 characters"),

    description: z
        .string()
        .trim()
        .max(2000, "Description must be at most 2000 characters")
        .optional()
        .or(z.literal("")),

    priority: taskPrioritySchema
        .default("MEDIUM"),

    dueDate: z
        .coerce
        .date()
        .optional()
        .nullable(),

    isCompleted: z
        .boolean()
        .optional()
        .default(false),
});

export const updateTaskSchema = createTaskSchema.partial();

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
