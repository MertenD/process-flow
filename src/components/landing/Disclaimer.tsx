import {TriangleAlert} from "lucide-react";
import Link from "next/link";

interface DisclaimerProps {
    className?: string
}

export default function Disclaimer({ className }: DisclaimerProps) {
    return <div className={`flex flex-row w-full justify-center space-x-2 bg-warning-foreground py-4 text-warning ${className}`}>
        <TriangleAlert/>
        <p>
            This tool is an university project and is not recommended for production use. See more under &quot;
            <Link href="#about" className="underline">about</Link>
            &quot;
        </p>
        <TriangleAlert/>
    </div>
}