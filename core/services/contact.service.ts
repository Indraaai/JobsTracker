import {
    createContact,
    deleteContact,
    findContactById,
    findContactsByCompanyId,
    findContactsByUserId,
    updateContact,
    type ContactWithCompany,
} from "@/core/repositories/contact.repository";
import {
    createContactSchema,
    updateContactSchema,
    type CreateContactInput,
    type UpdateContactInput,
} from "@/core/schemas/contact.schema";
import { type Contact } from "@/db/schema/contacts";

export async function getContactsService(
    userId: string,
): Promise<ContactWithCompany[]> {
    return findContactsByUserId(userId);
}

export async function getContactByIdService(
    id: string,
    userId: string,
): Promise<ContactWithCompany | null> {
    return findContactById(id, userId);
}

export async function getContactsByCompanyService(
    companyId: string,
    userId: string,
): Promise<ContactWithCompany[]> {
    return findContactsByCompanyId(companyId, userId);
}

export async function createContactService(
    userId: string,
    rawInput: CreateContactInput,
): Promise<Contact> {
    const parsed = createContactSchema.parse(rawInput);

    return createContact({
        userId,
        name: parsed.name,
        role: parsed.role ?? null,
        email: parsed.email ? parsed.email : null,
        phone: parsed.phone ? parsed.phone : null,
        linkedinUrl: parsed.linkedinUrl ? parsed.linkedinUrl : null,
        companyId: parsed.companyId ? parsed.companyId : null,
        notes: parsed.notes ?? null,
    });
}

export async function updateContactService(
    id: string,
    userId: string,
    rawInput: UpdateContactInput,
): Promise<Contact | null> {
    const parsed = updateContactSchema.parse(rawInput);

    const existing = await findContactById(id, userId);
    if (!existing) {
        return null;
    }

    return updateContact(id, userId, {
        ...(parsed.name !== undefined && { name: parsed.name }),
        ...(parsed.role !== undefined && { role: parsed.role }),
        ...(parsed.email !== undefined && {
            email: parsed.email ? parsed.email : null,
        }),
        ...(parsed.phone !== undefined && {
            phone: parsed.phone ? parsed.phone : null,
        }),
        ...(parsed.linkedinUrl !== undefined && {
            linkedinUrl: parsed.linkedinUrl ? parsed.linkedinUrl : null,
        }),
        ...(parsed.companyId !== undefined && {
            companyId: parsed.companyId ? parsed.companyId : null,
        }),
        ...(parsed.notes !== undefined && { notes: parsed.notes }),
    });
}

export async function deleteContactService(
    id: string,
    userId: string,
): Promise<boolean> {
    const existing = await findContactById(id, userId);
    if (!existing) {
        return false;
    }

    return deleteContact(id, userId);
}
