"use client";

import { useEffect, useMemo, useState } from "react";
import {
    CalendarDays,
    CalendarCheck,
    Video,
    MapPin,
    Building2,
    Plus,
    Pencil,
    Trash2,
    ExternalLink,
    Clock,
    Search,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Loader2,
} from "lucide-react";
import InterviewForm, { type InterviewItem } from "./interview-form";

const filterTabs = [
    { key: "ALL", label: "All" },
    { key: "UPCOMING", label: "Upcoming" },
    { key: "COMPLETED", label: "Completed" },
    { key: "PASSED", label: "Passed 🎉" },
    { key: "FAILED", label: "Failed" },
] as const;

function getStageBadge(stage: string) {
    switch (stage) {
        case "HR_SCREENING":
            return {
                label: "HR Screening",
                className: "bg-blue-500/10 text-blue-600 border-blue-200/50",
            };
        case "TECHNICAL_TEST":
            return {
                label: "Technical Test",
                className: "bg-purple-500/10 text-purple-600 border-purple-200/50",
            };
        case "USER_INTERVIEW":
            return {
                label: "User Interview",
                className: "bg-indigo-500/10 text-indigo-600 border-indigo-200/50",
            };
        case "SYSTEM_DESIGN":
            return {
                label: "System Design",
                className: "bg-fuchsia-500/10 text-fuchsia-600 border-fuchsia-200/50",
            };
        case "CULTURE_FIT":
            return {
                label: "Culture Fit",
                className: "bg-teal-500/10 text-teal-600 border-teal-200/50",
            };
        case "FINAL_OFFER":
            return {
                label: "Final / Offer",
                className: "bg-emerald-500/10 text-emerald-600 border-emerald-200/50",
            };
        default:
            return {
                label: "Other",
                className: "bg-slate-500/10 text-slate-600 border-slate-200/50",
            };
    }
}

function getFormatBadge(format: string) {
    switch (format) {
        case "ONLINE_GOOGLE_MEET":
            return { label: "Google Meet", icon: Video };
        case "ONLINE_ZOOM":
            return { label: "Zoom", icon: Video };
        case "ONLINE_TEAMS":
            return { label: "MS Teams", icon: Video };
        case "PHONE_CALL":
            return { label: "Phone Call", icon: Clock };
        case "ONSITE":
            return { label: "Onsite", icon: MapPin };
        default:
            return { label: "Online", icon: Video };
    }
}

function formatSchedule(dateString: string) {
    const date = new Date(dateString);
    const dayFormatter = new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    const timeFormatter = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    return {
        dateStr: dayFormatter.format(date),
        timeStr: `${timeFormatter.format(date)}`,
    };
}

function getRelativeTimeBadge(dateString: string, isCompleted?: boolean) {
    if (isCompleted) {
        return {
            label: "Finished",
            className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
        };
    }

    const now = new Date();
    const date = new Date(dateString);
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs < 0) {
        return {
            label: "Past Due",
            className: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400",
        };
    }

    if (diffHours < 24) {
        return {
            label: diffHours <= 1 ? "In ~1 hour ⚡" : `Today (${diffHours}h left) ⚡`,
            className: "bg-red-100 text-red-800 font-bold dark:bg-red-950/50 dark:text-red-400",
        };
    }

    if (diffDays === 1) {
        return {
            label: "Tomorrow",
            className: "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400",
        };
    }

    return {
        label: `In ${diffDays} days`,
        className: "bg-muted text-muted-foreground",
    };
}

