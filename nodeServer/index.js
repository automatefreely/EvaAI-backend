const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const https = require("https"); // Required for proxy support
const app = express();
const port = 3000; // Set your desired port number

app.use(bodyParser.json());

// Define your Hugging Face API key here
const apiKey = "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"; // If you have an API key

// Define your proxy settings (replace with your actual proxy details)
const proxyHost = "http://172.31.2.3";
const proxyPort = 8080;

const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false, // Ignore SSL certificate validation (not recommended for production)
        proxy: {
            host: proxyHost,
            port: proxyPort,
            // Other proxy configuration options
        },
    }),
    headers: apiKey ? { Authorization: `${apiKey}` } : undefined,
});

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.post("/reply", async (req, res) => {
    const data = req.body;
    const initial = `You are the best friend of the user and you need to have a conversation with the user as a best friend in a positive manner...`; // Define your initial message here
    const prompt = initial + data.prompt;

    try {
        const start = Date.now();
        const response = await axiosInstance.post(
            "https://api-inference.huggingface.co/models/google/flan-t5-xxl",
            {
                inputs: prompt,
                options: { temperature: 0.5, max_length: 256 },
            }
        );

        const end = Date.now();

        console.log("Call repo", end - start);
        console.log("Generate response", end - start);

        res.json({
            result: true,
            response: response.data,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
