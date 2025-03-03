import Footer from "@/components/landing/Footer";
import FAQ from "@/components/landing/FAQ";
import HomepageNavigation from "@/components/landing/HomepageNavigation";
import {Hero} from "@/components/landing/Hero";
import FeatureSection from "@/components/landing/FeatureSection";

export default function LandingPage() {

    const people = [
        {
            id: 1,
            name: "Merten Dieckmann",
            designation: "Software Engineer",
            image: "/assets/placeholder-avatar.jpg"
        },
        {
            id: 2,
            name: "Merten Dieckmann",
            designation: "Software Engineer",
            image: "/assets/placeholder-avatar.jpg"
        },
        {
            id: 3,
            name: "Merten Dieckmann",
            designation: "Software Engineer",
            image: "/assets/placeholder-avatar.jpg"
        },
        {
            id: 4,
            name: "Merten Dieckmann",
            designation: "Software Engineer",
            image: "/assets/placeholder-avatar.jpg"
        },
        {
            id: 5,
            name: "Merten Dieckmann",
            designation: "Software Engineer",
            image: "/assets/placeholder-avatar.jpg"
        }
    ]

    return (
        <div className="min-h-screen bg-background text-foreground">
            <HomepageNavigation isFixed />
            <Hero />
            <FeatureSection />
            <FAQ />
            <Footer />
        </div>
    )
}
