import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative py-24">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>

            <div className="container relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-16">
                    <div className="space-y-8">
                        <div className="space-y-6">
                            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                                Streamline Your Business Processes with{" "}
                                <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                                  Gamification
                                </span>
                            </h1>
                            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                                Empower your teams to create, manage, and monitor processes effectively while boosting engagement
                                through gamification.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/authenticate" >
                                <Button size="lg" className="gap-2">
                                    Get Started for Free <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/#features" >
                                <Button size="lg" variant="outline">
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="relative hidden lg:block">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-3xl" />
                        <div className="relative bg-card rounded-2xl border p-6 shadow-2xl">
                            <img
                                src="/assets/editor.png"
                                alt="ProcessFlow Illustration"
                                className="w-full h-auto rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

