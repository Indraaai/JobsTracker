import {
    createCompany,
    deleteCompany,
    findCompaniesByUserId,
    findCompanyById,
    updateCompany,
} from "@/core/repositories/company.repository";

import type {
    CreateCompanyInput,
    UpdateCompanyInput,
} from "@/core/schemas/company.schema";

export async function getCompanies(userId: string) {
    return findCompaniesByUserId(userId);
}

export async function getCompany(
    id: string,
    userId: string,
) {
    return findCompanyById(id, userId);
}

export async function createCompanyService(
    userId: string,
    input: CreateCompanyInput,
) {
    return createCompany({
        userId,
        ...input,
    });
}

export async function updateCompanyService(
    id: string,
    userId: string,
    input: UpdateCompanyInput,
) {
    const existingCompany = await findCompanyById(id, userId);

    if (!existingCompany) {
        throw new Error("Company not found");
    }

    return updateCompany(id, userId, input);
}

export async function deleteCompanyService(
    id: string,
    userId: string,
) {
    const existingCompany = await findCompanyById(id, userId);

    if (!existingCompany) {
        throw new Error("Company not found");
    }

    return deleteCompany(id, userId);
}