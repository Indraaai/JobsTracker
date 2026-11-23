"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    ArrowLeft,
    Building2,
    Calendar,
    CalendarPlus,
    CheckCircle2,
    CheckSquare,
    Clock,
    DollarSign,
    ExternalLink,
    MapPin,
    Pencil,
    Plus,
    Trash2,
    UserCheck,
    Video,
} from "lucide-react";
import type { ApplicationWithCompany } from "@/core/repositories/application.repository";
import type { Interview } from "@/db/schema/interviews";
import type { Task } from "@/db/schema/tasks";
import type { ContactWithCompany } from "@/core/repositories/contact.repository";
import type { Company } from "@/db/schema/companies";
import {
    formatDate,
    formatSalary,
    getStatusClass,
} from "@/lib/utils/application-helpers";
import {
    useUpdateApplication,
    useDeleteApplication,
} from "@/hooks/use-applications";
import {
    useInterviews,
    useDeleteInterview,
} from "@/hooks/use-interviews";
import {
    useTasks,
    useToggleTaskComplete,
    useDeleteTask,
} from "@/hooks/use-tasks";
import {
    useContacts,
    useCreateContact,
} from "@/hooks/use-contacts";
import InterviewForm from "@/components/interviews/interview-form";
import TaskForm from "@/components/tasks/task-form";
import ContactForm from "@/components/contacts/contact-form";
import ApplicationForm from "@/components/applications/application-form";
import CalendarSyncButton from "@/components/interviews/calendar-sync-button";

type ApplicationDetailProps = {
    initialApplication: ApplicationWithCompany;
    initialInterviews: Interview[];
    initialTasks: Task[];
    initialContacts: ContactWithCompany[];
    companies: Company[];
};

const STAGES: Array<ApplicationWithCompany["status"]> = [
    "SAVED",
    "APPLIED",
    "SCREENING",
    "INTERVIEW",
    "OFFER",
];

