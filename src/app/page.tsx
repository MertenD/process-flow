import Footer from "@/components/landing/Footer";
import FAQ from "@/components/landing/FAQ";
import HomepageNavigation from "@/components/landing/HomepageNavigation";
import {Hero} from "@/components/landing/Hero";
import FeatureSection from "@/components/landing/FeatureSection";
import AboutSection from "@/components/landing/About";
import Disclaimer from "@/components/landing/Disclaimer";

export default function LandingPage() {

    return (
        <div className="min-h-screen bg-background text-foreground">
            <HomepageNavigation isFixed/>
            <Disclaimer className={"mt-16"}/>
            <Hero/>
            <FeatureSection/>
            <FAQ/>
            <AboutSection/>
            <Footer/>
        </div>
    )
}
