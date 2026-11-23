import { auth } from "@/auth";
import { updateContactSchema } from "@/core/schemas/contact.schema";
import {
    deleteContactService,
    getContactByIdService,
    updateContactService,
} from "@/core/services/contact.service";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
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
        const contact = await getContactByIdService(id, session.user.id);

        if (!contact) {
            return Response.json(
                {
                    success: false,
                    message: "Contact not found",
                },
                { status: 404 },
            );
        }

        return Response.json({
            success: true,
            data: contact,
        });
    } catch (error) {
        console.error("Get contact error:", error);

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
    { params }: { params: Promise<{ id: string }> },
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

        const validation = updateContactSchema.safeParse(body);

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

        const updated = await updateContactService(
            id,
            session.user.id,
            validation.data,
        );

        if (!updated) {
            return Response.json(
                {
                    success: false,
                    message: "Contact not found",
                },
                { status: 404 },
            );
        }

        return Response.json({
            success: true,
            data: updated,
            message: "Contact updated successfully",
        });
    } catch (error) {
        console.error("Update contact error:", error);

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
    { params }: { params: Promise<{ id: string }> },
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
        const deleted = await deleteContactService(id, session.user.id);

        if (!deleted) {
            return Response.json(
                {
                    success: false,
                    message: "Contact not found",
                },
                { status: 404 },
            );
        }

        return Response.json({
            success: true,
            message: "Contact deleted successfully",
        });
    } catch (error) {
        console.error("Delete contact error:", error);

        return Response.json(
            {
                success: false,
                message: "Something went wrong",
            },
            { status: 500 },
        );
    }
}
