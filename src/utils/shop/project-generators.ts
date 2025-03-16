import { OptionsStructureType } from "@/model/OptionsModel"
import type { NodeDefinition } from "@/model/NodeDefinition"

export interface ProjectFile {
    path: string
    content: string
    language: string
}

// Helper function to convert string to camelCase
export function toCamelCase(str: string): string {
    return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase()
        })
        .replace(/\s+/g, "")
}

// Generate variable names from the options structure
export function getVariableNames(nodeDefinition: NodeDefinition) {
    const variables: { name: string; isOutput: boolean }[] = []

    nodeDefinition.optionsDefinition.structure.forEach((option) => {
        if ("label" in option && option.label) {
            const varName = toCamelCase(option.label as string)
            if (varName) {
                const isOutput =
                    option.type === OptionsStructureType.VARIABLE_NAME_INPUT ||
                    option.type === OptionsStructureType.MULTIPLE_VARIABLE_NAME_INPUT
                variables.push({ name: varName, isOutput })
            }
        }
    })

    return variables
}

export function generateNodeJSFiles(nodeDefinition: NodeDefinition): ProjectFile[] {
    const variables = getVariableNames(nodeDefinition)
    const nodeName = nodeDefinition.name.toLowerCase() || "node-service"

    const varDeclarations = variables
        .map((v) => {
            if (v.isOutput) {
                return `    const ${v.name} = req.body.data.outputs.${v.name};`
            } else {
                return `    const ${v.name} = req.body.data.${v.name};`
            }
        })
        .join("\n")

    // Only include output variables in the response
    const outputVars = variables.filter((v) => v.isOutput)
    const varResponses = outputVars.map((v) => `                [${v.name}]: "Example value for ${v.name}",`).join("\n")

    return [
        {
            path: "package.json",
            language: "json",
            content: `{
  "name": "${nodeName}",
  "version": "1.0.0",
  "description": "Node service for ${nodeDefinition.name || "custom node"}",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "dependencies": {
    "axios": "^1.6.2",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}`,
        },
        {
            path: "Dockerfile",
            language: "dockerfile",
            content: `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3030

CMD ["npm", "start"]`,
        },
        {
            path: "src/server.js",
            language: "javascript",
            content: `const express = require('express');
const axios = require("axios");
const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});
app.use(express.json());

app.post('/${nodeDefinition.name.toLowerCase() || "endpoint"}', async (req, res) => {
    // Send immediate response to avoid timeouts
    res.sendStatus(200);
    
    // Required parameters from the request
    const responsePath = req.body.responsePath;
    const errorResponsePath = req.body.errorResponsePath;
    const flowElementInstanceId = req.body.flowElementInstanceId;
    
    // Extract variables from the request
${varDeclarations}

    try {
        // Your business logic here
        
        // Send successful response
        await axios.post(responsePath, {
            flowElementInstanceId,
            data: {
${varResponses}
            },
        }).then(() => {
            console.log("Response sent successfully");
        }).catch((error) => {
            console.error("Error sending response", error);
        });
    } catch (error) {
        // Send error response
        await axios.post(errorResponsePath, {
            flowElementInstanceId,
            errorMessage: \`Error processing ${nodeDefinition.name || "node"}: \${error.message}\`
        }).then(() => {
            console.log("Error response sent");
        }).catch((err) => {
            console.error("Error sending error response", err);
        });
    }
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(\`Server running on port \${PORT}\`);
});`,
        },
        {
            path: "README.md",
            language: "markdown",
            content: `# ${nodeDefinition.name || "Node Service"}

${nodeDefinition.shortDescription || "A service for processing node requests in a workflow."}

## Getting Started

### Prerequisites

- Node.js 14+
- npm or yarn

### Installation

1. Clone this repository
2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`
3. Start the server:
   \`\`\`
   npm start
   \`\`\`

## Docker

To run with Docker:

\`\`\`
docker build -t ${nodeDefinition.name.toLowerCase() || "node-service"} .
docker run -p 3030:3030 ${nodeDefinition.name.toLowerCase() || "node-service"}
\`\`\`

## API Endpoints

- \`POST /${nodeDefinition.name.toLowerCase() || "endpoint"}\`: Process node requests

## Environment Variables

- \`PORT\`: Server port (default: 3030)
`,
        },
    ]
}

