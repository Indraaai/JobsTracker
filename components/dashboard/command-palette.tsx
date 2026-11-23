"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    BriefcaseBusiness,
    Building2,
    Calendar,
    CalendarPlus,
    CheckSquare,
    LayoutDashboard,
    Plus,
    Search,
    UserCheck,
    X,
} from "lucide-react";
import { useApplications } from "@/hooks/use-applications";
import { useCompanies } from "@/hooks/use-companies";

type CommandItem = {
    id: string;
    title: string;
    subtitle?: string;
    category: "Navigation" | "Applications" | "Companies" | "Quick Action";
    icon: React.ComponentType<{ className?: string }>;
    onSelect: () => void;
};

type CommandPaletteProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);

    const { data: applications = [] } = useApplications();
    const { data: companies = [] } = useCompanies();

    const handleClose = useCallback(() => {
        setSearch("");
        setSelectedIndex(0);
        onClose();
    }, [onClose]);

    // Build the master list of command items
    const allItems: CommandItem[] = useMemo(() => {
        const items: CommandItem[] = [
            // Navigation
            {
                id: "nav-dashboard",
                title: "Dashboard Overview",
                subtitle: "Go to analytics and summary",
                category: "Navigation",
                icon: LayoutDashboard,
                onSelect: () => {
                    router.push("/dashboard");
                    handleClose();
                },
            },
            {
                id: "nav-applications",
                title: "Applications Pipeline",
                subtitle: "View and manage job applications",
                category: "Navigation",
                icon: BriefcaseBusiness,
                onSelect: () => {
                    router.push("/applications");
                    handleClose();
                },
            },
            {
                id: "nav-companies",
                title: "Companies Directory",
                subtitle: "View tracked companies",
                category: "Navigation",
                icon: Building2,
                onSelect: () => {
                    router.push("/companies");
                    handleClose();
                },
            },
            {
                id: "nav-interviews",
                title: "Interviews Schedule",
                subtitle: "Upcoming and past interviews",
                category: "Navigation",
                icon: Calendar,
                onSelect: () => {
                    router.push("/interviews");
                    handleClose();
                },
            },
            {
                id: "nav-tasks",
                title: "Tasks & To-Dos",
                subtitle: "Action items and follow-ups",
                category: "Navigation",
                icon: CheckSquare,
                onSelect: () => {
                    router.push("/tasks");
                    handleClose();
                },
            },
            {
                id: "nav-contacts",
                title: "Recruiter Contacts",
                subtitle: "Hiring managers and network directory",
                category: "Navigation",
                icon: UserCheck,
                onSelect: () => {
                    router.push("/contacts");
                    handleClose();
                },
            },

            // Quick Actions
            {
                id: "action-new-application",
                title: "Create New Application",
                subtitle: "Track a new job posting",
                category: "Quick Action",
                icon: Plus,
                onSelect: () => {
                    router.push("/applications");
                    handleClose();
                },
            },
            {
                id: "action-new-interview",
                title: "Schedule Interview",
                subtitle: "Set up a new interview event",
                category: "Quick Action",
                icon: CalendarPlus,
                onSelect: () => {
                    router.push("/interviews");
                    handleClose();
                },
            },
            {
                id: "action-new-task",
                title: "Add Task / To-Do",
                subtitle: "Create a reminder or follow-up item",
                category: "Quick Action",
                icon: CheckSquare,
                onSelect: () => {
                    router.push("/tasks");
                    handleClose();
                },
            },
            {
                id: "action-new-contact",
                title: "Add Recruiter Contact",
                subtitle: "Save recruiter or hiring contact details",
                category: "Quick Action",
                icon: UserCheck,
                onSelect: () => {
                    router.push("/contacts");
                    handleClose();
                },
            },
        ];

        // Add application search results
        for (const app of applications) {
            items.push({
                id: `app-${app.id}`,
                title: app.position,
                subtitle: `${app.companyName ?? "Company"} • ${app.status}`,
                category: "Applications",
                icon: BriefcaseBusiness,
                onSelect: () => {
                    router.push(`/applications/${app.id}`);
                    handleClose();
                },
            });
        }

        // Add company search results
        for (const company of companies) {
            items.push({
                id: `company-${company.id}`,
                title: company.name,
                subtitle: company.industry || company.location || "Company",
                category: "Companies",
                icon: Building2,
                onSelect: () => {
                    router.push("/companies");
                    handleClose();
                },
            });
        }

        return items;
    }, [applications, companies, router, handleClose]);

    // Filter items based on user search query
    const filteredItems = useMemo(() => {
        if (!search.trim()) {
            return allItems.filter(
                (item) => item.category === "Navigation" || item.category === "Quick Action",
            );
        }

        const query = search.toLowerCase();
        return allItems.filter(
            (item) =>
                item.title.toLowerCase().includes(query) ||
                (item.subtitle && item.subtitle.toLowerCase().includes(query)),
        );
    }, [allItems, search]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev < filteredItems.length - 1 ? prev + 1 : 0,
                );
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev > 0 ? prev - 1 : filteredItems.length - 1,
                );
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (filteredItems[selectedIndex]) {
                    filteredItems[selectedIndex].onSelect();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, filteredItems, selectedIndex, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 backdrop-blur-xs p-4 pt-16 sm:pt-24">
            <div className="w-full max-w-xl rounded-xl border bg-card shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
                {/* Search input header */}
                <div className="flex items-center px-4 border-b">
                    <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                    <input
                        type="text"
                        autoFocus
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setSelectedIndex(0);
                        }}
                        placeholder="Type a command or search applications, companies..."
                        className="w-full bg-transparent px-3 py-3.5 text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/60"
                    />
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Results list */}
                <div className="max-h-80 overflow-y-auto p-2 divide-y divide-border/40">
                    {filteredItems.length === 0 ? (
                        <div className="py-8 text-center text-xs text-muted-foreground">
                            No results found for &ldquo;{search}&rdquo;
                        </div>
                    ) : (
                        filteredItems.map((item, index) => {
                            const Icon = item.icon;
                            const isSelected = index === selectedIndex;

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={item.onSelect}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors ${
                                        isSelected
                                            ? "bg-primary text-primary-foreground font-medium"
                                            : "text-foreground hover:bg-muted/60"
                                    }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div
                                            className={`p-1.5 rounded-md shrink-0 ${
                                                isSelected
                                                    ? "bg-primary-foreground/20 text-primary-foreground"
                                                    : "bg-muted text-muted-foreground"
                                            }`}
                                        >
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div className="truncate">
                                            <p className="truncate font-medium leading-none">
                                                {item.title}
                                            </p>
                                            {item.subtitle && (
                                                <p
                                                    className={`mt-1 text-xs truncate ${
                                                        isSelected
                                                            ? "text-primary-foreground/80"
                                                            : "text-muted-foreground"
                                                    }`}
                                                >
                                                    {item.subtitle}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <span
                                        className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                                            isSelected
                                                ? "bg-primary-foreground/20 text-primary-foreground"
                                                : "bg-muted text-muted-foreground"
                                        }`}
                                    >
                                        {item.category}
                                    </span>
                                </button>
                            );
                        })
                    )}
                </div>

                {/* Keyboard hints footer */}
                <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/30 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-3">
                        <span>
                            <kbd className="px-1.5 py-0.5 bg-background border rounded font-mono text-[10px]">↑</kbd>{" "}
                            <kbd className="px-1.5 py-0.5 bg-background border rounded font-mono text-[10px]">↓</kbd> navigate
                        </span>
                        <span>
                            <kbd className="px-1.5 py-0.5 bg-background border rounded font-mono text-[10px]">↵</kbd> select
                        </span>
                    </div>
                    <span>
                        <kbd className="px-1.5 py-0.5 bg-background border rounded font-mono text-[10px]">esc</kbd> close
                    </span>
                </div>
            </div>
        </div>
    );
}
