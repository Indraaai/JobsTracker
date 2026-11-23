import { auth } from "@/auth";
import Link from "next/link";
import {
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    CheckCircle2,
    CheckSquare,
    Plus,
    ArrowRight,
    TrendingUp,
    Video,
    Clock,
    Flame,
} from "lucide-react";
import { getApplications } from "@/core/services/application.service";
import { getCompanies } from "@/core/services/company.service";
import { getInterviews } from "@/core/services/interview.service";
import { getTasks } from "@/core/services/task.service";
import CalendarSyncButton from "@/components/interviews/calendar-sync-button";

export default async function DashboardPage() {
    const session = await auth();
    const userId = session?.user?.id;

    let applicationsCount = 0;
    let interviewsCount = 0;
    let offersCount = 0;
    let inProgressCount = 0;
    let companiesCount = 0;
    let pendingTasksCount = 0;
    let upcomingInterviews: Awaited<ReturnType<typeof getInterviews>> = [];
    let pendingTasks: Awaited<ReturnType<typeof getTasks>> = [];

    if (userId) {
        try {
            const [applications, companies, interviews, tasks] = await Promise.all([
                getApplications(userId),
                getCompanies(userId),
                getInterviews(userId),
                getTasks(userId),
            ]);

            applicationsCount = applications.length;
            companiesCount = companies.length;
            interviewsCount = interviews.filter((i) => !i.isCompleted).length;
            offersCount = applications.filter(
                (a) => a.status === "OFFER" || a.status === "ACCEPTED",
            ).length;
            inProgressCount = applications.filter((a) =>
                ["APPLIED", "SCREENING", "ASSESSMENT"].includes(a.status),
            ).length;

            upcomingInterviews = interviews
                .filter((i) => !i.isCompleted)
                .slice(0, 3);

            pendingTasks = tasks
                .filter((t) => !t.isCompleted)
                .slice(0, 4);
            pendingTasksCount = tasks.filter((t) => !t.isCompleted).length;
        } catch {
            // Fallback to defaults if db query fails
        }
    }

    const stats = [
        {
            title: "Total Applications",
            value: applicationsCount,
            icon: BriefcaseBusiness,
            desc: "All submitted applications",
            color: "text-blue-600 bg-blue-500/10 border-blue-200/50",
        },
        {
            title: "In Progress",
            value: inProgressCount,
            icon: TrendingUp,
            desc: "Review & screening",
            color: "text-purple-600 bg-purple-500/10 border-purple-200/50",
        },
        {
            title: "Interviews",
            value: interviewsCount,
            icon: CalendarDays,
            desc: "Upcoming discussions",
            color: "text-orange-600 bg-orange-500/10 border-orange-200/50",
        },
        {
            title: "Offers Received",
            value: offersCount,
            icon: CheckCircle2,
            desc: "Job offers & accepted",
            color: "text-emerald-600 bg-emerald-500/10 border-emerald-200/50",
        },
        {
            title: "Pending Tasks",
            value: pendingTasksCount,
            icon: CheckSquare,
            desc: "Action items to-do",
            color: "text-amber-600 bg-amber-500/10 border-amber-200/50",
        },
    ];

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Header Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        Welcome back, {session?.user?.name ?? "User"} 👋
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Here is an overview of your job search progress, upcoming interviews, and action items.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <Link
                        href="/tasks"
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border bg-background px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
                    >
                        <CheckSquare className="h-4 w-4" />
                        View Tasks
                    </Link>
                    <Link
                        href="/applications"
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        New Application
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.title}
                            className="relative overflow-hidden rounded-xl border bg-background p-5 shadow-xs transition-all hover:shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </span>
                                <div
                                    className={`flex h-9 w-9 items-center justify-center rounded-lg border ${stat.color}`}
                                >
                                    <Icon className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="mt-3">
                                <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                                    {stat.value}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {stat.desc}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Middle Grid: Upcoming Interviews & Action Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Interviews Widget */}
                <div className="rounded-2xl border bg-background p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between border-b pb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 border border-orange-200/50">
                                    <CalendarDays className="h-4 w-4" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-foreground">
                                        Upcoming Interviews
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        Scheduled rounds & discussions
                                    </p>
                                </div>
                            </div>

                            <Link
                                href="/interviews"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                            >
                                View All
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>

                        {upcomingInterviews.length === 0 ? (
                            <div className="py-8 text-center text-xs text-muted-foreground">
                                No upcoming interviews scheduled.
                            </div>
                        ) : (
                            <div className="mt-4 space-y-2.5">
                                {upcomingInterviews.map((interview) => {
                                    const date = new Date(interview.scheduledAt);
                                    const formattedDate = new Intl.DateTimeFormat("en-US", {
                                        weekday: "short",
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                    }).format(date);

                                    return (
                                        <div
                                            key={interview.id}
                                            className="rounded-xl border bg-muted/20 p-3 flex items-center justify-between gap-3 text-xs"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <span className="font-semibold text-primary">{interview.companyName}</span>
                                                    <span>•</span>
                                                    <span className="truncate">{interview.applicationPosition}</span>
                                                </div>
                                                <p className="font-bold text-foreground truncate mt-0.5">{interview.title}</p>
                                                <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{formattedDate}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1.5 shrink-0">
                                                {interview.meetingUrl && (
                                                    <a
                                                        href={interview.meetingUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 shrink-0"
                                                    >
                                                        <Video className="h-3.5 w-3.5" />
                                                        Join
                                                    </a>
                                                )}
                                                <CalendarSyncButton interview={interview} size="sm" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Pending Tasks / Action Items Widget */}
                <div className="rounded-2xl border bg-background p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between border-b pb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 border border-amber-200/50">
                                    <CheckSquare className="h-4 w-4" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-foreground">
                                        Pending Action Items
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        Take-home tests, follow-ups & deadlines
                                    </p>
                                </div>
                            </div>

                            <Link
                                href="/tasks"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                            >
                                View All
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>

                        {pendingTasks.length === 0 ? (
                            <div className="py-8 text-center text-xs text-muted-foreground">
                                All caught up! No pending tasks right now.
                            </div>
                        ) : (
                            <div className="mt-4 space-y-2.5">
                                {pendingTasks.map((t) => (
                                    <div
                                        key={t.id}
                                        className="rounded-xl border bg-muted/20 p-3 flex items-center justify-between gap-3 text-xs"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-foreground truncate">
                                                    {t.title}
                                                </span>
                                                {["HIGH", "URGENT"].includes(t.priority) && (
                                                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-red-600 bg-red-500/10 px-1.5 py-0.5 rounded-full">
                                                        <Flame className="h-2.5 w-2.5" />
                                                        {t.priority}
                                                    </span>
                                                )}
                                            </div>

                                            {t.companyName && (
                                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                                    {t.applicationPosition} @ {t.companyName}
                                                </p>
                                            )}
                                        </div>

                                        {t.dueDate && (
                                            <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-md shrink-0">
                                                Due {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(t.dueDate))}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions and Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="rounded-xl border bg-background p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between">
                            <h2 className="text-base sm:text-lg font-semibold text-foreground">
                                Applications Pipeline
                            </h2>
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                {applicationsCount} Active
                            </span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Track the status of your sent resumes, upcoming interviews, and follow-ups.
                        </p>
                    </div>

                    <div className="mt-6 pt-4 border-t flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                            Manage all positions
                        </span>
                        <Link
                            href="/applications"
                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-primary hover:underline"
                        >
                            View Applications
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>

                <div className="rounded-xl border bg-background p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                                    <Building2 className="h-4 w-4" />
                                </div>
                                <h2 className="text-base sm:text-lg font-semibold text-foreground">
                                    Target Companies
                                </h2>
                            </div>
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                {companiesCount} Companies
                            </span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Organize company research, links, and locations to target your dream employers.
                        </p>
                    </div>

                    <div className="mt-6 pt-4 border-t flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                            Explore your directory
                        </span>
                        <Link
                            href="/companies"
                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-primary hover:underline"
                        >
                            View Companies
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
