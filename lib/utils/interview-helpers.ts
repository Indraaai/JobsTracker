import { Video, Clock, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type InterviewItem = {
    id: string;
    userId: string;
    applicationId: string;
    title: string;
    stage:
    | "HR_SCREENING"
    | "TECHNICAL_TEST"
    | "USER_INTERVIEW"
    | "SYSTEM_DESIGN"
    | "CULTURE_FIT"
    | "FINAL_OFFER"
    | "OTHER";
    format:
    | "ONLINE_GOOGLE_MEET"
    | "ONLINE_ZOOM"
    | "ONLINE_TEAMS"
    | "PHONE_CALL"
    | "ONSITE";
    scheduledAt: Date | string;
    meetingUrl?: string | null;
    location?: string | null;
    notes?: string | null;
    feedback?: string | null;
    result?: "PENDING" | "PASSED" | "FAILED";
    isCompleted?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    applicationPosition?: string | null;
    companyName?: string | null;
    companyLogo?: string | null;
};

export function getStageBadge(stage: string) {
    switch (stage) {
        case "HR_SCREENING":
            return {
                label: "HR Screening",
                className: "bg-blue-500/10 text-blue-600 border-blue-200/50",
            };
        case "TECHNICAL_TEST":
            return {
                label: "Technical Test",
                className: "bg-purple-500/10 text-purple-600 border-purple-200/50",
            };
        case "USER_INTERVIEW":
            return {
                label: "User Interview",
                className: "bg-indigo-500/10 text-indigo-600 border-indigo-200/50",
            };
        case "SYSTEM_DESIGN":
            return {
                label: "System Design",
                className: "bg-fuchsia-500/10 text-fuchsia-600 border-fuchsia-200/50",
            };
        case "CULTURE_FIT":
            return {
                label: "Culture Fit",
                className: "bg-teal-500/10 text-teal-600 border-teal-200/50",
            };
        case "FINAL_OFFER":
            return {
                label: "Final / Offer",
                className: "bg-emerald-500/10 text-emerald-600 border-emerald-200/50",
            };
        default:
            return {
                label: "Other",
                className: "bg-slate-500/10 text-slate-600 border-slate-200/50",
            };
    }
}

export function getFormatBadge(format: string): { label: string; icon: LucideIcon } {
    switch (format) {
        case "ONLINE_GOOGLE_MEET":
            return { label: "Google Meet", icon: Video };
        case "ONLINE_ZOOM":
            return { label: "Zoom", icon: Video };
        case "ONLINE_TEAMS":
            return { label: "MS Teams", icon: Video };
        case "PHONE_CALL":
            return { label: "Phone Call", icon: Clock };
        case "ONSITE":
            return { label: "Onsite", icon: MapPin };
        default:
            return { label: "Online", icon: Video };
    }
}

export function formatSchedule(dateString: Date | string) {
    const date = new Date(dateString);
    const dayFormatter = new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    const timeFormatter = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    return {
        dateStr: dayFormatter.format(date),
        timeStr: `${timeFormatter.format(date)}`,
    };
}

export function getRelativeTimeBadge(dateString: Date | string, isCompleted?: boolean) {
    if (isCompleted) {
        return {
            label: "Finished",
            className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
        };
    }

    const now = new Date();
    const date = new Date(dateString);
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs < 0) {
        return {
            label: "Past Due",
            className: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400",
        };
    }

    if (diffHours < 24) {
        return {
            label: diffHours <= 1 ? "In ~1 hour ⚡" : `Today (${diffHours}h left) ⚡`,
            className: "bg-red-100 text-red-800 font-bold dark:bg-red-950/50 dark:text-red-400",
        };
    }

    if (diffDays === 1) {
        return {
            label: "Tomorrow",
            className: "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400",
        };
    }

    return {
        label: `In ${diffDays} days`,
        className: "bg-muted text-muted-foreground",
    };
}

export function generateGoogleCalendarUrl(
    interview: InterviewItem,
    durationMinutes: number = 60,
): string {
    const startDate = new Date(interview.scheduledAt);
    const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

    const formatGCalDate = (d: Date) =>
        d.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const startISO = formatGCalDate(startDate);
    const endISO = formatGCalDate(endDate);

    const title = `[Interview] ${interview.title} - ${interview.companyName || "Company"}`;

    const detailsParts = [
        interview.applicationPosition ? `Role: ${interview.applicationPosition}` : null,
        interview.companyName ? `Company: ${interview.companyName}` : null,
        `Stage: ${interview.stage.replace(/_/g, " ")}`,
        interview.meetingUrl ? `Meeting Link: ${interview.meetingUrl}` : null,
        interview.location ? `Location: ${interview.location}` : null,
        interview.notes ? `\nNotes:\n${interview.notes}` : null,
    ].filter(Boolean);

    const details = detailsParts.join("\n");
    const location = interview.meetingUrl || interview.location || "";

    const params = new URLSearchParams({
        action: "TEMPLATE",
        text: title,
        dates: `${startISO}/${endISO}`,
        details,
        location,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcsFile(
    interview: InterviewItem,
    durationMinutes: number = 60,
): void {
    const startDate = new Date(interview.scheduledAt);
    const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

    const formatIcsDate = (d: Date) =>
        d.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const nowISO = formatIcsDate(new Date());
    const startISO = formatIcsDate(startDate);
    const endISO = formatIcsDate(endDate);

    const title = `[Interview] ${interview.title} - ${interview.companyName || "Company"}`;
    const location = interview.meetingUrl || interview.location || "";
    const description = [
        `Role: ${interview.applicationPosition || "-"}`,
        `Company: ${interview.companyName || "-"}`,
        `Meeting Link: ${interview.meetingUrl || "-"}`,
        interview.notes ? `Notes: ${interview.notes}` : "",
    ]
        .filter(Boolean)
        .join("\\n");

    const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//JobTracker//Interview Schedule//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `UID:${interview.id}-${startDate.getTime()}@jobtracker`,
        `DTSTAMP:${nowISO}`,
        `DTSTART:${startISO}`,
        `DTEND:${endISO}`,
        `SUMMARY:${title}`,
        `DESCRIPTION:${description}`,
        `LOCATION:${location}`,
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute(
        "download",
        `interview-${(interview.companyName || "meeting").toLowerCase().replace(/\s+/g, "-")}.ics`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
