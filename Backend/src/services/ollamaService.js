const rubric = require('../data/rubric.json')

const buildRubricText = () =>{
    return rubric.rubric.bands.map(band => {
        const levels = band.levels.map(level => `
        ${level.score} - ${level.label} : ${level.description} Signals: ${level.signals.join(', ')}`).join('\n')

        return `## ${band.band} (${band.range[0]} - ${band.range[1]}): ${levels}`;
    }).join('\n')
}

const buildBoundariesText = () => {
    return `
    Boundary : ${rubric.rubric.criticalBoundary.boundary} - ${rubric.rubric.criticalBoundary.description}
    
    `;
}

const buildDimensionsText = () => {
    return rubric.assessmentDimensions.map(dimension => 
        `Assessment dimension - ${dimension.id} : ${dimension.description}`
    ).join('\n');
}

const buildKpiText = () => {
    return rubric.kpis.map(kpi => `- "${kpi.label}" : "${kpi.description}" `).join('\n');
}

const getExtractionPrompt = (transcript) => `
Read this supervisor transcript carefully.
Extract ONLY quotes that appear word-for-word in the TRANSCRIPT.
Do NOT invent quotes. Do NOT use examples from your instructions.
Include BOTH positive AND negative quotes — especially quotes where supervisor mentions limitations.


## ASSESSMENT DIMENSIONS TO LOOK FOR:
${buildDimensionsText()}

TRANSCRIPT:
"""
${transcript}
"""

Return ONLY valid JSON. No markdown, no explanation.

{
  "quotes": [
    {
      "quote": "<exact quote from transcript>",
      "signal": "<positive | negative | neutral>",
      "dimension": "<execution | systems_building | kpi_impact | change_management>",
      "note": "<one sentence on what this reveals>"
    }
  ]
}
`;

const getScoringPrompt = (transcript, extracted) => `
You are scoring a DT Fellow using a 1-10 rubric.

## RUBRIC:
${buildRubricText()}

- band "Need Attention" = scores 1-3 ONLY
- band "Productivity" = scores 4-6 ONLY  
- band "Performance" = scores 7-10 ONLY
- These are non-negotiable — band must match the score value

## CRITICAL BOUNDARY:
${buildBoundariesText()}

## HARD RULES:
- If ANY quote shows Fellow does not push back or waits for instructions → MAXIMUM score is 6
- If Fellow's work stops when they leave → NOT systems building → cannot score 7+
- Score 7+ requires Fellow to have EXPANDED SCOPE without being asked
- band must be EXACTLY one of: "Need Attention" OR "Productivity" OR "Performance"

## KPI NAMES
- Only include KPIs that have actual evidence in the transcript
- Never include a KPI with empty evidence field
- use ONLY these exact strings:
${buildKpiText()}

## DIMENSIONS — check all 4, report gap for any not evidenced:
${buildDimensionsText()}

## EXTRACTED QUOTES:
${JSON.stringify(extracted.quotes, null, 2)}

## ORIGINAL TRANSCRIPT:
"""
${transcript}
"""

Return ONLY valid JSON. No markdown, no backticks.

{
  "score": {
    "value": <number 1-10>,
    "label": "<exact label from rubric>",
    "band": "<exactly one of: Need Attention | Productivity | Performance>",
    "justification": "<2-3 sentences referencing both positive AND negative quotes>",
    "confidence": "<low | medium | high>"
  },
  "evidence": [
    {
      "quote": "<exact quote from transcript>",
      "signal": "<positive | negative | neutral>",
      "dimension": "<execution | systems_building | kpi_impact | change_management>",
      "interpretation": "<what this reveals about the Fellow>"
    }
  ],
  "kpiMapping": [
    {
      "kpi": "<one of the 8 KPI labels listed above>",
      "evidence": "<what in the transcript connects to this KPI>",
      "systemOrPersonal": "<system | personal>"
    }
  ],
  "gaps": [
    {
      "dimension": "<execution | systems_building | kpi_impact | change_management>",
      "detail": "<what was not mentioned and why it matters>"
    }
  ],
  "followUpQuestions": [
    {
      "question": "<specific question to ask the supervisor>",
      "targetGap": "<which dimension this addresses>",
      "lookingFor": "<what a good answer would reveal>"
    }
  ]
}
`;

const ollamaResponse = async (prompt) => {
    const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'llama3.2',
            prompt: prompt,
            stream: false,
            format: 'json'
        })
    });

    if (!response.ok) {
        throw new Error(`Ollama request failed: ${response.status}. Is Ollama running?`);
    }

    const data = await response.json();

    if (!data.response) {
        throw new Error('Empty response from Ollama. Try again.');
    }

    return data.response;

};

const analyzeTranscript = async (transcript) => {
    // Step 1: Extraction
    const extractionPrompt = getExtractionPrompt(transcript);
    const extractionRaw = await ollamaResponse(extractionPrompt);
    let extracted;
    try {
        extracted = JSON.parse(extractionRaw.replace(/```json|```/g, '').trim());
    } catch (e) {
        console.error("Failed to parse extraction JSON:", extractionRaw);
        extracted = { quotes: [] };
    }

    // Step 2: Scoring
    const scoringPrompt = getScoringPrompt(transcript, extracted);
    const scoringRaw = await ollamaResponse(scoringPrompt);
    try {
        return JSON.parse(scoringRaw.replace(/```json|```/g, '').trim());
    } catch (e) {
        console.error("Failed to parse scoring JSON:", scoringRaw);
        throw new Error("Failed to parse LLM response");
    }
}

module.exports = { analyzeTranscript };
