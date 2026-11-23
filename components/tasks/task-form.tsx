"use client";

import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { TASKS_QUERY_KEY } from "@/hooks/use-tasks";
import type { TaskItem } from "@/lib/utils/task-helpers";

type ApplicationOption = {
    id: string;
    position: string;
    companyId: string;
};

type CompanyOption = {
    id: string;
    name: string;
};

type TaskFormProps = {
    task?: TaskItem | null;
    initialApplicationId?: string;
    onSuccess: () => void;
    onCancel: () => void;
};

const priorities = [
    { value: "LOW", label: "Low Priority", color: "bg-slate-100 text-slate-700 border-slate-200" },
    { value: "MEDIUM", label: "Medium", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { value: "HIGH", label: "High", color: "bg-orange-50 text-orange-700 border-orange-200" },
    { value: "URGENT", label: "Urgent 🚨", color: "bg-red-50 text-red-700 border-red-200" },
] as const;

const commonPresets = [
    "Follow-up with Recruiter",
    "Submit Take-Home Assignment",
    "Prepare System Design Notes",
    "Send Thank You Email",
    "Update Portfolio & Resume",
    "Review Company Tech Stack",
];

export default function TaskForm({
    task,
    initialApplicationId,
    onSuccess,
    onCancel,
}: TaskFormProps) {
    const isEdit = Boolean(task?.id);
    const queryClient = useQueryClient();

    const [applications, setApplications] = useState<ApplicationOption[]>([]);
    const [companies, setCompanies] = useState<CompanyOption[]>([]);
    const [loadingApps, setLoadingApps] = useState(true);

    const [form, setForm] = useState({
        applicationId: task?.applicationId ?? initialApplicationId ?? "",
        title: task?.title ?? "",
        description: task?.description ?? "",
        priority: task?.priority ?? "MEDIUM",
        dueDate: task?.dueDate
            ? (typeof task.dueDate === "string"
                ? task.dueDate
                : new Date(task.dueDate).toISOString()
              ).slice(0, 10)
            : "",
        isCompleted: task?.isCompleted ?? false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadOptions() {
            try {
                const [appsRes, compsRes] = await Promise.all([
                    fetch("/api/applications"),
                    fetch("/api/companies"),
                ]);

                const appsData = await appsRes.json();
                const compsData = await compsRes.json();

                if (appsData.success) {
                    setApplications(appsData.data);
                }

                if (compsData.success) {
                    setCompanies(compsData.data);
                }
            } catch (err) {
                console.error("Failed to load options", err);
            } finally {
                setLoadingApps(false);
            }
        }

        loadOptions();
    }, []);

    const companyMap = new Map(companies.map((c) => [c.id, c.name]));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (!form.title.trim()) {
                throw new Error("Task title is required");
            }

            const payload = {
                applicationId: form.applicationId ? form.applicationId : null,
                title: form.title.trim(),
                description: form.description.trim() || undefined,
                priority: form.priority,
                dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
                isCompleted: form.isCompleted,
            };

            const url = isEdit ? `/api/tasks/${task?.id}` : "/api/tasks";
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Failed to save task");
            }

            queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border bg-background p-6 shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-4">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-foreground">
                            {isEdit ? "Edit Task" : "New Action Item"}
                        </h2>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Keep track of recruitment deadlines and follow-ups.
                        </p>
                    </div>

                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {error && (
                    <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    {/* Quick Presets */}
                    {!isEdit && (
                        <div>
                            <span className="block text-[11px] font-medium text-muted-foreground mb-1.5">
                                Quick suggestions:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {commonPresets.map((preset) => (
                                    <button
                                        type="button"
                                        key={preset}
                                        onClick={() => setForm((prev) => ({ ...prev, title: preset }))}
                                        className="rounded-full bg-muted/80 px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                                    >
                                        + {preset}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Task Title */}
                    <div>
                        <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                            Task Title *
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Submit Take-Home Test, Follow-up Email"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            disabled={loading}
                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>

                    {/* Linked Job Application */}
                    <div>
                        <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                            Linked Job Application (Optional)
                        </label>
                        {loadingApps ? (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                Loading applications...
                            </div>
                        ) : (
                            <select
                                value={form.applicationId}
                                onChange={(e) =>
                                    setForm({ ...form, applicationId: e.target.value })
                                }
                                disabled={loading}
                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">General Task (No linked application)</option>
                                {applications.map((app) => (
                                    <option key={app.id} value={app.id}>
                                        {app.position} — {companyMap.get(app.companyId) ?? "Company"}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Priority & Due Date Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                                Priority Level
                            </label>
                            <select
                                value={form.priority}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        priority: e.target.value as (typeof priorities)[number]["value"],
                                    })
                                }
                                disabled={loading}
                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                {priorities.map((p) => (
                                    <option key={p.value} value={p.value}>
                                        {p.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                                Due Date (Optional)
                            </label>
                            <input
                                type="date"
                                value={form.dueDate}
                                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                                disabled={loading}
                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* Description Notes */}
                    <div>
                        <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                            Details & Notes (Optional)
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Add submission guidelines, recruiter email, or checklist items..."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            disabled={loading}
                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Status Checkbox */}
                    {isEdit && (
                        <div className="rounded-xl border bg-muted/30 p-3 flex items-center justify-between">
                            <span className="text-xs font-semibold text-foreground">
                                Mark Task as Completed
                            </span>
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground">
                                <input
                                    type="checkbox"
                                    checked={form.isCompleted}
                                    onChange={(e) =>
                                        setForm({ ...form, isCompleted: e.target.checked })
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                Done
                            </label>
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="flex items-center justify-end gap-3 border-t pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isEdit ? "Save Changes" : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
