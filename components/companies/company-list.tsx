"use client";

import { useEffect, useState } from "react";
import { Building2, Pencil, Plus, Trash2 } from "lucide-react";
import CompanyForm from "./company-form";

type Company = {
    id: string;
    name: string;
    logoUrl?: string | null;
    websiteUrl?: string | null;
    linkedinUrl?: string | null;
    location?: string | null;
    industry?: string | null;
    notes?: string | null;
};

export default function CompanyList() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [selectedCompany, setSelectedCompany] =
        useState<Company | null>(null);

    const [error, setError] = useState("");

    async function loadCompanies() {
        try {
            const response = await fetch("/api/companies");

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ?? "Failed to fetch companies",
                );
            }

            setCompanies(result.data);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to fetch companies",
            );
        } finally {
            setLoading(false);
        }
    }

    async function fetchCompanies() {
        setLoading(true);
        setError("");
        await loadCompanies();
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadCompanies();
    }, []);

    function handleAdd() {
        setSelectedCompany(null);
        setShowForm(true);
    }

    function handleEdit(company: Company) {
        setSelectedCompany(company);
        setShowForm(true);
    }

    async function handleDelete(id: string) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this company?",
        );

        if (!confirmed) return;

        try {
            const response = await fetch(
                `/api/companies/${id}`,
                {
                    method: "DELETE",
                },
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ?? "Failed to delete company",
                );
            }

            await fetchCompanies();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to delete company",
            );
        }
    }

    function handleFormSuccess() {
        setShowForm(false);
        setSelectedCompany(null);
        fetchCompanies();
    }

    function handleFormCancel() {
        setShowForm(false);
        setSelectedCompany(null);
    }

    if (showForm) {
        return (
            <div className="max-w-3xl mx-auto rounded-xl border bg-background p-4 sm:p-6 lg:p-8 shadow-xs">
                <CompanyForm
                    company={selectedCompany}
                    onSuccess={handleFormSuccess}
                    onCancel={handleFormCancel}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Companies
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage companies you are applying to.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleAdd}
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Company
                </button>
            </div>

            {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="rounded-xl border bg-background p-8 sm:p-12 text-center text-sm text-muted-foreground">
                    Loading companies...
                </div>
            ) : companies.length === 0 ? (
                <div className="rounded-xl border bg-background p-8 sm:p-12 text-center">
                    <Building2 className="mx-auto h-10 w-10 text-muted-foreground" />

                    <h2 className="mt-4 font-semibold text-foreground">
                        No companies yet
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
                        Add your first company to start tracking your applications.
                    </p>

                    <button
                        type="button"
                        onClick={handleAdd}
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Add Company
                    </button>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border bg-background shadow-xs">
                    <div className="divide-y divide-border">
                        {companies.map((company) => (
                            <div
                                key={company.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 hover:bg-muted/20 transition-colors"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    {company.logoUrl ? (
                                        <img
                                            src={company.logoUrl}
                                            alt={`${company.name} logo`}
                                            className="h-10 w-10 rounded-lg border object-contain bg-background shrink-0"
                                        />
                                    ) : (
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                                            <Building2 className="h-5 w-5" />
                                        </div>
                                    )}

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm sm:text-base font-semibold text-foreground">
                                            {company.name}
                                        </p>

                                        <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
                                            {company.industry && (
                                                <span className="inline-flex items-center gap-1">
                                                    🏢 {company.industry}
                                                </span>
                                            )}

                                            {company.location && (
                                                <span className="inline-flex items-center gap-1">
                                                    📍 {company.location}
                                                </span>
                                            )}

                                            {company.websiteUrl && (
                                                <a
                                                    href={company.websiteUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline"
                                                >
                                                    Website
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end sm:justify-start gap-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => handleEdit(company)}
                                        className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                                        title="Edit company"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(company.id)
                                        }
                                        className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                                        title="Delete company"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}