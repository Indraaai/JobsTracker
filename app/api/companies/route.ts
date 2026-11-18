import { auth } from "@/auth";
import { createCompanySchema } from "@/core/schemas/company.schema";
import {
    createCompanyService,
    getCompanies,
} from "@/core/services/company.service";

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

        const companies = await getCompanies(session.user.id);

        return Response.json({
            success: true,
            data: companies,
        });
    } catch (error) {
        console.error("Get companies error:", error);

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

        const validation = createCompanySchema.safeParse(body);

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

        const company = await createCompanyService(
            session.user.id,
            validation.data,
        );

        return Response.json(
            {
                success: true,
                message: "Company created successfully",
                data: company,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Create company error:", error);

        return Response.json(
            {
                success: false,
                message: "Something went wrong",
            },
            { status: 500 },
        );
    }
}