"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ContactWithCompany } from "@/core/repositories/contact.repository";
import type { CreateContactInput, UpdateContactInput } from "@/core/schemas/contact.schema";

export const CONTACTS_QUERY_KEY = ["contacts"] as const;

export function useContacts(initialData?: ContactWithCompany[]) {
    return useQuery({
        queryKey: CONTACTS_QUERY_KEY,
        queryFn: async (): Promise<ContactWithCompany[]> => {
            const res = await fetch("/api/contacts");
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Failed to load contacts");
            return json.data;
        },
        initialData,
    });
}

export function useCreateContact() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateContactInput) => {
            const res = await fetch("/api/contacts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Failed to create contact");
            return json.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CONTACTS_QUERY_KEY });
        },
    });
}

export function useUpdateContact() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateContactInput }) => {
            const res = await fetch(`/api/contacts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Failed to update contact");
            return json.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CONTACTS_QUERY_KEY });
        },
    });
}

export function useDeleteContact() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/contacts/${id}`, {
                method: "DELETE",
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Failed to delete contact");
            return json;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CONTACTS_QUERY_KEY });
        },
    });
}
