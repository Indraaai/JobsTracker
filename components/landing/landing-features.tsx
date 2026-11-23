import {
    CalendarDays,
    CheckSquare,
    Command,
    Kanban,
    LayoutDashboard,
    UserCheck,
    Zap,
} from "lucide-react";

const features = [
    {
        icon: Kanban,
        title: "Visual Kanban Pipeline",
        description:
            "Drag and drop applications across Wishlist, Applied, Screening, Interview, and Offer stages. Fast, responsive, and intuitive.",
        tag: "Pipeline",
    },
    {
        icon: CalendarDays,
        title: "1-Click Calendar Sync",
        description:
            "Sync your scheduled rounds to Google Calendar, Apple Calendar, or Outlook with one click. Meeting links and notes auto-included.",
        tag: "Integration",
    },
    {
        icon: LayoutDashboard,
        title: "360° Application Cockpit",
        description:
            "A dedicated dashboard for each job posting showing status progress, linked interviews, pending assignments, and recruiter contacts.",
        tag: "Productivity",
    },
    {
        icon: Command,
        title: "Speedy Command Palette (Ctrl+K)",
        description:
            "Keyboard-first navigation. Jump between jobs, companies, or create new entries in milliseconds without leaving the keyboard.",
        tag: "UX",
    },
    {
        icon: UserCheck,
        title: "Recruiter & Network Directory",
        description:
            "Keep track of hiring managers, recruiter emails, phone numbers, and LinkedIn profiles associated with your target companies.",
        tag: "Networking",
    },
    {
        icon: CheckSquare,
        title: "Action Items & To-Dos",
        description:
            "Never miss a take-home coding assignment deadline or post-interview follow-up with integrated to-do checklists.",
        tag: "Tasks",
    },
];

export default function LandingFeatures() {
    return (
        <section id="features" className="py-16 md:py-24">
            <div className="container mx-auto max-w-6xl px-4 sm:px-6">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
                        <Zap className="h-3.5 w-3.5" />
                        <span>Core Capabilities</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
                        Everything You Need to Run a Professional Job Search
                    </h2>
                    <p className="mt-3 text-sm text-muted-foreground">
                        Engineered with Next.js, Bun, and modern design standards for maximum speed and zero friction.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={idx}
                                className="group rounded-2xl border bg-card p-6 shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider">
                                            {feature.tag}
                                        </span>
                                    </div>

                                    <h3 className="text-base font-bold text-foreground">
                                        {feature.title}
                                    </h3>

                                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
