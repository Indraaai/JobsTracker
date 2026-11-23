"use client";

import { useMemo, useState } from "react";
import { Plus, Search, UserCheck } from "lucide-react";
import ContactCard from "./contact-card";
import ContactForm from "./contact-form";
import {
    useContacts,
    useCreateContact,
    useDeleteContact,
    useUpdateContact,
} from "@/hooks/use-contacts";
import { useCompanies } from "@/hooks/use-companies";
import type { ContactWithCompany } from "@/core/repositories/contact.repository";
import type { Company } from "@/db/schema/companies";

type ContactListProps = {
    initialContacts: ContactWithCompany[];
    initialCompanies: Company[];
};

export default function ContactList({
    initialContacts,
    initialCompanies,
}: ContactListProps) {
    const { data: contacts = [] } = useContacts(initialContacts);
    const { data: companies = [] } = useCompanies(initialCompanies);

    const createMutation = useCreateContact();
    const updateMutation = useUpdateContact();
    const deleteMutation = useDeleteContact();

    const [search, setSearch] = useState("");
    const [selectedCompanyId, setSelectedCompanyId] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingContact, setEditingContact] =
        useState<ContactWithCompany | null>(null);

    const filteredContacts = useMemo(() => {
        return contacts.filter((c) => {
            const matchesSearch =
                c.name.toLowerCase().includes(search.toLowerCase()) ||
                (c.role && c.role.toLowerCase().includes(search.toLowerCase())) ||
                (c.companyName &&
                    c.companyName.toLowerCase().includes(search.toLowerCase())) ||
                (c.email && c.email.toLowerCase().includes(search.toLowerCase()));

            const matchesCompany =
                !selectedCompanyId || c.companyId === selectedCompanyId;

            return matchesSearch && matchesCompany;
        });
    }, [contacts, search, selectedCompanyId]);

    const handleOpenCreate = () => {
        setEditingContact(null);
        setIsFormOpen(true);
    };

    const handleEdit = (contact: ContactWithCompany) => {
        setEditingContact(contact);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to remove this contact?")) return;
        await deleteMutation.mutateAsync(id);
    };

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Recruiter & Contacts Directory
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Track hiring managers, HR recruiters, and industry peers for networking.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleOpenCreate}
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    <span>Add Contact</span>
                </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, role, company, or email..."
                        className="w-full rounded-lg border bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                </div>

                <select
                    value={selectedCompanyId}
                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                    className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                    <option value="">All Companies</option>
                    {companies.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Content List */}
            <div className="rounded-xl border bg-card shadow-xs overflow-hidden divide-y">
                {filteredContacts.length === 0 ? (
                    <div className="py-12 px-4 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <UserCheck className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="mt-3 text-sm font-semibold text-foreground">
                            No contacts found
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
                            {search || selectedCompanyId
                                ? "No contacts match your current filter criteria."
                                : "Start building your network by adding your first recruiter or interviewer."}
                        </p>
                        {!search && !selectedCompanyId && (
                            <button
                                type="button"
                                onClick={handleOpenCreate}
                                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                <span>Add First Contact</span>
                            </button>
                        )}
                    </div>
                ) : (
                    filteredContacts.map((contact) => (
                        <ContactCard
                            key={contact.id}
                            contact={contact}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            isBusy={deleteMutation.isPending}
                        />
                    ))
                )}
            </div>

            {/* Modal Form */}
            {isFormOpen && (
                <ContactForm
                    initialData={editingContact}
                    companies={companies}
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={async (data) => {
                        if (editingContact) {
                            await updateMutation.mutateAsync({
                                id: editingContact.id,
                                data,
                            });
                        } else {
                            await createMutation.mutateAsync(data);
                        }
                    }}
                />
            )}
        </div>
    );
}
