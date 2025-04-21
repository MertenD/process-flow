import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";

export default function FAQ() {

    return <section id="faq" className="py-16 md:py-24 bg-background">
        <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
                <AccordionItem value="item-0">
                    <AccordionTrigger>What is ProcessFlow?</AccordionTrigger>
                    <AccordionContent>
                        ProcessFlow aims to simplify the creation and management of gamified business processes.
                        It provides a visual tool for modeling and controlling business processes,
                        making it easier to design and implement complex workflows. It also enables you to create and use
                        custom activities, which can be used to automate tasks and improve efficiency.
                    </AccordionContent>
                </AccordionItem>
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
                        Yes, you can create your own integrations or use integrations from other users.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>Is process-flow ready for production use?</AccordionTrigger>
                    <AccordionContent>
                        Currently, process-flow is under active development and is not recommended for production environments.
                        The project is evolving, and changes may occur as development progresses.
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
                    <AccordionTrigger>What kind of activities are supported</AccordionTrigger>
                    <AccordionContent>
                        ProcessFlow supports two kinds of activities: Manual and Automated. Manual activities can be executed
                        by users, who can be assigned to them. Automated activities are executed by the system and can be triggered
                        inside the process.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    </section>
}