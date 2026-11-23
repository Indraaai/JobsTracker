import type { ApplicationWithCompany } from "@/core/repositories/application.repository";

export type ApplicationItem = ApplicationWithCompany;

export const applicationStatuses = [
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

export function getStatusClass(status: string) {
    switch (status) {
        case "APPLIED":
            return "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300";
        case "SCREENING":
            return "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300";
        case "ASSESSMENT":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300";
        case "INTERVIEW":
            return "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300";
        case "OFFER":
            return "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300";
        case "ACCEPTED":
            return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300";
        case "REJECTED":
            return "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300";
        case "WITHDRAWN":
            return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
        default:
            return "bg-muted text-muted-foreground";
    }
}

export function formatDate(date?: Date | string | null) {
    if (!date) return "-";
    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
    }).format(new Date(date));
}

export function formatSalary(
    min?: number | null,
    max?: number | null,
    currency?: string | null,
) {
    if (!min && !max) return "-";

    const formatter = new Intl.NumberFormat("id-ID");
    const curr = currency ?? "IDR";

    if (min && max) {
        return `${curr} ${formatter.format(min)} - ${formatter.format(max)}`;
    }

    if (min) {
        return `${curr} ${formatter.format(min)}+`;
    }

    return `Up to ${curr} ${formatter.format(max!)}`;
}
