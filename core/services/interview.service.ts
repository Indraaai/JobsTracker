import {
    createInterview,
    deleteInterview,
    findInterviewById,
    findInterviewsByApplicationId,
    findInterviewsByUserId,
    updateInterview,
} from "@/core/repositories/interview.repository";
import {
    findApplicationById,
    updateApplication,
} from "@/core/repositories/application.repository";
import type {
    CreateInterviewInput,
    UpdateInterviewInput,
} from "@/core/schemas/interview.schema";

export async function getInterviews(userId: string) {
    return findInterviewsByUserId(userId);
}

export async function getInterview(
    id: string,
    userId: string,
) {
    return findInterviewById(id, userId);
}

export async function getInterviewsByApplication(
    applicationId: string,
    userId: string,
) {
    return findInterviewsByApplicationId(applicationId, userId);
}

export async function createInterviewService(
    userId: string,
    input: CreateInterviewInput,
) {
    // 1. Verify application belongs to the current user
    const application = await findApplicationById(
        input.applicationId,
        userId,
    );

    if (!application) {
        throw new Error("Application not found");
    }

    // 2. Create the interview
    const newInterview = await createInterview({
        userId,
        applicationId: input.applicationId,
        title: input.title,
        stage: input.stage,
        format: input.format,
        scheduledAt: new Date(input.scheduledAt),
        meetingUrl: input.meetingUrl,
        location: input.location,
        notes: input.notes,
        feedback: input.feedback,
        result: input.result,
        isCompleted: input.isCompleted,
    });

    // 3. Automatically promote application to "INTERVIEW" stage if it's currently earlier
    if (["SAVED", "APPLIED", "SCREENING"].includes(application.status)) {
        await updateApplication(application.id, userId, {
            status: "INTERVIEW",
        });
    }

    return newInterview;
}

export async function updateInterviewService(
    id: string,
    userId: string,
    input: UpdateInterviewInput,
) {
    const existing = await findInterviewById(id, userId);

    if (!existing) {
        throw new Error("Interview not found");
    }

    if (input.applicationId && input.applicationId !== existing.applicationId) {
        const app = await findApplicationById(input.applicationId, userId);
        if (!app) {
            throw new Error("Target application not found");
        }
    }

    const scheduledDate = input.scheduledAt
        ? new Date(input.scheduledAt)
        : undefined;

    return updateInterview(id, userId, {
        applicationId: input.applicationId,
        title: input.title,
        stage: input.stage,
        format: input.format,
        scheduledAt: scheduledDate,
        meetingUrl: input.meetingUrl,
        location: input.location,
        notes: input.notes,
        feedback: input.feedback,
        result: input.result,
        isCompleted: input.isCompleted,
    });
}

export async function deleteInterviewService(
    id: string,
    userId: string,
) {
    const existing = await findInterviewById(id, userId);

    if (!existing) {
        throw new Error("Interview not found");
    }

    return deleteInterview(id, userId);
}