export function generatePythonFiles(nodeDefinition: NodeDefinition): ProjectFile[] {
    const variables = getVariableNames(nodeDefinition)
    const nodeName = nodeDefinition.name.toLowerCase() || "flask-service"

    const varDeclarations = variables
        .map((v) => {
            if (v.isOutput) {
                return `    ${v.name} = request.json.get('data', {}).get('outputs', {}).get('${v.name}')`
            } else {
                return `    ${v.name} = request.json.get('data', {}).get('${v.name}')`
            }
        })
        .join("\n")

    // Only include output variables in the response
    const outputVars = variables.filter((v) => v.isOutput)
    const varResponses = outputVars.map((v) => `                ${v.name}: f"Example value for {${v.name}}",`).join("\n")

    return [
        {
            path: "requirements.txt",
            language: "plaintext",
            content: `flask==2.3.3
requests==2.31.0
gunicorn==21.2.0
python-dotenv==1.0.0`,
        },
        {
            path: "Dockerfile",
            language: "dockerfile",
            content: `FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]`,
        },
        {
            path: "app.py",
            language: "python",
            content: `from flask import Flask, request, jsonify
import requests
import os
import logging
from functools import wraps

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

def cors_middleware(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.method == 'OPTIONS':
            headers = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
            return '', 200, headers
        
        response = f(*args, **kwargs)
        
        if isinstance(response, tuple):
            response_body, status_code = response
            headers = {'Access-Control-Allow-Origin': '*'}
            return response_body, status_code, headers
        else:
            return response
    
    return decorated_function

@app.route('/${nodeDefinition.name.toLowerCase() || "endpoint"}', methods=['POST', 'OPTIONS'])
@cors_middleware
def process_node():
    if request.method == 'OPTIONS':
        return '', 200
    
    # Send immediate response to avoid timeouts
    response_task = {
        'status': 'processing'
    }
    
    # Required parameters from the request
    response_path = request.json.get('responsePath')
    error_response_path = request.json.get('errorResponsePath')
    flow_element_instance_id = request.json.get('flowElementInstanceId')
    
    # Extract variables from the request
${varDeclarations}
    
    try:
        # Your business logic here
        
        # Send successful response
        try:
            response = requests.post(
                response_path,
                json={
                    'flowElementInstanceId': flow_element_instance_id,
                    'data': {
${varResponses}
                    }
                }
            )
            app.logger.info("Response sent successfully")
        except Exception as e:
            app.logger.error(f"Error sending response: {str(e)}")
    except Exception as e:
        # Send error response
        try:
            requests.post(
                error_response_path,
                json={
                    'flowElementInstanceId': flow_element_instance_id,
                    'errorMessage': f"Error processing ${nodeDefinition.name || 'node'}: {str(e)}"
                }
            )
            app.logger.info("Error response sent")
        except Exception as err:
            app.logger.error(f"Error sending error response: {str(err)}")
    
    return jsonify(response_task), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)`,
        },
        {
            path: "README.md",
            language: "markdown",
            content: `# ${nodeDefinition.name || "Flask Service"}

${nodeDefinition.shortDescription || "A service for processing node requests in a workflow."}

## Getting Started

### Prerequisites

- Python 3.8+
- pip

### Installation

1. Clone this repository
2. Install dependencies:
   \`\`\`
   pip install -r requirements.txt
   \`\`\`
3. Start the server:
   \`\`\`
   python app.py
   \`\`\`
   
   Or with Gunicorn:
   \`\`\`
   gunicorn --bind 0.0.0.0:5000 app:app
   \`\`\`

## Docker

To run with Docker:

\`\`\`
docker build -t ${nodeDefinition.name.toLowerCase() || "flask-service"} .
docker run -p 5000:5000 ${nodeDefinition.name.toLowerCase() || "flask-service"}
\`\`\`

## API Endpoints

- \`POST /${nodeDefinition.name.toLowerCase() || "endpoint"}\`: Process node requests

## Environment Variables

- \`PORT\`: Server port (default: 5000)
`,
        },
    ]
}
