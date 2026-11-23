import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { findContactsByUserId } from "@/core/repositories/contact.repository";
import { findCompaniesByUserId } from "@/core/repositories/company.repository";
import ContactList from "@/components/contacts/contact-list";

export const metadata = {
    title: "Contacts & Recruiters | JobTracker",
    description: "Manage your professional recruitment network and contacts.",
};

export default async function ContactsPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const [contacts, companies] = await Promise.all([
        findContactsByUserId(session.user.id),
        findCompaniesByUserId(session.user.id),
    ]);

    return (
        <div className="container max-w-6xl py-6 px-4 sm:px-6">
            <ContactList
                initialContacts={contacts}
                initialCompanies={companies}
            />
        </div>
    );
}
