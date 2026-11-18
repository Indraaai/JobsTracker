"use client";

import { useEffect, useMemo, useState } from "react";
import {
    BriefcaseBusiness,
    ExternalLink,
    Pencil,
    Plus,
    Trash2,
} from "lucide-react";
import ApplicationForm from "./application-form";

type Application = {
    id: string;
    companyId: string;
    position: string;
    status:
    | "SAVED"
    | "APPLIED"
    | "SCREENING"
    | "ASSESSMENT"
    | "INTERVIEW"
    | "OFFER"
    | "ACCEPTED"
    | "REJECTED"
    | "WITHDRAWN";
    jobUrl?: string | null;
    employmentType?: string | null;
    location?: string | null;
    salaryMin?: number | null;
    salaryMax?: number | null;
    currency?: string | null;
    appliedAt?: string | null;
    deadline?: string | null;
    notes?: string | null;
};

type Company = {
    id: string;
    name: string;
};

const statuses = [
    "ALL",
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

function getStatusClass(status: string) {
    switch (status) {
        case "APPLIED":
            return "bg-blue-100 text-blue-700";

        case "SCREENING":
            return "bg-purple-100 text-purple-700";

        case "ASSESSMENT":
            return "bg-yellow-100 text-yellow-700";

        case "INTERVIEW":
            return "bg-orange-100 text-orange-700";

        case "OFFER":
            return "bg-green-100 text-green-700";

        case "ACCEPTED":
            return "bg-emerald-100 text-emerald-700";

        case "REJECTED":
            return "bg-red-100 text-red-700";

        case "WITHDRAWN":
            return "bg-gray-100 text-gray-700";

        default:
            return "bg-muted text-muted-foreground";
    }
}

function formatDate(date?: string | null) {
    if (!date) return "-";

    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
    }).format(new Date(date));
}

function formatSalary(
    min?: number | null,
    max?: number | null,
    currency?: string | null,
) {
    if (!min && !max) return "-";

    const formatter = new Intl.NumberFormat("id-ID");

    if (min && max) {
        return `${currency ?? "IDR"} ${formatter.format(min)} - ${formatter.format(max)}`;
    }

    if (min) {
        return `${currency ?? "IDR"} ${formatter.format(min)}+`;
    }

    return `Up to ${currency ?? "IDR"} ${formatter.format(max!)}`;
}

