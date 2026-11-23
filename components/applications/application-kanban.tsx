"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Building2,
    Calendar,
    CalendarPlus,
    CheckSquare,
    ExternalLink,
    Pencil,
    Trash2,
    Plus,
} from "lucide-react";
import {
    type ApplicationItem,
    formatDate,
    formatSalary,
} from "@/lib/utils/application-helpers";

type KanbanColumn = {
    id: string;
    title: string;
    statuses: ApplicationItem["status"][];
    color: string;
    headerBg: string;
};

const kanbanColumns: KanbanColumn[] = [
    {
        id: "SAVED",
        title: "Wishlist / Saved",
        statuses: ["SAVED"],
        color: "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300",
        headerBg: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
    },
    {
        id: "APPLIED",
        title: "Applied",
        statuses: ["APPLIED"],
        color: "border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300",
        headerBg: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
    },
    {
        id: "SCREENING",
        title: "Screening / Test",
        statuses: ["SCREENING", "ASSESSMENT"],
        color: "border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300",
        headerBg: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
    },
    {
        id: "INTERVIEW",
        title: "Interviewing",
        statuses: ["INTERVIEW"],
        color: "border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300",
        headerBg: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
    },
    {
        id: "OFFER",
        title: "Offer & Accepted",
        statuses: ["OFFER", "ACCEPTED"],
        color: "border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300",
        headerBg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    },
    {
        id: "REJECTED",
        title: "Rejected / Withdrawn",
        statuses: ["REJECTED", "WITHDRAWN"],
        color: "border-red-300 dark:border-red-700 text-red-700 dark:text-red-300",
        headerBg: "bg-red-500/10 text-red-700 dark:text-red-300",
    },
];

type ApplicationKanbanProps = {
    applications: ApplicationItem[];
    onStatusChange: (id: string, newStatus: ApplicationItem["status"]) => void;
    onEdit: (app: ApplicationItem) => void;
    onDelete: (id: string) => void;
    onScheduleInterview: (app: ApplicationItem) => void;
    onAddTask: (app: ApplicationItem) => void;
    onNewApplication: () => void;
    isBusy?: boolean;
};

