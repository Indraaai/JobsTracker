import { CheckSquare, Sparkles } from "lucide-react";
import Link from "next/link";

export default function TasksPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Tasks & To-Dos
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Keep track of recruitment action items and follow-ups.
                </p>
            </div>

            <div className="rounded-xl border bg-background p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xs">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                    <CheckSquare className="h-7 w-7" />
                </div>

                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    Feature Coming Soon
                </div>

                <h2 className="mt-3 text-lg sm:text-xl font-bold text-foreground">
                    Action Items & Reminders
                </h2>

                <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                    A task manager tailored for job seekers — set deadlines for take-home tests, follow-up emails, and resume polish.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        href="/applications"
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
                    >
                        View Applications
                    </Link>
                    <Link
                        href="/dashboard"
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
