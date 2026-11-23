import { Clock, Flame, ArrowUpCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type TaskItem = {
    id: string;
    userId: string;
    applicationId: string | null;
    title: string;
    description: string | null;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    dueDate: Date | string | null;
    isCompleted: boolean;
    completedAt: Date | string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
    applicationPosition: string | null;
    companyName: string | null;
    companyLogo: string | null;
};

export type PriorityInfo = {
    label: string;
    icon: LucideIcon;
    className: string;
};

export function getPriorityBadge(priority: string): PriorityInfo {
    switch (priority) {
        case "URGENT":
            return {
                label: "Urgent",
                icon: Flame,
                className: "bg-red-500/10 text-red-600 border-red-200/50 dark:border-red-900/50",
            };
        case "HIGH":
            return {
                label: "High",
                icon: ArrowUpCircle,
                className: "bg-orange-500/10 text-orange-600 border-orange-200/50 dark:border-orange-900/50",
            };
        case "MEDIUM":
            return {
                label: "Medium",
                icon: Clock,
                className: "bg-blue-500/10 text-blue-600 border-blue-200/50 dark:border-blue-900/50",
            };
        default:
            return {
                label: "Low",
                icon: Clock,
                className: "bg-slate-500/10 text-slate-600 border-slate-200/50 dark:border-slate-800",
            };
    }
}

export function getDueDateBadge(dueDate?: Date | string | null, isCompleted?: boolean) {
    if (!dueDate) return null;
    const due = new Date(dueDate);

    if (isCompleted) {
        return {
            label: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(due),
            className: "text-muted-foreground",
        };
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dueDateOnly = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    const diffDays = Math.round((dueDateOnly.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return {
            label: `Overdue (${Math.abs(diffDays)}d ago)`,
            className: "text-red-600 font-semibold bg-red-500/10 border border-red-200 px-2 py-0.5 rounded-md",
        };
    }

    if (diffDays === 0) {
        return {
            label: "Due Today ⚡",
            className: "text-amber-600 font-bold bg-amber-500/10 border border-amber-200 px-2 py-0.5 rounded-md",
        };
    }

    if (diffDays === 1) {
        return {
            label: "Due Tomorrow",
            className: "text-blue-600 font-medium bg-blue-500/10 border border-blue-200 px-2 py-0.5 rounded-md",
        };
    }

    return {
        label: `Due ${new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(due)}`,
        className: "text-muted-foreground",
    };
}
