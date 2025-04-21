import Image from "next/image";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Github, Linkedin, Mail} from "lucide-react";

export default function AboutSection() {

    return <section id="about" className="py-16 md:py-24 bg-muted">
        <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">About Me & ProcessFlow</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
                { /* Image */}
                <div className="flex flex-col items-center">
                    <div
                        className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-green-500 shadow-lg shadow-green-500/20">
                        <Image
                            src="/assets/merten.jpg"
                            alt="Profile picture"
                            fill
                            priority
                            className="object-cover"
                        />
                    </div>
                    <div className="mt-6 text-center">
                        <h3 className="text-2xl font-bold text-white">Merten Dieckmann</h3>
                        <p className="text-green-500 font-medium">Software Engineer & Student</p>
                    </div>
                </div>
                { /* Text */}
                <div className="space-y-6 text-gray-300">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">The Project</h3>
                        <p>
                            ProcessFlow is a software project developed as part of my Master's degree in Software
                            Engineering at Ulm
                            University. It aims to create a customizable and gamified business process management tool
                            that includes features like a drag & drop editor, a process engine, customizable activities,
                            real-time monitoring, and role-based task management.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">My Background</h3>
                        <p>
                            I work part-time as a Fullstack Software Engineer at Mercedes-Benz Tech Innovation while
                            pursuing my Master's degree at Ulm University. In my freetime I enjoy bulding hobby software projects.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">The Vision</h3>
                        <p>
                            ProcessFlow was born from the observation that traditional business process management tools
                            often fail to
                            maintain user engagement. By incorporating gamification elements like points, levels, and
                            badges, ProcessFlow tries to
                            transforms routine tasks into rewarding activities, increasing motivation and productivity
                            across teams.
                        </p>
                    </div>

                    <div className="pt-4 space-x-2">
                        <Button asChild variant="outline" size="icon">
                            <Link href="mailto:merten.dieckmann@web.de" aria-label="Email">
                                <Mail className="h-5 w-5" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="icon">
                            <Link href="https://www.linkedin.com/in/merten-dieckmann" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="icon">
                            <Link href="https://github.com/MertenD" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                                <Github className="h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </section>
}