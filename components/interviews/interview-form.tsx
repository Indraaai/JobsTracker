"use client";

import { useEffect, useState } from "react";
import {
    Video,
    MapPin,
    X,
    Loader2,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { INTERVIEWS_QUERY_KEY } from "@/hooks/use-interviews";
import type { InterviewItem } from "@/lib/utils/interview-helpers";

type ApplicationOption = {
    id: string;
    position: string;
    companyId: string;
};

type CompanyOption = {
    id: string;
    name: string;
};

type InterviewFormProps = {
    interview?: InterviewItem | null;
    initialApplicationId?: string;
    onSuccess: () => void;
    onCancel: () => void;
};

const stages = [
    { value: "HR_SCREENING", label: "HR Screening" },
    { value: "TECHNICAL_TEST", label: "Technical Test / Live Coding" },
    { value: "USER_INTERVIEW", label: "User / Team Lead Interview" },
    { value: "SYSTEM_DESIGN", label: "System Design" },
    { value: "CULTURE_FIT", label: "Culture Fit / Values" },
    { value: "FINAL_OFFER", label: "Final / Offer Discussion" },
    { value: "OTHER", label: "Other" },
] as const;

const formats = [
    { value: "ONLINE_GOOGLE_MEET", label: "Google Meet" },
    { value: "ONLINE_ZOOM", label: "Zoom Meeting" },
    { value: "ONLINE_TEAMS", label: "Microsoft Teams" },
    { value: "PHONE_CALL", label: "Phone Call" },
    { value: "ONSITE", label: "Onsite (Office)" },
] as const;

const results = [
    { value: "PENDING", label: "Pending" },
    { value: "PASSED", label: "Passed 🎉" },
    { value: "FAILED", label: "Failed / Not Selected" },
] as const;

// Helper to format ISO date string for datetime-local input
function toLocalDateTimeString(isoString?: Date | string | null) {
    if (!isoString) {
        // default to tomorrow at 10:00 AM
        const now = new Date();
        now.setDate(now.getDate() + 1);
        now.setHours(10, 0, 0, 0);
        return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
    }

    const d = new Date(isoString);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
}

export default function InterviewForm({
    interview,
    initialApplicationId,
    onSuccess,
    onCancel,
}: InterviewFormProps) {
    const isEdit = Boolean(interview?.id);
    const queryClient = useQueryClient();

    const [applications, setApplications] = useState<ApplicationOption[]>([]);
    const [companies, setCompanies] = useState<CompanyOption[]>([]);
    const [loadingApps, setLoadingApps] = useState(true);

    const [form, setForm] = useState({
        applicationId:
            interview?.applicationId ?? initialApplicationId ?? "",
        title: interview?.title ?? "",
        stage: interview?.stage ?? "HR_SCREENING",
        format: interview?.format ?? "ONLINE_GOOGLE_MEET",
        scheduledAt: toLocalDateTimeString(interview?.scheduledAt),
        meetingUrl: interview?.meetingUrl ?? "",
        location: interview?.location ?? "",
        notes: interview?.notes ?? "",
        feedback: interview?.feedback ?? "",
        result: interview?.result ?? "PENDING",
        isCompleted: interview?.isCompleted ?? false,
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

                if (appsData.success && appsData.data.length > 0) {
                    setApplications(appsData.data);
                    setForm((prev) => ({
                        ...prev,
                        applicationId: prev.applicationId || appsData.data[0].id,
                    }));
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

    // Helper map company id -> company name
    const companyMap = new Map(companies.map((c) => [c.id, c.name]));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (!form.applicationId) {
                throw new Error("Please select a target application");
            }

            if (!form.title.trim()) {
                throw new Error("Interview title is required");
            }

            if (!form.scheduledAt) {
                throw new Error("Scheduled date and time is required");
            }

            const payload = {
                applicationId: form.applicationId,
                title: form.title.trim(),
                stage: form.stage,
                format: form.format,
                scheduledAt: new Date(form.scheduledAt).toISOString(),
                meetingUrl: form.meetingUrl.trim() || undefined,
                location: form.location.trim() || undefined,
                notes: form.notes.trim() || undefined,
                feedback: form.feedback.trim() || undefined,
                result: form.result,
                isCompleted: form.isCompleted,
            };

            const url = isEdit
                ? `/api/interviews/${interview?.id}`
                : "/api/interviews";
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Failed to save interview");
            }

            queryClient.invalidateQueries({ queryKey: INTERVIEWS_QUERY_KEY });
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border bg-background p-6 shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-4">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-foreground">
                            {isEdit ? "Edit Interview Schedule" : "Schedule New Interview"}
                        </h2>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Keep track of stage, meeting links, and post-interview notes.
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
                    {/* Target Application */}
                    <div>
                        <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                            Target Job Application *
                        </label>
                        {loadingApps ? (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                Loading your applications...
                            </div>
                        ) : applications.length === 0 ? (
                            <div className="rounded-lg border border-dashed p-3 text-center text-xs text-muted-foreground">
                                No applications found. Please create a job application first before scheduling an interview.
                            </div>
                        ) : (
                            <select
                                value={form.applicationId}
                                onChange={(e) =>
                                    setForm({ ...form, applicationId: e.target.value })
                                }
                                disabled={loading}
                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            >
                                <option value="" disabled>
                                    Select an application...
                                </option>
                                {applications.map((app) => (
                                    <option key={app.id} value={app.id}>
                                        {app.position} — {companyMap.get(app.companyId) ?? "Company"}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Interview Title */}
                    <div>
                        <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                            Interview Title *
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. HR Initial Screening, System Design with Tech Lead"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            disabled={loading}
                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>

                    {/* Stage & Format Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                                Interview Stage
                            </label>
                            <select
                                value={form.stage}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        stage: e.target.value as (typeof stages)[number]["value"],
                                    })
                                }
                                disabled={loading}
                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                {stages.map((s) => (
                                    <option key={s.value} value={s.value}>
                                        {s.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                                Format / Medium
                            </label>
                            <select
                                value={form.format}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        format: e.target.value as (typeof formats)[number]["value"],
                                    })
                                }
                                disabled={loading}
                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                {formats.map((f) => (
                                    <option key={f.value} value={f.value}>
                                        {f.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Scheduled Date & Time */}
                    <div>
                        <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                            Scheduled Date & Time *
                        </label>
                        <div className="relative">
                            <input
                                type="datetime-local"
                                value={form.scheduledAt}
                                onChange={(e) =>
                                    setForm({ ...form, scheduledAt: e.target.value })
                                }
                                disabled={loading}
                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>
                    </div>

                    {/* Meeting Link / Location */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                                Meeting Link (Google Meet / Zoom)
                            </label>
                            <div className="relative">
                                <Video className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="url"
                                    placeholder="https://meet.google.com/..."
                                    value={form.meetingUrl}
                                    onChange={(e) =>
                                        setForm({ ...form, meetingUrl: e.target.value })
                                    }
                                    disabled={loading}
                                    className="w-full rounded-lg border bg-background pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                                Office / Location (if onsite)
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Floor 12, Tower B..."
                                    value={form.location}
                                    onChange={(e) =>
                                        setForm({ ...form, location: e.target.value })
                                    }
                                    disabled={loading}
                                    className="w-full rounded-lg border bg-background pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preparation Notes */}
                    <div>
                        <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                            Preparation Notes & Topics
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Things to prepare, questions to ask the interviewer, recruiter tips..."
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            disabled={loading}
                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Post-Interview Result & Feedback */}
                    <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                                Post-Interview Outcome
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
                                Mark as Completed
                            </label>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1">
                                    Result
                                </label>
                                <select
                                    value={form.result}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            result: e.target.value as (typeof results)[number]["value"],
                                        })
                                    }
                                    disabled={loading}
                                    className="w-full rounded-lg border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    {results.map((r) => (
                                        <option key={r.value} value={r.value}>
                                            {r.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-muted-foreground mb-1">
                                    Feedback / Reflection
                                </label>
                                <input
                                    type="text"
                                    placeholder="How did it go? Feedback received..."
                                    value={form.feedback}
                                    onChange={(e) =>
                                        setForm({ ...form, feedback: e.target.value })
                                    }
                                    disabled={loading}
                                    className="w-full rounded-lg border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                    </div>

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
                            disabled={loading || applications.length === 0}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isEdit ? "Update Schedule" : "Schedule Interview"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
