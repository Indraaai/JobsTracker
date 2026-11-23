"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { APPLICATIONS_QUERY_KEY } from "@/hooks/use-applications";
import type { ApplicationItem } from "@/lib/utils/application-helpers";

type Company = {
    id: string;
    name: string;
};

type ApplicationFormProps = {
    application?: ApplicationItem | null;
    onSuccess: () => void;
    onCancel: () => void;
};

const statuses = [
    "SAVED",
    "APPLIED",
    "SCREENING",
    "ASSESSMENT",
    "INTERVIEW",
    "OFFER",
    "ACCEPTED",
    "REJECTED",
    "WITHDRAWN",
] as const;

export default function ApplicationForm({
    application,
    onSuccess,
    onCancel,
}: ApplicationFormProps) {
    const isEdit = Boolean(application?.id);
    const queryClient = useQueryClient();

    const [companies, setCompanies] = useState<Company[]>([]);
    const [loadingCompanies, setLoadingCompanies] = useState(true);
    const [isNewCompany, setIsNewCompany] = useState(false);
    const [newCompanyName, setNewCompanyName] = useState("");

    const [form, setForm] = useState({
        companyId: application?.companyId ?? "",
        position: application?.position ?? "",
        status: application?.status ?? "SAVED",
        jobUrl: application?.jobUrl ?? "",
        employmentType: application?.employmentType ?? "",
        location: application?.location ?? "",
        salaryMin:
            application?.salaryMin?.toString() ?? "",
        salaryMax:
            application?.salaryMax?.toString() ?? "",
        currency: application?.currency ?? "IDR",
        appliedAt: application?.appliedAt
            ? (typeof application.appliedAt === "string"
                ? application.appliedAt
                : new Date(application.appliedAt).toISOString()
              ).slice(0, 10)
            : "",
        deadline: application?.deadline
            ? (typeof application.deadline === "string"
                ? application.deadline
                : new Date(application.deadline).toISOString()
              ).slice(0, 10)
            : "",
        notes: application?.notes ?? "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchCompanies() {
            try {
                const response = await fetch("/api/companies");
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message ?? "Failed to fetch companies",
                    );
                }

                setCompanies(result.data);
                if (result.data.length === 0 && !isEdit) {
                    setIsNewCompany(true);
                }
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch companies",
                );
            } finally {
                setLoadingCompanies(false);
            }
        }

        fetchCompanies();
    }, [isEdit]);

    function handleChange(
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
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
            let targetCompanyId = form.companyId;

            if (isNewCompany) {
                if (!newCompanyName.trim()) {
                    setError("Please enter the company name");
                    setLoading(false);
                    return;
                }

                const compRes = await fetch("/api/companies", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: newCompanyName.trim() }),
                });

                const compResult = await compRes.json();
                if (!compRes.ok) {
                    setError(compResult.message || "Failed to create company");
                    setLoading(false);
                    return;
                }

                targetCompanyId = compResult.data.id;
                queryClient.invalidateQueries({ queryKey: ["companies"] });
            } else {
                if (!targetCompanyId) {
                    setError("Please select a company or enter a new one");
                    setLoading(false);
                    return;
                }
            }

            const body = {
                companyId: targetCompanyId,
                position: form.position,
                status: form.status,
                jobUrl: form.jobUrl,
                employmentType: form.employmentType,
                location: form.location,
                salaryMin: form.salaryMin
                    ? Number(form.salaryMin)
                    : undefined,
                salaryMax: form.salaryMax
                    ? Number(form.salaryMax)
                    : undefined,
                currency: form.currency,
                appliedAt: form.appliedAt || undefined,
                deadline: form.deadline || undefined,
                notes: form.notes,
            };

            const response = await fetch(
                isEdit
                    ? `/api/applications/${application?.id}`
                    : "/api/applications",
                {
                    method: isEdit ? "PATCH" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                },
            );

            const result = await response.json();

            if (!response.ok) {
                setError(
                    result.message ?? "Something went wrong",
                );
                return;
            }

            queryClient.invalidateQueries({ queryKey: APPLICATIONS_QUERY_KEY });
            onSuccess();
        } catch {
            setError("Failed to connect to server");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold">
                    {isEdit
                        ? "Edit Application"
                        : "Add Application"}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Track a job opportunity and its recruitment
                    progress.
                </p>
            </div>

            {error && (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-medium">Company *</label>
                        <button
                            type="button"
                            onClick={() => setIsNewCompany(!isNewCompany)}
                            className="text-xs text-primary font-semibold hover:underline cursor-pointer"
                        >
                            {isNewCompany ? "← Select existing" : "+ New Company"}
                        </button>
                    </div>

                    {isNewCompany ? (
                        <input
                            type="text"
                            placeholder="Company name (e.g. Google, Gojek, Grab)"
                            value={newCompanyName}
                            onChange={(e) => setNewCompanyName(e.target.value)}
                            required
                            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                        />
                    ) : (
                        <select
                            name="companyId"
                            value={form.companyId}
                            onChange={handleChange}
                            required={!isNewCompany}
                            disabled={loadingCompanies}
                            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                        >
                            <option value="">
                                {loadingCompanies ? "Loading companies..." : "Select company"}
                            </option>
                            {companies.map((company) => (
                                <option key={company.id} value={company.id}>
                                    {company.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium">
                        Position *
                    </label>

                    <input
                        name="position"
                        value={form.position}
                        onChange={handleChange}
                        required
                        placeholder="Backend Engineer"
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium">
                        Status
                    </label>

                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    >
                        {statuses.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium">
                        Employment Type
                    </label>

                    <select
                        name="employmentType"
                        value={form.employmentType}
                        onChange={handleChange}
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value="">Select type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                        <option value="Freelance">Freelance</option>
                    </select>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium">
                        Location
                    </label>

                    <input
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="Medan / Remote"
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium">
                        Job URL
                    </label>

                    <input
                        name="jobUrl"
                        value={form.jobUrl}
                        onChange={handleChange}
                        placeholder="https://..."
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium">
                        Minimum Salary
                    </label>

                    <input
                        name="salaryMin"
                        type="number"
                        min="0"
                        value={form.salaryMin}
                        onChange={handleChange}
                        placeholder="8000000"
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium">
                        Maximum Salary
                    </label>

                    <input
                        name="salaryMax"
                        type="number"
                        min="0"
                        value={form.salaryMax}
                        onChange={handleChange}
                        placeholder="12000000"
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium">
                        Currency
                    </label>

                    <input
                        name="currency"
                        value={form.currency}
                        onChange={handleChange}
                        maxLength={3}
                        placeholder="IDR"
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm uppercase outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium">
                        Applied Date
                    </label>

                    <input
                        name="appliedAt"
                        type="date"
                        value={form.appliedAt}
                        onChange={handleChange}
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium">
                        Deadline
                    </label>

                    <input
                        name="deadline"
                        type="date"
                        value={form.deadline}
                        onChange={handleChange}
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
                        placeholder="Recruitment notes..."
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
                    disabled={
                        loading ||
                        loadingCompanies ||
                        companies.length === 0
                    }
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 shadow-xs transition-colors"
                >
                    {loading
                        ? "Saving..."
                        : isEdit
                            ? "Update Application"
                            : "Add Application"}
                </button>
            </div>
        </form>
    );
}