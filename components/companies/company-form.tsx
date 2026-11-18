"use client";

import { useState } from "react";

type Company = {
    id?: string;
    name: string;
    logoUrl?: string | null;
    websiteUrl?: string | null;
    linkedinUrl?: string | null;
    location?: string | null;
    industry?: string | null;
    notes?: string | null;
};

type CompanyFormProps = {
    company?: Company | null;
    onSuccess: () => void;
    onCancel: () => void;
};

export default function CompanyForm({
    company,
    onSuccess,
    onCancel,
}: CompanyFormProps) {
    const isEdit = Boolean(company?.id);

    const [form, setForm] = useState({
        name: company?.name ?? "",
        logoUrl: company?.logoUrl ?? "",
        websiteUrl: company?.websiteUrl ?? "",
        linkedinUrl: company?.linkedinUrl ?? "",
        location: company?.location ?? "",
        industry: company?.industry ?? "",
        notes: company?.notes ?? "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleChange(
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >,
    ) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>,
    ) {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                isEdit
                    ? `/api/companies/${company?.id}`
                    : "/api/companies",
                {
                    method: isEdit ? "PATCH" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form),
                },
            );

            const result = await response.json();

            if (!response.ok) {
                setError(result.message ?? "Something went wrong");
                return;
            }

            onSuccess();
        } catch {
            setError("Failed to connect to server");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <h2 className="text-lg font-semibold">
                    {isEdit ? "Edit Company" : "Add Company"}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    {isEdit
                        ? "Update company information."
                        : "Add a company to your job tracker."}
                </p>
            </div>

            {error && (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium">
                        Company Name *
                    </label>

                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Google"
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium">
                        Website
                    </label>

                    <input
                        name="websiteUrl"
                        value={form.websiteUrl}
                        onChange={handleChange}
                        placeholder="https://example.com"
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium">
                        LinkedIn
                    </label>

                    <input
                        name="linkedinUrl"
                        value={form.linkedinUrl}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/company/..."
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium">
                        Location
                    </label>

                    <input
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="Jakarta, Indonesia"
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium">
                        Industry
                    </label>

                    <input
                        name="industry"
                        value={form.industry}
                        onChange={handleChange}
                        placeholder="Technology"
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium">
                        Logo URL
                    </label>

                    <input
                        name="logoUrl"
                        value={form.logoUrl}
                        onChange={handleChange}
                        placeholder="https://..."
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium">
                        Notes
                    </label>

                    <textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Additional notes..."
                        className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-accent disabled:opacity-50 transition-colors"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 shadow-xs transition-colors"
                >
                    {loading
                        ? "Saving..."
                        : isEdit
                            ? "Update Company"
                            : "Add Company"}
                </button>
            </div>
        </form>
    );
}