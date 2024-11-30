import {MacbookScroll} from "@/components/ui/macbook-scroll"
import Image from "next/image"
import Link from "next/link"
import {Award, BarChart3, Edit3, ShieldCheck, Star, Users} from 'lucide-react'
import {LinkButton} from "@/components/ui/link-button";
import FeatureCard from "@/components/homepage/FeatureCard";
import Footer from "@/components/homepage/Footer";
import FAQ from "@/components/homepage/FAQ";
import PricingSection from "@/components/homepage/PricingSection";
import {AnimatedTooltip} from "@/components/ui/animated-tooltip";

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
            {/* Navigation */}
            <nav className="navbar fixed top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
                <div className="container flex h-16 items-center justify-between">
                    <Link href="/landing" className="flex items-center space-x-2">
                        <Image src="/assets/icon.png" alt="Logo" width={32} height={32} />
                        <span className="font-bold">ProcessFlow</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Features
                        </Link>
                        <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Pricing
                        </Link>
                        <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            FAQ
                        </Link>
                        <Link href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Contact
                        </Link>
                        <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Docs
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <LinkButton href="/authenticate" className="hidden md:flex">
                            Sign in
                        </LinkButton>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-16 md:pt-40 md:pb-24">
                <div className="container flex flex-col items-center text-center space-y-8">
                    <div className="space-y-4 max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                            Transform Your Business Processes with Gamification
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Automate workflows, streamline collaboration, and boost productivity with our all-in-one process management solution.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                        <LinkButton href="/authenticate" className="w-full" >
                            Get Started
                        </LinkButton>
                        <LinkButton href="/docs" className="w-full" variant="outline">
                            See Documentation
                        </LinkButton>
                    </div>

                    <div className="pt-8">
                        <div className="flex items-center justify-center gap-8 py-4">
                            <div className="flex -space-x-2">
                                <AnimatedTooltip items={people} />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    Trusted by 5+ users
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Features Section */}
            <section id="features" className="py-16 md:py-24 bg-muted">
                <div className="container">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Choose ProcessFlow?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Users className="h-8 w-8 text-primary" />}
                            title="Team Management"
                            description="Invite members, define roles, and manage access effortlessly."
                            image="/assets/team.png"
                        />
                        <FeatureCard
                            icon={<Edit3 className="h-8 w-8 text-primary" />}
                            title="Intuitive Process Editor"
                            description="Design custom workflows with ease."
                            image="/assets/editor.png"
                        />
                        <FeatureCard
                            icon={<Award className="h-8 w-8 text-primary" />}
                            title="Gamified Task Management"
                            description="Experience points, levels, and badges for increased motivation."
                            image="/assets/tasks.png"
                        />
                        <FeatureCard
                            icon={<BarChart3 className="h-8 w-8 text-primary" />}
                            title="Real-Time Monitoring"
                            description="Track process progress and identify bottlenecks."
                            image="/assets/monitoring.png"
                        />
                        <FeatureCard
                            icon={<ShieldCheck className="h-8 w-8 text-primary" />}
                            title="Role-Based Permissions"
                            description="Restrict or grant access to specific sections of the app."
                        />
                    </div>
                </div>
            </section>

            {/* Macbook Scroll Section */}
            <MacbookScroll
                title={
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold">Powerful Features</h2>
                        <p className="text-muted-foreground">Experience our intuitive interface and robust toolset</p>
                    </div>
                }
                src="/assets/dashboard.png"
                showGradient
            />
            <PricingSection />
            <FAQ />
            <Footer />
        </div>
    )
}
