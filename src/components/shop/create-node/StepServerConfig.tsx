"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Server, Globe } from "lucide-react"
import type { NodeDefinition } from "@/model/NodeDefinition"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {useTranslations} from "next-intl";
import {generateNodeJSFiles, generatePythonFiles, ProjectFile} from "@/utils/shop/project-generators";
import {generateAndDownloadZip} from "@/utils/shop/zipUtils";
import {FileTree} from "@/components/shop/create-node/FileTree";
import {CodeEditor} from "@/components/shop/create-node/CodeEditor";

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
    const t = useTranslations("shop.step-server-config")
    const [copied, setCopied] = useState<string | null>(null)
    const [selectedLanguage, setSelectedLanguage] = useState("nodejs")
    const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
        src: true,
    })
    const [selectedFile, setSelectedFile] = useState<string>("src/server.js")
    const [isDownloading, setIsDownloading] = useState(false)

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

    const downloadProject = async () => {
        try {
            setIsDownloading(true)
            const files = getProjectFiles()
            const projectName =
                nodeDefinition.name.toLowerCase().replace(/\s+/g, "-") ||
                (selectedLanguage === "python" ? "flask-service" : "node-service")

            await generateAndDownloadZip(files, projectName)
        } catch (error) {
            console.error("Error downloading project:", error)
            alert("Failed to download project. Please try again.")
        } finally {
            setIsDownloading(false)
        }
    }

    const fileTree = buildFileTree(projectFiles)

    return (
        <div className="space-y-8">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold">{t("title")}</h2>
                <p className="text-muted-foreground mt-2">{t("subtitle")}</p>
            </div>

            {/* Server URL Configuration Section */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                        <Globe className="mr-2 h-5 w-5 text-primary" />
                        {t("server-url.title")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="executionUrl" className="text-sm font-medium">
                                {t("server-url.label")}
                            </Label>
                            <div className="flex mt-2">
                                <Input
                                    id="executionUrl"
                                    value={nodeDefinition.executionUrl}
                                    onChange={(e) => updateField("executionUrl", e.target.value)}
                                    placeholder={t("server-url.placeholder")}
                                    className="flex-grow"
                                />
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">{t("server-url.help-text")}</p>
                        </div>

                        <div>
                            <Alert className="border-amber-200">
                                <Server className="h-4 w-4 stroke-amber-200" />
                                <AlertTitle className="text-amber-200">{t("important-note.title")}</AlertTitle>
                                <AlertDescription className="text-amber-200">{t("important-note.content")}</AlertDescription>
                            </Alert>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Code Templates Section */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg flex items-center">
                            <Server className="mr-2 h-5 w-5 text-primary" />
                            {t("templates.title")}
                        </CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{t("templates.subtitle")}</p>
                </CardHeader>
                <CardContent className="p-0">
                    <Tabs defaultValue="nodejs" value={selectedLanguage} onValueChange={handleLanguageChange} className="p-4">
                        <div className="flex flex-row justify-between">
                            <TabsList className="mb-4 grid grid-cols-2 w-[200px]">
                                <TabsTrigger value="nodejs">Node.js</TabsTrigger>
                                <TabsTrigger value="python">Python</TabsTrigger>
                            </TabsList>
                            <Button variant="outline" size="sm" onClick={downloadProject} disabled={isDownloading}>
                                <Download className="h-4 w-4 mr-2" />
                                {isDownloading ? t("templates.downloading") : t("templates.download-button")}
                            </Button>
                        </div>

                        <TabsContent value="nodejs" className="mt-0 space-y-4">
                            <div className="border rounded-md overflow-hidden">
                                <div className="grid grid-cols-12 h-[550px]">
                                    {/* File tree */}
                                    <div className="col-span-3 border-r bg-muted/30">
                                        <div className="p-3 border-b bg-muted/50 font-medium text-sm">{t("templates.project-files")}</div>
                                        <FileTree
                                            items={fileTree}
                                            expandedFolders={expandedFolders}
                                            selectedFile={selectedFile}
                                            onToggleFolder={toggleFolder}
                                            onSelectFile={setSelectedFile}
                                        />
                                    </div>

                                    {/* Code editor */}
                                    <div className="col-span-9">
                                        <div className="p-3 border-b bg-muted/50 font-medium text-sm flex justify-between items-center">
                                            <span>{selectedFile}</span>
                                        </div>
                                        <div className="h-[500px] overflow-y-auto">
                                            <CodeEditor
                                                code={getSelectedFileContent()}
                                                language={getSelectedFileLanguage()}
                                                fileName={selectedFile}
                                                onCopy={copyToClipboard}
                                                copied={copied}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="python" className="mt-0 space-y-4">
                            <div className="border rounded-md overflow-hidden">
                                <div className="grid grid-cols-12 h-[550px]">
                                    {/* File tree */}
                                    <div className="col-span-3 border-r bg-muted/30">
                                        <div className="p-3 border-b bg-muted/50 font-medium text-sm">{t("templates.project-files")}</div>
                                        <FileTree
                                            items={fileTree}
                                            expandedFolders={expandedFolders}
                                            selectedFile={selectedFile}
                                            onToggleFolder={toggleFolder}
                                            onSelectFile={setSelectedFile}
                                        />
                                    </div>

                                    {/* Code editor */}
                                    <div className="col-span-9">
                                        <div className="p-3 border-b bg-muted/50 font-medium text-sm flex justify-between items-center">
                                            <span>{selectedFile}</span>
                                        </div>
                                        <div className="h-[500px] overflow-y-auto">
                                            <CodeEditor
                                                code={getSelectedFileContent()}
                                                language={getSelectedFileLanguage()}
                                                fileName={selectedFile}
                                                onCopy={copyToClipboard}
                                                copied={copied}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Implementation Notes */}
            <Card className="bg-muted/30 border-muted">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">{t("implementation-notes.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>{t("implementation-notes.notes.note1")}</li>
                        <li>{t("implementation-notes.notes.note2")}</li>
                        <li>{t("implementation-notes.notes.note3")}</li>
                        <li>{t("implementation-notes.notes.note4")}</li>
                        <li>{t("implementation-notes.notes.note5")}</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}

