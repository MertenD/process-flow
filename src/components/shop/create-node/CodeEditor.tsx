"use client"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"

interface CodeEditorProps {
    code: string
    language: string
    fileName: string
    onCopy: (code: string, id: string) => void
    copied: string | null
}

export function CodeEditor({ code, language, fileName, onCopy, copied }: CodeEditorProps) {
    // Map file extensions to syntax highlighter language names
    const mapLanguage = (language: string): string => {
        const languageMap: Record<string, string> = {
            javascript: "javascript",
            typescript: "typescript",
            json: "json",
            markdown: "markdown",
            dockerfile: "dockerfile",
            plaintext: "text",
            js: "javascript",
            ts: "typescript",
            md: "markdown",
            python: "python",
            py: "python",
        }

        return languageMap[language] || "text"
    }

    return (
        <div className="relative h-full">
            <div className="absolute top-3 right-7 z-10">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCopy(code, fileName)}
                    className="shadow-sm"
                >
                    {copied === fileName ? (
                        <>
                            <Check className="h-3.5 w-3.5 mr-1.5" />
                            Copied
                        </>
                    ) : (
                        <>
                            <Copy className="h-3.5 w-3.5 mr-1.5" />
                            Copy
                        </>
                    )}
                </Button>
            </div>
            <div className="h-full overflow-auto">
                <SyntaxHighlighter
                    language={mapLanguage(language)}
                    style={vscDarkPlus}
                    showLineNumbers={true}
                    customStyle={{
                        margin: 0,
                        padding: "1.5rem",
                        height: "100%",
                        fontSize: "0.875rem",
                        fontFamily:
                            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                        backgroundColor: "#1e1e1e",
                        borderRadius: "0",
                    }}
                    lineNumberStyle={{
                        minWidth: "2.5em",
                        paddingRight: "1em",
                        color: "#6e7681",
                        textAlign: "right",
                        userSelect: "none",
                    }}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    )
}

