import { auth } from "@/auth";
import LandingNavbar from "@/components/landing/landing-navbar";
import LandingHero from "@/components/landing/landing-hero";
import LandingPreview from "@/components/landing/landing-preview";
import LandingFeatures from "@/components/landing/landing-features";
import LandingFaq from "@/components/landing/landing-faq";
import LandingFooter from "@/components/landing/landing-footer";

export const metadata = {
    title: "JobTracker — The Modern Job Search Cockpit",
    description:
        "Track job applications, sync interview schedules with Google Calendar, manage take-home test deadlines, and organize recruiter contacts in one unified app.",
};

export default async function HomePage() {
    const session = await auth();
    const isLoggedIn = Boolean(session?.user);
    const userName = session?.user?.name ?? null;

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <LandingNavbar isLoggedIn={isLoggedIn} userName={userName} />
            <main className="flex-1">
                <LandingHero isLoggedIn={isLoggedIn} />
                <LandingPreview />
                <LandingFeatures />
                <LandingFaq />
            </main>
            <LandingFooter />
        </div>
    );
}
