import { z } from "zod";

export const interviewStageSchema = z.enum([
    "HR_SCREENING",
    "TECHNICAL_TEST",
    "USER_INTERVIEW",
    "SYSTEM_DESIGN",
    "CULTURE_FIT",
    "FINAL_OFFER",
    "OTHER",
]);

export const interviewFormatSchema = z.enum([
    "ONLINE_GOOGLE_MEET",
    "ONLINE_ZOOM",
    "ONLINE_TEAMS",
    "PHONE_CALL",
    "ONSITE",
]);

export const interviewResultSchema = z.enum([
    "PENDING",
    "PASSED",
    "FAILED",
]);

export const createInterviewSchema = z.object({
    applicationId: z
        .string()
        .uuid("Invalid application ID"),

    title: z
        .string()
        .trim()
        .min(2, "Title must be at least 2 characters")
        .max(150, "Title must be at most 150 characters"),

    stage: interviewStageSchema
        .default("HR_SCREENING"),

    format: interviewFormatSchema
        .default("ONLINE_GOOGLE_MEET"),

    scheduledAt: z
        .coerce
        .date({
            message: "Valid scheduled date and time is required",
        }),

    meetingUrl: z
        .string()
        .url("Invalid meeting URL")
        .optional()
        .or(z.literal("")),

    location: z
        .string()
        .trim()
        .max(200)
        .optional()
        .or(z.literal("")),

    notes: z
        .string()
        .trim()
        .max(2000)
        .optional()
        .or(z.literal("")),

    feedback: z
        .string()
        .trim()
        .max(2000)
        .optional()
        .or(z.literal("")),

    result: interviewResultSchema
        .default("PENDING"),

    isCompleted: z
        .boolean()
        .default(false),
});

export const updateInterviewSchema = createInterviewSchema.partial();

export type CreateInterviewInput = z.infer<typeof createInterviewSchema>;
export type UpdateInterviewInput = z.infer<typeof updateInterviewSchema>;
