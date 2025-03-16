"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Download, Server } from 'lucide-react'
import type { NodeDefinition } from "@/model/NodeDefinition"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CodeEditor } from "@/components/shop/create-node/CodeEditor"
import { FileTree } from "@/components/shop/create-node/FileTree"
import {
    generateNodeJSFiles,
    generatePythonFiles,
    type ProjectFile
} from "@/utils/shop/project-generators"

interface StepServerConfigProps {
    nodeDefinition: NodeDefinition
    updateNodeDefinition: (updatedDefinition: NodeDefinition) => void
    onPrevious: () => void
    onSave: () => void
}

interface FileTreeItem {
    name: string
    type: "file" | "folder"
    path: string
    children?: FileTreeItem[]
}

export function StepServerConfig({ nodeDefinition, updateNodeDefinition, onPrevious, onSave }: StepServerConfigProps) {
    const [copied, setCopied] = useState<string | null>(null)
    const [selectedLanguage, setSelectedLanguage] = useState("nodejs")
    const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
        src: true,
    })
    const [selectedFile, setSelectedFile] = useState<string>("src/server.js")

    const updateField = (field: keyof NodeDefinition, value: string) => {
        updateNodeDefinition({
            ...nodeDefinition,
            [field]: value,
        })
    }

    const copyToClipboard = (code: string, id: string) => {
        navigator.clipboard.writeText(code)
        setCopied(id)
        setTimeout(() => setCopied(null), 2000)
    }

    const toggleFolder = (path: string) => {
        setExpandedFolders((prev) => ({
            ...prev,
            [path]: !prev[path],
        }))
    }

    const getProjectFiles = (): ProjectFile[] => {
        switch (selectedLanguage) {
            case "python":
                return generatePythonFiles(nodeDefinition)
            case "nodejs":
            default:
                return generateNodeJSFiles(nodeDefinition)
        }
    }

    // Handle language change
    const handleLanguageChange = (language: string) => {
        setSelectedLanguage(language)

        // Set default selected file based on language
        if (language === "python") {
            setSelectedFile("app.py")
        } else {
            setSelectedFile("src/server.js")
        }
    }

    const projectFiles = getProjectFiles()

    const buildFileTree = (files: ProjectFile[]): FileTreeItem[] => {
        const root: Record<string, FileTreeItem> = {}

        files.forEach((file) => {
            const parts = file.path.split("/")
            let current = root

            for (let i = 0; i < parts.length; i++) {
                const part = parts[i]
                const path = parts.slice(0, i + 1).join("/")

                if (i === parts.length - 1) {
                    // This is a file
                    current[part] = {
                        name: part,
                        type: "file",
                        path: path,
                    }
                } else {
                    // This is a directory
                    if (!current[part]) {
                        current[part] = {
                            name: part,
                            type: "folder",
                            path: path,
                            // @ts-ignore
                            children: {},
                        }
                    }
                    // @ts-ignore
                    current = current[part].children as Record<string, FileTreeItem>
                }
            }
        })

        // Convert the nested objects to arrays
        const convertToArray = (obj: Record<string, FileTreeItem>): FileTreeItem[] => {
            return Object.values(obj)
                .map((item) => {
                    if (item.type === "folder" && item.children) {
                        return {
                            ...item,
                            children: convertToArray(item.children as unknown as Record<string, FileTreeItem>),
                        }
                    }
                    return item
                })
                .sort((a, b) => {
                    // Folders first, then files
                    if (a.type === "folder" && b.type === "file") return -1
                    if (a.type === "file" && b.type === "folder") return 1
                    // Alphabetical within same type
                    return a.name.localeCompare(b.name)
                })
        }

        return convertToArray(root)
    }

    const getSelectedFileContent = () => {
        const file = projectFiles.find((f) => f.path === selectedFile)
        return file ? file.content : ""
    }

    const getSelectedFileLanguage = () => {
        const file = projectFiles.find((f) => f.path === selectedFile)
        return file ? file.language : "plaintext"
    }

    const downloadProject = () => {
        // In a real implementation, this would create a ZIP file
        // For now, we'll just show an alert
        alert(`Project download functionality would be implemented here for ${selectedLanguage}`)
    }

    const fileTree = buildFileTree(projectFiles)

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold">Server Configuration</h2>
                <p className="text-muted-foreground">Configure the server URL and get code templates for your implementation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="executionUrl" className="text-sm font-medium">
                        Server URL
                    </Label>
                    <div className="flex mt-1">
                        <Input
                            id="executionUrl"
                            value={nodeDefinition.executionUrl}
                            onChange={(e) => updateField("executionUrl", e.target.value)}
                            placeholder="https://your-server-url.com/endpoint"
                            className="flex-grow"
                        />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        This is the URL where your server will receive requests from the workflow engine.
                    </p>
                </div>

                <div>
                    <Alert className="border-amber-200">
                        <AlertDescription>
                            <div className="flex items-start">
                                <Server className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                                <span>
                  Your server must be publicly accessible and able to receive POST requests. Make sure to implement
                  proper error handling and response formatting.
                </span>
                            </div>
                        </AlertDescription>
                    </Alert>
                </div>
            </div>

            <div className="border-t pt-6 mt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Server Implementation Templates</h3>
                    <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={downloadProject}>
                            <Download className="h-4 w-4 mr-2" />
                            Download Project
                        </Button>
                    </div>
                </div>

                <p className="text-muted-foreground mb-4">
                    These are example templates you can copy and use in your own server implementation. They are not executed
                    within this application - they&apos;re just for reference to help you implement the server-side functionality
                    for your node.
                </p>

                <Tabs defaultValue="nodejs" value={selectedLanguage} onValueChange={handleLanguageChange}>
                    <TabsList className="mb-4">
                        <TabsTrigger value="nodejs">Node.js</TabsTrigger>
                        <TabsTrigger value="python">Python</TabsTrigger>
                    </TabsList>

                    <TabsContent value="nodejs" className="mt-0">
                        <Card className="border">
                            <div className="grid grid-cols-12 h-[500px]">
                                {/* File tree */}
                                <div className="col-span-3 border-r">
                                    <FileTree
                                        items={fileTree}
                                        expandedFolders={expandedFolders}
                                        selectedFile={selectedFile}
                                        onToggleFolder={toggleFolder}
                                        onSelectFile={setSelectedFile}
                                    />
                                </div>

                                {/* Code editor */}
                                <div className="col-span-9 overflow-y-auto">
                                    <CodeEditor
                                        code={getSelectedFileContent()}
                                        language={getSelectedFileLanguage()}
                                        fileName={selectedFile}
                                        onCopy={copyToClipboard}
                                        copied={copied}
                                    />
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="python" className="mt-0">
                        <Card className="border">
                            <div className="grid grid-cols-12 h-[500px]">
                                {/* File tree */}
                                <div className="col-span-3 border-r">
                                    <FileTree
                                        items={fileTree}
                                        expandedFolders={expandedFolders}
                                        selectedFile={selectedFile}
                                        onToggleFolder={toggleFolder}
                                        onSelectFile={setSelectedFile}
                                    />
                                </div>

                                {/* Code editor */}
                                <div className="col-span-9 overflow-y-auto">
                                    <CodeEditor
                                        code={getSelectedFileContent()}
                                        language={getSelectedFileLanguage()}
                                        fileName={selectedFile}
                                        onCopy={copyToClipboard}
                                        copied={copied}
                                    />
                                </div>
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            <div className="bg-muted p-4 rounded-lg mt-6">
                <h4 className="font-medium mb-2">Implementation Notes</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Your server must respond quickly to avoid timeouts (return 200 immediately)</li>
                    <li>Process the request asynchronously and send the result to the provided response path</li>
                    <li>Always include the flowElementInstanceId in your responses</li>
                    <li>Handle errors gracefully and send them to the errorResponsePath</li>
                    <li>The server must be accessible from the internet</li>
                </ul>
            </div>
        </div>
    )
}
