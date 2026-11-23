import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { applications, type Application } from "@/db/schema/application";
import { companies } from "@/db/schema/companies";

export type ApplicationWithCompany = Application & {
    companyName: string | null;
    companyLogo: string | null;
};

export async function findApplicationsByUserId(userId: string): Promise<ApplicationWithCompany[]> {
    return db
        .select({
            id: applications.id,
            userId: applications.userId,
            companyId: applications.companyId,
            position: applications.position,
            status: applications.status,
            jobUrl: applications.jobUrl,
            employmentType: applications.employmentType,
            location: applications.location,
            salaryMin: applications.salaryMin,
            salaryMax: applications.salaryMax,
            currency: applications.currency,
            appliedAt: applications.appliedAt,
            deadline: applications.deadline,
            notes: applications.notes,
            createdAt: applications.createdAt,
            updatedAt: applications.updatedAt,
            companyName: companies.name,
            companyLogo: companies.logoUrl,
        })
        .from(applications)
        .leftJoin(companies, eq(applications.companyId, companies.id))
        .where(eq(applications.userId, userId))
        .orderBy(desc(applications.createdAt));
}

export async function findApplicationById(
    id: string,
    userId: string,
): Promise<ApplicationWithCompany | null> {
    const result = await db
        .select({
            id: applications.id,
            userId: applications.userId,
            companyId: applications.companyId,
            position: applications.position,
            status: applications.status,
            jobUrl: applications.jobUrl,
            employmentType: applications.employmentType,
            location: applications.location,
            salaryMin: applications.salaryMin,
            salaryMax: applications.salaryMax,
            currency: applications.currency,
            appliedAt: applications.appliedAt,
            deadline: applications.deadline,
            notes: applications.notes,
            createdAt: applications.createdAt,
            updatedAt: applications.updatedAt,
            companyName: companies.name,
            companyLogo: companies.logoUrl,
        })
        .from(applications)
        .leftJoin(companies, eq(applications.companyId, companies.id))
        .where(
            and(
                eq(applications.id, id),
                eq(applications.userId, userId),
            ),
        )
        .limit(1);

    return result[0] ?? null;
}

export async function createApplication(data: {
    userId: string;
    companyId: string;
    position: string;
    status?:
    | "SAVED"
    | "APPLIED"
    | "SCREENING"
    | "ASSESSMENT"
    | "INTERVIEW"
    | "OFFER"
    | "ACCEPTED"
    | "REJECTED"
    | "WITHDRAWN";
    jobUrl?: string;
    employmentType?: string;
    location?: string;
    salaryMin?: number;
    salaryMax?: number;
    currency?: string;
    appliedAt?: Date;
    deadline?: Date;
    notes?: string;
}) {
    const result = await db
        .insert(applications)
        .values({
            userId: data.userId,
            companyId: data.companyId,
            position: data.position,
            status: data.status ?? "SAVED",
            jobUrl: data.jobUrl,
            employmentType: data.employmentType,
            location: data.location,
            salaryMin: data.salaryMin,
            salaryMax: data.salaryMax,
            currency: data.currency ?? "IDR",
            appliedAt: data.appliedAt,
            deadline: data.deadline,
            notes: data.notes,
        })
        .returning();

    return result[0];
}

export async function updateApplication(
    id: string,
    userId: string,
    data: {
        companyId?: string;
        position?: string;
        status?:
        | "SAVED"
        | "APPLIED"
        | "SCREENING"
        | "ASSESSMENT"
        | "INTERVIEW"
        | "OFFER"
        | "ACCEPTED"
        | "REJECTED"
        | "WITHDRAWN";
        jobUrl?: string;
        employmentType?: string;
        location?: string;
        salaryMin?: number;
        salaryMax?: number;
        currency?: string;
        appliedAt?: Date;
        deadline?: Date;
        notes?: string;
    },
) {
    const result = await db
        .update(applications)
        .set({
            ...data,
            updatedAt: new Date(),
        })
        .where(
            and(
                eq(applications.id, id),
                eq(applications.userId, userId),
            ),
        )
        .returning();

    return result[0] ?? null;
}

export async function deleteApplication(
    id: string,
    userId: string,
) {
    const result = await db
        .delete(applications)
        .where(
            and(
                eq(applications.id, id),
                eq(applications.userId, userId),
            ),
        )
        .returning({
            id: applications.id,
        });

    return result[0] ?? null;
}