import json
import numpy as np
from pathlib import Path
from functools import lru_cache
from sklearn.preprocessing import normalize
import uuid
# pyrefly: ignore [missing-import]
from loguru import logger
from sentence_transformers import SentenceTransformer

from app.config import settings

EMBEDDING_DIM = 384
VECTOR_STORE_FILE = Path(settings.CHROMA_PERSIST_DIR).parent / "vector_store.json"
SOURCES_DIR = Path(settings.CHROMA_PERSIST_DIR).parent / "sources"

class TransformerEmbeddingFunction:
    def __init__(self, model_name: str = settings.EMBEDDING_MODEL):
        self.model = SentenceTransformer(model_name)

    def __call__(self, input_texts: list[str]) -> list[list[float]]:
        embeddings = self.model.encode(input_texts, convert_to_numpy=True)
        embeddings = normalize(embeddings, norm="l2", axis=1)
        return embeddings.tolist()

    def embed_query(self, query: str) -> list[float]:
        return self([query])[0]

@lru_cache(maxsize=1)
def get_embedding_model() -> TransformerEmbeddingFunction:
    return TransformerEmbeddingFunction()

class SimpleVectorStore:
    def __init__(self, persist_path: Path):
        self.persist_path = persist_path
        self.documents = []
        self.metadatas = []
        self.embeddings = []
        self.load()

    def load(self):
        if self.persist_path.exists():
            try:
                with open(self.persist_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.documents = data.get("documents", [])
                    self.metadatas = data.get("metadatas", [])
                    self.embeddings = data.get("embeddings", [])
                logger.info(f"Loaded vector store with {len(self.documents)} documents.")
            except Exception as e:
                logger.error(f"Failed to load vector store: {e}")

    def save(self):
        self.persist_path.parent.mkdir(parents=True, exist_ok=True)
        try:
            with open(self.persist_path, "w", encoding="utf-8") as f:
                json.dump({
                    "documents": self.documents,
                    "metadatas": self.metadatas,
                    "embeddings": self.embeddings
                }, f, indent=2)
            logger.info("Saved vector store data.")
        except Exception as e:
            logger.error(f"Failed to save vector store: {e}")

    def add(self, documents: list[str], metadatas: list[dict], embeddings: list[list[float]]):
        self.documents.extend(documents)
        self.metadatas.extend(metadatas)
        self.embeddings.extend(embeddings)
        self.save()

    def query(self, query_embedding: list[float], n_results: int = 4) -> list[dict]:
        if not self.embeddings:
            logger.warning("Vector store is empty.")
            return []
        
        q = np.array(query_embedding)
        db = np.array(self.embeddings)
        
        # Calculate dot product (cosine similarity, since embeddings are L2 normalized)
        scores = np.dot(db, q)
        
        # Get top-k indices
        top_k = min(n_results, len(scores))
        top_k_idx = np.argsort(scores)[::-1][:top_k]
        
        results = []
        for idx in top_k_idx:
            results.append({
                "text": self.documents[idx],
                "metadata": self.metadatas[idx],
                "score": float(scores[idx])
            })
        return results

@lru_cache(maxsize=1)
def get_vector_store() -> SimpleVectorStore:
    return SimpleVectorStore(VECTOR_STORE_FILE)

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        end = start + chunk_size
        chunks.append(" ".join(words[start:end]))
        start += chunk_size - overlap
    return chunks

def ingest_directory(sources_dir: Path | None = None):
    sources_dir = sources_dir or SOURCES_DIR
    vector_store = get_vector_store()
    embedding_model = get_embedding_model()

    files = list(sources_dir.glob("*.md")) + list(sources_dir.glob("*.txt"))
    if not files:
        logger.warning(f"No source documents found in {sources_dir}")
        return

    # Clear previous documents for fresh seeding
    vector_store.documents = []
    vector_store.metadatas = []
    vector_store.embeddings = []

    total_chunks = 0
    for file in files:
        text = file.read_text(encoding="utf-8")
        chunks = chunk_text(text)
        if not chunks:
            continue

        embeddings = embedding_model(chunks)
        metadatas = [{"source": file.name, "chunk_index": i} for i in range(len(chunks))]

        vector_store.add(chunks, metadatas, embeddings)
        total_chunks += len(chunks)
        logger.info(f"Ingested {len(chunks)} chunks from {file.name}")

    logger.info(f"Done. Total chunks ingested: {total_chunks}")

def retrieve_relevant_context(query: str, top_k: int | None = None) -> list[dict]:
    try:
        top_k = top_k or settings.RAG_TOP_K
        vector_store = get_vector_store()
        embedding_model = get_embedding_model()

        query_emb = embedding_model.embed_query(query)
        results = vector_store.query(query_emb, n_results=top_k)

        return [
            {"text": res["text"], "source": res["metadata"].get("source", "unknown"), "score": res["score"]}
            for res in results
        ]
    except Exception as e:
        logger.error(f"Retrieval failed: {e}")
        return []
