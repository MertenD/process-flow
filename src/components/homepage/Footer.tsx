import Link from "next/link";

export default function Footer() {

    return <footer className="bg-background text-foreground py-12">
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
                        <li><Link href="#" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold mb-4">Resources</h3>
                    <ul className="space-y-2">
                        <li><Link href="#" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
                        <li><Link href="/docs" className="text-muted-foreground hover:text-foreground">Documentation</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold mb-4">Legal</h3>
                    <ul className="space-y-2">
                        <li><Link href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link>
                        </li>
                        <li><Link href="#" className="text-muted-foreground hover:text-foreground">Terms of
                            Service</Link></li>
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