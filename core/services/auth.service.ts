import { createUser, findUserByEmail } from "@/core/repositories/user.repository";
import { RegisterInput } from "@/core/schemas/auth.schema";
import bcrypt from "bcryptjs";

export async function registerUser(input: RegisterInput) {
    const existingUser = await findUserByEmail(input.email);

    if (existingUser) {
        throw new Error("Email is already registered");
    }

    const passwordHash = await bcrypt.hash(input.password, 12);

    const user = await createUser({
        id: crypto.randomUUID(),
        name: input.name,
        email: input.email,
        passwordHash,
    });

    return user;

}

export async function authenticateUser(
    email: string,
    password: string,
) {
    const user = await findUserByEmail(email);

    if (!user || !user.passwordHash) {
        return null;
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.passwordHash,
    );

    if (!isPasswordValid) {
        return null;
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
    };
}
