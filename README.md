<div align="center">

# ⚖️ VAKEEL AI
### AI-Powered Legislative Intelligence Platform

**Transforming complex Indian laws into citizen-friendly insights**  
**using Token Compression + LLM Analysis**

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Groq](https://img.shields.io/badge/Groq-F55036?style=flat-square&logoColor=white)](https://groq.com)
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)

</div>

---

## 🌍 Vision

Legal systems are often inaccessible to the public due to:

- 📄 Extremely long legislative documents (100,000+ tokens)
- 🔒 Dense legal language and jargon
- 🚫 Lack of citizen-friendly explanations

**VAKEEL AI bridges this gap** by compressing and analyzing large policy documents using AI — enabling every citizen to understand what a law actually means for them.

---

## 🧠 Core Idea

Traditional LLM analysis of legal documents is token-expensive and energy-intensive.

VAKEEL AI introduces a **two-stage intelligent pipeline:**

```
1️⃣  Token Compression  →  ScaleDown API
2️⃣  AI Legal Analysis  →  Groq LLM (Llama-3.3-70B)
```

This approach:
- ✅ Reduces processing cost
- ✅ Saves energy & CO₂
- ✅ Improves inference efficiency
- ✅ Handles documents with 100k+ tokens

---

## 🏗️ System Architecture

```
User uploads PDF / TXT
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

## 📊 Token Compression Results

| Metric | Value |
|--------|-------|
| Original Document Tokens | 80,000 |
| Compressed Tokens | 14,000 |
| Token Reduction | **82.5%** |
| Estimated Energy Saved | 0.0198 kWh |
| Estimated CO₂ Saved | **4.6g** |

---

## 🎬 Demo




https://github.com/user-attachments/assets/c684a798-b985-446a-9f75-cf51290f950d


---

## ⚙️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| 🎨 Frontend | React + Vite | Dashboard UI |
| ⚡ Backend | FastAPI (Python) | REST API |
| 🧠 LLM | Groq · Llama-3.3-70B | Legal Analysis |
| 🗜️ Compression | ScaleDown API | Token Compression |
| 📄 Parsing | pdfplumber | PDF Text Extraction |
| 🚀 Hosting | Railway + Vercel | Deployment |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/upload` | Upload PDF or TXT file |
| `POST` | `/compress` | Run ScaleDown token compression |
| `POST` | `/analyze` | Groq LLM analysis — summary, clauses, impact |
| `POST` | `/ask` | Ask a citizen question about the document |
| `GET` | `/stats` | Token savings & carbon metrics |
| `GET` | `/health` | Health check |

---

## 🚀 Installation Guide

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/vakeel-ai.git
cd vakeel-ai
```

### 2. Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
```

Create your `.env` file:

```bash
cp .env.example .env
```

Open `.env` and fill in your keys — no quotes, no spaces:

```
GROQ_API_KEY=your_groq_key_here
SCALEDOWN_API_KEY=your_scaledown_key_here
SCALEDOWN_ENDPOINT=https://api.scaledown.xyz/compress/raw/
GROQ_MODEL=llama-3.3-70b-versatile
```

Start the server:

```bash
uvicorn main:app --reload --port 8000
```

✅ API live at `http://localhost:8000`  
📖 Swagger docs at `http://localhost:8000/docs`

### 3. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

✅ App live at `http://localhost:5173`

> Run both terminals simultaneously — backend on 8000, frontend on 5173.

---

## 📄 Example Input & Output

### Input — Sample Policy Document

```
The Government of India proposes a new Agricultural Support Policy aimed at
improving farmer income and promoting sustainable agriculture. The policy
introduces digital crop monitoring systems, reduces fertilizer subsidies by 5%,
and increases irrigation investment in rural regions.
```

### Output — AI Citizen Summary

```
This policy aims to improve agricultural productivity and farmer income.

Key highlights:
• Fertilizer subsidies will be reduced by 5%
• Government will invest more in rural irrigation systems
• Farmers get access to AI-based crop disease detection tools
• Digital crop monitoring will be implemented nationwide

Effective April 2026 — primarily affects small and medium farmers.
```

### Citizen Q&A Example

```
Q: How will this policy affect farmers?

A: The policy may initially reduce fertilizer subsidies, increasing some costs.
   However, improved irrigation and AI crop disease detection tools are designed
   to raise productivity and reduce crop losses over time.
```

---

## 📁 File Structure

```
vakeel-ai/
├── backend/
│   ├── main.py              # FastAPI app
│   ├── requirements.txt     # Python dependencies
│   ├── .env                 # Your API keys (never commit)
│   └── .env.example         # Safe template
├── frontend/
│   ├── src/
│   │   └── App.jsx          # React dashboard
│   └── vite.config.js
├── .gitignore               # Keeps .env out of Git
└── README.md
```

---

## 🔐 Environment Variables

| Variable | Description | Where to get |
|----------|-------------|--------------|
| `GROQ_API_KEY` | Groq LLM API key | [console.groq.com](https://console.groq.com) |
| `SCALEDOWN_API_KEY` | ScaleDown compression key | [scaledown.xyz](https://scaledown.xyz) |

> ⚠️ **Never commit your `.env` file.** It is listed in `.gitignore`.

---

## 🔮 Future Enhancements

- 🌐 Multi-language translation (Hindi, Bengali, Tamil)
- ⚖️ Legal bias detection
- 📊 Policy comparison engine
- 📅 Timeline of legislative changes
- 📣 Public sentiment analysis
- 📱 Mobile app (iOS & Android)
  

---

## 👥 Team Behind VAKEEL AI
- Sayan Chowdhury
- Sanjit Kumar Shaw
- Sukanya Rana

<div align="center">

*Satyameva Jayate*

**Making Indian law accessible to every citizen.**

</div>
