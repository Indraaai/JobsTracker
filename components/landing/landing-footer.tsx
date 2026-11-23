import Link from "next/link";
import { BriefcaseBusiness } from "lucide-react";

export default function LandingFooter() {
    return (
        <footer className="border-t bg-background py-10">
            <div className="container mx-auto max-w-6xl px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    {/* Brand */}
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <BriefcaseBusiness className="h-4 w-4" />
                        </div>
                        <span className="font-bold text-sm tracking-tight text-foreground">
                            JobTracker
                        </span>
                        <span className="text-xs text-muted-foreground ml-2">
                            © {new Date().getFullYear()} All rights reserved.
                        </span>
                    </div>

                    {/* Quick navigation */}
                    <div className="flex items-center gap-6 text-xs text-muted-foreground">
                        <Link href="/login" className="hover:text-foreground transition-colors">
                            Sign In
                        </Link>
                        <Link href="/register" className="hover:text-foreground transition-colors">
                            Create Account
                        </Link>
                        <a href="#features" className="hover:text-foreground transition-colors">
                            Features
                        </a>
                        <a href="#preview" className="hover:text-foreground transition-colors">
                            Preview
                        </a>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border/40 text-center text-[11px] text-muted-foreground/70">
                    Built for ambitious job seekers with Next.js, Bun, Tailwind CSS & Drizzle ORM.
                </div>
            </div>
        </footer>
    );
}
