import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
    interviews,
    type Interview,
} from "@/db/schema/interviews";
import { applications } from "@/db/schema/application";
import { companies } from "@/db/schema/companies";

export type InterviewWithDetails = Interview & {
    applicationPosition: string;
    companyName: string;
    companyLogo: string | null;
};

export async function findInterviewsByUserId(
    userId: string,
): Promise<InterviewWithDetails[]> {
    const rows = await db
        .select({
            id: interviews.id,
            userId: interviews.userId,
            applicationId: interviews.applicationId,
            title: interviews.title,
            stage: interviews.stage,
            format: interviews.format,
            scheduledAt: interviews.scheduledAt,
            meetingUrl: interviews.meetingUrl,
            location: interviews.location,
            notes: interviews.notes,
            feedback: interviews.feedback,
            result: interviews.result,
            isCompleted: interviews.isCompleted,
            createdAt: interviews.createdAt,
            updatedAt: interviews.updatedAt,
            applicationPosition: applications.position,
            companyName: companies.name,
            companyLogo: companies.logoUrl,
        })
        .from(interviews)
        .innerJoin(
            applications,
            eq(interviews.applicationId, applications.id),
        )
        .innerJoin(
            companies,
            eq(applications.companyId, companies.id),
        )
        .where(eq(interviews.userId, userId))
        .orderBy(desc(interviews.scheduledAt));

    return rows;
}

export async function findInterviewById(
    id: string,
    userId: string,
): Promise<InterviewWithDetails | null> {
    const rows = await db
        .select({
            id: interviews.id,
            userId: interviews.userId,
            applicationId: interviews.applicationId,
            title: interviews.title,
            stage: interviews.stage,
            format: interviews.format,
            scheduledAt: interviews.scheduledAt,
            meetingUrl: interviews.meetingUrl,
            location: interviews.location,
            notes: interviews.notes,
            feedback: interviews.feedback,
            result: interviews.result,
            isCompleted: interviews.isCompleted,
            createdAt: interviews.createdAt,
            updatedAt: interviews.updatedAt,
            applicationPosition: applications.position,
            companyName: companies.name,
            companyLogo: companies.logoUrl,
        })
        .from(interviews)
        .innerJoin(
            applications,
            eq(interviews.applicationId, applications.id),
        )
        .innerJoin(
            companies,
            eq(applications.companyId, companies.id),
        )
        .where(
            and(
                eq(interviews.id, id),
                eq(interviews.userId, userId),
            ),
        )
        .limit(1);

    return rows[0] ?? null;
}

export async function findInterviewsByApplicationId(
    applicationId: string,
    userId: string,
): Promise<Interview[]> {
    return db
        .select()
        .from(interviews)
        .where(
            and(
                eq(interviews.applicationId, applicationId),
                eq(interviews.userId, userId),
            ),
        )
        .orderBy(desc(interviews.scheduledAt));
}

export async function createInterview(data: {
    userId: string;
    applicationId: string;
    title: string;
    stage?:
    | "HR_SCREENING"
    | "TECHNICAL_TEST"
    | "USER_INTERVIEW"
    | "SYSTEM_DESIGN"
    | "CULTURE_FIT"
    | "FINAL_OFFER"
    | "OTHER";
    format?:
    | "ONLINE_GOOGLE_MEET"
    | "ONLINE_ZOOM"
    | "ONLINE_TEAMS"
    | "PHONE_CALL"
    | "ONSITE";
    scheduledAt: Date;
    meetingUrl?: string;
    location?: string;
    notes?: string;
    feedback?: string;
    result?: "PENDING" | "PASSED" | "FAILED";
    isCompleted?: boolean;
}) {
    const result = await db
        .insert(interviews)
        .values({
            userId: data.userId,
            applicationId: data.applicationId,
            title: data.title,
            stage: data.stage ?? "HR_SCREENING",
            format: data.format ?? "ONLINE_GOOGLE_MEET",
            scheduledAt: data.scheduledAt,
            meetingUrl: data.meetingUrl || null,
            location: data.location || null,
            notes: data.notes || null,
            feedback: data.feedback || null,
            result: data.result ?? "PENDING",
            isCompleted: data.isCompleted ?? false,
        })
        .returning();

    return result[0];
}

export async function updateInterview(
    id: string,
    userId: string,
    data: {
        applicationId?: string;
        title?: string;
        stage?:
        | "HR_SCREENING"
        | "TECHNICAL_TEST"
        | "USER_INTERVIEW"
        | "SYSTEM_DESIGN"
        | "CULTURE_FIT"
        | "FINAL_OFFER"
        | "OTHER";
        format?:
        | "ONLINE_GOOGLE_MEET"
        | "ONLINE_ZOOM"
        | "ONLINE_TEAMS"
        | "PHONE_CALL"
        | "ONSITE";
        scheduledAt?: Date;
        meetingUrl?: string;
        location?: string;
        notes?: string;
        feedback?: string;
        result?: "PENDING" | "PASSED" | "FAILED";
        isCompleted?: boolean;
    },
) {
    const result = await db
        .update(interviews)
        .set({
            ...data,
            updatedAt: new Date(),
        })
        .where(
            and(
                eq(interviews.id, id),
                eq(interviews.userId, userId),
            ),
        )
        .returning();

    return result[0] ?? null;
}

export async function deleteInterview(
    id: string,
    userId: string,
) {
    const result = await db
        .delete(interviews)
        .where(
            and(
                eq(interviews.id, id),
                eq(interviews.userId, userId),
            ),
        )
        .returning({
            id: interviews.id,
        });

    return result[0] ?? null;
}
