"""
Text extraction module.
Handles PDF, DOCX and TXT files and returns per-page text so downstream
components (entities, clauses, RAG) can cite a page number as "evidence".
"""
from typing import List, Dict
import io

import pdfplumber
from docx import Document


def extract_pdf(file_bytes: bytes) -> List[Dict]:
    """Returns a list of {page: int, text: str}"""
    pages = []
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for i, page in enumerate(pdf.pages, start=1):
            text = page.extract_text() or ""
            pages.append({"page": i, "text": text})
    return pages


def extract_docx(file_bytes: bytes) -> List[Dict]:
    """DOCX has no native 'pages', so we chunk paragraphs into
    pseudo-pages of ~40 paragraphs to keep evidence citations useful."""
    doc = Document(io.BytesIO(file_bytes))
    paras = [p.text for p in doc.paragraphs if p.text.strip()]
    chunk_size = 40
    pages = []
    for i in range(0, len(paras), chunk_size):
        chunk = "\n".join(paras[i:i + chunk_size])
        pages.append({"page": (i // chunk_size) + 1, "text": chunk})
    if not pages:
        pages = [{"page": 1, "text": ""}]
    return pages


def extract_txt(file_bytes: bytes) -> List[Dict]:
    text = file_bytes.decode("utf-8", errors="ignore")
    # split into ~2000 char pseudo-pages
    chunk_size = 2000
    pages = []
    for i in range(0, len(text), chunk_size):
        pages.append({"page": (i // chunk_size) + 1, "text": text[i:i + chunk_size]})
    if not pages:
        pages = [{"page": 1, "text": ""}]
    return pages


def extract_text(filename: str, file_bytes: bytes) -> List[Dict]:
    lower = filename.lower()
    if lower.endswith(".pdf"):
        return extract_pdf(file_bytes)
    elif lower.endswith(".docx"):
        return extract_docx(file_bytes)
    elif lower.endswith(".txt"):
        return extract_txt(file_bytes)
    else:
        raise ValueError("Unsupported file type. Please upload PDF, DOCX, or TXT.")


def clean_text(text: str) -> str:
    """Basic normalization: collapse whitespace, strip odd characters."""
    text = text.replace("\r", " ")
    text = " ".join(text.split())
    return text
