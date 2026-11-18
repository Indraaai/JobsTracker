import {
    boolean,
    index,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";
import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { users } from "./auth";
import { applications } from "./application";

export const interviewStageEnum = pgEnum("interview_stage", [
    "HR_SCREENING",
    "TECHNICAL_TEST",
    "USER_INTERVIEW",
    "SYSTEM_DESIGN",
    "CULTURE_FIT",
    "FINAL_OFFER",
    "OTHER",
]);

export const interviewFormatEnum = pgEnum("interview_format", [
    "ONLINE_GOOGLE_MEET",
    "ONLINE_ZOOM",
    "ONLINE_TEAMS",
    "PHONE_CALL",
    "ONSITE",
]);

export const interviewResultEnum = pgEnum("interview_result", [
    "PENDING",
    "PASSED",
    "FAILED",
]);

export const interviews = pgTable(
    "interviews",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        userId: text("user_id")
            .notNull()
            .references(() => users.id, {
                onDelete: "cascade",
            }),

        applicationId: uuid("application_id")
            .notNull()
            .references(() => applications.id, {
                onDelete: "cascade",
            }),

        title: text("title").notNull(),

        stage: interviewStageEnum("stage")
            .default("HR_SCREENING")
            .notNull(),

        format: interviewFormatEnum("format")
            .default("ONLINE_GOOGLE_MEET")
            .notNull(),

        scheduledAt: timestamp("scheduled_at", {
            withTimezone: true,
        }).notNull(),

        meetingUrl: text("meeting_url"),

        location: text("location"),

        notes: text("notes"),

        feedback: text("feedback"),

        result: interviewResultEnum("result")
            .default("PENDING")
            .notNull(),

        isCompleted: boolean("is_completed")
            .default(false)
            .notNull(),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),

        updatedAt: timestamp("updated_at", {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        index("interviews_user_id_idx").on(table.userId),
        index("interviews_application_id_idx").on(table.applicationId),
        index("interviews_scheduled_at_idx").on(table.scheduledAt),
        index("interviews_stage_idx").on(table.stage),
    ],
);

export type Interview = InferSelectModel<typeof interviews>;
export type NewInterview = InferInsertModel<typeof interviews>;
