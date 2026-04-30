const express = require('express');
const ollamaResponse = require('./services/ollamaService');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post("/ollama-response", async (req, res) => {
    try {
        const transcript = req.body.transcript;
        if (!transcript) {
            return res.status(400).json({ error: "Transcript is required" });
        }

        const prompt = `You are an expert HR analyst evaluating a supervisor's feedback transcript.
    Analyze the following transcript and output ONLY valid JSON. Do not include any conversational text, markdown formatting (like \`\`\`json), or explanations outside the JSON object.

    The JSON must exactly match this structure:
    {
      "score": <number 1-10>,
      "justification": "<one paragraph explaining the score>",
      "evidence": [
        { "quote": "<exact quote from transcript>", "type": "positive" | "negative" | "neutral" }
      ],
      "gaps": [
        "<what was NOT mentioned in the transcript>"
      ],
      "followUpQuestions": [
        "<question 1>", "<question 2>"
      ]
    }

    Transcript to analyze:
    """
    ${transcript}
    """
    `;
    const response = await ollamaResponse(prompt);
    const responseData = await response.json();
    console.log(responseData);
    res.json({
        response: responseData.response,
    });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to get response from Ollama"
        });
    }
})

module.exports = app;