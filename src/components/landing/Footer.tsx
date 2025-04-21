import Link from "next/link";

export default function Footer() {

    return <footer className="bg-background text-foreground py-12">
        <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="font-semibold mb-4">Product</h3>
                    <ul className="space-y-2">
                        <li><Link href="/#features" className="text-muted-foreground hover:text-foreground">Features</Link></li>
                        <li><Link href="/#faq" className="text-muted-foreground hover:text-foreground">FAQ</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold mb-4">Project</h3>
                    <ul className="space-y-2">
                        <li><Link href="#about" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold mb-4">Resources</h3>
                    <ul className="space-y-2">
                        <li><Link href="/docs" className="text-muted-foreground hover:text-foreground">Documentation</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold mb-4">Legal</h3>
                    <ul className="space-y-2">
                        <li><Link href="/imprint" className="text-muted-foreground hover:text-foreground">Imprint</Link></li>
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
}