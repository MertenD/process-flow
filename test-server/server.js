const express = require('express');
const axios = require("axios");
const app = express();

app.use((req, res, next) => {
    const origin = req.headers.origin;

    // Prüfen, ob die Anfrage von 10.105.11.42 stammt
    if (origin === 'http://10.105.11.42') {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    // OPTIONS-Anfragen (Preflight) direkt beantworten
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});
app.use(express.json());

app.post('/test', (req, res) => {
    // Den Body in der Konsole ausgeben
    console.log('Empfangener Body:', req.body);

    setTimeout(() => {
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
    }, 2000)

    res.sendStatus(200);
});

const PORT = 3030;
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
