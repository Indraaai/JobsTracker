"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Password dan konfirmasi password tidak sama.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.message ?? "Registration failed.");
                return;
            }
            setSuccess("Registrasi berhasil. Anda akan diarahkan ke halaman login dalam 3 detik.");
            setTimeout(() => {
                window.location.href = "/login";
            }, 3000);

            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
        } catch {
            setError("Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-md">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">
                    Create an account
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                    Create your Job Tracker account.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                        Name
                    </label>

                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        required
                        className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                    />
                </div>

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
                        placeholder="Minimum 8 characters"
                        minLength={8}
                        required
                        className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium"
                    >
                        Confirm Password
                    </label>

                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat your password"
                        minLength={8}
                        required
                        className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-500">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="text-sm text-green-600">
                        {success}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                    {loading ? "Creating account..." : "Create account"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="font-medium text-foreground underline"
                >
                    Login
                </Link>
            </p>
        </div>
    );
}