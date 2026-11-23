import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { tasks, type Task } from "@/db/schema/tasks";
import { applications } from "@/db/schema/application";
import { companies } from "@/db/schema/companies";

export type TaskWithDetails = Task & {
    applicationPosition: string | null;
    companyName: string | null;
    companyLogo: string | null;
};

export async function findTasksByUserId(
    userId: string,
): Promise<TaskWithDetails[]> {
    const rows = await db
        .select({
            id: tasks.id,
            userId: tasks.userId,
            applicationId: tasks.applicationId,
            title: tasks.title,
            description: tasks.description,
            priority: tasks.priority,
            dueDate: tasks.dueDate,
            isCompleted: tasks.isCompleted,
            completedAt: tasks.completedAt,
            createdAt: tasks.createdAt,
            updatedAt: tasks.updatedAt,
            applicationPosition: applications.position,
            companyName: companies.name,
            companyLogo: companies.logoUrl,
        })
        .from(tasks)
        .leftJoin(
            applications,
            eq(tasks.applicationId, applications.id),
        )
        .leftJoin(
            companies,
            eq(applications.companyId, companies.id),
        )
        .where(eq(tasks.userId, userId))
        .orderBy(tasks.isCompleted, desc(tasks.createdAt));

    return rows;
}

export async function findTaskById(
    id: string,
    userId: string,
): Promise<TaskWithDetails | null> {
    const rows = await db
        .select({
            id: tasks.id,
            userId: tasks.userId,
            applicationId: tasks.applicationId,
            title: tasks.title,
            description: tasks.description,
            priority: tasks.priority,
            dueDate: tasks.dueDate,
            isCompleted: tasks.isCompleted,
            completedAt: tasks.completedAt,
            createdAt: tasks.createdAt,
            updatedAt: tasks.updatedAt,
            applicationPosition: applications.position,
            companyName: companies.name,
            companyLogo: companies.logoUrl,
        })
        .from(tasks)
        .leftJoin(
            applications,
            eq(tasks.applicationId, applications.id),
        )
        .leftJoin(
            companies,
            eq(applications.companyId, companies.id),
        )
        .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
        .limit(1);

    return rows[0] ?? null;
}

export async function findTasksByApplicationId(
    applicationId: string,
    userId: string,
): Promise<Task[]> {
    return db
        .select()
        .from(tasks)
        .where(
            and(
                eq(tasks.applicationId, applicationId),
                eq(tasks.userId, userId),
            ),
        )
        .orderBy(tasks.isCompleted, desc(tasks.createdAt));
}

export async function createTask(data: {
    userId: string;
    applicationId?: string | null;
    title: string;
    description?: string | null;
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    dueDate?: Date | null;
    isCompleted?: boolean;
    completedAt?: Date | null;
}) {
    const result = await db
        .insert(tasks)
        .values({
            userId: data.userId,
            applicationId: data.applicationId || null,
            title: data.title,
            description: data.description || null,
            priority: data.priority ?? "MEDIUM",
            dueDate: data.dueDate || null,
            isCompleted: data.isCompleted ?? false,
            completedAt: data.completedAt || null,
        })
        .returning();

    return result[0];
}

export async function updateTask(
    id: string,
    userId: string,
    data: {
        applicationId?: string | null;
        title?: string;
        description?: string | null;
        priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
        dueDate?: Date | null;
        isCompleted?: boolean;
        completedAt?: Date | null;
    },
) {
    const result = await db
        .update(tasks)
        .set({
            ...data,
            updatedAt: new Date(),
        })
        .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
        .returning();

    return result[0] ?? null;
}

export async function deleteTask(id: string, userId: string) {
    const result = await db
        .delete(tasks)
        .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
        .returning({
            id: tasks.id,
        });

    return result[0] ?? null;
}
