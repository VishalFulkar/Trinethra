const ollamaResponse = async (prompt) => {
    return fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'llama3.2',
            prompt: prompt,
            stream: false,
            format: 'json'
        })
    });
};

module.exports = ollamaResponse;
