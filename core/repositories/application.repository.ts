import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { applications } from "@/db/schema/application";

export async function findApplicationsByUserId(
    userId: string,
) {
    return db
        .select()
        .from(applications)
        .where(eq(applications.userId, userId))
        .orderBy(applications.createdAt);
}

export async function findApplicationById(
    id: string,
    userId: string,
) {
    const result = await db
        .select()
        .from(applications)
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