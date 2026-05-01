const rubric = require('../data/rubric.json')

const buildRubricText = () => {
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
Extract MINIMUM 4 quotes that reveal something about the Fellow's performance.
Do NOT invent quotes. Do NOT use examples from your instructions.
Include BOTH positive AND negative quotes — do not skip critical ones.
Do NOT copy placeholder text from instructions — only use exact words from the TRANSCRIPT.


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

## CRITICAL BOUNDARY:
${buildBoundariesText()}

## BAND RULES — non-negotiable:
- score 1-3 → band must be "Need Attention"
- score 4-6 → band must be "Productivity"
- score 7-10 → band must be "Performance"

## OUTPUT REQUIREMENTS — MINIMUM:
- evidence: at least 4 quotes from the transcript
- gaps: check ALL 4 dimensions, report gap for EVERY dimension not evidenced (minimum 2)
- followUpQuestions: minimum 3, maximum 5
- kpiMapping: only real KPI names with real evidence from transcript, no placeholders

## HARD RULES:
- If ANY extracted quote shows Fellow does not push back or waits for instructions → MAXIMUM score is 6
- If Fellow's work stops when they leave → cannot score 7+
- Score 7+ ONLY if Fellow independently noticed a problem NO ONE asked about
- "Helpful" or "takes work off plate" = 5-6, never 7+
- Only include KPIs with actual transcript evidence — no empty fields
- evidence dimension must be one of: execution | systems_building | kpi_impact | change_management
- Never use band names as dimension values

## KPI NAMES — use ONLY these exact strings:
${buildKpiText()}

## DIMENSIONS — check all 4, report gap for any not evidenced:
${buildDimensionsText()}

## EXTRACTED QUOTES — base your analysis ONLY on these:
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
    "band": "<Need Attention | Productivity | Performance — must match score value>",
    "justification": "<2-3 sentences citing specific quotes from transcript, including negative ones>",
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
      "kpi": "<one of the 8 KPI labels — only if transcript supports it>",
      "evidence": "<non-empty: what in transcript connects to this KPI>",
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
      "targetGap": "<execution | systems_building | kpi_impact | change_management>",
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

const fixAnalysis = (analysis, extracted , transcript) => {
  let score = analysis.score?.value;
  if (!score) return analysis;
  const capTriggerPhrases = [
    "doesn't push back",
    "does not push back",
    "does what i tell",
    "does what he's told",
    "waits for instructions",
    "only when i tell",
    "even if it's not the best way"
  ];

  const allQuotes = [
    ...(extracted?.quotes || []),
    ...(analysis?.evidence || [])
  ].map(q => (q.quote || '').toLowerCase());

  const transcriptLower = (transcript || '').toLowerCase();

    const shouldCap =
        allQuotes.some(quote => capTriggerPhrases.some(phrase => quote.includes(phrase))) ||
        capTriggerPhrases.some(phrase => transcriptLower.includes(phrase));

    if (shouldCap && score > 6) {
        console.log(`Score capped from ${score} to 6 — negative quote detected`);
        score = 6;
        analysis.score.value = 6;
        analysis.score.justification += ' [Score capped at 6: supervisor explicitly noted Fellow does not push back or exercise independent judgment.]';
    }

  if (shouldCap && score > 6) {
    console.log(`Score capped from ${score} to 6 — negative quote detected`);
    score = 6;
    analysis.score.value = 6;
    analysis.score.justification += ' [Score capped at 6: supervisor explicitly noted Fellow does not push back or exercise independent judgment.]';
  }

  if (score <= 3) analysis.score.band = 'Need Attention';
  else if (score <= 6) analysis.score.band = 'Productivity';
  else analysis.score.band = 'Performance';
  const labels = {
    1: 'Not Interested',
    2: 'Lacks Discipline',
    3: 'Motivated but Directionless',
    4: 'Careless and Inconsistent',
    5: 'Consistent Performer',
    6: 'Reliable and Productive',
    7: 'Problem Identifier',
    8: 'Problem Solver',
    9: 'Innovative and Experimental',
    10: 'Exceptional Performer'
  };
  analysis.score.label = labels[score];

  const validKpis = rubric.kpis.map(k => k.label);
  if (analysis.kpiMapping) {
    analysis.kpiMapping = analysis.kpiMapping.filter(k =>
      validKpis.includes(k.kpi) &&
      k.evidence &&
      !k.evidence.startsWith('<') &&
      k.evidence.length > 10
    );
  }

  return analysis;
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
  let analysis;
  try {
    analysis = JSON.parse(scoringRaw.replace(/```json|```/g, '').trim());
  } catch (e) {
    console.error("Failed to parse scoring JSON:", scoringRaw);
    throw new Error("Failed to parse LLM response");
  }

  const fixed = fixAnalysis(analysis, extracted , transcript);
  console.log(`Final score: ${fixed.score?.value} — ${fixed.score?.label} (${fixed.score?.band})`);
  return fixed;
}

module.exports = { analyzeTranscript };
