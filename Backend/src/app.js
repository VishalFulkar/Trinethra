const express = require('express');
const { analyzeTranscript } = require('./services/ollamaService');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.post("/ollama-response", async (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript) {
      return res.status(400).json({ error: "Transcript is required" });
    }

    const result = await analyzeTranscript(transcript);
    
    res.json({
      response: result,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to get response from Ollama",
      details: error.message
    });
  }
})

module.exports = app;