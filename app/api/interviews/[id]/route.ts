import { auth } from "@/auth";
import { updateInterviewSchema } from "@/core/schemas/interview.schema";
import {
    deleteInterviewService,
    getInterview,
    updateInterviewService,
} from "@/core/services/interview.service";

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

        const interview = await getInterview(id, session.user.id);

        if (!interview) {
            return Response.json(
                {
                    success: false,
                    message: "Interview not found",
                },
                { status: 404 },
            );
        }

        return Response.json({
            success: true,
            data: interview,
        });
    } catch (error) {
        console.error("Get interview error:", error);

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

        const validation = updateInterviewSchema.safeParse(body);

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

        const updatedInterview = await updateInterviewService(
            id,
            session.user.id,
            validation.data,
        );

        return Response.json({
            success: true,
            message: "Interview updated successfully",
            data: updatedInterview,
        });
    } catch (error) {
        if (error instanceof Error) {
            if (
                error.message === "Interview not found" ||
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

        console.error("Update interview error:", error);

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

        const deleted = await deleteInterviewService(id, session.user.id);

        if (!deleted) {
            return Response.json(
                {
                    success: false,
                    message: "Interview not found",
                },
                { status: 404 },
            );
        }

        return Response.json({
            success: true,
            message: "Interview deleted successfully",
        });
    } catch (error) {
        if (error instanceof Error && error.message === "Interview not found") {
            return Response.json(
                {
                    success: false,
                    message: error.message,
                },
                { status: 404 },
            );
        }

        console.error("Delete interview error:", error);

        return Response.json(
            {
                success: false,
                message: "Something went wrong",
            },
            { status: 500 },
        );
    }
}
