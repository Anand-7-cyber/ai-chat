import dotenv from 'dotenv'; // dotenv ko import karna
dotenv.config();

import express from 'express'; // express ko import karna
import fetch from 'node-fetch'; // node-fetch ko import karna

const app = express();
const port = 4000;

// Middleware to parse JSON requests
app.use(express.json());

// Static file serving (HTML, CSS, JS)
app.use(express.static('public'));

// Home route to serve HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Chat endpoint to handle requests to Cohere API
app.post('/chat', async (req, res) => {
    const userInput = req.body.input;
    console.log('User Input:', userInput); // Debugging

    if (!userInput) {
        return res.status(400).send('No input received');
    }

    try {
        // Access API key from .env file
        const apiKey = process.env.COHERE_API_KEY;

        const response = await fetch('https://api.cohere.ai/v1/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}` // Using the API key from .env
            },
            body: JSON.stringify({
                model: 'command-xlarge-nightly',
                prompt: userInput,
                max_tokens: 150,
                temperature: 0.7,
                k: 0,
                p: 0.75
            })
        });

        if (!response.ok) {
            console.log(`API Error: ${response.status} - ${response.statusText}`);
            return res.status(response.status).send('Error from Cohere API');
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (data && data.generations && data.generations.length > 0) {
            res.json({ response: data.generations[0].text.trim() });
        } else {
            res.json({ response: "Sorry, I couldn't generate a response." });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error: Unable to process your request');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
