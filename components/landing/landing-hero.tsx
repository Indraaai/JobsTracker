import Link from "next/link";
import { ArrowRight, Calendar, CheckCircle2, Command, Sparkles, Star } from "lucide-react";

type LandingHeroProps = {
    isLoggedIn?: boolean;
};

export default function LandingHero({ isLoggedIn }: LandingHeroProps) {
    return (
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

            <div className="container mx-auto max-w-5xl px-4 sm:px-6 text-center">
                {/* Floating pill */}
                <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3.5 py-1 text-xs font-semibold text-foreground backdrop-blur-xs shadow-2xs mb-6">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span>The Modern Job Search Cockpit</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground font-normal">v1.0 Live</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
                    Track applications. Ace interviews.{" "}
                    <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                        Land your dream role.
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="mt-6 max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground leading-relaxed font-normal">
                    Say goodbye to chaotic spreadsheets and forgotten interview dates.
                    JobTracker provides a drag-and-drop Kanban pipeline, Google Calendar sync,
                    take-home test checklists, and recruiter networking in one distraction-free tool.
                </p>

                {/* CTA Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                    <Link
                        href={isLoggedIn ? "/dashboard" : "/register"}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <span>{isLoggedIn ? "Go to Your Dashboard" : "Start Tracking For Free"}</span>
                        <ArrowRight className="h-4 w-4" />
                    </Link>

                    <a
                        href="#preview"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border bg-background px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-muted/40 transition-colors"
                    >
                        <span>Live Product Preview</span>
                    </a>
                </div>

                {/* Value bullet points */}
                <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span>Interactive Kanban Pipeline</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span>1-Click Google Calendar Sync</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Command className="h-4 w-4 text-purple-500" />
                        <span>Fast Command Palette (Ctrl+K)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Star className="h-4 w-4 text-amber-500" />
                        <span>100% Free & Open</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
