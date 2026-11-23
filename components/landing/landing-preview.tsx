import {
    Building2,
    Calendar,
    Clock,
    DollarSign,
    MapPin,
    Video,
} from "lucide-react";

export default function LandingPreview() {
    return (
        <section id="preview" className="py-12 border-y bg-muted/20">
            <div className="container mx-auto max-w-6xl px-4 sm:px-6">
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        Your Entire Job Hunt in a Single Glanced View
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        No complex configurations. Drag, drop, schedule interviews, and stay on top of deadlines.
                    </p>
                </div>

                {/* Mock Browser/App Shell */}
                <div className="rounded-2xl border bg-background shadow-2xl overflow-hidden">
                    {/* Mock Window Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/40">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1.5">
                                <span className="h-3 w-3 rounded-full bg-red-400/80 inline-block" />
                                <span className="h-3 w-3 rounded-full bg-amber-400/80 inline-block" />
                                <span className="h-3 w-3 rounded-full bg-emerald-400/80 inline-block" />
                            </div>
                            <span className="text-xs font-mono text-muted-foreground ml-2">
                                app.jobtracker.dev/applications
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="rounded-md border bg-background px-2 py-0.5 font-mono text-[10px]">
                                ⌘K Search
                            </span>
                        </div>
                    </div>

                    {/* Mock Kanban Board View */}
                    <div className="p-3 sm:p-6 overflow-x-auto snap-x snap-mandatory scroll-smooth">
                        {/* Mobile Swipe Hint */}
                        <div className="flex md:hidden items-center justify-between text-[11px] text-muted-foreground pb-2 px-1">
                            <span>Swipe to explore pipeline stages</span>
                            <span>→</span>
                        </div>

                        <div className="flex md:grid md:grid-cols-4 gap-3 sm:gap-4 min-w-full">
                            {/* Column 1: Applied */}
                            <div className="flex flex-col w-[78vw] sm:w-[280px] md:w-auto shrink-0 snap-center rounded-xl border border-blue-200/60 dark:border-blue-900/40 bg-blue-500/5 p-3.5">
                                <div className="flex items-center justify-between mb-3 pb-2 border-b border-blue-200/40">
                                    <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                                        Applied (2)
                                    </span>
                                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                                </div>

                                <div className="space-y-3">
                                    <div className="rounded-lg border bg-card p-3 shadow-xs space-y-2">
                                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                            <span className="font-semibold text-foreground flex items-center gap-1">
                                                <Building2 className="h-3 w-3" /> TechCorp Global
                                            </span>
                                            <span>2d ago</span>
                                        </div>
                                        <p className="font-bold text-xs text-foreground">
                                            Fullstack Next.js Engineer
                                        </p>
                                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                            <span className="inline-flex items-center gap-0.5">
                                                <MapPin className="h-2.5 w-2.5" /> Jakarta (Hybrid)
                                            </span>
                                            <span>•</span>
                                            <span>Full-time</span>
                                        </div>
                                    </div>

                                    <div className="rounded-lg border bg-card p-3 shadow-xs space-y-2 opacity-80">
                                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                            <span className="font-semibold text-foreground flex items-center gap-1">
                                                <Building2 className="h-3 w-3" /> CloudScale AI
                                            </span>
                                            <span>4d ago</span>
                                        </div>
                                        <p className="font-bold text-xs text-foreground">
                                            Backend Go Developer
                                        </p>
                                        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                            $3,500 - $4,200/mo
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Column 2: Screening & Test */}
                            <div className="flex flex-col w-[78vw] sm:w-[280px] md:w-auto shrink-0 snap-center rounded-xl border border-purple-200/60 dark:border-purple-900/40 bg-purple-500/5 p-3.5">
                                <div className="flex items-center justify-between mb-3 pb-2 border-b border-purple-200/40">
                                    <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide">
                                        Screening / Test (1)
                                    </span>
                                    <span className="h-2 w-2 rounded-full bg-purple-500" />
                                </div>

                                <div className="space-y-3">
                                    <div className="rounded-lg border bg-card p-3 shadow-xs space-y-2.5">
                                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                            <span className="font-semibold text-foreground flex items-center gap-1">
                                                <Building2 className="h-3 w-3" /> FinFlow Systems
                                            </span>
                                            <span className="text-amber-600 font-semibold">Test Due Fri</span>
                                        </div>
                                        <p className="font-bold text-xs text-foreground">
                                            Senior Frontend Engineer
                                        </p>
                                        <div className="rounded-md bg-amber-500/10 p-2 text-[11px] text-amber-700 dark:text-amber-300 border border-amber-200/50 flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5 shrink-0" />
                                            <span>Take-home assignment: Dashboard UI</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Column 3: Interviewing */}
                            <div className="flex flex-col w-[78vw] sm:w-[280px] md:w-auto shrink-0 snap-center rounded-xl border border-orange-200/60 dark:border-orange-900/40 bg-orange-500/5 p-3.5">
                                <div className="flex items-center justify-between mb-3 pb-2 border-b border-orange-200/40">
                                    <span className="text-xs font-bold text-orange-700 dark:text-orange-300 uppercase tracking-wide">
                                        Interviewing (1)
                                    </span>
                                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                                </div>

                                <div className="space-y-3">
                                    <div className="rounded-lg border-2 border-primary/40 bg-card p-3 shadow-sm space-y-2.5 ring-2 ring-primary/10">
                                        <div className="flex items-center justify-between text-[11px]">
                                            <span className="font-bold text-foreground flex items-center gap-1">
                                                <Building2 className="h-3 w-3 text-primary" /> Stripe
                                            </span>
                                            <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-bold text-orange-600">
                                                Tech Round
                                            </span>
                                        </div>
                                        <p className="font-bold text-xs text-foreground">
                                            Staff Software Engineer
                                        </p>

                                        {/* Highlight: Google Calendar Sync Button */}
                                        <div className="pt-1 flex items-center gap-1.5">
                                            <div className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
                                                <Video className="h-3 w-3" />
                                                <span>Google Meet</span>
                                            </div>
                                            <div className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-[10px] font-medium text-foreground">
                                                <Calendar className="h-3 w-3 text-blue-500" />
                                                <span>Synced to GCal</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Column 4: Offer */}
                            <div className="flex flex-col w-[78vw] sm:w-[280px] md:w-auto shrink-0 snap-center rounded-xl border border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-500/5 p-3.5">
                                <div className="flex items-center justify-between mb-3 pb-2 border-b border-emerald-200/40">
                                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                                        Offer Received (1) 🎉
                                    </span>
                                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                </div>

                                <div className="space-y-3">
                                    <div className="rounded-lg border bg-card p-3 shadow-xs space-y-2 bg-gradient-to-br from-background to-emerald-500/5">
                                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                            <span className="font-semibold text-foreground flex items-center gap-1">
                                                <Building2 className="h-3 w-3" /> SupaLabs Inc
                                            </span>
                                            <span className="text-emerald-600 font-bold">OFFER</span>
                                        </div>
                                        <p className="font-bold text-xs text-foreground">
                                            Senior Solutions Architect
                                        </p>
                                        <div className="rounded-md bg-emerald-500/10 p-2 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 flex items-center gap-1">
                                            <DollarSign className="h-3.5 w-3.5" />
                                            <span>$95,000 / year + Equity</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
