import { auth } from "@/auth";
import { createInterviewSchema } from "@/core/schemas/interview.schema";
import {
    createInterviewService,
    getInterviews,
} from "@/core/services/interview.service";

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

        const interviews = await getInterviews(session.user.id);

        return Response.json({
            success: true,
            data: interviews,
        });
    } catch (error) {
        console.error("Get interviews error:", error);

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

        const validation = createInterviewSchema.safeParse(body);

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

        const interview = await createInterviewService(
            session.user.id,
            validation.data,
        );

        return Response.json(
            {
                success: true,
                message: "Interview scheduled successfully",
                data: interview,
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

        console.error("Create interview error:", error);

        return Response.json(
            {
                success: false,
                message: "Something went wrong",
            },
            { status: 500 },
        );
    }
}
