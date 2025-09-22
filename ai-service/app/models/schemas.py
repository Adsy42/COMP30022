from pydantic import BaseModel
from typing import List, Optional


class QueryRequest(BaseModel):
    question: str
    include_documents: Optional[bool] = True
    max_results: Optional[int] = 5


class QueryResponse(BaseModel):
    answer: str
    sources: List[str]
    confidence: float


class ResourceInfo(BaseModel):
    id: str
    name: str
    type: str
    upload_date: str
    size: int


class IndexStats(BaseModel):
    total_vectors: int
    dimension: int
    index_fullness: float
    namespaces: dict


class DocumentChunk(BaseModel):
    content: str
    metadata: dict


class FAQItem(BaseModel):
    question: str
    answer: str
