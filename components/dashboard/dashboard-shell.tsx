"use client";

import { useState, useCallback } from "react";
import Sidebar, { MobileSidebar } from "@/components/dashboard/sidebar";
import DashboardHeader from "@/components/dashboard/dashboard-header";

interface DashboardShellProps {
    children: React.ReactNode;
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

export default function DashboardShell({
    children,
    user,
}: DashboardShellProps) {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const handleClose = useCallback(() => {
        setMobileNavOpen(false);
    }, []);

    const handleOpen = useCallback(() => {
        setMobileNavOpen(true);
    }, []);

    return (
        <div className="flex min-h-screen bg-muted/20">
            {/* Desktop Fixed/Sticky Sidebar */}
            <Sidebar user={user} />

            {/* Mobile Drawer Navigation */}
            <MobileSidebar
                isOpen={mobileNavOpen}
                onClose={handleClose}
                user={user}
            />

            {/* Main Area */}
            <div className="flex min-w-0 flex-1 flex-col">
                <DashboardHeader
                    onOpenMobileMenu={handleOpen}
                    user={user}
                />

                <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto min-w-0">
                    {children}
                </main>
            </div>
        </div>
    );
}