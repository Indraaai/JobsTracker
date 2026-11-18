import {
    index,
    integer,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

import { users } from "./auth";
import { companies } from "./companies";

export const applicationStatusEnum = pgEnum(
    "application_status",
    [
        "SAVED",
        "APPLIED",
        "SCREENING",
        "ASSESSMENT",
        "INTERVIEW",
        "OFFER",
        "ACCEPTED",
        "REJECTED",
        "WITHDRAWN",
    ],
);

export const applications = pgTable(
    "applications",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        userId: text("user_id")
            .notNull()
            .references(() => users.id, {
                onDelete: "cascade",
            }),

        companyId: uuid("company_id")
            .notNull()
            .references(() => companies.id, {
                onDelete: "cascade",
            }),

        position: text("position").notNull(),

        status: applicationStatusEnum("status")
            .default("SAVED")
            .notNull(),

        jobUrl: text("job_url"),

        employmentType: text("employment_type"),

        location: text("location"),

        salaryMin: integer("salary_min"),

        salaryMax: integer("salary_max"),

        currency: text("currency")
            .default("IDR")
            .notNull(),

        appliedAt: timestamp("applied_at", {
            withTimezone: true,
        }),

        deadline: timestamp("deadline", {
            withTimezone: true,
        }),

        notes: text("notes"),

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
        index("applications_user_id_idx").on(
            table.userId,
        ),

        index("applications_company_id_idx").on(
            table.companyId,
        ),

        index("applications_status_idx").on(
            table.status,
        ),

        index("applications_applied_at_idx").on(
            table.appliedAt,
        ),
    ],
);