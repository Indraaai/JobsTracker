import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;

// Client postgres untuk PostgreSQL lokal maupun cloud
const client = postgres(connectionString);

export const db = drizzle(client);
