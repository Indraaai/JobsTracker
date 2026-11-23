import { auth } from "@/auth";
import { createContactSchema } from "@/core/schemas/contact.schema";
import {
    createContactService,
    getContactsService,
} from "@/core/services/contact.service";

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

        const contacts = await getContactsService(session.user.id);

        return Response.json({
            success: true,
            data: contacts,
        });
    } catch (error) {
        console.error("Get contacts error:", error);

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

        const validation = createContactSchema.safeParse(body);

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

        const contact = await createContactService(
            session.user.id,
            validation.data,
        );

        return Response.json(
            {
                success: true,
                data: contact,
                message: "Contact created successfully",
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Create contact error:", error);

        return Response.json(
            {
                success: false,
                message: "Something went wrong",
            },
            { status: 500 },
        );
    }
}
