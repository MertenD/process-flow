import FeatureCard from "@/components/landing/FeatureCard";
import {Award, BarChart3, Edit3, ShieldCheck, Users} from "lucide-react";

export default function FeatureSection() {

    return <section id="features" className="py-16 md:py-24 bg-muted">
        <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose ProcessFlow?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard
                    icon={<Users className="h-8 w-8 text-primary"/>}
                    title="Team Management"
                    description="Invite members, define roles, and manage access effortlessly."
                    image="/assets/team.png"
                />
                <FeatureCard
                    icon={<Edit3 className="h-8 w-8 text-primary"/>}
                    title="Intuitive Process Editor"
                    description="Design custom workflows with ease."
                    image="/assets/editor.png"
                />
                <FeatureCard
                    icon={<Award className="h-8 w-8 text-primary"/>}
                    title="Gamified Task Management"
                    description="Experience points, levels, and badges for increased motivation."
                    image="/assets/tasks.png"
                />
                <FeatureCard
                    icon={<BarChart3 className="h-8 w-8 text-primary"/>}
                    title="Real-Time Monitoring"
                    description="Track process progress and identify bottlenecks."
                    image="/assets/monitoring.png"
                />
                <FeatureCard
                    icon={<ShieldCheck className="h-8 w-8 text-primary"/>}
                    title="Role-Based Permissions"
                    description="Restrict or grant access to specific sections of the app."
                />
            </div>
        </div>
    </section>
}