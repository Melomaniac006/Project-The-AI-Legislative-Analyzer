# ⚖️ VAKEEL AI
AI-Powered Legislative Intelligence Platform

VAKEEL AI transforms complex legal documents and parliamentary bills into simple, citizen-friendly insights using token compression, large language models, and intelligent analysis.

Instead of forcing citizens to read hundreds of pages of legal jargon, VAKEEL AI converts laws into clear summaries, key clauses, societal impact, and interactive Q&A.

## 🌍 Vision

Legal systems are often inaccessible to the public due to:

Extremely long legislative documents

Dense legal language

Lack of citizen-friendly explanations

VAKEEL AI bridges this gap by compressing and analyzing large policy documents using AI, enabling every citizen to understand what a law actually means for them.

## 🧠 Core Idea

Traditional LLM analysis of legal documents is token-expensive and energy-intensive.

VAKEEL AI introduces a two-stage intelligent pipeline:

1️⃣ Token Compression (ScaleDown API)
2️⃣ AI Legal Analysis (Groq LLM)

This approach:

- Reduces processing cost

- Saves energy

- Improves inference efficiency

- Enables large document processing

## 🏗️ System Architecture

```
User uploads PDF/TXT
       ↓
FastAPI Backend (/upload)
       ↓
ScaleDown API → compress text → save tokens
       ↓
Groq LLM (llama-3.3-70b) → analyze compressed text
       ↓
React Dashboard → summary, clauses, impact, Q&A
```

---

## ⚙️ Technology Stack
```
| Layer            | Technology           |
| ---------------- | -------------------- |
| Frontend         | React + Vite         |
| Backend          | FastAPI              |
| LLM              | Groq (Llama-3.3-70B) |
| Compression      | ScaleDown API        |
| Document Parsing | PyPDF                |
| Language         | Python               |
| Visualization    | React UI             |

```
---

## 🚀 Installation Guide

### Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API will be live at: http://localhost:8000  
Swagger docs: http://localhost:8000/docs

### Frontend (React)

Option A — Vite:
```bash
npm create vite@latest frontend -- --template react
# Replace src/App.jsx with the provided App.jsx
cd frontend
npm install
npm run dev
```

Option B — Use directly in any React setup by replacing App.jsx.

---

## 📡 API Endpoints

| Method | Endpoint     | Description                          |
|--------|-------------|--------------------------------------|
| POST   | /upload      | Upload PDF or TXT file               |
| POST   | /compress    | Run ScaleDown compression            |
| POST   | /analyze     | Groq LLM analysis (summary, clauses) |
| POST   | /ask         | Ask a question about the document    |
| GET    | /stats       | Token savings & carbon metrics       |
| GET    | /health      | Health check                         |

--

## 📄 Example Legislative Document Input
### Sample Policy Document
```

The Government of India proposes a new Agricultural Support Policy aimed at improving
farmer income and promoting sustainable agriculture. The policy introduces digital crop
monitoring systems, reduces fertilizer subsidies by 5%, and increases irrigation
investment in rural regions.

The new regulation will come into effect from April 2026 and will primarily impact
small and medium-scale farmers. The government also plans to introduce AI-based crop
disease detection programs to improve productivity.
```
---

### 🧠 AI Generated Citizen Summary
```
This policy aims to improve agricultural productivity and farmer income.

Key highlights:
• Fertilizer subsidies will be reduced by 5%.
• The government will invest more in rural irrigation systems.
• Farmers will get access to AI-based crop disease detection tools.
• Digital crop monitoring systems will be implemented nationwide.

The policy is expected to affect small and medium farmers and will start
in April 2026.
```
---

### ⚖️ Extracted Key Clauses
```
Clause 1 – Reduction of fertilizer subsidies by 5%.

Clause 2 – Implementation of nationwide digital crop monitoring.

Clause 3 – Government investment in irrigation infrastructure.

Clause 4 – Introduction of AI-powered crop disease detection systems.
```
---

### 🌍 Societal Impact Analysis
```
| Sector      | Impact                                    |
| ----------- | ----------------------------------------- |
| Agriculture | Increased productivity                    |
| Farmers     | Reduced subsidies but improved technology |
| Government  | Increased infrastructure investment       |
| Technology  | Growth in AgriTech and AI adoption        |
```
---

### ❓ Example User Question
User can ask:
```
How will this policy affect farmers?
```
#### AI Response
```
The policy may initially reduce fertilizer subsidies for farmers,
which could increase costs. However, the government plans to offset
this by improving irrigation infrastructure and providing AI-based
crop disease detection systems, which can help farmers increase
productivity and reduce crop losses.
```

## 📊 Token Compression Example
```
| Metric                   | Value      |
| ------------------------ | ---------- |
| Original Document Tokens | 80,000     |
| Compressed Tokens        | 14,000     |
| Token Reduction          | 82.5%      |
| Estimated Energy Saved   | 0.0198 kWh |
| Estimated CO₂ Saved      | 4.6g       |
```  


## 📁 File Structure

```
legislative-analyzer/
├── backend/
│   ├── main.py           # FastAPI app
│   └── requirements.txt  # Python deps
├── frontend/
│   └── App.jsx           # React dashboard
├── start_backend.sh      # Quick start script
└── README.md
```

## 🔮 Future Enhancements

- Multi-language law translation (Hindi, Bengali, Tamil)

- Legal bias detection

- Policy comparison engine

- Timeline of legislative changes

- Public sentiment analysis