from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import httpx
import os
import re
import json
import pdfplumber
import io
from groq import Groq

load_dotenv()

app = FastAPI(title="AI Legislative Analyzer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
SCALEDOWN_API_KEY = os.getenv("SCALEDOWN_API_KEY")
SCALEDOWN_ENDPOINT = "https://api.scaledown.xyz/compress/raw/"
GROQ_MODEL = "llama-3.3-70b-versatile"
if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY is not set. Please add it to your .env file.")

if not SCALEDOWN_API_KEY:
    raise RuntimeError("SCALEDOWN_API_KEY is not set. Please add it to your .env file.")

groq_client = Groq(api_key=GROQ_API_KEY)

# In-memory store for current session
session = {
    "original_text": "",
    "compressed_text": "",
    "original_tokens": 0,
    "compressed_tokens": 0,
    "filename": "",
    "analysis": None,
}

def estimate_tokens(text: str) -> int:
    return max(1, len(text) // 4)

def extract_text_from_file(content: bytes, filename: str) -> str:
    if filename.lower().endswith(".pdf"):
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            return "\n".join(page.extract_text() or "" for page in pdf.pages)
    return content.decode("utf-8", errors="ignore")

async def compress_text(text: str):
    """
    Returns (compressed_text, original_tokens, compressed_tokens)
    Uses ScaleDown actual API format with x-api-key header and context/prompt/model payload.
    """
    async with httpx.AsyncClient(timeout=120) as client:
        resp = await client.post(
            SCALEDOWN_ENDPOINT,
            headers={
                "x-api-key": SCALEDOWN_API_KEY,
                "Content-Type": "application/json",
            },
            json={
                "context": text,
                "prompt": "Summarize and analyze this legislative document for a citizen.",
                "model": "gpt-4o",
                "scaledown": {"rate": "auto"}
            },
        )
        print(f"[ScaleDown] Status: {resp.status_code}, Body: {resp.text[:500]}")
        if resp.status_code != 200:
            raise HTTPException(status_code=502, detail=f"Compression API error: {resp.text}")
        data = resp.json()
        if "detail" in data and "results" not in data:
            print(f"[ScaleDown] ERROR in body: {data['detail']}")
            orig_tokens = estimate_tokens(text)
            return text, orig_tokens, orig_tokens

        # Unwrap "results" envelope if present
        payload = data.get("results", data)
        compressed = payload.get("compressed_prompt", text)

        api_orig = payload.get("original_prompt_tokens", 0)
        api_comp = payload.get("compressed_prompt_tokens", 0)

        if api_orig > 0 and api_comp > 0 and api_orig != api_comp:
            orig_tokens = api_orig
            comp_tokens = api_comp
        else:
            # Fall back to character-based estimation
            orig_tokens = estimate_tokens(text)
            comp_tokens = estimate_tokens(compressed)

        return compressed, orig_tokens, comp_tokens

class AskRequest(BaseModel):
    question: str

class AnalyzeRequest(BaseModel):
    text: str

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    content = await file.read()
    text = extract_text_from_file(content, file.filename)
    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from file.")

    session["original_text"] = text
    session["filename"] = file.filename
    session["original_tokens"] = estimate_tokens(text)
    session["compressed_text"] = ""
    session["compressed_tokens"] = 0
    session["analysis"] = None

    return {
        "filename": file.filename,
        "original_tokens": session["original_tokens"],
        "preview": text[:500],
        "char_count": len(text),
    }

@app.post("/compress")
async def compress_document():
    if not session["original_text"]:
        raise HTTPException(status_code=400, detail="No document uploaded yet.")

    compressed, orig_tokens, comp_tokens = await compress_text(session["original_text"])
    session["compressed_text"] = compressed
    session["original_tokens"] = orig_tokens   # use real token counts from ScaleDown
    session["compressed_tokens"] = comp_tokens

    orig = session["original_tokens"]
    comp = session["compressed_tokens"]
    savings_pct = round((1 - comp / orig) * 100, 1) if orig > 0 else 0
    # 0.0003 kWh per 1000 tokens (approximate LLM energy cost)
    energy_saved_kwh = round((orig - comp) * 0.0003 / 1000, 4)
    co2_saved_g = round(energy_saved_kwh * 233, 2)  # 233g CO2/kWh average

    return {
        "original_tokens": orig,
        "compressed_tokens": comp,
        "savings_pct": savings_pct,
        "energy_saved_kwh": energy_saved_kwh,
        "co2_saved_g": co2_saved_g,
        "compressed_preview": compressed[:400],
    }

@app.post("/analyze")
async def analyze_document():
    text = session.get("compressed_text") or session.get("original_text")
    if not text:
        raise HTTPException(status_code=400, detail="No document to analyze.")

    prompt = f"""You are an expert Indian legislative analyst helping ordinary citizens understand government bills and policies.

Analyze the following legal/policy document and respond ONLY with a valid JSON object (no markdown, no extra text) in this exact structure:
{{
  "summary": "3-4 sentence plain English summary of what this document does",
  "key_clauses": [
    {{"title": "clause name", "description": "plain English explanation", "impact": "high|medium|low"}}
  ],
  "citizen_impact": {{
    "positive": ["benefit 1", "benefit 2"],
    "negative": ["concern 1", "concern 2"],
    "neutral": ["neutral point 1"]
  }},
  "sectors_affected": ["sector1", "sector2"],
  "implementation_timeline": "when this takes effect",
  "complexity_score": 7
}}

DOCUMENT:
{text[:12000]}"""

    completion = groq_client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        max_tokens=2000,
    )

    raw = completion.choices[0].message.content.strip()
    # Strip markdown fences if present
    raw = re.sub(r"^```json\s*|^```\s*|\s*```$", "", raw, flags=re.MULTILINE).strip()

    try:
        analysis = json.loads(raw)
    except json.JSONDecodeError:
        analysis = {"summary": raw, "key_clauses": [], "citizen_impact": {}, "sectors_affected": [], "implementation_timeline": "Unknown", "complexity_score": 5}

    session["analysis"] = analysis
    return analysis

@app.post("/ask")
async def ask_question(req: AskRequest):
    text = session.get("compressed_text") or session.get("original_text")
    if not text:
        raise HTTPException(status_code=400, detail="No document loaded.")

    prompt = f"""You are an expert Indian legislative analyst. A citizen is asking about a legal document.

DOCUMENT CONTEXT:
{text[:10000]}

CITIZEN'S QUESTION: {req.question}

Answer in plain, simple English that any citizen can understand. Be concise (2-4 sentences max). If the answer isn't in the document, say so clearly."""

    completion = groq_client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=500,
    )

    return {"answer": completion.choices[0].message.content.strip()}

