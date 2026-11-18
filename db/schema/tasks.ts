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

export const taskPriorityEnum = pgEnum("task_priority", [
    "LOW",
    "MEDIUM",
    "HIGH",
    "URGENT",
]);

export const tasks = pgTable(
    "tasks",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        userId: text("user_id")
            .notNull()
            .references(() => users.id, {
                onDelete: "cascade",
            }),

        applicationId: uuid("application_id").references(
            () => applications.id,
            {
                onDelete: "set null",
            },
        ),

        title: text("title").notNull(),

        description: text("description"),

        priority: taskPriorityEnum("priority")
            .default("MEDIUM")
            .notNull(),

        dueDate: timestamp("due_date", {
            withTimezone: true,
        }),

        isCompleted: boolean("is_completed")
            .default(false)
            .notNull(),

        completedAt: timestamp("completed_at", {
            withTimezone: true,
        }),

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
        index("tasks_user_id_idx").on(table.userId),
        index("tasks_application_id_idx").on(table.applicationId),
        index("tasks_is_completed_idx").on(table.isCompleted),
        index("tasks_due_date_idx").on(table.dueDate),
    ],
);

export type Task = InferSelectModel<typeof tasks>;
export type NewTask = InferInsertModel<typeof tasks>;
