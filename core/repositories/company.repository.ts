import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { companies } from "@/db/schema/companies";

export async function findCompaniesByUserId(userId: string) {
    return db
        .select()
        .from(companies)
        .where(eq(companies.userId, userId))
        .orderBy(companies.name);
}

export async function findCompanyById(
    id: string,
    userId: string,
) {
    const result = await db
        .select()
        .from(companies)
        .where(
            and(
                eq(companies.id, id),
                eq(companies.userId, userId),
            ),
        )
        .limit(1);

    return result[0] ?? null;
}

export async function createCompany(data: {
    userId: string;
    name: string;
    logoUrl?: string;
    websiteUrl?: string;
    linkedinUrl?: string;
    location?: string;
    industry?: string;
    notes?: string;
}) {
    const result = await db
        .insert(companies)
        .values({
            userId: data.userId,
            name: data.name,
            logoUrl: data.logoUrl,
            websiteUrl: data.websiteUrl,
            linkedinUrl: data.linkedinUrl,
            location: data.location,
            industry: data.industry,
            notes: data.notes,
        })
        .returning();

    return result[0];
}

export async function updateCompany(
    id: string,
    userId: string,
    data: {
        name?: string;
        logoUrl?: string;
        websiteUrl?: string;
        linkedinUrl?: string;
        location?: string;
        industry?: string;
        notes?: string;
    },
) {
    const result = await db
        .update(companies)
        .set({
            ...data,
            updatedAt: new Date(),
        })
        .where(
            and(
                eq(companies.id, id),
                eq(companies.userId, userId),
            ),
        )
        .returning();

    return result[0] ?? null;
}

export async function deleteCompany(
    id: string,
    userId: string,
) {
    const result = await db
        .delete(companies)
        .where(
            and(
                eq(companies.id, id),
                eq(companies.userId, userId),
            ),
        )
        .returning({
            id: companies.id,
        });

    return result[0] ?? null;
}