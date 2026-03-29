"""
Optional ChromaDB + sentence-transformers pipeline (install requirements-rag.txt).
"""
from __future__ import annotations

import logging
from pathlib import Path

logger = logging.getLogger(__name__)

_ROOT = Path(__file__).resolve().parent.parent
_CHROMA_DIR = _ROOT / "data" / "chroma_store"


def rag_available() -> bool:
    try:
        import chromadb  # noqa: F401
        from sentence_transformers import SentenceTransformer  # noqa: F401

        return True
    except Exception:
        return False


def get_collection(name: str = "fintech_ai_docs"):
    """Return chromadb Collection or None if deps missing."""
    if not rag_available():
        logger.info("RAG deps not installed; skipping vector store.")
        return None
    import chromadb
    from chromadb.config import Settings

    client = chromadb.PersistentClient(path=str(_CHROMA_DIR), settings=Settings(anonymized_telemetry=False))
    return client.get_or_create_collection(name=name, metadata={"hnsw:space": "cosine"})


def embed_texts(texts: list[str]) -> list[list[float]] | None:
    if not rag_available():
        return None
    from sentence_transformers import SentenceTransformer

    model = SentenceTransformer("all-MiniLM-L6-v2")
    return model.encode(texts, normalize_embeddings=True).tolist()
