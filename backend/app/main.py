import uuid
from datetime import datetime
from typing import Dict

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.utils.extraction import extract_text, clean_text
from app.utils.ner import extract_entities
from app.utils.clauses import detect_clauses
from app.utils.risk import (
    score_clauses,
    overall_risk_summary,
    evaluate_model,
)
from app.utils.rag import (
    build_chunks,
    DocumentIndex,
    answer_question,
)
from app.utils.settings import (
    get_settings,
    update_settings,
    reset_settings,
)


# ============================================================
# CREATE FASTAPI APP
# ============================================================

app = FastAPI(
    title="Contract Analysis API",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

# Allow requests from your Netlify frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://aicontract2.netlify.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# IN-MEMORY DATABASE
# ============================================================

DOCUMENTS: Dict[str, Dict] = {}
INDEXES: Dict[str, DocumentIndex] = {}


# ============================================================
# REQUEST MODELS
# ============================================================

class AskRequest(BaseModel):
    document_id: str
    question: str


class SettingsUpdateRequest(BaseModel):
    theme: str | None = None
    default_document_type: str | None = None


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():
    return {
        "status": "ok",
        "service": "Contract Analysis API"
    }


# ============================================================
# SETTINGS
# ============================================================

@app.get("/settings")
def read_settings():
    return get_settings()


@app.put("/settings")
def write_settings(req: SettingsUpdateRequest):

    updates = {
        key: value
        for key, value in req.model_dump().items()
        if value is not None
    }

    # Validate theme
    if "theme" in updates:
        if updates["theme"] not in ("light", "dark"):
            raise HTTPException(
                status_code=400,
                detail="theme must be 'light' or 'dark'."
            )

    return update_settings(updates)


@app.post("/settings/reset")
def reset_settings_endpoint():
    return reset_settings()


# ============================================================
# UPLOAD DOCUMENT
# ============================================================

@app.post("/upload")
async def upload_document(
    file: UploadFile = File(...)
):

    # --------------------------------------------------------
    # Check file type
    # --------------------------------------------------------

    if not file.filename.lower().endswith(
        (".pdf", ".docx", ".txt")
    ):
        raise HTTPException(
            status_code=400,
            detail="Only PDF, DOCX and TXT files are supported."
        )

    # --------------------------------------------------------
    # Read file
    # --------------------------------------------------------

    file_bytes = await file.read()

    if len(file_bytes) == 0:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty."
        )

    # ========================================================
    # TEXT EXTRACTION
    # ========================================================

    try:

        raw_pages = extract_text(
            file.filename,
            file_bytes
        )

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=f"Could not extract text: {e}"
        )

    # --------------------------------------------------------
    # Clean extracted text
    # --------------------------------------------------------

    pages = [
        {
            "page": p["page"],
            "text": clean_text(p["text"])
        }
        for p in raw_pages
    ]

    # ========================================================
    # NLP
    # ========================================================

    try:

        entities = extract_entities(pages)

        clauses = detect_clauses(pages)

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"NLP processing failed: {e}"
        )

    # ========================================================
    # MACHINE LEARNING
    # ========================================================

    try:

        scored_clauses = score_clauses(clauses)

        risk_summary = overall_risk_summary(
            scored_clauses
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Risk analysis failed: {e}"
        )

    # ========================================================
    # RAG
    # ========================================================

    try:

        chunks = build_chunks(pages)

        index = DocumentIndex(chunks)

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"RAG indexing failed: {e}"
        )

    # ========================================================
    # DOCUMENT ID
    # ========================================================

    document_id = str(uuid.uuid4())

    # ========================================================
    # STORE DOCUMENT
    # ========================================================

    DOCUMENTS[document_id] = {
        "id": document_id,
        "filename": file.filename,
        "uploaded_at": datetime.utcnow().isoformat(),
        "pages": pages,
        "entities": entities,
        "clauses": scored_clauses,
        "risk_summary": risk_summary,
        "num_pages": len(pages),
    }

    INDEXES[document_id] = index

    # ========================================================
    # RESPONSE
    # ========================================================

    return {
        "document_id": document_id,
        "filename": file.filename,
        "num_pages": len(pages),
        "num_clauses": len(scored_clauses),

        "num_entities": (
            len(entities.get("parties", []))
            + len(entities.get("money_mentions", []))
            + len(entities.get("dates", []))
        ),

        "risk_summary": risk_summary,
    }


# ============================================================
# GET COMPLETE DOCUMENT
# ============================================================

@app.get("/document/{document_id}")
def get_document(document_id: str):

    doc = DOCUMENTS.get(document_id)

    if not doc:

        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    return doc


# ============================================================
# GET ENTITIES
# ============================================================

@app.get("/document/{document_id}/entities")
def get_entities(document_id: str):

    doc = DOCUMENTS.get(document_id)

    if not doc:

        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    return doc["entities"]


# ============================================================
# GET CLAUSES
# ============================================================

@app.get("/document/{document_id}/clauses")
def get_clauses(document_id: str):

    doc = DOCUMENTS.get(document_id)

    if not doc:

        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    return doc["clauses"]


# ============================================================
# GET RISK
# ============================================================

@app.get("/document/{document_id}/risk")
def get_risk(document_id: str):

    doc = DOCUMENTS.get(document_id)

    if not doc:

        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    return doc["risk_summary"]


# ============================================================
# ASK QUESTION - RAG
# ============================================================

@app.post("/ask")
def ask_document(req: AskRequest):

    doc = DOCUMENTS.get(req.document_id)

    index = INDEXES.get(req.document_id)

    if not doc or index is None:

        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    if not req.question.strip():

        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty."
        )

    try:

        result = answer_question(
            index,
            req.question
        )

        return result

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Question answering failed: {e}"
        )


# ============================================================
# HISTORY
# ============================================================

@app.get("/history")
def get_history():

    return [
        {
            "id": d["id"],
            "filename": d["filename"],
            "uploaded_at": d["uploaded_at"],
            "risk_summary": d["risk_summary"],
        }
        for d in DOCUMENTS.values()
    ]


# ============================================================
# MODEL EVALUATION
# ============================================================

@app.get("/model/evaluation")
def model_evaluation():

    """
    Reports precision, recall and F1
    of the risk classifier on a holdout split.
    """

    try:

        return evaluate_model()

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Model evaluation failed: {e}"
        )