import PricingCard from "@/components/landing/PricingCard";

export default function PricingSection() {

    return <section id="pricing" className="py-16 md:py-24">
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
}