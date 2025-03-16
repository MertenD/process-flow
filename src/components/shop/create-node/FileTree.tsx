"use client"
import { Folder, FolderOpen, File, ChevronRight, ChevronDown } from "lucide-react"

interface FileTreeItem {
    name: string
    type: "file" | "folder"
    path: string
    children?: FileTreeItem[]
}

interface FileTreeProps {
    items: FileTreeItem[]
    expandedFolders: Record<string, boolean>
    selectedFile: string
    onToggleFolder: (path: string) => void
    onSelectFile: (path: string) => void
}

export function FileTree({ items, expandedFolders, selectedFile, onToggleFolder, onSelectFile }: FileTreeProps) {
    const renderFileTree = (items: FileTreeItem[], level = 0) => {
        return (
            <ul className={`pl-${level > 0 ? 4 : 0}`}>
                {items.map((item) => (
                    <li key={item.path} className="py-1">
                        {item.type === "folder" ? (
                            <div>
                                <button
                                    className="flex items-center text-sm hover:bg-muted rounded px-2 py-1 w-full text-left transition-colors"
                                    onClick={() => onToggleFolder(item.path)}
                                >
                                    {expandedFolders[item.path] ? (
                                        <ChevronDown className="h-3.5 w-3.5 mr-1 text-gray-500 flex-shrink-0" />
                                    ) : (
                                        <ChevronRight className="h-3.5 w-3.5 mr-1 text-gray-500 flex-shrink-0" />
                                    )}
                                    {expandedFolders[item.path] ? (
                                        <FolderOpen className="h-4 w-4 mr-1.5 text-amber-500 flex-shrink-0" />
                                    ) : (
                                        <Folder className="h-4 w-4 mr-1.5 text-amber-500 flex-shrink-0" />
                                    )}
                                    <span className="truncate">{item.name}</span>
                                </button>
                                {expandedFolders[item.path] && item.children && (
                                    <div className="ml-2 pl-2 border-l border-gray-200 mt-1">
                                        {renderFileTree(item.children, level + 1)}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                className={`flex items-center text-sm rounded hover:bg-muted px-2 py-1 w-full text-left transition-colors ${
                                    selectedFile === item.path ? "bg-muted font-medium" : ""
                                }`}
                                onClick={() => onSelectFile(item.path)}
                            >
                                <File className="h-4 w-4 mr-1.5 text-blue-500 flex-shrink-0" />
                                <span className="truncate">{item.name}</span>
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        )
    }

    return <div className="p-2 overflow-y-auto h-full">{renderFileTree(items)}</div>
}

