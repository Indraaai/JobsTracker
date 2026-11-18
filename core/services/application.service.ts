import {
    createApplication,
    deleteApplication,
    findApplicationById,
    findApplicationsByUserId,
    updateApplication,
} from "@/core/repositories/application.repository";
import { findCompanyById } from "@/core/repositories/company.repository";

import type {
    CreateApplicationInput,
    UpdateApplicationInput,
} from "@/core/schemas/application.schema";

export async function getApplications(userId: string) {
    return findApplicationsByUserId(userId);
}

export async function getApplication(
    id: string,
    userId: string,
) {
    return findApplicationById(id, userId);
}

export async function createApplicationService(
    userId: string,
    input: CreateApplicationInput,
) {
    // Make sure the company belongs to the current user
    const company = await findCompanyById(
        input.companyId,
        userId,
    );

    if (!company) {
        throw new Error("Company not found");
    }

    // Validate salary range
    if (
        input.salaryMin !== undefined &&
        input.salaryMax !== undefined &&
        input.salaryMin > input.salaryMax
    ) {
        throw new Error(
            "Minimum salary cannot be greater than maximum salary",
        );
    }

    return createApplication({
        userId,
        companyId: input.companyId,
        position: input.position,
        status: input.status,
        jobUrl: input.jobUrl,
        employmentType: input.employmentType,
        location: input.location,
        salaryMin: input.salaryMin,
        salaryMax: input.salaryMax,
        currency: input.currency,
        appliedAt: input.appliedAt,
        deadline: input.deadline,
        notes: input.notes,
    });
}

export async function updateApplicationService(
    id: string,
    userId: string,
    input: UpdateApplicationInput,
) {
    const existingApplication =
        await findApplicationById(id, userId);

    if (!existingApplication) {
        throw new Error("Application not found");
    }

    // If companyId is being changed,
    // make sure the new company belongs to this user.
    if (input.companyId) {
        const company = await findCompanyById(
            input.companyId,
            userId,
        );

        if (!company) {
            throw new Error("Company not found");
        }
    }

    // Validate salary range.
    // Use existing values when one side isn't being updated.
    const salaryMin =
        input.salaryMin ?? existingApplication.salaryMin;

    const salaryMax =
        input.salaryMax ?? existingApplication.salaryMax;

    if (
        salaryMin !== null &&
        salaryMax !== null &&
        salaryMin !== undefined &&
        salaryMax !== undefined &&
        salaryMin > salaryMax
    ) {
        throw new Error(
            "Minimum salary cannot be greater than maximum salary",
        );
    }

    return updateApplication(
        id,
        userId,
        input,
    );
}

export async function deleteApplicationService(
    id: string,
    userId: string,
) {
    const existingApplication =
        await findApplicationById(id, userId);

    if (!existingApplication) {
        throw new Error("Application not found");
    }

    return deleteApplication(id, userId);
}