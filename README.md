# TRINETHRA

![Trinethra Banner](file:///C:/Users/visha/Web-Development/Project/Trinethra/Frontend/public/trinethra_banner_1777977142185.png)

**Trinethra** is an AI-powered intelligence platform designed to analyze supervisor-fellow interactions and extract actionable performance insights. Using advanced LLM capabilities (Ollama), it processes raw interview transcripts to provide objective, rubric-based scoring that cuts through supervisor bias.

---

## 👁️ Core Philosophy

The name **Trinethra** (The Third Eye) represents the platform's ability to see beyond surface-level feedback. It is specifically designed to distinguish between **"Personal Helpfulness"** (being the supervisor's right hand) and **"Systems Building"** (creating self-sustaining impact).

### The Critical Boundary (6 vs 7)
Trinethra's scoring logic is centered around the "Initiative Boundary":
- **Score 6:** An excellent executor who delivers perfectly on tasks defined by others.
- **Score 7:** A problem identifier who proactively addresses challenges the supervisor hadn't yet articulated.

---

## 🚀 Key Features

- **🔍 Intelligent Quote Extraction:** Automatically identifies critical evidence from transcripts, categorizing them as positive, negative, or neutral.
- **📊 Rubric-Based Scoring:** Evaluates performance on a 1-10 scale across three bands: *Need Attention*, *Productivity*, and *Performance*.
- **🎯 KPI Mapping:** Connects qualitative feedback to specific business metrics like Lead Generation, NPS, TAT, and Quality.
- **🕳️ Gap Analysis:** Identifies missing dimensions in the fellow's performance (Execution, Systems Building, KPI Impact, Change Management).
- **❓ Strategic Follow-ups:** Generates targeted questions for supervisors to probe deeper into identified performance gaps.
- **🛡️ Bias Correction:** Built-in logic to detect "Helpfulness Traps" and "Presence Bias," ensuring objective assessment even with critical or overly glowing supervisors.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS
- **Icons/Typography:** Fontsource Oswald

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **AI Engine:** Ollama (Llama 3.2)
- **APIs:** RESTful architecture

---

## 📦 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Ollama](https://ollama.ai/) installed and running locally.
- Llama 3.2 model pulled: `ollama pull llama3.2`

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
   *The backend runs on `http://localhost:3001`*

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend runs on `http://localhost:5173`*

---

## 📂 Project Structure

```text
Trinethra/
├── Backend/
│   ├── src/
│   │   ├── services/       # Ollama integration & scoring logic
│   │   ├── data/           # Performance rubrics (JSON)
│   │   └── app.js          # Express app configuration
│   └── server.js           # Entry point
├── Frontend/
│   ├── src/
│   │   ├── components/     # UI Components (ScoreCard, EvidenceList, etc.)
│   │   ├── App.jsx         # Main application container
│   │   └── main.jsx        # React entry point
│   └── vite.config.js      # Vite configuration
└── README.md               # You are here
```

---

## ⚖️ Scoring Tiers

| Band | Score | Label | Focus |
| :--- | :--- | :--- | :--- |
| **Performance** | 7 - 10 | Problem Solver | Systems building & Proactive solutions |
| **Productivity** | 4 - 6 | Reliable Executor | Consistent delivery on assigned tasks |
| **Need Attention** | 1 - 3 | Directionless | Pre-productivity or disengaged |

---

Developed with ❤️ for Advanced Performance Analysis.
