import JSZip from "jszip"
import type { ProjectFile } from "./project-generators"

export async function generateAndDownloadZip(files: ProjectFile[], projectName: string): Promise<void> {
    try {
        const zip = new JSZip()

        // Add files to the zip
        files.forEach((file) => {
            // Create folders if needed
            const path = file.path.split("/")
            const fileName = path.pop() || ""
            let folder = zip

            // Create nested folders if needed
            if (path.length > 0) {
                let currentPath = ""
                path.forEach((folderName) => {
                    currentPath = currentPath ? `${currentPath}/${folderName}` : folderName
                    folder = folder.folder(folderName) || folder
                })
            }

            // Add the file to the folder
            folder.file(fileName, file.content)
        })

        // Generate the zip file
        const content = await zip.generateAsync({ type: "blob" })

        // Create a download link
        const url = URL.createObjectURL(content)
        const link = document.createElement("a")
        link.href = url
        link.download = `${projectName}.zip`
        document.body.appendChild(link)
        link.click()

        // Clean up
        setTimeout(() => {
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        }, 100)
    } catch (error) {
        console.error("Error generating ZIP file:", error)
        alert("Failed to generate ZIP file. Please try again.")
    }
}

