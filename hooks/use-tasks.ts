"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TaskItem } from "@/lib/utils/task-helpers";
import type { CreateTaskInput, UpdateTaskInput } from "@/core/schemas/task.schema";

export const TASKS_QUERY_KEY = ["tasks"] as const;

export function useTasks(initialData?: TaskItem[]) {
    return useQuery({
        queryKey: TASKS_QUERY_KEY,
        queryFn: async (): Promise<TaskItem[]> => {
            const res = await fetch("/api/tasks");
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Failed to load tasks");
            return json.data;
        },
        initialData,
    });
}

export function useToggleTaskComplete() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, isCompleted }: { id: string; isCompleted: boolean }) => {
            const res = await fetch(`/api/tasks/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isCompleted }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Failed to toggle task");
            return json.data;
        },
        onMutate: async ({ id, isCompleted }) => {
            await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });
            const previousTasks = queryClient.getQueryData<TaskItem[]>(TASKS_QUERY_KEY);

            if (previousTasks) {
                queryClient.setQueryData<TaskItem[]>(
                    TASKS_QUERY_KEY,
                    previousTasks.map((t) => (t.id === id ? { ...t, isCompleted } : t)),
                );
            }

            return { previousTasks };
        },
        onError: (_err, _vars, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(TASKS_QUERY_KEY, context.previousTasks);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
        },
    });
}

export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<CreateTaskInput> & { title: string }) => {
            const res = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Failed to create task");
            return json.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
        },
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateTaskInput }) => {
            const res = await fetch(`/api/tasks/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Failed to update task");
            return json.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
        },
    });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/tasks/${id}`, {
                method: "DELETE",
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Failed to delete task");
            return id;
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });
            const previousTasks = queryClient.getQueryData<TaskItem[]>(TASKS_QUERY_KEY);

            if (previousTasks) {
                queryClient.setQueryData<TaskItem[]>(
                    TASKS_QUERY_KEY,
                    previousTasks.filter((t) => t.id !== id),
                );
            }

            return { previousTasks };
        },
        onError: (_err, _vars, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(TASKS_QUERY_KEY, context.previousTasks);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
        },
    });
}
