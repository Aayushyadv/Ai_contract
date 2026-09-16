"""
Semantic search + Retrieval-Augmented "Generation".

Real RAG systems embed chunks with a neural embedding model (OpenAI /
sentence-transformers) and store vectors in a vector DB (FAISS,
Pinecone, Chroma...). To keep this project runnable with zero external
API keys, we use TF-IDF + cosine similarity as the retriever, which is
a legitimate classical "semantic search" baseline, and then generate an
extractive answer from the best-matching sentence. Swap
`build_index` / `search` for an embeddings-backed vector store later
without changing the API surface.
"""
from typing import List, Dict, Tuple

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.utils.clauses import split_sentences


def build_chunks(pages: List[Dict]) -> List[Dict]:
    """Flatten pages into sentence-level chunks with page provenance."""
    chunks = []
    for p in pages:
        for sentence in split_sentences(p["text"]):
            chunks.append({"text": sentence, "page": p["page"]})
    return chunks


class DocumentIndex:
    """In-memory TF-IDF index for a single document's sentence chunks."""

    def __init__(self, chunks: List[Dict]):
        self.chunks = chunks
        self.vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words="english")
        if chunks:
            self.matrix = self.vectorizer.fit_transform([c["text"] for c in chunks])
        else:
            self.matrix = None

    def search(self, query: str, top_k: int = 3) -> List[Tuple[Dict, float]]:
        if not self.chunks or self.matrix is None:
            return []
        query_vec = self.vectorizer.transform([query])
        sims = cosine_similarity(query_vec, self.matrix)[0]
        ranked = sorted(zip(self.chunks, sims), key=lambda x: x[1], reverse=True)
        return [r for r in ranked[:top_k] if r[1] > 0]


def answer_question(index: DocumentIndex, question: str) -> Dict:
    results = index.search(question, top_k=3)
    if not results:
        return {
            "answer": "I couldn't find anything in this document that answers that question.",
            "evidence": [],
        }

    top_chunk, top_score = results[0]

    # Extractive "answer": use the best sentence directly, cleaned up.
    answer_text = top_chunk["text"]

    evidence = [
        {
            "text": chunk["text"],
            "page": chunk["page"],
            "similarity": round(float(score) * 100),
        }
        for chunk, score in results
    ]

    return {
        "answer": answer_text,
        "evidence": evidence,
        "confidence": round(float(top_score) * 100),
    }
