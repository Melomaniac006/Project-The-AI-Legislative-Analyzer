# ⚖️ VAKEEL AI — AI Legislative Analyzer

> Making Indian laws accessible to every citizen through token compression + LLM analysis.

---

## 🏗️ Architecture

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

## 🚀 Setup

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

---

## 🌿 Carbon Savings Calculation

- **Energy estimate**: 0.0003 kWh per 1,000 tokens processed  
- **CO₂ factor**: 233g CO₂ per kWh (global average grid)  
- **Token savings** = (original_tokens - compressed_tokens)  
- **CO₂ saved** = token_savings × 0.0003 / 1000 × 233



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
