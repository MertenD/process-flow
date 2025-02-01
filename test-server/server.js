const express = require('express');
const axios = require("axios");
const app = express();

app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (origin === 'http://10.105.11.42') {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});
app.use(express.json());

app.post('/test', (req, res) => {
    // Den Body in der Konsole ausgeben
    console.log('Empfangener Body:', req.body);

    const responsePath = req.body.responsePath;
    const postData = {
        flowElementInstanceId: req.body.flowElementInstanceId,
        data: {
            message: 'Hello from test-server'
        }
    }

    axios.post(responsePath, postData, {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(() => {
        console.log('Antwort gesendet');
    }).catch((error) => {
        console.error('Fehler beim Senden der Antwort:', error)
    })

    res.sendStatus(200);
});

app.post("/chatgpt", async (req, res) => {
    res.sendStatus(200);

    console.log("Empfangener Body:", req.body);

    const responsePath = req.body.responsePath;
    const flowElementInstanceId = req.body.flowElementInstanceId;
    const prompt = req.body.data.prompt;
    const variableName = req.body.data.outputs.variablenname;

    const openAiUrl = "http://127.0.0.1:1234/v1/chat/completions";

    try {
        const openAiResponse = await axios.post(
            openAiUrl,
            {
                model: "deepseek-r1-distill-qwen-7b",
                messages: [
                    {
                        role: "system",
                        content: "Du bist ein kreativer Dichter, der Gedichte über beliebige Themen verfassen kann. Gib niemals zweimal nacheinander das gleiche Gedicht aus, sondern verändere es jedes Mal",
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ]
            }
        );

        const poem = openAiResponse.data.choices[0].message.content.split("</think>")[1].trim();

        await axios.post(responsePath, {
            flowElementInstanceId,
            data: {
                [variableName]: poem,
            },
        }).then(() => {
            console.log("Antwort gesendet");
        }).catch((error) => {
            // TODO Add Endpoint in Webapp to set flow element to error state
            console.error("Fehler beim Senden der Antwort an responsePath:", error);
        });
    } catch (error) {
        console.error("Fehler beim Senden der Antwort:", error);
        res.sendStatus(500);
    }
});

const PORT = 3030;
const server = app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});

server.timeout = 120000;
server.keepAliveTimeout = 120000;