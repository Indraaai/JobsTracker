"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    CheckSquare,
    LayoutDashboard,
    LogOut,
    UserCheck,
    X,
} from "lucide-react";
import { signOut } from "next-auth/react";

export const navigation = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Applications",
        href: "/applications",
        icon: BriefcaseBusiness,
    },
    {
        name: "Companies",
        href: "/companies",
        icon: Building2,
    },
    {
        name: "Interviews",
        href: "/interviews",
        icon: CalendarDays,
    },
    {
        name: "Tasks",
        href: "/tasks",
        icon: CheckSquare,
    },
    {
        name: "Contacts",
        href: "/contacts",
        icon: UserCheck,
    },
];

interface SidebarNavProps {
    onNavigate?: () => void;
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

export function SidebarNavContent({ onNavigate, user }: SidebarNavProps) {
    const pathname = usePathname();

    const initials = user?.name
        ? user.name
              .split(" ")
              .filter(Boolean)
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
        : "U";

    return (
        <div className="flex h-full flex-col">
            {/* Navigation links */}
            <nav className="flex-1 space-y-1.5 p-3 sm:p-4 overflow-y-auto">
                <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                    Menu
                </div>
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        pathname === item.href ||
                        (item.href !== "/dashboard" &&
                            pathname.startsWith(`${item.href}/`));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onNavigate}
                            className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            }`}
                        >
                            <Icon
                                className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                                    isActive
                                        ? "text-primary-foreground"
                                        : "text-muted-foreground group-hover:text-foreground"
                                }`}
                            />
                            <span className="truncate">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User section & Logout */}
            <div className="border-t p-3 sm:p-4 space-y-2 bg-muted/20">
                {user && (
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-background border">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs border border-primary/20">
                            {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-foreground">
                                {user.name ?? "User"}
                            </p>
                            <p className="truncate text-[11px] text-muted-foreground">
                                {user.email ?? ""}
                            </p>
                        </div>
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                    <LogOut className="h-4 w-4 shrink-0" />
                    <span>Log out</span>
                </button>
            </div>
        </div>
    );
}

export default function Sidebar({
    user,
}: {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}) {
    return (
        <aside className="hidden md:flex sticky top-0 h-screen w-64 shrink-0 flex-col border-r bg-background select-none z-20">
            {/* Header Brand */}
            <div className="flex h-16 items-center gap-2.5 border-b px-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                    <BriefcaseBusiness className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                    <Link
                        href="/dashboard"
                        className="text-base font-bold tracking-tight text-foreground"
                    >
                        Job Tracker
                    </Link>
                    <span className="text-[10px] text-muted-foreground font-medium -mt-0.5">
                        Career Assistant
                    </span>
                </div>
            </div>

            <SidebarNavContent user={user} />
        </aside>
    );
}

export function MobileSidebar({
    isOpen,
    onClose,
    user,
}: {
    isOpen: boolean;
    onClose: () => void;
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}) {
    const pathname = usePathname();
    const prevPathname = useRef(pathname);

    // Only close when route actually changes
    useEffect(() => {
        if (prevPathname.current !== pathname) {
            prevPathname.current = pathname;
            onClose();
        }
    }, [pathname, onClose]);

    // Handle Escape key and body scroll lock
    useEffect(() => {
        if (!isOpen) return;

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }

        window.addEventListener("keydown", handleKeyDown);
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Mobile Sheet / Drawer */}
            <div className="relative z-10 flex h-full w-72 max-w-[85vw] flex-col bg-background shadow-2xl border-r">
                {/* Header with Close Button */}
                <div className="flex h-16 shrink-0 items-center justify-between border-b px-4 sm:px-6">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                            <BriefcaseBusiness className="h-4 w-4" />
                        </div>
                        <span className="text-base font-bold tracking-tight text-foreground">
                            Job Tracker
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        aria-label="Close menu"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 min-h-0">
                    <SidebarNavContent onNavigate={onClose} user={user} />
                </div>
            </div>
        </div>
    );
}