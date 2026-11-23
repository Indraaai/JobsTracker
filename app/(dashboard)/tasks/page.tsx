import { auth } from "@/auth";
import { getTasks } from "@/core/services/task.service";
import TaskList from "@/components/tasks/task-list";
import type { TaskItem } from "@/lib/utils/task-helpers";

export default async function TasksPage() {
    const session = await auth();
    let initialTasks: TaskItem[] = [];

    if (session?.user?.id) {
        try {
            const rawTasks = await getTasks(session.user.id);
            // Serialize dates for client components
            initialTasks = JSON.parse(JSON.stringify(rawTasks));
        } catch {
            // fallback to empty if db is cold/error
        }
    }

    return <TaskList initialData={initialTasks} />;
}