@app.get("/stats")
async def get_stats():
    orig = session["original_tokens"]
    comp = session["compressed_tokens"] or orig
    savings_pct = round((1 - comp / orig) * 100, 1) if orig > 0 else 0
    energy_saved_kwh = round((orig - comp) * 0.0003 / 1000, 4)
    co2_saved_g = round(energy_saved_kwh * 233, 2)
    return {
        "filename": session["filename"],
        "original_tokens": orig,
        "compressed_tokens": comp,
        "savings_pct": savings_pct,
        "energy_saved_kwh": energy_saved_kwh,
        "co2_saved_g": co2_saved_g,
        "has_analysis": session["analysis"] is not None,
    }

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/debug-compression")
async def debug_compression():
    """Test the ScaleDown API with a short sample text to diagnose auth issues."""
    sample = "The Parliament of India hereby enacts the following provisions relating to taxation."
    results = []
    auth_attempts = [
        ("x-api-key header", {"x-api-key": SCALEDOWN_API_KEY, "Content-Type": "application/json"}),
        ("Bearer token", {"Authorization": f"Bearer {SCALEDOWN_API_KEY}", "Content-Type": "application/json"}),
        ("Raw Authorization", {"Authorization": SCALEDOWN_API_KEY, "Content-Type": "application/json"}),
        ("api-key header", {"api-key": SCALEDOWN_API_KEY, "Content-Type": "application/json"}),
    ]
    async with httpx.AsyncClient(timeout=30) as client:
        for label, headers in auth_attempts:
            try:
                resp = await client.post(SCALEDOWN_ENDPOINT, headers=headers, json={"text": sample})
                results.append({
                    "auth_style": label,
                    "status_code": resp.status_code,
                    "response": resp.text[:300],
                })
            except Exception as e:
                results.append({"auth_style": label, "error": str(e)})
    return {"endpoint": SCALEDOWN_ENDPOINT, "results": results}