export default function ApplicationList() {
    const [applications, setApplications] = useState<
        Application[]
    >([]);

    const [companies, setCompanies] = useState<Company[]>(
        [],
    );

    const [filter, setFilter] =
        useState<(typeof statuses)[number]>("ALL");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [selectedApplication, setSelectedApplication] =
        useState<Application | null>(null);

    async function loadData() {
        try {
            const [
                applicationsResponse,
                companiesResponse,
            ] = await Promise.all([
                fetch("/api/applications"),
                fetch("/api/companies"),
            ]);

            const applicationsResult =
                await applicationsResponse.json();

            const companiesResult =
                await companiesResponse.json();

            if (!applicationsResponse.ok) {
                throw new Error(
                    applicationsResult.message ??
                    "Failed to fetch applications",
                );
            }

            if (!companiesResponse.ok) {
                throw new Error(
                    companiesResult.message ??
                    "Failed to fetch companies",
                );
            }

            setApplications(applicationsResult.data);
            setCompanies(companiesResult.data);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to fetch data",
            );
        } finally {
            setLoading(false);
        }
    }

    async function fetchData() {
        setLoading(true);
        setError("");
        await loadData();
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadData();
    }, []);

    const companyMap = useMemo(() => {
        return new Map(
            companies.map((company) => [
                company.id,
                company.name,
            ]),
        );
    }, [companies]);

    const filteredApplications =
        filter === "ALL"
            ? applications
            : applications.filter(
                (application) =>
                    application.status === filter,
            );

    function handleAdd() {
        setSelectedApplication(null);
        setShowForm(true);
    }

    function handleEdit(application: Application) {
        setSelectedApplication(application);
        setShowForm(true);
    }

    async function handleDelete(id: string) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this application?",
        );

        if (!confirmed) return;

        try {
            const response = await fetch(
                `/api/applications/${id}`,
                {
                    method: "DELETE",
                },
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ??
                    "Failed to delete application",
                );
            }

            await fetchData();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to delete application",
            );
        }
    }

    function handleFormSuccess() {
        setShowForm(false);
        setSelectedApplication(null);
        fetchData();
    }

    function handleFormCancel() {
        setShowForm(false);
        setSelectedApplication(null);
    }

    if (showForm) {
        return (
            <div className="max-w-4xl mx-auto rounded-xl border bg-background p-4 sm:p-6 lg:p-8 shadow-xs">
                <ApplicationForm
                    application={selectedApplication}
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
                        Applications
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Track and manage your job applications.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleAdd}
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Application
                </button>
            </div>

            {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap -mx-4 px-4 sm:mx-0 sm:px-0">
                {statuses.map((status) => (
                    <button
                        key={status}
                        type="button"
                        onClick={() => setFilter(status)}
                        className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${filter === status
                                ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                : "bg-background hover:bg-accent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="rounded-xl border bg-background p-8 sm:p-12 text-center text-sm text-muted-foreground">
                    Loading applications...
                </div>
            ) : filteredApplications.length === 0 ? (
                <div className="rounded-xl border bg-background p-8 sm:p-12 text-center">
                    <BriefcaseBusiness className="mx-auto h-10 w-10 text-muted-foreground" />

                    <h2 className="mt-4 font-semibold text-foreground">
                        {filter === "ALL"
                            ? "No applications yet"
                            : `No ${filter.toLowerCase()} applications`}
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
                        {filter === "ALL"
                            ? "Add your first job application to start tracking your job search."
                            : "Try selecting another status filter."}
                    </p>

                    {filter === "ALL" && (
                        <button
                            type="button"
                            onClick={handleAdd}
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Add Application
                        </button>
                    )}
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border bg-background shadow-xs">
                    <div className="divide-y divide-border">
                        {filteredApplications.map(
                            (application) => (
                                <div
                                    key={application.id}
                                    className="p-4 sm:p-5 hover:bg-muted/20 transition-colors"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                                        <div className="flex items-start gap-3 min-w-0">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                                                <BriefcaseBusiness className="h-5 w-5" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="font-semibold text-foreground text-sm sm:text-base leading-snug">
                                                        {application.position}
                                                    </h3>

                                                    <span
                                                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${getStatusClass(application.status)}`}
                                                    >
                                                        {application.status}
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-sm font-medium text-muted-foreground">
                                                    {companyMap.get(
                                                        application.companyId,
                                                    ) ??
                                                        "Unknown company"}
                                                </p>

                                                <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
                                                    {application.location && (
                                                        <span>
                                                            📍 {application.location}
                                                        </span>
                                                    )}

                                                    {application.employmentType && (
                                                        <span>
                                                            💼 {application.employmentType}
                                                        </span>
                                                    )}

                                                    <span>
                                                        🗓️ Applied: {formatDate(
                                                            application.appliedAt,
                                                        )}
                                                    </span>

                                                    {(application.salaryMin ||
                                                        application.salaryMax) && (
                                                        <span className="font-medium text-foreground/80">
                                                            💰 {formatSalary(
                                                                application.salaryMin,
                                                                application.salaryMax,
                                                                application.currency,
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end sm:justify-start gap-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40 shrink-0">
                                            {application.jobUrl && (
                                                <a
                                                    href={application.jobUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                                                    title="Open job posting"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleEdit(application)
                                                }
                                                className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                                                title="Edit application"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(application.id)
                                                }
                                                className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                                                title="Delete application"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}