import { registerSchema } from "@/core/schemas/auth.schema";
import { registerUser } from "@/core/services/auth.service";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const validation = registerSchema.safeParse(body);

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

        const user = await registerUser(validation.data);

        return Response.json(
            {
                success: true,
                message: "Registration successful",
                data: user,
            },
            { status: 201 },
        );
    } catch (error) {
        if (
            error instanceof Error &&
            error.message === "Email is already registered"
        ) {
            return Response.json(
                {
                    success: false,
                    message: error.message,
                },
                { status: 409 },
            );
        }

        console.error("Registration error:", error);

        return Response.json(
            {
                success: false,
                message: "Something went wrong",
            },
            { status: 500 },
        );
    }
}