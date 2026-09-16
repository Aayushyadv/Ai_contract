"""
Lightweight rule-based Named Entity Recognition.

This mirrors what a spaCy/transformer NER pipeline would surface for a
contract (parties, money, dates, notice periods) without requiring a
large model download. Swap `extract_entities` for a spaCy/HF pipeline
later without touching the API contract.
"""
import re
from typing import List, Dict

MONEY_RE = re.compile(r"(?:₹|Rs\.?|INR|\$|USD)\s?[\d][\d,]*(?:\.\d+)?")
DATE_RE = re.compile(
    r"\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}(?:st|nd|rd|th)?\s+"
    r"(?:January|February|March|April|May|June|July|August|September|"
    r"October|November|December)\s+\d{4})\b",
    re.IGNORECASE,
)
NOTICE_RE = re.compile(r"(\d+)\s*[- ]?\s*(day|days|month|months)\s+(?:written\s+)?notice", re.IGNORECASE)

PARTY_LABEL_RE = re.compile(
    r"\b(Landlord|Tenant|Lessor|Lessee|Employer|Employee|Disclosing Party|"
    r"Receiving Party|Client|Contractor|Vendor|Service Provider)\b\s*[:\-]?\s*"
    r"([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,3})",
)

RENT_RE = re.compile(r"(monthly rent|rent)\D{0,15}(₹|Rs\.?|INR|\$)\s?[\d][\d,]*", re.IGNORECASE)
DEPOSIT_RE = re.compile(r"(security deposit|deposit)\D{0,15}(₹|Rs\.?|INR|\$)\s?[\d][\d,]*", re.IGNORECASE)


def extract_entities(pages: List[Dict]) -> Dict:
    parties = {}
    money_mentions = []
    dates = []
    notice_periods = []
    rent = None
    deposit = None

    for p in pages:
        text = p["text"]
        page_no = p["page"]

        for m in PARTY_LABEL_RE.finditer(text):
            role, name = m.group(1), m.group(2).strip()
            parties.setdefault(role, {"name": name, "page": page_no})

        for m in MONEY_RE.finditer(text):
            money_mentions.append({"value": m.group(0), "page": page_no})

        for m in DATE_RE.finditer(text):
            dates.append({"value": m.group(0), "page": page_no})

        for m in NOTICE_RE.finditer(text):
            notice_periods.append({"value": f"{m.group(1)} {m.group(2)}", "page": page_no})

        if rent is None:
            m = RENT_RE.search(text)
            if m:
                rent = {"value": m.group(0), "page": page_no}

        if deposit is None:
            m = DEPOSIT_RE.search(text)
            if m:
                deposit = {"value": m.group(0), "page": page_no}

    return {
        "parties": parties,
        "money_mentions": money_mentions[:10],
        "dates": dates[:10],
        "notice_periods": notice_periods[:5],
        "rent": rent,
        "deposit": deposit,
    }
