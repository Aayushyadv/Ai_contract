"""
Machine Learning risk classification.

A genuinely trained scikit-learn pipeline (TF-IDF + Logistic Regression)
scores each detected clause for "risk" (i.e. how likely this kind of
clause is to be one-sided / costly / restrictive for the uploaded
party), based on a small hand-labeled seed dataset of contract
sentences. This is intentionally small and transparent so it's easy to
extend with real labeled data later -- retrain by adding rows to
SEED_DATA and re-running `train_model()`.

IMPORTANT: this predicts a *risk signal*, not a legal judgement.
"""
from typing import List, Dict
import re

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_score, recall_score, f1_score

# label: 1 = high risk / one-sided, 0 = low risk / standard boilerplate
SEED_DATA = [
    ("Either party may terminate this agreement immediately without notice or cause.", 1),
    ("The tenant shall forfeit the entire security deposit for any early termination.", 1),
    ("A penalty of 5% per day shall apply for any delay in payment.", 1),
    ("The company may modify these terms at any time without prior notice to the employee.", 1),
    ("The employee shall not be entitled to any severance pay under any circumstance.", 1),
    ("The tenant is solely liable for all damages regardless of cause.", 1),
    ("Failure to pay rent within 3 days will result in immediate eviction.", 1),
    ("The receiving party shall be liable for unlimited damages for any breach.", 1),
    ("Subletting is strictly prohibited and will result in immediate termination.", 1),
    ("Any dispute shall be resolved exclusively in the courts chosen by the landlord.", 1),
    ("Either party must provide 60 days written notice before termination.", 0),
    ("The monthly rent shall be paid on or before the 5th of every month.", 0),
    ("The security deposit shall be refunded within 30 days of vacating the premises.", 0),
    ("The tenant shall be responsible for routine maintenance of the premises.", 0),
    ("This agreement may be renewed for a further term upon mutual written consent.", 0),
    ("Both parties agree to keep the terms of this agreement confidential.", 0),
    ("The employer shall provide 15 days of paid annual leave.", 0),
    ("Rent shall be increased annually by a mutually agreed percentage.", 0),
    ("Notice of termination must be given in writing at least one month in advance.", 0),
    ("Disputes shall first be attempted to be resolved through mediation.", 0),
    ("The landlord shall carry out major structural repairs at their own cost.", 0),
    ("Late payment beyond 60 days may attract a reasonable interest as mutually agreed.", 0),
]

_model = None


def train_model():
    texts = [t for t, _ in SEED_DATA]
    labels = [l for _, l in SEED_DATA]

    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1, 2), min_df=1)),
        ("clf", LogisticRegression(max_iter=1000)),
    ])
    pipeline.fit(texts, labels)
    return pipeline


def get_model():
    global _model
    if _model is None:
        _model = train_model()
    return _model


def evaluate_model() -> Dict:
    """Simple holdout evaluation so the UI/README can report precision/recall/F1."""
    texts = [t for t, _ in SEED_DATA]
    labels = [l for _, l in SEED_DATA]
    X_train, X_test, y_train, y_test = train_test_split(
        texts, labels, test_size=0.3, random_state=42, stratify=labels
    )
    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1, 2), min_df=1)),
        ("clf", LogisticRegression(max_iter=1000)),
    ])
    pipeline.fit(X_train, y_train)
    preds = pipeline.predict(X_test)
    return {
        "precision": round(precision_score(y_test, preds, zero_division=0), 2),
        "recall": round(recall_score(y_test, preds, zero_division=0), 2),
        "f1_score": round(f1_score(y_test, preds, zero_division=0), 2),
        "test_size": len(y_test),
    }


def risk_label(score: float) -> str:
    if score >= 0.66:
        return "HIGH"
    elif score >= 0.33:
        return "MEDIUM"
    return "LOW"


def score_clauses(clauses: List[Dict]) -> List[Dict]:
    if not clauses:
        return []
    model = get_model()
    texts = [c["text"] for c in clauses]
    probs = model.predict_proba(texts)[:, 1]  # probability of class 1 (high risk)

    scored = []
    for clause, prob in zip(clauses, probs):
        scored.append({
            **clause,
            "risk_score": round(float(prob), 2),
            "risk_label": risk_label(prob),
        })
    return scored


def overall_risk_summary(scored_clauses: List[Dict]) -> Dict:
    if not scored_clauses:
        return {"overall_score": 0, "level": "LOW", "high": 0, "medium": 0, "low": 0}

    avg = sum(c["risk_score"] for c in scored_clauses) / len(scored_clauses)
    high = sum(1 for c in scored_clauses if c["risk_label"] == "HIGH")
    medium = sum(1 for c in scored_clauses if c["risk_label"] == "MEDIUM")
    low = sum(1 for c in scored_clauses if c["risk_label"] == "LOW")

    return {
        "overall_score": round(avg * 100),
        "level": risk_label(avg),
        "high": high,
        "medium": medium,
        "low": low,
    }
