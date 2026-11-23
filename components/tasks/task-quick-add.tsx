"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";

type TaskQuickAddProps = {
    onAdd: (title: string, priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT") => Promise<void>;
    disabled?: boolean;
};

export default function TaskQuickAdd({ onAdd, disabled }: TaskQuickAddProps) {
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onAdd(title.trim(), priority);
            setTitle("");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 rounded-xl border bg-background p-2 shadow-xs"
        >
            <div className="pl-2 text-muted-foreground">
                <Plus className="h-5 w-5" />
            </div>
            <input
                type="text"
                placeholder="Quick add a to-do (e.g. Email recruiter, polish CV) and press Enter..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={disabled || isSubmitting}
                className="flex-1 bg-transparent px-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as typeof priority)}
                disabled={disabled || isSubmitting}
                className="rounded-lg border bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground focus:outline-none"
            >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent 🚨</option>
            </select>
            <button
                type="submit"
                disabled={disabled || isSubmitting || !title.trim()}
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
            </button>
        </form>
    );
}
