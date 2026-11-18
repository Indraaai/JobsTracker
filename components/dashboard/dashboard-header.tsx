"use client";

import { Menu, BriefcaseBusiness } from "lucide-react";
import { usePathname } from "next/navigation";

interface DashboardHeaderProps {
    onOpenMobileMenu: () => void;
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

export default function DashboardHeader({
    onOpenMobileMenu,
    user,
}: DashboardHeaderProps) {
    const pathname = usePathname();

    const name = user?.name ?? "User";
    const email = user?.email ?? "";

    const initials = name
        ? name
              .split(" ")
              .filter(Boolean)
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
        : "U";

    const getPageTitle = (path: string) => {
        if (path.startsWith("/applications")) return "Applications";
        if (path.startsWith("/companies")) return "Companies";
        if (path.startsWith("/interviews")) return "Interviews";
        if (path.startsWith("/tasks")) return "Tasks";
        return "Dashboard";
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-4 sm:px-6">
            <div className="flex items-center gap-3">
                {/* Mobile hamburger button */}
                <button
                    type="button"
                    onClick={onOpenMobileMenu}
                    className="inline-flex md:hidden items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Open sidebar navigation"
                >
                    <Menu className="h-5 w-5" />
                </button>

                {/* Mobile brand badge */}
                <div className="flex md:hidden items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <BriefcaseBusiness className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-sm tracking-tight">Job Tracker</span>
                </div>

                {/* Desktop page subtitle */}
                <div className="hidden md:flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Workspace
                    </span>
                    <span className="text-muted-foreground/40">/</span>
                    <h2 className="text-sm font-semibold text-foreground">
                        {getPageTitle(pathname)}
                    </h2>
                </div>
            </div>

            {/* Right side: user profile info */}
            <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                    <p className="text-sm font-medium leading-none text-foreground truncate max-w-[150px] sm:max-w-[200px]">
                        {name}
                    </p>
                    {email && (
                        <p className="mt-1 text-xs text-muted-foreground leading-none truncate max-w-[150px] sm:max-w-[200px]">
                            {email}
                        </p>
                    )}
                </div>

                <div
                    title={`${name}${email ? ` (${email})` : ""}`}
                    className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs sm:text-sm border border-primary/20 shadow-xs"
                >
                    {initials}
                </div>
            </div>
        </header>
    );
}