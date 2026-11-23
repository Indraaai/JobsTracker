"use client";

import {
    CalendarDays,
    CalendarCheck,
    Video,
    MapPin,
    Building2,
    Pencil,
    Trash2,
    ExternalLink,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import CalendarSyncButton from "./calendar-sync-button";
import {
    type InterviewItem,
    getStageBadge,
    getFormatBadge,
    formatSchedule,
    getRelativeTimeBadge,
} from "@/lib/utils/interview-helpers";

type InterviewCardProps = {
    item: InterviewItem;
    onToggle: (item: InterviewItem) => void;
    onEdit: (item: InterviewItem) => void;
    onDelete: (id: string) => void;
    isBusy?: boolean;
};

export default function InterviewCard({
    item,
    onToggle,
    onEdit,
    onDelete,
    isBusy,
}: InterviewCardProps) {
    const stageInfo = getStageBadge(item.stage);
    const formatInfo = getFormatBadge(item.format);
    const FormatIcon = formatInfo.icon;
    const { dateStr, timeStr } = formatSchedule(item.scheduledAt);
    const relBadge = getRelativeTimeBadge(item.scheduledAt, item.isCompleted);

    return (
        <div
            className={`group relative flex flex-col justify-between rounded-2xl border bg-background p-5 shadow-xs transition-all hover:shadow-md ${
                item.isCompleted ? "opacity-75" : ""
            }`}
        >
            <div>
                {/* Header: Company, Position, Stage, Relative Time */}
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                            <Building2 className="h-3.5 w-3.5" />
                            <span>{item.companyName ?? "Company"}</span>
                            <span>•</span>
                            <span className="text-foreground font-semibold">
                                {item.applicationPosition ?? "Role"}
                            </span>
                        </div>

                        <h3 className="mt-1 text-base font-bold tracking-tight text-foreground">
                            {item.title}
                        </h3>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span
                            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${stageInfo.className}`}
                        >
                            {stageInfo.label}
                        </span>
                        <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${relBadge.className}`}
                        >
                            {relBadge.label}
                        </span>
                    </div>
                </div>

                {/* Schedule & Medium Info */}
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground border-y py-2.5">
                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                        <CalendarDays className="h-3.5 w-3.5 text-primary" />
                        <span>{dateStr}</span>
                        <span>at {timeStr}</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <FormatIcon className="h-3.5 w-3.5" />
                        <span>{formatInfo.label}</span>
                    </div>

                    {item.location && (
                        <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="truncate max-w-[150px]">{item.location}</span>
                        </div>
                    )}
                </div>

                {/* Notes & Feedback */}
                {(item.notes || item.feedback) && (
                    <div className="mt-3 space-y-1.5 text-xs">
                        {item.notes && (
                            <div className="rounded-lg bg-muted/40 p-2 text-muted-foreground">
                                <span className="font-semibold text-foreground">Prep notes: </span>
                                {item.notes}
                            </div>
                        )}
                        {item.feedback && (
                            <div className="rounded-lg bg-primary/5 border border-primary/10 p-2 text-foreground">
                                <span className="font-semibold text-primary">Feedback: </span>
                                {item.feedback}
                            </div>
                        )}
                    </div>
                )}

                {/* Result Pill */}
                {item.result && item.result !== "PENDING" && (
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                        {item.result === "PASSED" ? (
                            <span className="flex items-center gap-1 text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Passed Stage 🎉
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-red-600 bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-200">
                                <XCircle className="h-3.5 w-3.5" />
                                Not Selected
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                <div className="flex flex-wrap items-center gap-2">
                    {item.meetingUrl ? (
                        <a
                            href={item.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                        >
                            <Video className="h-3.5 w-3.5" />
                            Join Meeting
                            <ExternalLink className="h-3 w-3" />
                        </a>
                    ) : (
                        <span className="text-[11px] text-muted-foreground italic">
                            No meeting link
                        </span>
                    )}

                    <CalendarSyncButton interview={item} size="sm" />
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onToggle(item)}
                        disabled={isBusy}
                        title={item.isCompleted ? "Mark as upcoming" : "Mark as completed"}
                        className={`rounded-lg p-1.5 text-xs font-medium transition-colors ${
                            item.isCompleted
                                ? "text-emerald-600 hover:bg-emerald-500/10"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                    >
                        <CalendarCheck className="h-4 w-4" />
                    </button>

                    <button
                        onClick={() => onEdit(item)}
                        disabled={isBusy}
                        title="Edit interview"
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>

                    <button
                        onClick={() => onDelete(item.id)}
                        disabled={isBusy}
                        title="Delete interview"
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-600 transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