export default function ApplicationDetail({
    initialApplication,
    initialInterviews,
    initialTasks,
    initialContacts,
    companies,
}: ApplicationDetailProps) {
    const router = useRouter();
    const [app, setApp] = useState(initialApplication);

    // Queries & Mutations
    const updateAppMutation = useUpdateApplication();
    const deleteAppMutation = useDeleteApplication();

    // Modals
    const [isEditAppOpen, setIsEditAppOpen] = useState(false);
    const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    // Linked Data Queries
    const { data: allInterviews = [] } = useInterviews();
    const { data: allTasks = [] } = useTasks();
    const { data: allContacts = [] } = useContacts(initialContacts);

    const deleteInterviewMutation = useDeleteInterview();
    const toggleTaskMutation = useToggleTaskComplete();
    const deleteTaskMutation = useDeleteTask();
    const createContactMutation = useCreateContact();

    // Filter data for this application
    const applicationInterviews = allInterviews.length > 0
        ? allInterviews.filter((i) => i.applicationId === app.id)
        : initialInterviews.map((i) => ({
              ...i,
              applicationPosition: app.position,
              companyName: app.companyName ?? "Company",
              companyLogo: app.companyLogo,
          }));

    const applicationTasks = allTasks.length > 0
        ? allTasks.filter((t) => t.applicationId === app.id)
        : initialTasks.map((t) => ({
              ...t,
              applicationPosition: app.position,
              companyName: app.companyName ?? "Company",
              companyLogo: app.companyLogo,
          }));

    const companyContacts = allContacts.filter(
        (c) => c.companyId === app.companyId,
    );

    const handleStageChange = async (newStatus: ApplicationWithCompany["status"]) => {
        try {
            setApp((prev) => ({ ...prev, status: newStatus }));
            await updateAppMutation.mutateAsync({
                id: app.id,
                data: { status: newStatus },
            });
        } catch {
            setApp(initialApplication);
        }
    };

    const handleDeleteApplication = async () => {
        if (!confirm("Are you sure you want to delete this application?")) return;
        await deleteAppMutation.mutateAsync(app.id);
        router.push("/applications");
    };

    const salary = formatSalary(app.salaryMin, app.salaryMax, app.currency);

    return (
        <div className="space-y-6">
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
                <Link
                    href="/applications"
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Applications</span>
                </Link>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setIsEditAppOpen(true)}
                        className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-accent transition-colors"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                        <span>Edit</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleDeleteApplication}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20 transition-colors"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                    </button>
                </div>
            </div>

            {/* Header Hero Card */}
            <div className="rounded-xl border bg-card p-4 sm:p-6 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        {app.companyLogo ? (
                            <Image
                                src={app.companyLogo}
                                alt={app.companyName ?? "Company"}
                                width={56}
                                height={56}
                                unoptimized
                                className="h-14 w-14 rounded-xl border object-contain bg-background shrink-0"
                            />
                        ) : (
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                                <Building2 className="h-7 w-7" />
                            </div>
                        )}

                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                                    {app.position}
                                </h1>
                                <span
                                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusClass(
                                        app.status,
                                    )}`}
                                >
                                    {app.status}
                                </span>
                            </div>

                            <p className="text-base font-medium text-muted-foreground flex items-center gap-1.5">
                                <Building2 className="h-4 w-4" />
                                <span>{app.companyName ?? "Unknown Company"}</span>
                            </p>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground pt-1">
                                {app.location && (
                                    <span className="inline-flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {app.location}
                                    </span>
                                )}
                                {app.employmentType && (
                                    <span className="inline-flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" />
                                        {app.employmentType.replace("_", " ")}
                                    </span>
                                )}
                                {salary && (
                                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                                        <DollarSign className="h-3.5 w-3.5" />
                                        {salary}
                                    </span>
                                )}
                                {app.appliedAt && (
                                    <span className="inline-flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        Applied: {formatDate(app.appliedAt)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {app.jobUrl && (
                        <a
                            href={app.jobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
                        >
                            <span>Open Job Posting</span>
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    )}
                </div>

                {/* Interactive Status Pipeline Stepper */}
                <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                        Pipeline Stage (Click to fast-forward stage)
                    </p>
                    <div className="flex flex-wrap sm:grid sm:grid-cols-5 gap-2">
                        {STAGES.map((stage, idx) => {
                            const isCurrent = app.status === stage;
                            const isPassed =
                                STAGES.indexOf(app.status) > idx;

                            return (
                                <button
                                    key={stage}
                                    type="button"
                                    onClick={() => handleStageChange(stage)}
                                    className={`flex-1 min-w-[110px] sm:min-w-0 flex items-center justify-center gap-1.5 rounded-lg py-2 px-2.5 text-xs font-bold transition-all ${
                                        isCurrent
                                            ? "bg-primary text-primary-foreground shadow-xs ring-2 ring-primary/30"
                                            : isPassed
                                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                            : "bg-muted/40 text-muted-foreground hover:bg-muted"
                                    }`}
                                >
                                    {isPassed && <CheckCircle2 className="h-3.5 w-3.5" />}
                                    <span>{stage}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Grid layout for 360 Cockpit */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Interviews & Tasks */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Section: Interviews */}
                    <div className="rounded-xl border bg-card p-5 shadow-xs">
                        <div className="flex items-center justify-between pb-4 border-b">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-primary" />
                                <h3 className="font-bold text-foreground text-sm uppercase tracking-wide">
                                    Interviews ({applicationInterviews.length})
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsInterviewModalOpen(true)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 text-primary px-3 py-1.5 text-xs font-semibold hover:bg-primary/20 transition-colors"
                            >
                                <CalendarPlus className="h-3.5 w-3.5" />
                                <span>Schedule Interview</span>
                            </button>
                        </div>

                        <div className="mt-4 divide-y">
                            {applicationInterviews.length === 0 ? (
                                <p className="py-6 text-center text-xs text-muted-foreground">
                                    No interviews scheduled yet. Click &ldquo;Schedule Interview&rdquo; above.
                                </p>
                            ) : (
                                applicationInterviews.map((interview) => (
                                    <div
                                        key={interview.id}
                                        className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                    >
                                        <div>
                                            <p className="font-semibold text-sm text-foreground">
                                                {interview.title}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                                                <span className="font-medium text-foreground">
                                                    📅 {formatDate(interview.scheduledAt)}
                                                </span>
                                                <span>•</span>
                                                <span>{interview.stage}</span>
                                                {interview.format && (
                                                    <span>• {interview.format}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {interview.meetingUrl && (
                                                <a
                                                    href={interview.meetingUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 text-blue-600 px-2 py-1 text-xs font-medium hover:bg-blue-500/20"
                                                >
                                                    <Video className="h-3 w-3" />
                                                    <span>Join</span>
                                                </a>
                                            )}
                                            <CalendarSyncButton interview={interview} size="sm" />
                                            <button
                                                type="button"
                                                onClick={() => deleteInterviewMutation.mutateAsync(interview.id)}
                                                className="text-muted-foreground hover:text-destructive p-1 rounded-md"
                                                title="Delete interview"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Section: Tasks & Action Items */}
                    <div className="rounded-xl border bg-card p-5 shadow-xs">
                        <div className="flex items-center justify-between pb-4 border-b">
                            <div className="flex items-center gap-2">
                                <CheckSquare className="h-4 w-4 text-primary" />
                                <h3 className="font-bold text-foreground text-sm uppercase tracking-wide">
                                    Action Items & To-Dos ({applicationTasks.length})
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsTaskModalOpen(true)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 text-primary px-3 py-1.5 text-xs font-semibold hover:bg-primary/20 transition-colors"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                <span>Add Task</span>
                            </button>
                        </div>

                        <div className="mt-4 divide-y">
                            {applicationTasks.length === 0 ? (
                                <p className="py-6 text-center text-xs text-muted-foreground">
                                    No tasks for this application yet.
                                </p>
                            ) : (
                                applicationTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="py-3 flex items-center justify-between gap-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={task.isCompleted}
                                                onChange={() =>
                                                    toggleTaskMutation.mutateAsync({
                                                        id: task.id,
                                                        isCompleted: !task.isCompleted,
                                                    })
                                                }
                                                className="h-4 w-4 rounded border-muted-foreground/30 text-primary focus:ring-primary cursor-pointer"
                                            />
                                            <div>
                                                <p
                                                    className={`text-sm font-medium ${
                                                        task.isCompleted
                                                            ? "line-through text-muted-foreground"
                                                            : "text-foreground"
                                                    }`}
                                                >
                                                    {task.title}
                                                </p>
                                                {task.dueDate && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Due: {formatDate(task.dueDate)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => deleteTaskMutation.mutateAsync(task.id)}
                                            className="text-muted-foreground hover:text-destructive p-1 rounded-md"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Col: Recruiter Contacts & Notes */}
                <div className="space-y-6">
                    {/* Contacts at this company */}
                    <div className="rounded-xl border bg-card p-5 shadow-xs">
                        <div className="flex items-center justify-between pb-4 border-b">
                            <div className="flex items-center gap-2">
                                <UserCheck className="h-4 w-4 text-emerald-600" />
                                <h3 className="font-bold text-foreground text-sm uppercase tracking-wide">
                                    Company Contacts
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsContactModalOpen(true)}
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1.5 text-xs font-semibold hover:bg-emerald-500/20"
                            >
                                <Plus className="h-3 w-3" />
                                <span>Add</span>
                            </button>
                        </div>

                        <div className="mt-4 divide-y">
                            {companyContacts.length === 0 ? (
                                <p className="py-6 text-center text-xs text-muted-foreground">
                                    No recruiters saved for {app.companyName ?? "this company"}.
                                </p>
                            ) : (
                                companyContacts.map((contact) => (
                                    <div key={contact.id} className="py-3">
                                        <p className="text-sm font-semibold text-foreground">
                                            {contact.name}
                                        </p>
                                        {contact.role && (
                                            <p className="text-xs text-muted-foreground">
                                                {contact.role}
                                            </p>
                                        )}
                                        <div className="mt-1 flex flex-wrap gap-2 text-xs">
                                            {contact.email && (
                                                <a
                                                    href={`mailto:${contact.email}`}
                                                    className="text-primary hover:underline"
                                                >
                                                    {contact.email}
                                                </a>
                                            )}
                                            {contact.phone && (
                                                <a
                                                    href={`tel:${contact.phone}`}
                                                    className="text-muted-foreground hover:underline"
                                                >
                                                    {contact.phone}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Notes & Comments */}
                    <div className="rounded-xl border bg-card p-5 shadow-xs">
                        <h3 className="font-bold text-foreground text-sm uppercase tracking-wide pb-3 border-b">
                            Application Notes
                        </h3>
                        <div className="mt-3">
                            {app.notes ? (
                                <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap">
                                    {app.notes}
                                </p>
                            ) : (
                                <p className="text-xs text-muted-foreground italic">
                                    No notes added yet. Click &ldquo;Edit&rdquo; above to write notes or interview prep details.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {isEditAppOpen && (
                <ApplicationForm
                    application={app}
                    onSuccess={() => {
                        setIsEditAppOpen(false);
                        router.refresh();
                    }}
                    onCancel={() => setIsEditAppOpen(false)}
                />
            )}

            {isInterviewModalOpen && (
                <InterviewForm
                    initialApplicationId={app.id}
                    onSuccess={() => {
                        setIsInterviewModalOpen(false);
                    }}
                    onCancel={() => setIsInterviewModalOpen(false)}
                />
            )}

            {isTaskModalOpen && (
                <TaskForm
                    initialApplicationId={app.id}
                    onSuccess={() => {
                        setIsTaskModalOpen(false);
                    }}
                    onCancel={() => setIsTaskModalOpen(false)}
                />
            )}

            {isContactModalOpen && (
                <ContactForm
                    companies={companies}
                    defaultCompanyId={app.companyId}
                    onClose={() => setIsContactModalOpen(false)}
                    onSubmit={async (data) => {
                        await createContactMutation.mutateAsync(data);
                    }}
                />
            )}
        </div>
    );
}
