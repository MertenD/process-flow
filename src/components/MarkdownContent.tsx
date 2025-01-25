"use client"

import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

interface MarkdownContentProps {
    content: string
}

export function MarkdownContent({ content }: MarkdownContentProps) {

    return (
        <ReactMarkdown
            components={{
                h1: ({ node, ...props }) => <h1 className="text-lg sm:text-xl font-bold mb-4" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-base sm:text-lg font-semibold mb-3" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-sm sm:text-md font-medium mb-2" {...props} />,
                p: ({ node, ...props }) => <p className="mb-4" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4" {...props} />,
                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                a: ({ node, ...props }) => <a className="text-primary hover:underline" {...props} />,
                // @ts-ignore
                code: ({ node, inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || "")
                    return !inline && match ? (
                        <div className="overflow-x-auto py-2">
                            <SyntaxHighlighter
                                // @ts-ignore
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                customStyle={{
                                    fontSize: "0.8rem",
                                    lineHeight: "1.4",
                                    padding: "1rem",
                                    borderRadius: "0.375rem",
                                }}
                                {...props}
                            >
                                {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                        </div>
                    ) : (
                        <code className="bg-muted px-1 py-2 rounded text-sm" {...props}>
                            {children}
                        </code>
                    )
                },
            }}
        >
            {content}
        </ReactMarkdown>
    )
}

