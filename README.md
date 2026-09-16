# ContractAI — NLP & ML Based Contract Analysis System

Full working implementation of the spec: React (Vite + Tailwind) frontend
+ FastAPI backend doing real text extraction, rule-based NLP (NER + clause
detection), a trained scikit-learn risk classifier, and a TF-IDF semantic
search / RAG-style Q&A engine — no external API keys required to run.

## Quick start

**Terminal 1 — backend**
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — frontend**
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173, upload a PDF/DOCX/TXT contract, and walk through
Dashboard → Analyze → Results (risk score, clause explorer, entities, ask-the-
contract chat with page-cited evidence) → History.

## What's real vs. simplified (read before presenting this as a project)

| Stage | Implementation | Notes |
|---|---|---|
| Extraction | `pdfplumber`, `python-docx` | Real, page-aware |
| NER | Regex/rule-based (`app/utils/ner.py`) | Fast + transparent; swap for spaCy/HF NER for a stronger model |
| Clause detection | Keyword-matched sentences (`app/utils/clauses.py`) | Swap for a fine-tuned text classifier with labeled clause data |
| Risk ML | **Actually trained** TF-IDF + Logistic Regression (`app/utils/risk.py`) | Trained on a small 22-row seed dataset — expand it with real labeled clauses for a meaningful model. `/model/evaluation` reports precision/recall/F1 |
| Semantic search / RAG | TF-IDF + cosine similarity retriever, extractive answer (`app/utils/rag.py`) | No embedding API key needed; swap for `sentence-transformers` + FAISS/Chroma + an LLM for generative answers |
| Storage | In-memory dict, resets on restart | Swap for Postgres + a vector DB for persistence |

See `backend/README.md` and `frontend/README.md` for endpoint/component details.
