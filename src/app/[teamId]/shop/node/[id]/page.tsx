"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {MarkdownContent} from "@/components/MarkdownContent";
import {useTranslations} from "next-intl";

// Example node data
const nodeDetails = {
    id: 1,
    title: "Single Choice Node",
    category: "Input",
    description: "Presents users with a single choice selection from multiple options.",
    formFields: {
        title: "Ja oder Nein",
        description: "Klicke auf ja oder nein",
        activityType: "Single choice",
        choices: "Ja,Nein",
        saveAs: "answer",
        role: "admin",
        gamification: "None",
    },
    documentation: '# Single Choice Node\n\nThis node allows you to create a single choice question in your process. Users will be presented with the options you define and must select one answer.\n\n## Usage\n\nUse this node when you need to gather a specific choice from a user within your process flow.\n\n## Configuration\n\nTo set up a Single Choice Node:\n\n1. Set a clear title that describes the choice to be made\n2. Provide a detailed description to guide users\n3. Define the choices that will be presented\n4. Specify the variable name to store the selected answer\n5. Assign the appropriate role for access control\n\n## Best Practices\n\n- Keep choices clear and mutually exclusive\n- Use consistent naming for save variables\n- Consider the flow of your process when setting roles\n\n## Example\n\n```json\n{\n  "title": "Preferred Contact Method",\n  "description": "How would you like us to contact you?",\n  "choices": ["Email", "Phone", "SMS"],\n  "saveAs": "contactPreference",\n  "role": "user"\n}\n```\n\nThis example creates a single choice question asking users for their preferred contact method.',
}

export default function NodeDetails() {

    const t = useTranslations("shop.node.details")

    const router = useRouter()
    const { id } = useParams()
    const [isAdded, setIsAdded] = useState(false)
    const [formFields, setFormFields] = useState(nodeDetails.formFields)

    const updateFormField = (field: string, value: string) => {
        setFormFields((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleAddRemove = () => {
        setIsAdded(!isAdded)
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <Button variant="ghost" onClick={() => router.back()} className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>

            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{nodeDetails.title}</h1>
                        <p className="text-muted-foreground">{nodeDetails.description}</p>
                    </div>

                    <Button onClick={handleAddRemove} className={isAdded ? "bg-destructive hover:bg-destructive/90" : ""}>
                        {isAdded ? (
                            t("removeFromEditor")
                        ) : (
                            <>
                                <Plus className="mr-2 h-4 w-4" />
                                { t("addToEditor") }
                            </>
                        )}
                    </Button>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-3xl">{ t("documentationTitle") }</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <MarkdownContent content={nodeDetails.documentation} />
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <h2 className="text-xl sm:text-2xl font-semibold">{ t("nodePreview") }</h2>
                    <Tabs defaultValue="form" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="form">{ t("SettingsPreview") }</TabsTrigger>
                            <TabsTrigger value="visual">{ t("taskPreview") }</TabsTrigger>
                        </TabsList>
                        <TabsContent value="form">
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle>Node Configuration</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            value={formFields.title}
                                            onChange={(e) => updateFormField("title", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Input
                                            id="description"
                                            value={formFields.description}
                                            onChange={(e) => updateFormField("description", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="activity-type">Activity type</Label>
                                        <Select
                                            value={formFields.activityType}
                                            onValueChange={(value) => updateFormField("activityType", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Single choice">Single choice</SelectItem>
                                                <SelectItem value="Multiple choice">Multiple choice</SelectItem>
                                                <SelectItem value="Text input">Text input</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="choices">Choices</Label>
                                        <Input
                                            id="choices"
                                            value={formFields.choices}
                                            onChange={(e) => updateFormField("choices", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="save-as">Save input as</Label>
                                        <Input
                                            id="save-as"
                                            value={formFields.saveAs}
                                            onChange={(e) => updateFormField("saveAs", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Assigned role</Label>
                                        <Select value={formFields.role} onValueChange={(value) => updateFormField("role", value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="user">User</SelectItem>
                                                <SelectItem value="manager">Manager</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="gamification">Gamification type</Label>
                                        <Select
                                            value={formFields.gamification}
                                            onValueChange={(value) => updateFormField("gamification", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="None">None</SelectItem>
                                                <SelectItem value="Points">Points</SelectItem>
                                                <SelectItem value="Badge">Badge</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="visual">
                            <Card className="mb-6">
                                <CardContent className="p-6">
                                    <div className="bg-[#1E1E1E] rounded-lg p-4">
                                        <div className="mb-4 space-y-2">
                                            <h3 className="text-white text-lg font-semibold">{formFields.title}</h3>
                                            <p className="text-gray-400">{formFields.description}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {formFields.choices.split(",").map((choice, index) => (
                                                <button
                                                    key={index}
                                                    className="px-3 py-1 text-sm sm:px-4 sm:py-2 bg-[#2D2D2D] text-white rounded hover:bg-[#3D3D3D] transition-colors"
                                                >
                                                    {choice}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="mt-4 flex items-center gap-2">
                                            <span className="text-gray-400 text-sm">Saved as:</span>
                                            <code className="bg-[#2D2D2D] px-2 py-1 rounded text-sm text-white">{formFields.saveAs}</code>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

