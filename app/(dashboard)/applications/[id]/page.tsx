import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { findApplicationById } from "@/core/repositories/application.repository";
import { findInterviewsByApplicationId } from "@/core/repositories/interview.repository";
import { findTasksByApplicationId } from "@/core/repositories/task.repository";
import { findContactsByCompanyId } from "@/core/repositories/contact.repository";
import { findCompaniesByUserId } from "@/core/repositories/company.repository";
import ApplicationDetail from "@/components/applications/application-detail";

export const metadata = {
    title: "Application Details | JobTracker",
    description: "360-degree cockpit view of your job application progress.",
};

export default async function ApplicationDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const { id } = await params;
    const application = await findApplicationById(id, session.user.id);

    if (!application) {
        notFound();
    }

    const [interviews, tasks, contacts, companies] = await Promise.all([
        findInterviewsByApplicationId(id, session.user.id),
        findTasksByApplicationId(id, session.user.id),
        findContactsByCompanyId(application.companyId, session.user.id),
        findCompaniesByUserId(session.user.id),
    ]);

    return (
        <div className="container max-w-6xl py-6 px-4 sm:px-6">
            <ApplicationDetail
                initialApplication={application}
                initialInterviews={interviews}
                initialTasks={tasks}
                initialContacts={contacts}
                companies={companies}
            />
        </div>
    );
}
