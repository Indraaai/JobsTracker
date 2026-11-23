import { auth } from "@/auth";
import { getApplications } from "@/core/services/application.service";
import ApplicationList from "@/components/applications/application-list";
import type { ApplicationItem } from "@/lib/utils/application-helpers";

export default async function ApplicationsPage() {
    const session = await auth();
    let initialApplications: ApplicationItem[] = [];

    if (session?.user?.id) {
        try {
            const rawApps = await getApplications(session.user.id);
            initialApplications = JSON.parse(JSON.stringify(rawApps));
        } catch {
            // fallback
        }
    }

    return <ApplicationList initialData={initialApplications} />;
}
