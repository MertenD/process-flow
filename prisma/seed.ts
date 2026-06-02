import { PrismaClient } from "../lib/generated/prisma"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding node definitions from Supabase backup (2025-07-07)...")

  // ---------------------------------------------------------------------------
  // Node Definitions
  // Original IDs from Supabase: 1, 2, 3, 5
  // created_by / team_id set to null — old Supabase user/team IDs no longer exist.
  // TeamsNodeDefinitions from the old DB:
  //   Team 5  → NodeDefs 1, 2, 3, 5
  //   Team 11 → NodeDefs 1, 2
  //   Team 13 → NodeDef  3
  // Re-add those via the Shop UI or via TeamsNodeDefinitions inserts once teams exist.
  // ---------------------------------------------------------------------------

  const nodeDefs = [
    {
      definition: {
        icon: "ListTodo",
        name: "Standard Activity Node",
        executionUrl: "/instance/task/activity",
        executionMode: "Manual",
        shortDescription: "This is the standard activity node",
        optionsDefinition: {
          title: "Activity Options",
          structure: [
            {
              type: "select",
              label: "Activity type",
              keyString: "activityType",
              defaultValue: "Text input",
              options: [
                {
                  values: ["Text input"],
                  dependentStructure: [
                    {
                      type: "input",
                      label: "Input regex",
                      keyString: "inputRegex",
                      placeholder: "[0-9]+",
                      suggestions: [
                        "[0-9]+",
                        "[a-zA-Z .,-_]+",
                        "[a-zA-Z .,-_0-9]+",
                        "[a-zA-Z]+",
                      ],
                    },
                    {
                      type: "VariableNameInput",
                      label: "Save input as",
                      keyString: "outputs.userInputVariableName",
                      placeholder: "input1",
                    },
                  ],
                },
                {
                  values: ["Single choice", "Multiple Choice"],
                  dependentStructure: [
                    {
                      type: "input",
                      label: "Choices",
                      keyString: "choices",
                      placeholder: "choice 1,choice 2,...",
                    },
                    {
                      type: "VariableNameInput",
                      label: "Save input as",
                      keyString: "outputs.userInputVariableName",
                      placeholder: "input1",
                    },
                  ],
                },
                {
                  values: ["Info"],
                  dependentStructure: [
                    {
                      type: "textarea",
                      label: "Info text",
                      keyString: "infoText",
                      placeholder: "This is an info text",
                    },
                  ],
                },
              ],
            },
          ],
        },
        markdownDocumentation:
          "This is the standard activity node. It can be used to create activities with different types of inputs.\n\n- Text input\n- Single choice\n- Multiple choice\n- Info",
      },
      visibility: "Team" as const,
    },
    {
      definition: {
        icon: "FlaskConical",
        name: "Test Aktivität",
        executionUrl: "https://processflow.mertendieckmann.de/test",
        executionMode: "Automatic",
        shortDescription: "Das ist ein Test der Row",
        optionsDefinition: {
          title: "Test Aktivität",
          nodeId: "",
          structure: [
            {
              type: "row",
              structure: [
                {
                  type: "input",
                  label: "Test Input",
                  keyString: "testInput",
                  placeholder: "Gib was ein...",
                },
                {
                  type: "select",
                  label: "Select 1",
                  keyString: "select1",
                  defaultValue: "None",
                  options: [
                    {
                      values: ["Option 1"],
                      dependentStructure: [{ text: "Option 1 ausgewählt", type: "text" }],
                    },
                    {
                      values: ["Option 2"],
                      dependentStructure: [{ text: "Option 2 ausgewählt", type: "text" }],
                    },
                    { values: ["None"], dependentStructure: [] },
                  ],
                },
              ],
            },
            { type: "separator", orientation: "horizontal" },
            {
              type: "select",
              label: "Select 2",
              keyString: "select2",
              defaultValue: "None",
              options: [
                {
                  values: ["Option 1"],
                  dependentStructure: [{ text: "Option 1 ausgewählt", type: "text" }],
                },
                {
                  values: ["Option 2"],
                  dependentStructure: [{ text: "Option 2 ausgewählt", type: "text" }],
                },
                { values: ["None"], dependentStructure: [] },
              ],
            },
          ],
        },
        markdownDocumentation:
          "Es ist ein quaint, kleine Wunder,  \nEin App für allemal Prozesse zu k+:  \nProcessFlow, das Lustiges und Neues bietet,  \nUm arme Leute bei ihrer Arbeit zu mentzen.  \n\nOh ProcessFlow, du mit deinen Zellen,  \nWandel liebes Tutes in spannende Games:  \nLernst du ProcESs, aber lustig?  \nJa, du findest den Reiz im Prozess!  \n\nMit Punkten und Badges, mit Leveln und Challenges,  \nIhr kreatives Ambitionales zeigt.  \nAlles ist interaktiv, alles ist interaktiv,  \nDein Workflow ist ein lebendiger Brot!  \n\nSo tue ProcessFlow, so spann' und neu,  \nIhr Team-Flow ist die perfekte Kombination.  \nMit dir ist der Prozess lebendig gemacht,  \nEuer Status ist im App arbeitsvollten.  \n\nFiou! Prozesse, die wie eine Spielsaison,  \nMit ProcessFlow in einer anderen Welt.",
      },
      visibility: "Team" as const,
    },
    {
      definition: {
        icon: "BotMessageSquare",
        name: "ChactivityGPT",
        executionUrl: "https://processflow.mertendieckmann.de/chatgpt",
        executionMode: "Automatic",
        shortDescription: "Führt einen ChatGPT Prompt aus",
        optionsDefinition: {
          title: "ChactivityGPT",
          nodeId: "",
          structure: [
            {
              type: "textarea",
              label: "Prompt",
              keyString: "prompt",
              placeholder: "Gib hier den Prompt für ChatGPT ein",
            },
            {
              type: "VariableNameInput",
              label: "Variablenname",
              keyString: "outputs.variablenname",
              placeholder: "Die Variable in der die Antwort gespeichert wird",
            },
          ],
        },
        markdownDocumentation:
          "Gib den Prompt ein der ausgeführt werden soll und gib an wie die Variable heißen soll, in die die Ausgabe von ChatGPT gespeichert werden soll",
      },
      visibility: "Team" as const,
    },
    {
      definition: {
        icon: "BrainCircuit",
        name: "ChatGPT Call",
        executionUrl: "https://chatgpt.mertendieckmann.de/call",
        executionMode: "Automatic",
        shortDescription: "Send a request to ChatGPT",
        optionsDefinition: {
          title: "ChatGPT Call",
          nodeId: "",
          structure: [
            {
              type: "input",
              label: "OpenAI API Key",
              keyString: "openAIAPIKey",
              placeholder: "sk-...x9wA",
            },
            {
              type: "textarea",
              label: "Prompt",
              keyString: "prompt",
              placeholder: "Do something with the following data...",
            },
            {
              type: "Select with custom",
              label: "Additional Data",
              keyString: "additionalData",
              defaultValue: "",
              options: [],
            },
            {
              type: "VariableNameInput",
              label: "Output Variable Name",
              keyString: "outputs.outputVariableName",
              placeholder: "e.g. chatgptAnswer",
            },
          ],
        },
        markdownDocumentation:
          "## How to use\n\n1. Provide your OepnAI API Key.\n2. Provide a prompt that the AI should use.\n3. Provide additional data in form of a variable value that should be used to extend the prompt.\n4. Provide a variable name where the ChatGPT output should be saved to.",
      },
      visibility: "Public" as const,
    },
  ]

  for (const def of nodeDefs) {
    const name = (def.definition as { name: string }).name
    const existing = await prisma.nodeDefinition.findFirst({
      where: { definition: { path: ["name"], equals: name } },
    })
    if (existing) {
      console.log(`  Skipping "${name}" — already exists (id=${existing.id})`)
      continue
    }
    const created = await prisma.nodeDefinition.create({
      data: {
        definition: def.definition,
        visibility: def.visibility,
        createdBy: null,
        teamId: null,
      },
    })
    console.log(`  Created "${name}" (id=${created.id})`)
  }

  console.log("Done.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
