"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { InterviewItem } from "@/lib/utils/interview-helpers";
import type { CreateInterviewInput, UpdateInterviewInput } from "@/core/schemas/interview.schema";

export const INTERVIEWS_QUERY_KEY = ["interviews"] as const;

export function useInterviews(initialData?: InterviewItem[]) {
    return useQuery({
        queryKey: INTERVIEWS_QUERY_KEY,
        queryFn: async (): Promise<InterviewItem[]> => {
            const res = await fetch("/api/interviews");
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Failed to load interviews");
            return json.data;
        },
        initialData,
    });
}

export function useToggleInterviewComplete() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, isCompleted }: { id: string; isCompleted: boolean }) => {
            const res = await fetch(`/api/interviews/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isCompleted }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Failed to toggle interview");
            return json.data;
        },
        onMutate: async ({ id, isCompleted }) => {
            await queryClient.cancelQueries({ queryKey: INTERVIEWS_QUERY_KEY });
            const previous = queryClient.getQueryData<InterviewItem[]>(INTERVIEWS_QUERY_KEY);

            if (previous) {
                queryClient.setQueryData<InterviewItem[]>(
                    INTERVIEWS_QUERY_KEY,
                    previous.map((i) => (i.id === id ? { ...i, isCompleted } : i)),
                );
            }

            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(INTERVIEWS_QUERY_KEY, context.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: INTERVIEWS_QUERY_KEY });
        },
    });
}

export function useCreateInterview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateInterviewInput) => {
            const res = await fetch("/api/interviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Failed to schedule interview");
            return json.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: INTERVIEWS_QUERY_KEY });
            // Invalidate applications as well since status might have changed to INTERVIEW
            queryClient.invalidateQueries({ queryKey: ["applications"] });
        },
    });
}

export function useUpdateInterview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateInterviewInput }) => {
            const res = await fetch(`/api/interviews/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Failed to update interview");
            return json.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: INTERVIEWS_QUERY_KEY });
        },
    });
}

export function useDeleteInterview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/interviews/${id}`, {
                method: "DELETE",
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Failed to delete interview");
            return id;
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: INTERVIEWS_QUERY_KEY });
            const previous = queryClient.getQueryData<InterviewItem[]>(INTERVIEWS_QUERY_KEY);

            if (previous) {
                queryClient.setQueryData<InterviewItem[]>(
                    INTERVIEWS_QUERY_KEY,
                    previous.filter((i) => i.id !== id),
                );
            }

            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(INTERVIEWS_QUERY_KEY, context.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: INTERVIEWS_QUERY_KEY });
        },
    });
}
