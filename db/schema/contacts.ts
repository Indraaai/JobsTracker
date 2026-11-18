import {
    index,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";
import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { users } from "./auth";
import { companies } from "./companies";

export const contacts = pgTable(
    "contacts",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        userId: text("user_id")
            .notNull()
            .references(() => users.id, {
                onDelete: "cascade",
            }),

        companyId: uuid("company_id").references(
            () => companies.id,
            {
                onDelete: "set null",
            },
        ),

        name: text("name").notNull(),

        role: text("role"),

        email: text("email"),

        phone: text("phone"),

        linkedinUrl: text("linkedin_url"),

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
        index("contacts_user_id_idx").on(table.userId),
        index("contacts_company_id_idx").on(table.companyId),
        index("contacts_name_idx").on(table.name),
    ],
);

export type Contact = InferSelectModel<typeof contacts>;
export type NewContact = InferInsertModel<typeof contacts>;
