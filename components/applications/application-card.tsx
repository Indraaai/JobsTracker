"use client";

import Link from "next/link";
import {
    Building2,
    ExternalLink,
    Pencil,
    Trash2,
    CalendarPlus,
    CheckSquare,
} from "lucide-react";
import {
    type ApplicationItem,
    getStatusClass,
    formatDate,
    formatSalary,
    applicationStatuses,
} from "@/lib/utils/application-helpers";

type ApplicationCardProps = {
    application: ApplicationItem;
    companyName?: string;
    onEdit: (app: ApplicationItem) => void;
    onDelete: (id: string) => void;
    onStatusChange?: (app: ApplicationItem, newStatus: ApplicationItem["status"]) => void;
    onScheduleInterview?: (app: ApplicationItem) => void;
    onAddTask?: (app: ApplicationItem) => void;
    isBusy?: boolean;
};

export default function ApplicationCard({
    application,
    companyName,
    onEdit,
    onDelete,
    onStatusChange,
    onScheduleInterview,
    onAddTask,
    isBusy,
}: ApplicationCardProps) {
    const displayName = application.companyName || companyName || "Company";

    return (
        <tr className="hover:bg-muted/30 transition-colors">
            {/* Position & Company */}
            <td className="px-4 py-3.5">
                <Link
                    href={`/applications/${application.id}`}
                    className="font-semibold text-foreground text-sm hover:text-primary hover:underline transition-colors block"
                >
                    {application.position}
                </Link>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                    <Building2 className="h-3 w-3" />
                    <span>{displayName}</span>
                    {application.location && <span>• {application.location}</span>}
                </div>
            </td>

            {/* Quick Status Dropdown Switcher */}
            <td className="px-4 py-3.5">
                <select
                    value={application.status}
                    onChange={(e) =>
                        onStatusChange?.(
                            application,
                            e.target.value as ApplicationItem["status"],
                        )
                    }
                    disabled={isBusy}
                    title="Click to switch status"
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold cursor-pointer border-0 outline-none transition-colors ${getStatusClass(
                        application.status,
                    )}`}
                >
                    {applicationStatuses
                        .filter((s) => s !== "ALL")
                        .map((st) => (
                            <option
                                key={st}
                                value={st}
                                className="bg-background text-foreground py-1"
                            >
                                {st}
                            </option>
                        ))}
                </select>
            </td>

            <td className="px-4 py-3.5 text-xs text-muted-foreground hidden sm:table-cell">
                {application.employmentType || "-"}
            </td>

            <td className="px-4 py-3.5 text-xs text-muted-foreground hidden md:table-cell">
                {formatSalary(
                    application.salaryMin,
                    application.salaryMax,
                    application.currency,
                )}
            </td>

            <td className="px-4 py-3.5 text-xs text-muted-foreground hidden lg:table-cell">
                {formatDate(application.appliedAt)}
            </td>

            {/* Quick Actions Shortcuts */}
            <td className="px-4 py-3.5 text-right">
                <div className="flex items-center justify-end gap-1">
                    {/* Quick Schedule Interview */}
                    {onScheduleInterview && (
                        <button
                            type="button"
                            onClick={() => onScheduleInterview(application)}
                            disabled={isBusy}
                            className="rounded-lg p-1.5 text-orange-600 hover:bg-orange-500/10 transition-colors"
                            title="Schedule Interview for this job"
                        >
                            <CalendarPlus className="h-4 w-4" />
                        </button>
                    )}

                    {/* Quick Add To-Do */}
                    {onAddTask && (
                        <button
                            type="button"
                            onClick={() => onAddTask(application)}
                            disabled={isBusy}
                            className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-500/10 transition-colors"
                            title="Add To-Do / Task for this job"
                        >
                            <CheckSquare className="h-4 w-4" />
                        </button>
                    )}

                    {application.jobUrl && (
                        <a
                            href={application.jobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            title="Open Job URL"
                        >
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    )}

                    <button
                        type="button"
                        onClick={() => onEdit(application)}
                        disabled={isBusy}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
                        title="Edit application"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(application.id)}
                        disabled={isBusy}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50"
                        title="Delete application"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}
