import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema/auth";

export async function createUser(data: {
    id: string
    email: string
    name: string
    passwordHash: string
}) {
    const result = await db.insert(users).values({
        id: data.id,
        email: data.email,
        name: data.name,
        passwordHash: data.passwordHash,
    })
        .returning({ id: users.id, email: users.email, name: users.name, image: users.image })
    return result[0] || null
}

export async function findUserByEmail(email: string) {
    const result = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

    return result[0] ?? null;
}