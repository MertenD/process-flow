import { PrismaClient } from "../lib/generated/prisma"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding node definitions...")

  // Remove legacy AI activity definitions that have been replaced by OpenRouter Call
  const legacyNames = ["ChactivityGPT", "ChatGPT Call"]
  for (const name of legacyNames) {
    const deleted = await prisma.nodeDefinition.deleteMany({
      where: { definition: { path: ["name"], equals: name } },
    })
    if (deleted.count > 0) {
      console.log(`  Deleted legacy definition "${name}" (${deleted.count} row(s))`)
    }
  }

  // ---------------------------------------------------------------------------
  // Node Definitions
  // created_by / team_id set to null — public/team-level definitions.
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
        icon: "BrainCircuit",
        name: "OpenRouter Call",
        executionUrl: process.env.ACTIVITY_OPENROUTER_URL ?? "https://processflow.merten.tech/activities/openrouter/call",
        executionMode: "Automatic",
        shortDescription: "Send a prompt to any AI model via OpenRouter",
        optionsDefinition: {
          title: "OpenRouter Call",
          structure: [
            {
              type: "input",
              label: "OpenRouter API Key",
              keyString: "apiKey",
              placeholder: "sk-or-v1-...",
            },
            {
              type: "input",
              label: "Model",
              keyString: "model",
              placeholder: "openai/gpt-4o-mini",
              suggestions: [
                "openai/gpt-4o",
                "openai/gpt-4o-mini",
                "anthropic/claude-3-5-sonnet",
                "anthropic/claude-3-haiku",
                "meta-llama/llama-3.1-8b-instruct",
                "google/gemini-flash-1.5",
              ],
            },
            {
              type: "textarea",
              label: "System Prompt",
              keyString: "prompt",
              placeholder: "You are a helpful assistant.",
            },
            {
              type: "Select with custom",
              label: "User Input",
              keyString: "userInput",
              defaultValue: "",
              options: [{ values: ["{availableVariables}"], dependentStructure: [] }],
            },
            {
              type: "VariableNameInput",
              label: "Output Variable Name",
              keyString: "outputs.outputVariableName",
              placeholder: "e.g. aiResponse",
            },
          ],
        },
        markdownDocumentation:
          "## OpenRouter Call\n\nSend a prompt to any AI model via [OpenRouter](https://openrouter.ai).\n\n### Configuration\n\n1. **API Key** – Your OpenRouter API key (starts with `sk-or-`).\n2. **Model** – Model identifier in `provider/model-name` format. Examples:\n   - `openai/gpt-4o`\n   - `anthropic/claude-3-5-sonnet`\n   - `meta-llama/llama-3.1-8b-instruct`\n3. **System Prompt** – Instructions that define the AI's behavior.\n4. **User Input** – Optional process variable whose value is sent as the user message.\n5. **Output Variable Name** – The process variable that will store the AI's response.\n\n### How it works\n\nAt runtime the node calls the OpenRouter API and writes the AI response into the specified output variable. Downstream nodes can then read this variable.",
      },
      visibility: "Public" as const,
    },
  ]

  // Activities whose executionUrl is resolved from env vars must always be
  // upserted so a URL change takes effect when the seed is re-run.
  const alwaysUpdate = new Set(["OpenRouter Call"])

  for (const def of nodeDefs) {
    const name = (def.definition as { name: string }).name
    const existing = await prisma.nodeDefinition.findFirst({
      where: { definition: { path: ["name"], equals: name } },
    })
    if (existing) {
      if (alwaysUpdate.has(name)) {
        await prisma.nodeDefinition.update({
          where: { id: existing.id },
          data: { definition: def.definition, visibility: def.visibility },
        })
        console.log(`  Updated "${name}" (id=${existing.id})`)
      } else {
        console.log(`  Skipping "${name}" — already exists (id=${existing.id})`)
      }
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