export default function InterviewList() {
    const [interviews, setInterviews] = useState<InterviewItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [activeTab, setActiveTab] =
        useState<(typeof filterTabs)[number]["key"]>("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [selectedInterview, setSelectedInterview] =
        useState<InterviewItem | null>(null);

    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

    async function loadInterviews() {
        try {
            const res = await fetch("/api/interviews");
            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.message || "Failed to load interviews");
            }

            setInterviews(json.data ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    async function refreshInterviews() {
        setLoading(true);
        setError("");
        await loadInterviews();
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadInterviews();
    }, []);

    // Quick toggle complete status
    async function toggleComplete(item: InterviewItem) {
        try {
            setActionLoadingId(item.id!);
            const res = await fetch(`/api/interviews/${item.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    isCompleted: !item.isCompleted,
                }),
            });

            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.message || "Failed to update interview");
            }

            setInterviews((prev) =>
                prev.map((i) =>
                    i.id === item.id ? { ...i, isCompleted: !i.isCompleted } : i,
                ),
            );
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to toggle status");
        } finally {
            setActionLoadingId(null);
        }
    }

    // Delete interview
    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this interview schedule?")) {
            return;
        }

        try {
            setActionLoadingId(id);
            const res = await fetch(`/api/interviews/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.message || "Failed to delete interview");
            }

            setInterviews((prev) => prev.filter((i) => i.id !== id));
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to delete interview");
        } finally {
            setActionLoadingId(null);
        }
    }

    // Filtered items
    const filteredInterviews = useMemo(() => {
        return interviews.filter((item) => {
            // Tab filter
            if (activeTab === "UPCOMING") {
                if (item.isCompleted) return false;
            } else if (activeTab === "COMPLETED") {
                if (!item.isCompleted) return false;
            } else if (activeTab === "PASSED") {
                if (item.result !== "PASSED") return false;
            } else if (activeTab === "FAILED") {
                if (item.result !== "FAILED") return false;
            }

            // Search query filter
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const matchCompany =
                    item.companyName?.toLowerCase().includes(query) ?? false;
                const matchPos =
                    item.applicationPosition?.toLowerCase().includes(query) ?? false;
                const matchTitle = item.title.toLowerCase().includes(query);
                return matchCompany || matchPos || matchTitle;
            }

            return true;
        });
    }, [interviews, activeTab, searchQuery]);

    // Counts for tabs
    const upcomingCount = useMemo(
        () => interviews.filter((i) => !i.isCompleted).length,
        [interviews],
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        Interviews
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage your upcoming interview schedules, preparation notes, and outcomes.
                    </p>
                </div>

                <button
                    onClick={() => {
                        setSelectedInterview(null);
                        setShowForm(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Schedule Interview
                </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                {/* Tabs */}
                <div className="flex flex-wrap items-center gap-1.5">
                    {filterTabs.map((tab) => {
                        const isActive = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-xs"
                                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                            >
                                {tab.label}
                                {tab.key === "UPCOMING" && upcomingCount > 0 && (
                                    <span className="ml-1.5 rounded-full bg-primary-foreground/20 px-1.5 py-0.5 text-[10px]">
                                        {upcomingCount}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search company or title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border bg-background pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-3 text-sm text-muted-foreground">
                        Loading interview schedules...
                    </p>
                </div>
            ) : error ? (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-sm text-red-600">
                    <AlertCircle className="mx-auto h-6 w-6 mb-2" />
                    <p className="font-semibold">Failed to load interviews</p>
                    <p className="mt-1 text-xs opacity-90">{error}</p>
                    <button
                        onClick={refreshInterviews}
                        className="mt-4 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            ) : filteredInterviews.length === 0 ? (
                <div className="rounded-2xl border border-dashed bg-background p-12 text-center max-w-lg mx-auto">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                        <CalendarDays className="h-7 w-7" />
                    </div>
                    <h3 className="mt-4 text-base font-bold text-foreground">
                        {interviews.length === 0
                            ? "No interviews scheduled yet"
                            : "No interviews match this filter"}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                        {interviews.length === 0
                            ? "Schedule your technical rounds, HR screenings, or final offer discussions to stay on top of your recruitment pipeline."
                            : "Try switching tabs or clearing your search term."}
                    </p>
                    {interviews.length === 0 && (
                        <button
                            onClick={() => {
                                setSelectedInterview(null);
                                setShowForm(true);
                            }}
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Schedule Interview
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredInterviews.map((item) => {
                        const stageInfo = getStageBadge(item.stage);
                        const formatInfo = getFormatBadge(item.format);
                        const FormatIcon = formatInfo.icon;
                        const { dateStr, timeStr } = formatSchedule(item.scheduledAt);
                        const relBadge = getRelativeTimeBadge(
                            item.scheduledAt,
                            item.isCompleted,
                        );

                        return (
                            <div
                                key={item.id}
                                className={`group relative flex flex-col justify-between rounded-2xl border bg-background p-5 shadow-xs transition-all hover:shadow-md ${
                                    item.isCompleted ? "opacity-75" : ""
                                }`}
                            >
                                <div>
                                    {/* Top Row: Company, Position, Stage & Relative Time */}
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

                                    {/* Middle Row: Schedule Info & Medium */}
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
                                                <span className="truncate max-w-[150px]">
                                                    {item.location}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Notes & Feedback */}
                                    {(item.notes || item.feedback) && (
                                        <div className="mt-3 space-y-1.5 text-xs">
                                            {item.notes && (
                                                <div className="rounded-lg bg-muted/40 p-2 text-muted-foreground">
                                                    <span className="font-semibold text-foreground">
                                                        Prep notes:{" "}
                                                    </span>
                                                    {item.notes}
                                                </div>
                                            )}
                                            {item.feedback && (
                                                <div className="rounded-lg bg-primary/5 border border-primary/10 p-2 text-foreground">
                                                    <span className="font-semibold text-primary">
                                                        Feedback:{" "}
                                                    </span>
                                                    {item.feedback}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Result Badge */}
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
                                <div className="mt-5 flex items-center justify-between border-t pt-3">
                                    <div className="flex items-center gap-2">
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
                                    </div>

                                    <div className="flex items-center gap-1">
                                        {/* Toggle Completed */}
                                        <button
                                            onClick={() => toggleComplete(item)}
                                            disabled={actionLoadingId === item.id}
                                            title={
                                                item.isCompleted
                                                    ? "Mark as upcoming"
                                                    : "Mark as completed"
                                            }
                                            className={`rounded-lg p-1.5 text-xs font-medium transition-colors ${
                                                item.isCompleted
                                                    ? "text-emerald-600 hover:bg-emerald-500/10"
                                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            }`}
                                        >
                                            <CalendarCheck className="h-4 w-4" />
                                        </button>

                                        {/* Edit */}
                                        <button
                                            onClick={() => {
                                                setSelectedInterview(item);
                                                setShowForm(true);
                                            }}
                                            disabled={actionLoadingId === item.id}
                                            title="Edit interview"
                                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>

                                        {/* Delete */}
                                        <button
                                            onClick={() => handleDelete(item.id!)}
                                            disabled={actionLoadingId === item.id}
                                            title="Delete interview"
                                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal Form */}
            {showForm && (
                <InterviewForm
                    interview={selectedInterview}
                    onSuccess={() => {
                        setShowForm(false);
                        setSelectedInterview(null);
                        refreshInterviews();
                    }}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedInterview(null);
                    }}
                />
            )}
        </div>
    );
}
