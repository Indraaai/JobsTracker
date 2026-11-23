"use client";

import { useMemo, useState } from "react";
import { Plus, Search, CheckSquare, Loader2 } from "lucide-react";
import {
    useTasks,
    useToggleTaskComplete,
    useCreateTask,
    useDeleteTask,
} from "@/hooks/use-tasks";
import type { TaskItem } from "@/lib/utils/task-helpers";
import TaskSummaryCards from "./task-summary-cards";
import TaskQuickAdd from "./task-quick-add";
import TaskCard from "./task-card";
import TaskForm from "./task-form";

const filterTabs = [
    { key: "ALL", label: "All Tasks" },
    { key: "PENDING", label: "To-Do" },
    { key: "COMPLETED", label: "Completed" },
    { key: "HIGH_PRIORITY", label: "High / Urgent 🔥" },
] as const;

export default function TaskList({ initialData }: { initialData?: TaskItem[] }) {
    const { data: tasks = [], isLoading, error } = useTasks(initialData);
    const toggleCompleteMutation = useToggleTaskComplete();
    const createTaskMutation = useCreateTask();
    const deleteTaskMutation = useDeleteTask();

    const [activeTab, setActiveTab] =
        useState<(typeof filterTabs)[number]["key"]>("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

    // Summary calculations
    const totalCount = tasks.length;
    const completedCount = useMemo(() => tasks.filter((t) => t.isCompleted).length, [tasks]);
    const pendingCount = totalCount - completedCount;

    // Filtered tasks
    const filteredTasks = useMemo(() => {
        return tasks.filter((item) => {
            if (activeTab === "PENDING" && item.isCompleted) return false;
            if (activeTab === "COMPLETED" && !item.isCompleted) return false;
            if (activeTab === "HIGH_PRIORITY" && !["HIGH", "URGENT"].includes(item.priority)) return false;

            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const matchTitle = item.title.toLowerCase().includes(query);
                const matchDesc = item.description?.toLowerCase().includes(query) ?? false;
                const matchCompany = item.companyName?.toLowerCase().includes(query) ?? false;
                const matchRole = item.applicationPosition?.toLowerCase().includes(query) ?? false;
                return matchTitle || matchDesc || matchCompany || matchRole;
            }

            return true;
        });
    }, [tasks, activeTab, searchQuery]);

    const handleQuickAdd = async (title: string, priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT") => {
        await createTaskMutation.mutateAsync({ title, priority });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        Tasks & To-Dos
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Track recruitment action items, take-home tests, and follow-ups.
                    </p>
                </div>

                <button
                    onClick={() => {
                        setSelectedTask(null);
                        setShowForm(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    New Task
                </button>
            </div>

            {/* Quick Summary Cards */}
            <TaskSummaryCards
                total={totalCount}
                pending={pendingCount}
                completed={completedCount}
            />

            {/* Quick Add Bar */}
            <TaskQuickAdd onAdd={handleQuickAdd} />

            {/* Filter Tabs & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                <div className="flex flex-wrap items-center gap-1.5">
                    {filterTabs.map((tab) => {
                        const isActive = activeTab === tab.key;
                        let count = totalCount;
                        if (tab.key === "PENDING") count = pendingCount;
                        if (tab.key === "COMPLETED") count = completedCount;
                        if (tab.key === "HIGH_PRIORITY") {
                            count = tasks.filter((t) => ["HIGH", "URGENT"].includes(t.priority)).length;
                        }

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
                                <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${
                                    isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                                }`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border bg-background pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            {/* Tasks List */}
            {isLoading && tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-3 text-sm text-muted-foreground">Loading tasks...</p>
                </div>
            ) : error ? (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-sm text-red-600">
                    Failed to load tasks: {error.message}
                </div>
            ) : filteredTasks.length === 0 ? (
                <div className="rounded-2xl border border-dashed bg-background p-12 text-center max-w-lg mx-auto">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                        <CheckSquare className="h-7 w-7" />
                    </div>
                    <h3 className="mt-4 text-base font-bold text-foreground">
                        {tasks.length === 0 ? "No action items yet" : "No tasks match this filter"}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                        {tasks.length === 0
                            ? "Keep track of recruitment to-dos like take-home tests and recruiter follow-ups."
                            : "Try switching tabs or clearing your search query."}
                    </p>
                    {tasks.length === 0 && (
                        <button
                            onClick={() => {
                                setSelectedTask(null);
                                setShowForm(true);
                            }}
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Create First Task
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-2.5">
                    {filteredTasks.map((item) => (
                        <TaskCard
                            key={item.id}
                            item={item}
                            onToggle={(task) =>
                                toggleCompleteMutation.mutate({
                                    id: task.id,
                                    isCompleted: !task.isCompleted,
                                })
                            }
                            onEdit={(task) => {
                                setSelectedTask(task);
                                setShowForm(true);
                            }}
                            onDelete={(id) => {
                                if (confirm("Are you sure you want to delete this task?")) {
                                    deleteTaskMutation.mutate(id);
                                }
                            }}
                            isBusy={
                                toggleCompleteMutation.isPending ||
                                deleteTaskMutation.isPending
                            }
                        />
                    ))}
                </div>
            )}

            {/* Modal Form */}
            {showForm && (
                <TaskForm
                    task={selectedTask}
                    onSuccess={() => {
                        setShowForm(false);
                        setSelectedTask(null);
                    }}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedTask(null);
                    }}
                />
            )}
        </div>
    );
}
