import { Button } from "@/components/ui/button"
import { MacbookScroll } from "@/components/ui/macbook-scroll"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Image from "next/image"
import Link from "next/link"
import { Star, Users, Edit3, Award, BarChart3, ShieldCheck, Check } from 'lucide-react'
import {ReactNode} from "react";
import {LinkButton} from "@/components/ui/link-button";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Navigation */}
            <nav className="navbar fixed top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
                <div className="container flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
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
                    </div>

                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" className="hidden md:flex">
                            Sign in
                        </Button>
                        <Button disabled>
                            Book a demo
                        </Button>
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
                        <div className="flex items-center justify-center gap-4 py-4">
                            <div className="flex -space-x-2">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                                        <Image
                                            src={`/placeholder.svg?text=${i + 1}`}
                                            alt="User"
                                            width={32}
                                            height={32}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                  Trusted by 1+ users
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

            {/* Pricing Section */}
            <section id="pricing" className="py-16 md:py-24">
                <div className="container">
                    <h2 className="text-3xl font-bold text-center mb-12">Choose the Perfect Plan for Your Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <PricingCard
                            title="Starter"
                            price="$29"
                            description="Perfect for small teams just getting started"
                            features={[
                                "Up to 10 team members",
                                "Basic process templates",
                                "Standard support",
                                "1 GB storage"
                            ]}
                        />
                        <PricingCard
                            title="Pro"
                            price="$79"
                            description="Ideal for growing teams with advanced needs"
                            features={[
                                "Up to 50 team members",
                                "Advanced process editor",
                                "Priority support",
                                "10 GB storage",
                                "Custom branding"
                            ]}
                            highlighted={true}
                        />
                        <PricingCard
                            title="Enterprise"
                            price="Custom"
                            description="Tailored solutions for large organizations"
                            features={[
                                "Unlimited team members",
                                "Dedicated account manager",
                                "24/7 premium support",
                                "Unlimited storage",
                                "Advanced security features"
                            ]}
                        />
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-16 md:py-24 bg-muted">
                <div className="container">
                    <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>How does ProcessFlow&apos;s gamification work?</AccordionTrigger>
                            <AccordionContent>
                                ProcessFlow incorporates game-like elements such as points, badges, and levels into your workflow. As team members complete tasks and achieve goals, they earn rewards, fostering a sense of accomplishment and motivation.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Can I integrate ProcessFlow with other tools?</AccordionTrigger>
                            <AccordionContent>
                                Yes, ProcessFlow offers integrations with popular tools like Slack, Trello, and Google Workspace. We also provide an API for custom integrations with your existing systems.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Is my data secure with ProcessFlow?</AccordionTrigger>
                            <AccordionContent>
                                Absolutely. We use industry-standard encryption and security practices to protect your data. Our systems are regularly audited and comply with GDPR and other data protection regulations.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger>How customizable are the workflows?</AccordionTrigger>
                            <AccordionContent>
                                ProcessFlow offers highly customizable workflows. You can create complex, multi-stage processes with conditional logic, automated actions, and custom fields to fit your specific business needs.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-5">
                            <AccordionTrigger>Do you offer onboarding and training?</AccordionTrigger>
                            <AccordionContent>
                                Yes, we provide comprehensive onboarding and training for all plans. Our Pro and Enterprise plans include personalized onboarding sessions and ongoing training to ensure your team gets the most out of ProcessFlow.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-background text-foreground py-12">
                <div className="container">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="font-semibold mb-4">Product</h3>
                            <ul className="space-y-2">
                                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Features</Link></li>
                                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
                                <li><Link href="#" className="text-muted-foreground hover:text-foreground">FAQ</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Company</h3>
                            <ul className="space-y-2">
                                <li><Link href="#" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
                                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
                                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Resources</h3>
                            <ul className="space-y-2">
                                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
                                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Documentation</Link></li>
                                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Community</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Legal</h3>
                            <ul className="space-y-2">
                                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
                                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Cookie Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-border">
                        <p className="text-center text-muted-foreground">
                            © {new Date().getFullYear()} ProcessFlow. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

interface FeatureCardProps {
    icon: ReactNode
    title: string
    description: string
    image?: string
}

function FeatureCard({ icon, title, description, image }: FeatureCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {icon}
                    <span>{title}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">{description}</p>
                {image && (
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                        <Image src={image} alt={title} fill className="object-cover" />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

interface PricingCardProps {
    title: string
    price: string
    description: string
    features: string[]
    highlighted?: boolean
}

function PricingCard({ title, price, description, features, highlighted = false }: PricingCardProps) {
    return (
        <Card className={highlighted ? 'border-primary shadow-lg' : ''}>
            <CardHeader>
                <CardTitle className="text-2xl">{title}</CardTitle>
                <p className="text-4xl font-bold">{price}</p>
                <p className="text-muted-foreground">{description}</p>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-primary" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
                <Button className="w-full mt-6" variant={highlighted ? 'default' : 'outline'}>
                    Get Started
                </Button>
            </CardContent>
        </Card>
    )
}

