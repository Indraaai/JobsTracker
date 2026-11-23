import {
    createTask,
    deleteTask,
    findTaskById,
    findTasksByApplicationId,
    findTasksByUserId,
    updateTask,
} from "@/core/repositories/task.repository";
import { findApplicationById } from "@/core/repositories/application.repository";
import type {
    CreateTaskInput,
    UpdateTaskInput,
} from "@/core/schemas/task.schema";

export async function getTasks(userId: string) {
    return findTasksByUserId(userId);
}

export async function getTask(id: string, userId: string) {
    return findTaskById(id, userId);
}

export async function getTasksByApplication(
    applicationId: string,
    userId: string,
) {
    return findTasksByApplicationId(applicationId, userId);
}

export async function createTaskService(
    userId: string,
    input: CreateTaskInput,
) {
    if (input.applicationId) {
        const application = await findApplicationById(
            input.applicationId,
            userId,
        );

        if (!application) {
            throw new Error("Application not found");
        }
    }

    const dueDate = input.dueDate instanceof Date
        ? input.dueDate
        : input.dueDate
            ? new Date(input.dueDate)
            : null;
    const isCompleted = input.isCompleted ?? false;
    const completedAt = isCompleted ? new Date() : null;

    return createTask({
        userId,
        applicationId: input.applicationId || null,
        title: input.title,
        description: input.description,
        priority: input.priority,
        dueDate,
        isCompleted,
        completedAt,
    });
}

export async function updateTaskService(
    id: string,
    userId: string,
    input: UpdateTaskInput,
) {
    const existing = await findTaskById(id, userId);

    if (!existing) {
        throw new Error("Task not found");
    }

    if (input.applicationId && input.applicationId !== existing.applicationId) {
        const app = await findApplicationById(input.applicationId, userId);
        if (!app) {
            throw new Error("Target application not found");
        }
    }

    const dueDate = input.dueDate !== undefined
        ? input.dueDate instanceof Date
            ? input.dueDate
            : input.dueDate
                ? new Date(input.dueDate)
                : null
        : undefined;

    let completedAt: Date | null | undefined = undefined;
    if (input.isCompleted !== undefined) {
        if (input.isCompleted && !existing.isCompleted) {
            completedAt = new Date();
        } else if (!input.isCompleted && existing.isCompleted) {
            completedAt = null;
        }
    }

    return updateTask(id, userId, {
        applicationId: input.applicationId !== undefined ? (input.applicationId || null) : undefined,
        title: input.title,
        description: input.description,
        priority: input.priority,
        dueDate,
        isCompleted: input.isCompleted,
        completedAt,
    });
}

export async function deleteTaskService(id: string, userId: string) {
    const existing = await findTaskById(id, userId);

    if (!existing) {
        throw new Error("Task not found");
    }

    return deleteTask(id, userId);
}
