"use client";

type TaskSummaryCardsProps = {
    total: number;
    pending: number;
    completed: number;
};

export default function TaskSummaryCards({
    total,
    pending,
    completed,
}: TaskSummaryCardsProps) {
    return (
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-xl border bg-background p-4 shadow-xs">
                <span className="text-xs font-medium text-muted-foreground">Total Action Items</span>
                <p className="text-2xl font-bold text-foreground mt-1">{total}</p>
            </div>
            <div className="rounded-xl border bg-background p-4 shadow-xs">
                <span className="text-xs font-medium text-amber-600">Pending To-Dos</span>
                <p className="text-2xl font-bold text-amber-600 mt-1">{pending}</p>
            </div>
            <div className="rounded-xl border bg-background p-4 shadow-xs">
                <span className="text-xs font-medium text-emerald-600">Completed</span>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{completed}</p>
            </div>
        </div>
    );
}
