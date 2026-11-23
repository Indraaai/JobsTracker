"use client";

import { useMemo, useState } from "react";
import { Building2, Plus, Search, Loader2 } from "lucide-react";
import { useCompanies, useDeleteCompany } from "@/hooks/use-companies";
import type { Company } from "@/db/schema/companies";
import type { CompanyItem } from "./company-card";
import CompanyCard from "./company-card";
import CompanyForm from "./company-form";

export default function CompanyList({ initialData }: { initialData?: Company[] }) {
    const { data: companies = [], isLoading, error } = useCompanies(initialData);
    const deleteCompanyMutation = useDeleteCompany();

    const [showForm, setShowForm] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<CompanyItem | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCompanies = useMemo(() => {
        if (!searchQuery.trim()) return companies;
        const q = searchQuery.toLowerCase();
        return companies.filter(
            (c) =>
                c.name.toLowerCase().includes(q) ||
                (c.industry && c.industry.toLowerCase().includes(q)) ||
                (c.location && c.location.toLowerCase().includes(q)),
        );
    }, [companies, searchQuery]);

    const handleAdd = () => {
        setSelectedCompany(null);
        setShowForm(true);
    };

    const handleEdit = (company: CompanyItem) => {
        setSelectedCompany(company);
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this company?")) {
            deleteCompanyMutation.mutate(id);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        Companies
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage your target companies, research notes, and website links.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleAdd}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Company
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search company, industry, location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border bg-background pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {/* Content */}
            {isLoading && companies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-3 text-sm text-muted-foreground">Loading companies...</p>
                </div>
            ) : error ? (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                    Failed to load companies: {error.message}
                </div>
            ) : filteredCompanies.length === 0 ? (
                <div className="rounded-2xl border border-dashed bg-background p-12 text-center max-w-md mx-auto">
                    <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h2 className="mt-4 font-bold text-foreground">
                        {companies.length === 0 ? "No companies yet" : "No companies match search"}
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {companies.length === 0
                            ? "Add your first company to start organizing your job applications."
                            : "Try searching with a different term."}
                    </p>
                    {companies.length === 0 && (
                        <button
                            type="button"
                            onClick={handleAdd}
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Add Company
                        </button>
                    )}
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border bg-background shadow-xs">
                    <div className="divide-y divide-border">
                        {filteredCompanies.map((company) => (
                            <CompanyCard
                                key={company.id}
                                company={company}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                isBusy={deleteCompanyMutation.isPending}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-lg rounded-2xl border bg-background p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                        <CompanyForm
                            company={selectedCompany}
                            onSuccess={() => {
                                setShowForm(false);
                                setSelectedCompany(null);
                            }}
                            onCancel={() => {
                                setShowForm(false);
                                setSelectedCompany(null);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}