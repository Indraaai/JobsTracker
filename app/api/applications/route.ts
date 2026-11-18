import { auth } from "@/auth";
import { createApplicationSchema } from "@/core/schemas/application.schema";
import {
    createApplicationService,
    getApplications,
} from "@/core/services/application.service";

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

        const applications = await getApplications(
            session.user.id,
        );

        return Response.json({
            success: true,
            data: applications,
        });
    } catch (error) {
        console.error("Get applications error:", error);

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

        const validation =
            createApplicationSchema.safeParse(body);

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
            await createApplicationService(
                session.user.id,
                validation.data,
            );

        return Response.json(
            {
                success: true,
                message: "Application created successfully",
                data: application,
            },
            { status: 201 },
        );
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Company not found") {
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
            "Create application error:",
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