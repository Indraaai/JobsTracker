"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setError("");
        setLoading(true);

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            setError("Email atau password salah.");
            return;
        }

        window.location.href = "/dashboard";
    }

    async function handleGoogleLogin() {
        await signIn("google", {
            callbackUrl: "/dashboard",
        });
    }

    return (
        <div className="w-full max-w-md">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">
                    Welcome back
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                    Login to your Job Tracker account.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-500">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-border" />

                <span className="text-xs text-muted-foreground">
                    OR
                </span>

                <div className="h-px flex-1 bg-border" />
            </div>

            <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
                Continue with Google
            </button>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                Belum punya akun?{" "}
                <Link
                    href="/register"
                    className="font-medium text-foreground underline"
                >
                    Register
                </Link>
            </p>
        </div>
    );
}

export default LoginForm;