"use client"

import { useRouter } from "next/navigation";

export default function BackButton(
    {href, classNames } : Readonly<{ href?: string, classNames?: string }>
) {

    const router = useRouter()

    return (
        <button
            onClick={() => href ? router.push(href) : history.back()}
            className={`flex items-center group ${classNames}`}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
            >
                <polyline points="15 18 9 12 15 6"/>
            </svg>
            {' '}
            Back
        </button>
    )
}

