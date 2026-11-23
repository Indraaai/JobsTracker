"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApplicationItem } from "@/lib/utils/application-helpers";
import type { CreateApplicationInput, UpdateApplicationInput } from "@/core/schemas/application.schema";

export const APPLICATIONS_QUERY_KEY = ["applications"] as const;

export function useApplications(initialData?: ApplicationItem[]) {
    return useQuery({
        queryKey: APPLICATIONS_QUERY_KEY,
        queryFn: async (): Promise<ApplicationItem[]> => {
            const res = await fetch("/api/applications");
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Failed to load applications");
            return json.data;
        },
        initialData,
    });
}

export function useCreateApplication() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateApplicationInput) => {
            const res = await fetch("/api/applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Failed to create application");
            return json.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: APPLICATIONS_QUERY_KEY });
        },
    });
}

export function useUpdateApplication() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateApplicationInput }) => {
            const res = await fetch(`/api/applications/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Failed to update application");
            return json.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: APPLICATIONS_QUERY_KEY });
        },
    });
}

export function useDeleteApplication() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/applications/${id}`, {
                method: "DELETE",
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Failed to delete application");
            return id;
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: APPLICATIONS_QUERY_KEY });
            const previous = queryClient.getQueryData<ApplicationItem[]>(APPLICATIONS_QUERY_KEY);

            if (previous) {
                queryClient.setQueryData<ApplicationItem[]>(
                    APPLICATIONS_QUERY_KEY,
                    previous.filter((a) => a.id !== id),
                );
            }

            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(APPLICATIONS_QUERY_KEY, context.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: APPLICATIONS_QUERY_KEY });
        },
    });
}
