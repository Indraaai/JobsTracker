"use client";

import { useMemo, useState } from "react";
import { Plus, Search, CalendarDays, Loader2 } from "lucide-react";
import {
    useInterviews,
    useToggleInterviewComplete,
    useDeleteInterview,
} from "@/hooks/use-interviews";
import type { InterviewItem } from "@/lib/utils/interview-helpers";
import InterviewCard from "./interview-card";
import InterviewForm from "./interview-form";

const filterTabs = [
    { key: "ALL", label: "All" },
    { key: "UPCOMING", label: "Upcoming" },
    { key: "COMPLETED", label: "Completed" },
    { key: "PASSED", label: "Passed 🎉" },
    { key: "FAILED", label: "Failed" },
] as const;

export default function InterviewList({ initialData }: { initialData?: InterviewItem[] }) {
    const { data: interviews = [], isLoading, error } = useInterviews(initialData);
    const toggleCompleteMutation = useToggleInterviewComplete();
    const deleteMutation = useDeleteInterview();

    const [activeTab, setActiveTab] =
        useState<(typeof filterTabs)[number]["key"]>("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [selectedInterview, setSelectedInterview] =
        useState<InterviewItem | null>(null);

    const upcomingCount = useMemo(
        () => interviews.filter((i) => !i.isCompleted).length,
        [interviews],
    );

    const filteredInterviews = useMemo(() => {
        return interviews.filter((item) => {
            if (activeTab === "UPCOMING" && item.isCompleted) return false;
            if (activeTab === "COMPLETED" && !item.isCompleted) return false;
            if (activeTab === "PASSED" && item.result !== "PASSED") return false;
            if (activeTab === "FAILED" && item.result !== "FAILED") return false;

            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const matchCompany = item.companyName?.toLowerCase().includes(query) ?? false;
                const matchPos = item.applicationPosition?.toLowerCase().includes(query) ?? false;
                const matchTitle = item.title.toLowerCase().includes(query);
                return matchCompany || matchPos || matchTitle;
            }

            return true;
        });
    }, [interviews, activeTab, searchQuery]);

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
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Schedule Interview
                </button>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
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

            {/* Interviews Grid */}
            {isLoading && interviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-3 text-sm text-muted-foreground">Loading interview schedules...</p>
                </div>
            ) : error ? (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-sm text-red-600">
                    Failed to load interviews: {error.message}
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
                            ? "Schedule technical rounds, HR screenings, or final offer discussions."
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
                    {filteredInterviews.map((item) => (
                        <InterviewCard
                            key={item.id}
                            item={item}
                            onToggle={(interview) =>
                                toggleCompleteMutation.mutate({
                                    id: interview.id,
                                    isCompleted: !interview.isCompleted,
                                })
                            }
                            onEdit={(interview) => {
                                setSelectedInterview(interview);
                                setShowForm(true);
                            }}
                            onDelete={(id) => {
                                if (confirm("Are you sure you want to delete this interview schedule?")) {
                                    deleteMutation.mutate(id);
                                }
                            }}
                            isBusy={
                                toggleCompleteMutation.isPending ||
                                deleteMutation.isPending
                            }
                        />
                    ))}
                </div>
            )}

            {/* Modal Form */}
            {showForm && (
                <InterviewForm
                    interview={selectedInterview}
                    onSuccess={() => {
                        setShowForm(false);
                        setSelectedInterview(null);
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
