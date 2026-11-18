import { auth } from "@/auth";
import { updateApplicationSchema } from "@/core/schemas/application.schema";
import {
    deleteApplicationService,
    getApplication,
    updateApplicationService,
} from "@/core/services/application.service";

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

        const application = await getApplication(
            id,
            session.user.id,
        );

        if (!application) {
            return Response.json(
                {
                    success: false,
                    message: "Application not found",
                },
                { status: 404 },
            );
        }

        return Response.json({
            success: true,
            data: application,
        });
    } catch (error) {
        console.error("Get application error:", error);

        return Response.json(
            {
                success: false,
                message: "Something went wrong",
            },
            { status: 500 },
        );
    }
}

export async function PATCH(
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

        const validation =
            updateApplicationSchema.safeParse(body);

        if (!validation.success) {
            return Response.json(
                {
                    success: false,
                    message: "Validation failed",
                    errors:
                        validation.error.flatten().fieldErrors,
                },
                { status: 400 },
            );
        }

        const application =
            await updateApplicationService(
                id,
                session.user.id,
                validation.data,
            );

        return Response.json({
            success: true,
            message: "Application updated successfully",
            data: application,
        });
    } catch (error) {
        if (error instanceof Error) {
            if (
                error.message === "Application not found" ||
                error.message === "Company not found"
            ) {
                return Response.json(
                    {
                        success: false,
                        message: error.message,
                    },
                    { status: 404 },
                );
            }

            if (
                error.message ===
                "Minimum salary cannot be greater than maximum salary"
            ) {
                return Response.json(
                    {
                        success: false,
                        message: error.message,
                    },
                    { status: 400 },
                );
            }
        }

        console.error(
            "Update application error:",
            error,
        );

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

        const application =
            await deleteApplicationService(
                id,
                session.user.id,
            );

        if (!application) {
            return Response.json(
                {
                    success: false,
                    message: "Application not found",
                },
                { status: 404 },
            );
        }

        return Response.json({
            success: true,
            message: "Application deleted successfully",
        });
    } catch (error) {
        if (
            error instanceof Error &&
            error.message === "Application not found"
        ) {
            return Response.json(
                {
                    success: false,
                    message: error.message,
                },
                { status: 404 },
            );
        }

        console.error(
            "Delete application error:",
            error,
        );

        return Response.json(
            {
                success: false,
                message: "Something went wrong",
            },
            { status: 500 },
        );
    }
}