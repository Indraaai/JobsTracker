"use client";

import { useState } from "react";
import Link from "next/link";
import { BriefcaseBusiness, ArrowRight, Menu, X } from "lucide-react";

type LandingNavbarProps = {
    isLoggedIn?: boolean;
    userName?: string | null;
};

export default function LandingNavbar({
    isLoggedIn,
    userName,
}: LandingNavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-md">
            <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                {/* Logo & Brand */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs group-hover:scale-105 transition-transform">
                        <BriefcaseBusiness className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="font-bold text-base tracking-tight text-foreground">
                            JobTracker
                        </span>
                        <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                            v1.0
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider font-medium text-muted-foreground">
                    <a
                        href="#features"
                        className="hover:text-foreground transition-colors"
                    >
                        Features
                    </a>
                    <a
                        href="#preview"
                        className="hover:text-foreground transition-colors"
                    >
                        Preview
                    </a>
                    <a
                        href="#faq"
                        className="hover:text-foreground transition-colors"
                    >
                        FAQ
                    </a>
                </nav>

                {/* Desktop Auth CTAs */}
                <div className="hidden sm:flex items-center gap-3">
                    {isLoggedIn ? (
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
                        >
                            <span>Dashboard ({userName || "User"})</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
                            >
                                <span>Get Started</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Right Bar: Hamburger Button */}
                <div className="flex items-center gap-2 sm:hidden">
                    {isLoggedIn ? (
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                        >
                            <span>Dashboard</span>
                            <ArrowRight className="h-3 w-3" />
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="inline-flex items-center rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                        >
                            Sign In
                        </Link>
                    )}

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                        aria-label="Toggle navigation menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden border-b bg-background px-4 py-4 animate-in slide-in-from-top-2 duration-150 shadow-lg">
                    <nav className="flex flex-col space-y-3 text-sm font-semibold">
                        <a
                            href="#features"
                            onClick={closeMobileMenu}
                            className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                        >
                            Features
                        </a>
                        <a
                            href="#preview"
                            onClick={closeMobileMenu}
                            className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                        >
                            Preview
                        </a>
                        <a
                            href="#faq"
                            onClick={closeMobileMenu}
                            className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                        >
                            FAQ
                        </a>

                        <div className="border-t pt-3 flex flex-col gap-2">
                            {isLoggedIn ? (
                                <Link
                                    href="/dashboard"
                                    onClick={closeMobileMenu}
                                    className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground"
                                >
                                    <span>Go to Dashboard</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/register"
                                        onClick={closeMobileMenu}
                                        className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground"
                                    >
                                        <span>Create Free Account</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        href="/login"
                                        onClick={closeMobileMenu}
                                        className="flex items-center justify-center rounded-lg border px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent"
                                    >
                                        Sign In to Existing Account
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
