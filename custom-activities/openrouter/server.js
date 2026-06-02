const express = require('express');
const axios = require('axios');
const app = express();

app.use((req, res, next) => {
    console.log('Request:', req.method, req.url);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});
app.use(express.json());

app.post('/call', async (req, res) => {
    res.sendStatus(200);

    const { responsePath, errorResponsePath, flowElementInstanceId } = req.body;
    const { apiKey, model, prompt, userInput, outputs } = req.body.data;
    const outputVar = outputs.outputVariableName;

    try {
        const messages = [{ role: 'system', content: prompt }];
        if (userInput) messages.push({ role: 'user', content: userInput });

        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: model || 'openai/gpt-4o-mini',
                messages,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
            }
        );

        const answer = response.data.choices[0].message.content;
        console.log(`Sending response to ${responsePath}`);

        await axios.post(responsePath, {
            flowElementInstanceId,
            data: { [outputVar]: answer },
        });
    } catch (error) {
        console.error('OpenRouter call failed:', error.message);
        await axios.post(errorResponsePath, {
            flowElementInstanceId,
            errorMessage: `OpenRouter call failed: ${error.message}`,
        }).catch((e) => console.error('Failed to send error response:', e.message));
    }
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`OpenRouter activity listening on port ${PORT}`);
});

server.timeout = 120000;
server.keepAliveTimeout = 120000;