export default function ApplicationKanban({
    applications,
    onStatusChange,
    onEdit,
    onDelete,
    onScheduleInterview,
    onAddTask,
    onNewApplication,
    isBusy,
}: ApplicationKanbanProps) {
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [dragOverCol, setDragOverCol] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.setData("applicationId", id);
        setDraggingId(id);
    };

    const handleDragEnd = () => {
        setDraggingId(null);
        setDragOverCol(null);
    };

    const handleDragOver = (e: React.DragEvent, colId: string) => {
        e.preventDefault();
        setDragOverCol(colId);
    };

    const handleDragLeave = () => {
        setDragOverCol(null);
    };

    const handleDrop = (e: React.DragEvent, targetStatus: ApplicationItem["status"]) => {
        e.preventDefault();
        setDragOverCol(null);
        const appId = e.dataTransfer.getData("applicationId");
        if (appId) {
            onStatusChange(appId, targetStatus);
        }
    };

    return (
        <div className="flex gap-4 overflow-x-auto pb-6 pt-2">
            {kanbanColumns.map((col) => {
                const colApps = applications.filter((a) =>
                    col.statuses.includes(a.status),
                );
                const isOver = dragOverCol === col.id;
                // Target status to assign on drop (defaults to first status in column)
                const targetStatus = col.statuses[0];

                return (
                    <div
                        key={col.id}
                        onDragOver={(e) => handleDragOver(e, col.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, targetStatus)}
                        className={`flex w-72 shrink-0 flex-col rounded-2xl border bg-muted/20 p-3 transition-colors ${
                            isOver ? "border-primary bg-primary/5 ring-2 ring-primary/20" : ""
                        }`}
                    >
                        {/* Column Header */}
                        <div className="flex items-center justify-between px-1.5 py-2">
                            <div className="flex items-center gap-2">
                                <span
                                    className={`rounded-lg px-2.5 py-1 text-xs font-bold tracking-tight ${col.headerBg}`}
                                >
                                    {col.title}
                                </span>
                                <span className="rounded-full bg-background px-2 py-0.5 text-xs font-bold text-muted-foreground shadow-2xs border">
                                    {colApps.length}
                                </span>
                            </div>

                            <button
                                onClick={onNewApplication}
                                title="Add Application"
                                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Column Cards Container */}
                        <div className="mt-2.5 flex-1 space-y-3 min-h-[350px]">
                            {colApps.length === 0 ? (
                                <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-border/60 text-xs text-muted-foreground">
                                    Drag card here
                                </div>
                            ) : (
                                colApps.map((app) => {
                                    const isDragging = draggingId === app.id;
                                    const salary = formatSalary(
                                        app.salaryMin,
                                        app.salaryMax,
                                        app.currency,
                                    );

                                    return (
                                        <div
                                            key={app.id}
                                            draggable={!isBusy}
                                            onDragStart={(e) => handleDragStart(e, app.id)}
                                            onDragEnd={handleDragEnd}
                                            className={`group relative flex flex-col justify-between rounded-xl border bg-background p-3.5 shadow-xs transition-all hover:border-primary/50 hover:shadow-md cursor-grab active:cursor-grabbing ${
                                                isDragging ? "opacity-40 scale-95" : ""
                                            }`}
                                        >
                                            <div>
                                                {/* Company & Role */}
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground truncate">
                                                            <Building2 className="h-3 w-3 shrink-0" />
                                                            <span className="truncate">
                                                                {app.companyName ?? "Company"}
                                                            </span>
                                                        </div>
                                                        <Link
                                                            href={`/applications/${app.id}`}
                                                            className="mt-1 text-sm font-bold tracking-tight text-foreground line-clamp-1 hover:text-primary hover:underline transition-colors block"
                                                        >
                                                            {app.position}
                                                        </Link>
                                                    </div>

                                                    {app.jobUrl && (
                                                        <a
                                                            href={app.jobUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-muted-foreground hover:text-primary transition-colors shrink-0 p-1"
                                                            title="Open Job Link"
                                                        >
                                                            <ExternalLink className="h-3.5 w-3.5" />
                                                        </a>
                                                    )}
                                                </div>

                                                {/* Meta Pills */}
                                                <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
                                                    {salary !== "-" && (
                                                        <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium">
                                                            {salary}
                                                        </span>
                                                    )}
                                                    {app.employmentType && (
                                                        <span className="rounded-md bg-muted px-2 py-0.5 text-[10px]">
                                                            {app.employmentType}
                                                        </span>
                                                    )}
                                                    {app.location && (
                                                        <span className="rounded-md bg-muted px-2 py-0.5 text-[10px]">
                                                            📍 {app.location}
                                                        </span>
                                                    )}
                                                </div>

                                                {app.appliedAt && (
                                                    <div className="mt-2.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>Applied {formatDate(app.appliedAt)}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Quick Actions Bar */}
                                            <div className="mt-3.5 pt-2.5 border-t flex items-center justify-between">
                                                <div className="flex items-center gap-1">
                                                    {/* Quick Schedule Interview */}
                                                    <button
                                                        onClick={() => onScheduleInterview(app)}
                                                        title="Schedule Interview"
                                                        className="inline-flex items-center gap-1 rounded-md bg-orange-500/10 px-2 py-1 text-[10px] font-semibold text-orange-600 hover:bg-orange-500/20 transition-colors"
                                                    >
                                                        <CalendarPlus className="h-3 w-3" />
                                                        Interview
                                                    </button>

                                                    {/* Quick Add To-Do */}
                                                    <button
                                                        onClick={() => onAddTask(app)}
                                                        title="Add Action Item / To-Do"
                                                        className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-1 text-[10px] font-semibold text-blue-600 hover:bg-blue-500/20 transition-colors"
                                                    >
                                                        <CheckSquare className="h-3 w-3" />
                                                        Task
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => onEdit(app)}
                                                        title="Edit Application"
                                                        className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => onDelete(app.id)}
                                                        title="Delete Application"
                                                        className="rounded-md p-1 text-muted-foreground hover:bg-red-500/10 hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
