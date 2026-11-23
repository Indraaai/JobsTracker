import { auth } from "@/auth";
import { updateTaskSchema } from "@/core/schemas/task.schema";
import {
    deleteTaskService,
    getTask,
    updateTaskService,
} from "@/core/services/task.service";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(
    _request: Request,
    { params }: RouteContext,
) {
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

        const { id } = await params;

        const task = await getTask(id, session.user.id);

        if (!task) {
            return Response.json(
                {
                    success: false,
                    message: "Task not found",
                },
                { status: 404 },
            );
        }

        return Response.json({
            success: true,
            data: task,
        });
    } catch (error) {
        console.error("Get task error:", error);

        return Response.json(
            {
                success: false,
                message: "Something went wrong",
            },
            { status: 500 },
        );
    }
}

export async function PUT(
    request: Request,
    { params }: RouteContext,
) {
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

        const { id } = await params;
        const body = await request.json();

        const validation = updateTaskSchema.safeParse(body);

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

        const updatedTask = await updateTaskService(
            id,
            session.user.id,
            validation.data,
        );

        return Response.json({
            success: true,
            message: "Task updated successfully",
            data: updatedTask,
        });
    } catch (error) {
        if (error instanceof Error) {
            if (
                error.message === "Task not found" ||
                error.message === "Target application not found"
            ) {
                return Response.json(
                    {
                        success: false,
                        message: error.message,
                    },
                    { status: 404 },
                );
            }
        }

        console.error("Update task error:", error);

        return Response.json(
            {
                success: false,
                message: "Something went wrong",
            },
            { status: 500 },
        );
    }
}

export async function DELETE(
    _request: Request,
    { params }: RouteContext,
) {
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

        const { id } = await params;

        const deleted = await deleteTaskService(id, session.user.id);

        if (!deleted) {
            return Response.json(
                {
                    success: false,
                    message: "Task not found",
                },
                { status: 404 },
            );
        }

        return Response.json({
            success: true,
            message: "Task deleted successfully",
        });
    } catch (error) {
        if (error instanceof Error && error.message === "Task not found") {
            return Response.json(
                {
                    success: false,
                    message: error.message,
                },
                { status: 404 },
            );
        }

        console.error("Delete task error:", error);

        return Response.json(
            {
                success: false,
                message: "Something went wrong",
            },
            { status: 500 },
        );
    }
}
