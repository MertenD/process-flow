import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";

export default function FAQ() {

    return <section id="faq" className="py-16 md:py-24 bg-background">
        <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
                <AccordionItem value="item-1">
                    <AccordionTrigger>How does ProcessFlow&apos;s gamification work?</AccordionTrigger>
                    <AccordionContent>
                        ProcessFlow incorporates game-like elements such as points, badges, and levels into your
                        workflow. As team members complete tasks and achieve goals, they earn rewards, fostering a sense
                        of accomplishment and motivation.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Can I integrate ProcessFlow with other tools?</AccordionTrigger>
                    <AccordionContent>
                        Yes, ProcessFlow offers integrations with popular tools like Slack, Trello, and Google
                        Workspace. We also provide an API for custom integrations with your existing systems.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>Is my data secure with ProcessFlow?</AccordionTrigger>
                    <AccordionContent>
                        Absolutely. We use industry-standard encryption and security practices to protect your data. Our
                        systems are regularly audited and comply with GDPR and other data protection regulations.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger>How customizable are the workflows?</AccordionTrigger>
                    <AccordionContent>
                        ProcessFlow offers highly customizable workflows. You can create complex, multi-stage processes
                        with conditional logic, automated actions, and custom fields to fit your specific business
                        needs.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                    <AccordionTrigger>Do you offer onboarding and training?</AccordionTrigger>
                    <AccordionContent>
                        Yes, we provide comprehensive onboarding and training for all plans. Our Pro and Enterprise
                        plans include personalized onboarding sessions and ongoing training to ensure your team gets the
                        most out of ProcessFlow.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    </section>
}