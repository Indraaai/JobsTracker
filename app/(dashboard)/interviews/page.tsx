import { auth } from "@/auth";
import { getInterviews } from "@/core/services/interview.service";
import InterviewList from "@/components/interviews/interview-list";
import type { InterviewItem } from "@/lib/utils/interview-helpers";

export default async function InterviewsPage() {
    const session = await auth();
    let initialInterviews: InterviewItem[] = [];

    if (session?.user?.id) {
        try {
            const rawInterviews = await getInterviews(session.user.id);
            initialInterviews = JSON.parse(JSON.stringify(rawInterviews));
        } catch {
            // fallback
        }
    }

    return <InterviewList initialData={initialInterviews} />;
}
