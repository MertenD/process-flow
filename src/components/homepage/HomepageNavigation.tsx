import Link from "next/link";
import Image from "next/image";
import {LinkButton} from "@/components/ui/link-button";

export interface HomepageNavigationProps {
    isFixed?: boolean
}

export default function HomepageNavigation({ isFixed }: HomepageNavigationProps) {

    return <nav className={`navbar w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm${
        isFixed ? " fixed top-0" : ""
    }`}>
        <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
                <Image src="/assets/icon.png" alt="Logo" width={32} height={32}/>
                <span className="font-bold">ProcessFlow</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
                <Link href="/#features"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Features
                </Link>
                <Link href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Pricing
                </Link>
                <Link href="/#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    FAQ
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
}