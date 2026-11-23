"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import type { ContactWithCompany } from "@/core/repositories/contact.repository";
import type { Company } from "@/db/schema/companies";
import type { CreateContactInput } from "@/core/schemas/contact.schema";

type ContactFormProps = {
    initialData?: ContactWithCompany | null;
    companies: Company[];
    defaultCompanyId?: string | null;
    onClose: () => void;
    onSubmit: (data: CreateContactInput) => Promise<void>;
};

export default function ContactForm({
    initialData,
    companies,
    defaultCompanyId,
    onClose,
    onSubmit,
}: ContactFormProps) {
    const [name, setName] = useState(initialData?.name ?? "");
    const [role, setRole] = useState(initialData?.role ?? "");
    const [companyId, setCompanyId] = useState(
        initialData?.companyId ?? defaultCompanyId ?? "",
    );
    const [email, setEmail] = useState(initialData?.email ?? "");
    const [phone, setPhone] = useState(initialData?.phone ?? "");
    const [linkedinUrl, setLinkedinUrl] = useState(
        initialData?.linkedinUrl ?? "",
    );
    const [notes, setNotes] = useState(initialData?.notes ?? "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError("Contact name is required");
            return;
        }

        try {
            setLoading(true);
            await onSubmit({
                name: name.trim(),
                role: role.trim() || undefined,
                companyId: companyId || undefined,
                email: email.trim() || undefined,
                phone: phone.trim() || undefined,
                linkedinUrl: linkedinUrl.trim() || undefined,
                notes: notes.trim() || undefined,
            });
            onClose();
        } catch (err: unknown) {
            setError(
                err instanceof Error ? err.message : "Failed to save contact",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="w-full max-w-lg rounded-xl border bg-card p-5 sm:p-6 shadow-xl my-8">
                <div className="flex items-center justify-between pb-4 border-b">
                    <h3 className="text-lg font-semibold text-foreground">
                        {initialData ? "Edit Contact" : "Add Recruiter / Contact"}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {error && (
                    <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Sarah Jenkins"
                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Role / Title
                            </label>
                            <input
                                type="text"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                placeholder="e.g. Senior Tech Recruiter"
                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Company
                            </label>
                            <select
                                value={companyId}
                                onChange={(e) => setCompanyId(e.target.value)}
                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            >
                                <option value="">Select company (optional)</option>
                                {companies.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="sarah@example.com"
                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+62 812 3456 7890"
                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                LinkedIn Profile URL
                            </label>
                            <input
                                type="url"
                                value={linkedinUrl}
                                onChange={(e) => setLinkedinUrl(e.target.value)}
                                placeholder="https://linkedin.com/in/username"
                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Notes & Relationship Details
                            </label>
                            <textarea
                                rows={2}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="e.g. Connected via Tech in Asia job fair, very responsive on WhatsApp."
                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {initialData ? "Save Changes" : "Create Contact"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
