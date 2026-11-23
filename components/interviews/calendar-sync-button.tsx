"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, Download, ExternalLink } from "lucide-react";
import {
    downloadIcsFile,
    generateGoogleCalendarUrl,
    type InterviewItem,
} from "@/lib/utils/interview-helpers";

type CalendarSyncButtonProps = {
    interview: InterviewItem;
    size?: "sm" | "default";
    variant?: "outline" | "ghost" | "secondary";
};

export default function CalendarSyncButton({
    interview,
    size = "sm",
    variant = "outline",
}: CalendarSyncButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleGoogleCalendar = () => {
        const url = generateGoogleCalendarUrl(interview);
        window.open(url, "_blank", "noopener,noreferrer");
        setIsOpen(false);
    };

    const handleDownloadIcs = () => {
        downloadIcsFile(interview);
        setIsOpen(false);
    };

    const isSm = size === "sm";

    const variantStyles = {
        outline:
            "border bg-background hover:bg-accent text-foreground hover:text-foreground",
        ghost: "hover:bg-accent text-muted-foreground hover:text-foreground",
        secondary:
            "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    }[variant];

    return (
        <div ref={dropdownRef} className="relative inline-block text-left">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                title="Add to Google Calendar or Outlook"
                className={`inline-flex items-center gap-1.5 rounded-lg font-medium transition-colors ${variantStyles} ${
                    isSm ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-xs sm:text-sm"
                }`}
            >
                <CalendarDays className={isSm ? "h-3.5 w-3.5" : "h-4 w-4"} />
                <span>Add to Calendar</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 z-50 mt-1.5 w-52 rounded-xl border bg-card p-1.5 shadow-xl animate-in fade-in-0 zoom-in-95 duration-100">
                    <button
                        type="button"
                        onClick={handleGoogleCalendar}
                        className="w-full flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-foreground hover:bg-accent transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 font-bold text-[10px]">
                                G
                            </span>
                            <span>Google Calendar</span>
                        </div>
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </button>

                    <button
                        type="button"
                        onClick={handleDownloadIcs}
                        className="w-full flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-foreground hover:bg-accent transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-purple-500/10 text-purple-600">
                                <Download className="h-3 w-3" />
                            </span>
                            <span>Apple / Outlook (.ics)</span>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}
