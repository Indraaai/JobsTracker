import {
    pgTable,
    text,
    timestamp,
    uuid,
    unique,
    index,
} from "drizzle-orm/pg-core";
import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";

import { users } from "./auth";

export const companies = pgTable(
    "companies",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        userId: text("user_id")
            .notNull()
            .references(() => users.id, {
                onDelete: "cascade",
            }),

        name: text("name").notNull(),

        logoUrl: text("logo_url"),

        websiteUrl: text("website_url"),

        linkedinUrl: text("linkedin_url"),

        location: text("location"),

        industry: text("industry"),

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
        unique("companies_user_id_name_unique").on(
            table.userId,
            table.name,
        ),

        index("companies_user_id_idx").on(table.userId),

        index("companies_name_idx").on(table.name),
    ],
);

export type Company = InferSelectModel<typeof companies>;
export type NewCompany = InferInsertModel<typeof companies>;