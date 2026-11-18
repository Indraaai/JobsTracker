import { auth } from "@/auth";
import { updateCompanySchema } from "@/core/schemas/company.schema";
import {
    deleteCompanyService,
    getCompany,
    updateCompanyService,
} from "@/core/services/company.service";

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

        const company = await getCompany(
            id,
            session.user.id,
        );

        if (!company) {
            return Response.json(
                {
                    success: false,
                    message: "Company not found",
                },
                { status: 404 },
            );
        }

        return Response.json({
            success: true,
            data: company,
        });
    } catch (error) {
        console.error("Get company error:", error);

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

        const validation = updateCompanySchema.safeParse(body);

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

        const company = await updateCompanyService(
            id,
            session.user.id,
            validation.data,
        );

        return Response.json({
            success: true,
            message: "Company updated successfully",
            data: company,
        });
    } catch (error) {
        if (
            error instanceof Error &&
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

        console.error("Update company error:", error);

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

        const company = await deleteCompanyService(
            id,
            session.user.id,
        );

        if (!company) {
            return Response.json(
                {
                    success: false,
                    message: "Company not found",
                },
                { status: 404 },
            );
        }

        return Response.json({
            success: true,
            message: "Company deleted successfully",
        });
    } catch (error) {
        if (
            error instanceof Error &&
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

        console.error("Delete company error:", error);

        return Response.json(
            {
                success: false,
                message: "Something went wrong",
            },
            { status: 500 },
        );
    }
}