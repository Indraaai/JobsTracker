import { auth } from "@/auth";
import { createTaskSchema } from "@/core/schemas/task.schema";
import {
    createTaskService,
    getTasks,
} from "@/core/services/task.service";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return Response.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 },
            );
        }

        const tasks = await getTasks(session.user.id);

        return Response.json({
            success: true,
            data: tasks,
        });
    } catch (error) {
        console.error("Get tasks error:", error);

        return Response.json(
            {
                success: false,
                message: "Something went wrong",
            },
            { status: 500 },
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return Response.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 },
            );
        }

        const body = await request.json();

        const validation = createTaskSchema.safeParse(body);

        if (!validation.success) {
            return Response.json(
                {
                    success: false,
                    message: "Validation failed",
                    errors: validation.error.flatten().fieldErrors,
                },
                { status: 400 },
            );
        }

        const task = await createTaskService(
            session.user.id,
            validation.data,
        );

        return Response.json(
            {
                success: true,
                message: "Task created successfully",
                data: task,
            },
            { status: 201 },
        );
    } catch (error) {
        if (error instanceof Error && error.message === "Application not found") {
            return Response.json(
                {
                    success: false,
                    message: error.message,
                },
                { status: 404 },
            );
        }

        console.error("Create task error:", error);

        return Response.json(
            {
                success: false,
                message: "Something went wrong",
            },
            { status: 500 },
        );
    }
}
