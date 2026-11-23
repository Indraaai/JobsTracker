"use client";

import {
    CheckCircle2,
    Square,
    Pencil,
    Trash2,
    Calendar,
    Briefcase,
} from "lucide-react";
import {
    type TaskItem,
    getPriorityBadge,
    getDueDateBadge,
} from "@/lib/utils/task-helpers";

type TaskCardProps = {
    item: TaskItem;
    onToggle: (item: TaskItem) => void;
    onEdit: (item: TaskItem) => void;
    onDelete: (id: string) => void;
    isBusy?: boolean;
};

export default function TaskCard({
    item,
    onToggle,
    onEdit,
    onDelete,
    isBusy,
}: TaskCardProps) {
    const prio = getPriorityBadge(item.priority);
    const PrioIcon = prio.icon;
    const dueBadge = getDueDateBadge(item.dueDate, item.isCompleted);

    return (
        <div
            className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border bg-background p-4 shadow-xs transition-all hover:border-primary/40 ${
                item.isCompleted ? "bg-muted/20 opacity-70" : ""
            }`}
        >
            <div className="flex items-start gap-3 flex-1 min-w-0">
                {/* Toggle Checkbox */}
                <button
                    type="button"
                    onClick={() => onToggle(item)}
                    disabled={isBusy}
                    className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                >
                    {item.isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />
                    ) : (
                        <Square className="h-5 w-5 hover:border-primary" />
                    )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3
                            className={`text-sm font-semibold tracking-tight text-foreground ${
                                item.isCompleted ? "line-through text-muted-foreground font-normal" : ""
                            }`}
                        >
                            {item.title}
                        </h3>

                        {/* Priority Pill */}
                        <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${prio.className}`}
                        >
                            <PrioIcon className="h-3 w-3" />
                            {prio.label}
                        </span>
                    </div>

                    {item.description && (
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                            {item.description}
                        </p>
                    )}

                    {/* Metadata */}
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        {item.companyName && (
                            <div className="flex items-center gap-1 font-medium text-foreground">
                                <Briefcase className="h-3 w-3 text-primary" />
                                <span>{item.applicationPosition ?? "Job"}</span>
                                <span>@</span>
                                <span>{item.companyName}</span>
                            </div>
                        )}

                        {dueBadge && (
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span className={dueBadge.className}>{dueBadge.label}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-1 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                <button
                    onClick={() => onEdit(item)}
                    disabled={isBusy}
                    title="Edit Task"
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
                >
                    <Pencil className="h-4 w-4" />
                </button>

                <button
                    onClick={() => onDelete(item.id)}
                    disabled={isBusy}
                    title="Delete Task"
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-600 transition-colors disabled:opacity-50"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
