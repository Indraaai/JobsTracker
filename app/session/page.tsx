import { auth } from "@/auth";

export default async function SessionPage() {
  const session = await auth();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Session</h1>

      <pre className="mt-4 rounded-lg bg-gray-100 p-4">
        {JSON.stringify(session, null, 2)}
      </pre>
    </main>
  );
}