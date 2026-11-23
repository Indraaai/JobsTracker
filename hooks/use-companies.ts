"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Company } from "@/db/schema/companies";
import type { CreateCompanyInput, UpdateCompanyInput } from "@/core/schemas/company.schema";

export const COMPANIES_QUERY_KEY = ["companies"] as const;

export function useCompanies(initialData?: Company[]) {
    return useQuery({
        queryKey: COMPANIES_QUERY_KEY,
        queryFn: async (): Promise<Company[]> => {
            const res = await fetch("/api/companies");
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Failed to load companies");
            return json.data;
        },
        initialData,
    });
}

export function useCreateCompany() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateCompanyInput) => {
            const res = await fetch("/api/companies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Failed to create company");
            return json.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: COMPANIES_QUERY_KEY });
        },
    });
}

export function useUpdateCompany() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateCompanyInput }) => {
            const res = await fetch(`/api/companies/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Failed to update company");
            return json.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: COMPANIES_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: ["applications"] });
            queryClient.invalidateQueries({ queryKey: ["interviews"] });
        },
    });
}

export function useDeleteCompany() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/companies/${id}`, {
                method: "DELETE",
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Failed to delete company");
            return id;
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: COMPANIES_QUERY_KEY });
            const previous = queryClient.getQueryData<Company[]>(COMPANIES_QUERY_KEY);

            if (previous) {
                queryClient.setQueryData<Company[]>(
                    COMPANIES_QUERY_KEY,
                    previous.filter((c) => c.id !== id),
                );
            }

            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(COMPANIES_QUERY_KEY, context.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: COMPANIES_QUERY_KEY });
        },
    });
}
