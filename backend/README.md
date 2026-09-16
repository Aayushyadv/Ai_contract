# Contract Analysis API (FastAPI backend)

## Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

## Endpoints

| Method | Path                          | Purpose                              |
|--------|-------------------------------|---------------------------------------|
| POST   | /upload                       | Upload PDF/DOCX/TXT, run full pipeline|
| GET    | /document/{id}                | Full stored analysis                  |
| GET    | /document/{id}/entities       | NER results                           |
| GET    | /document/{id}/clauses        | Detected + risk-scored clauses        |
| GET    | /document/{id}/risk           | Risk summary                          |
| POST   | /ask                          | RAG-style question answering          |
| GET    | /history                      | All analyzed documents                |
| GET    | /model/evaluation             | Precision/Recall/F1 of risk model     |

## Pipeline

Upload -> Extraction (pdfplumber/python-docx) -> NLP (regex NER + clause
keyword detection) -> ML (TF-IDF + Logistic Regression risk classifier,
trained on `app/utils/risk.py::SEED_DATA`) -> Semantic Search (TF-IDF +
cosine similarity retriever in `app/utils/rag.py`) -> extractive answer +
evidence with page number and similarity score.

## Notes on scope

- The NER/clause detection are transparent rule-based modules, not a
  trained transformer, so behavior is easy to inspect and extend. Swap in
  spaCy or a fine-tuned HF token-classifier without changing the API shape.
- The risk classifier is a *real* trained scikit-learn model, but trained
  on a small (~20-row) seed dataset for demo purposes. Expand `SEED_DATA`
  with real labeled clauses to make it meaningful.
- The RAG retriever uses TF-IDF, not neural embeddings, so it needs no API
  key to run. Swap for `sentence-transformers` + FAISS/Chroma for stronger
  semantic matching.
- Storage is in-memory (resets on server restart). Swap `DOCUMENTS` /
  `INDEXES` for a real DB + vector store for persistence.
