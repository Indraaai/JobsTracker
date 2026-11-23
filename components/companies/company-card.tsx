"use client";

import { Building2, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

export type CompanyItem = {
    id: string;
    name: string;
    logoUrl?: string | null;
    websiteUrl?: string | null;
    linkedinUrl?: string | null;
    location?: string | null;
    industry?: string | null;
    notes?: string | null;
};

type CompanyCardProps = {
    company: CompanyItem;
    onEdit: (company: CompanyItem) => void;
    onDelete: (id: string) => void;
    isBusy?: boolean;
};

export default function CompanyCard({
    company,
    onEdit,
    onDelete,
    isBusy,
}: CompanyCardProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 hover:bg-muted/20 transition-colors">
            <div className="flex min-w-0 items-center gap-3">
                {company.logoUrl ? (
                    <Image
                        src={company.logoUrl}
                        alt={`${company.name} logo`}
                        width={40}
                        height={40}
                        unoptimized
                        className="h-10 w-10 rounded-lg border object-contain bg-background shrink-0"
                    />
                ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                        <Building2 className="h-5 w-5" />
                    </div>
                )}

                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm sm:text-base font-semibold text-foreground">
                        {company.name}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
                        {company.industry && (
                            <span className="inline-flex items-center gap-1">
                                🏢 {company.industry}
                            </span>
                        )}

                        {company.location && (
                            <span className="inline-flex items-center gap-1">
                                📍 {company.location}
                            </span>
                        )}

                        {company.websiteUrl && (
                            <a
                                href={company.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                Website
                            </a>
                        )}

                        {company.linkedinUrl && (
                            <a
                                href={company.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                LinkedIn
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end sm:justify-start gap-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40 shrink-0">
                <button
                    type="button"
                    onClick={() => onEdit(company)}
                    disabled={isBusy}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors disabled:opacity-50"
                    title="Edit company"
                >
                    <Pencil className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => onDelete(company.id)}
                    disabled={isBusy}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50"
                    title="Delete company"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
