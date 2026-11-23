import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { contacts, type Contact, type NewContact } from "@/db/schema/contacts";
import { companies } from "@/db/schema/companies";

export type ContactWithCompany = Contact & {
    companyName: string | null;
    companyLogo: string | null;
};

export async function findContactsByUserId(
    userId: string,
): Promise<ContactWithCompany[]> {
    const rows = await db
        .select({
            id: contacts.id,
            userId: contacts.userId,
            companyId: contacts.companyId,
            name: contacts.name,
            role: contacts.role,
            email: contacts.email,
            phone: contacts.phone,
            linkedinUrl: contacts.linkedinUrl,
            notes: contacts.notes,
            createdAt: contacts.createdAt,
            updatedAt: contacts.updatedAt,
            companyName: companies.name,
            companyLogo: companies.logoUrl,
        })
        .from(contacts)
        .leftJoin(companies, eq(contacts.companyId, companies.id))
        .where(eq(contacts.userId, userId))
        .orderBy(desc(contacts.createdAt));

    return rows;
}

export async function findContactById(
    id: string,
    userId: string,
): Promise<ContactWithCompany | null> {
    const rows = await db
        .select({
            id: contacts.id,
            userId: contacts.userId,
            companyId: contacts.companyId,
            name: contacts.name,
            role: contacts.role,
            email: contacts.email,
            phone: contacts.phone,
            linkedinUrl: contacts.linkedinUrl,
            notes: contacts.notes,
            createdAt: contacts.createdAt,
            updatedAt: contacts.updatedAt,
            companyName: companies.name,
            companyLogo: companies.logoUrl,
        })
        .from(contacts)
        .leftJoin(companies, eq(contacts.companyId, companies.id))
        .where(and(eq(contacts.id, id), eq(contacts.userId, userId)))
        .limit(1);

    return rows[0] ?? null;
}

export async function findContactsByCompanyId(
    companyId: string,
    userId: string,
): Promise<ContactWithCompany[]> {
    const rows = await db
        .select({
            id: contacts.id,
            userId: contacts.userId,
            companyId: contacts.companyId,
            name: contacts.name,
            role: contacts.role,
            email: contacts.email,
            phone: contacts.phone,
            linkedinUrl: contacts.linkedinUrl,
            notes: contacts.notes,
            createdAt: contacts.createdAt,
            updatedAt: contacts.updatedAt,
            companyName: companies.name,
            companyLogo: companies.logoUrl,
        })
        .from(contacts)
        .leftJoin(companies, eq(contacts.companyId, companies.id))
        .where(
            and(
                eq(contacts.companyId, companyId),
                eq(contacts.userId, userId),
            ),
        )
        .orderBy(desc(contacts.createdAt));

    return rows;
}

export async function createContact(
    data: NewContact,
): Promise<Contact> {
    const [created] = await db
        .insert(contacts)
        .values(data)
        .returning();

    return created;
}

export async function updateContact(
    id: string,
    userId: string,
    data: Partial<NewContact>,
): Promise<Contact | null> {
    const [updated] = await db
        .update(contacts)
        .set({
            ...data,
            updatedAt: new Date(),
        })
        .where(and(eq(contacts.id, id), eq(contacts.userId, userId)))
        .returning();

    return updated ?? null;
}

export async function deleteContact(
    id: string,
    userId: string,
): Promise<boolean> {
    const [deleted] = await db
        .delete(contacts)
        .where(and(eq(contacts.id, id), eq(contacts.userId, userId)))
        .returning({ id: contacts.id });

    return !!deleted;
}
