"use client";

import {
    Building2,
    Mail,
    Pencil,
    Phone,
    Trash2,
    UserCheck,
} from "lucide-react";
import Image from "next/image";
import type { ContactWithCompany } from "@/core/repositories/contact.repository";

type ContactCardProps = {
    contact: ContactWithCompany;
    onEdit: (contact: ContactWithCompany) => void;
    onDelete: (id: string) => void;
    isBusy?: boolean;
};

export default function ContactCard({
    contact,
    onEdit,
    onDelete,
    isBusy,
}: ContactCardProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 hover:bg-muted/20 transition-colors">
            <div className="flex min-w-0 items-start sm:items-center gap-3">
                {contact.companyLogo ? (
                    <Image
                        src={contact.companyLogo}
                        alt={`${contact.companyName ?? "Company"} logo`}
                        width={40}
                        height={40}
                        unoptimized
                        className="h-10 w-10 rounded-lg border object-contain bg-background shrink-0 mt-0.5 sm:mt-0"
                    />
                ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mt-0.5 sm:mt-0">
                        <UserCheck className="h-5 w-5" />
                    </div>
                )}

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm sm:text-base font-semibold text-foreground">
                            {contact.name}
                        </p>
                        {contact.role && (
                            <span className="rounded-md bg-secondary/80 px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                                {contact.role}
                            </span>
                        )}
                        {contact.companyName && (
                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-medium">
                                <Building2 className="h-3 w-3" />
                                {contact.companyName}
                            </span>
                        )}
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        {contact.email && (
                            <a
                                href={`mailto:${contact.email}`}
                                className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                                <Mail className="h-3 w-3 shrink-0" />
                                <span className="truncate max-w-[180px] sm:max-w-[220px]">
                                    {contact.email}
                                </span>
                            </a>
                        )}

                        {contact.phone && (
                            <a
                                href={`tel:${contact.phone}`}
                                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                            >
                                <Phone className="h-3 w-3 shrink-0" />
                                <span>{contact.phone}</span>
                            </a>
                        )}

                        {contact.linkedinUrl && (
                            <a
                                href={contact.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[#0A66C2] hover:underline font-medium"
                            >
                                <svg
                                    className="h-3 w-3 shrink-0 fill-current"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.66 1.66 0 0 0-1.66 1.66 1.66 1.66 0 0 0 1.66 1.66 1.66 1.66 0 0 0 1.66-1.66 1.66 1.66 0 0 0-1.66-1.66Z" />
                                </svg>
                                <span>LinkedIn Profile</span>
                            </a>
                        )}
                    </div>

                    {contact.notes && (
                        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-1 italic">
                            &ldquo;{contact.notes}&rdquo;
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-end gap-1 shrink-0 self-end sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto">
                <button
                    type="button"
                    onClick={() => onEdit(contact)}
                    disabled={isBusy}
                    className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors disabled:opacity-50"
                >
                    <Pencil className="h-3.5 w-3.5" />
                    <span>Edit</span>
                </button>

                <button
                    type="button"
                    onClick={() => onDelete(contact.id)}
                    disabled={isBusy}
                    className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                </button>
            </div>
        </div>
    );
}
