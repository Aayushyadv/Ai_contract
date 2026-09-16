"""
Clause detection.

Splits the document into paragraphs/sentences, then tags each chunk
against a dictionary of known clause categories using keyword matching.
This is the "NLP clause extraction" stage referenced in the project spec.
A production version would fine-tune a text classifier on labeled
clauses instead of keyword matching.
"""
import re
from typing import List, Dict

CLAUSE_KEYWORDS = {
    "Termination": ["terminate", "termination", "notice period", "end this agreement"],
    "Late Payment": ["late payment", "late fee", "overdue", "penalty for delay"],
    "Rent": ["monthly rent", "rent shall be", "rent of"],
    "Security Deposit": ["security deposit", "refundable deposit"],
    "Maintenance": ["maintenance", "repairs", "upkeep"],
    "Renewal": ["renew", "renewal", "extend this agreement"],
    "Penalty": ["penalty", "fine", "liquidated damages"],
    "Confidentiality": ["confidential", "non-disclosure", "proprietary information"],
    "Liability": ["liability", "indemnify", "indemnification"],
    "Subletting": ["sublet", "sub-lease", "assign this agreement"],
    "Dispute": ["dispute", "arbitration", "governing law"],
    "Jurisdiction": ["jurisdiction", "courts of"],
    "Lock-in Period": ["lock-in", "lock in period"],
    "Payment": ["payment shall", "paid by", "due on"],
}

SENT_SPLIT_RE = re.compile(r"(?<=[.!?])\s+(?=[A-Z0-9])")


def split_sentences(text: str) -> List[str]:
    text = text.strip()
    if not text:
        return []
    parts = SENT_SPLIT_RE.split(text)
    return [p.strip() for p in parts if len(p.strip()) > 15]


def detect_clauses(pages: List[Dict]) -> List[Dict]:
    clauses = []
    seen_categories = set()

    for p in pages:
        for sentence in split_sentences(p["text"]):
            lowered = sentence.lower()
            for category, keywords in CLAUSE_KEYWORDS.items():
                if any(kw in lowered for kw in keywords):
                    clauses.append({
                        "category": category,
                        "text": sentence,
                        "page": p["page"],
                    })
                    seen_categories.add(category)
                    break  # one category per sentence to avoid duplicate noise

    return clauses
