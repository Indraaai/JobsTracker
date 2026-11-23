"use client";

import { useMemo, useState } from "react";
import {
    BriefcaseBusiness,
    Plus,
    Search,
    Loader2,
    LayoutList,
    Kanban,
} from "lucide-react";
import {
    useApplications,
    useDeleteApplication,
    useUpdateApplication,
} from "@/hooks/use-applications";
import {
    type ApplicationItem,
    applicationStatuses,
} from "@/lib/utils/application-helpers";
import ApplicationCard from "./application-card";
import ApplicationKanban from "./application-kanban";
import ApplicationForm from "./application-form";
import InterviewForm from "@/components/interviews/interview-form";
import TaskForm from "@/components/tasks/task-form";

export default function ApplicationList({
    initialData,
}: {
    initialData?: ApplicationItem[];
}) {
    const { data: applications = [], isLoading, error } = useApplications(initialData);
    const deleteMutation = useDeleteApplication();
    const updateMutation = useUpdateApplication();

    const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
    const [filter, setFilter] = useState<(typeof applicationStatuses)[number]>("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [selectedApplication, setSelectedApplication] =
        useState<ApplicationItem | null>(null);

    // Shortcuts for Inter-Module Actions
    const [selectedForInterview, setSelectedForInterview] =
        useState<ApplicationItem | null>(null);
    const [selectedForTask, setSelectedForTask] =
        useState<ApplicationItem | null>(null);

    const filteredApplications = useMemo(() => {
        return applications.filter((app) => {
            if (filter !== "ALL" && app.status !== filter) return false;

            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchPos = app.position.toLowerCase().includes(q);
                const matchComp = app.companyName?.toLowerCase().includes(q) ?? false;
                const matchLoc = app.location?.toLowerCase().includes(q) ?? false;
                return matchPos || matchComp || matchLoc;
            }

            return true;
        });
    }, [applications, filter, searchQuery]);

    const handleAdd = () => {
        setSelectedApplication(null);
        setShowForm(true);
    };

    const handleEdit = (app: ApplicationItem) => {
        setSelectedApplication(app);
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this application?")) {
            deleteMutation.mutate(id);
        }
    };

    const handleStatusChange = (
        appOrId: ApplicationItem | string,
        newStatus: ApplicationItem["status"],
    ) => {
        const id = typeof appOrId === "string" ? appOrId : appOrId.id;
        updateMutation.mutate({
            id,
            data: { status: newStatus },
        });
    };

    return (
        <div className="space-y-6">
            {/* Header with View Toggle & New Button */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        Job Applications
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Track sent applications, interviews, salaries, and current status.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    {/* View Mode Toggle */}
                    <div className="flex items-center rounded-lg border bg-muted/40 p-1">
                        <button
                            type="button"
                            onClick={() => setViewMode("table")}
                            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                                viewMode === "table"
                                    ? "bg-background text-foreground shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <LayoutList className="h-3.5 w-3.5" />
                            Table
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode("kanban")}
                            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                                viewMode === "kanban"
                                    ? "bg-background text-foreground shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <Kanban className="h-3.5 w-3.5" />
                            Board
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={handleAdd}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        New Application
                    </button>
                </div>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
                    {applicationStatuses.map((status) => {
                        const isActive = filter === status;
                        return (
                            <button
                                key={status}
                                type="button"
                                onClick={() => setFilter(status)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors shrink-0 ${
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-xs"
                                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                            >
                                {status}
                            </button>
                        );
                    })}
                </div>

                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search position or company..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border bg-background pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            {/* Content Area */}
            {isLoading && applications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-3 text-sm text-muted-foreground">Loading applications...</p>
                </div>
            ) : error ? (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                    Failed to load applications: {error.message}
                </div>
            ) : filteredApplications.length === 0 ? (
                <div className="rounded-2xl border border-dashed bg-background p-12 text-center max-w-md mx-auto">
                    <BriefcaseBusiness className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h2 className="mt-4 font-bold text-foreground">
                        {applications.length === 0 ? "No applications yet" : "No applications match filter"}
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {applications.length === 0
                            ? "Add your first job application to track its progress from screening to offer."
                            : "Try switching status filter tabs or clearing your search term."}
                    </p>
                    {applications.length === 0 && (
                        <button
                            type="button"
                            onClick={handleAdd}
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            New Application
                        </button>
                    )}
                </div>
            ) : viewMode === "kanban" ? (
                /* Kanban Board View */
                <ApplicationKanban
                    applications={filteredApplications}
                    onStatusChange={handleStatusChange}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onScheduleInterview={(app) => setSelectedForInterview(app)}
                    onAddTask={(app) => setSelectedForTask(app)}
                    onNewApplication={handleAdd}
                    isBusy={updateMutation.isPending || deleteMutation.isPending}
                />
            ) : (
                /* Table View */
                <div className="overflow-x-auto rounded-xl border bg-background shadow-xs -mx-4 sm:mx-0">
                    <table className="w-full min-w-[620px] text-left border-collapse">
                        <thead>
                            <tr className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground">
                                <th className="px-4 py-3">Position & Company</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 hidden sm:table-cell">Type</th>
                                <th className="px-4 py-3 hidden md:table-cell">Salary</th>
                                <th className="px-4 py-3 hidden lg:table-cell">Applied</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border text-sm">
                            {filteredApplications.map((app) => (
                                <ApplicationCard
                                    key={app.id}
                                    application={app}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onStatusChange={handleStatusChange}
                                    onScheduleInterview={(item) => setSelectedForInterview(item)}
                                    onAddTask={(item) => setSelectedForTask(item)}
                                    isBusy={updateMutation.isPending || deleteMutation.isPending}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal: Application Form */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border bg-background p-4 sm:p-6 shadow-xl">
                        <ApplicationForm
                            application={selectedApplication}
                            onSuccess={() => {
                                setShowForm(false);
                                setSelectedApplication(null);
                            }}
                            onCancel={() => {
                                setShowForm(false);
                                setSelectedApplication(null);
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Modal: Quick Schedule Interview Shortcut */}
            {selectedForInterview && (
                <InterviewForm
                    initialApplicationId={selectedForInterview.id}
                    onSuccess={() => setSelectedForInterview(null)}
                    onCancel={() => setSelectedForInterview(null)}
                />
            )}

            {/* Modal: Quick Add Task Shortcut */}
            {selectedForTask && (
                <TaskForm
                    initialApplicationId={selectedForTask.id}
                    onSuccess={() => setSelectedForTask(null)}
                    onCancel={() => setSelectedForTask(null)}
                />
            )}
        </div>
    );
}
