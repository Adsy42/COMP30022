from fastapi import APIRouter, HTTPException
from typing import List, Dict, Optional
from pydantic import BaseModel

from ..core.rag import RAGServicePinecone

router = APIRouter(prefix="/api", tags=["analyze"])


# Lazy initialization - only create services when needed
def get_rag_service():
    if not hasattr(get_rag_service, "_instance"):
        get_rag_service._instance = RAGServicePinecone()
    return get_rag_service._instance


class AnalyzeRequest(BaseModel):
    chat_id: str
    common_answers: List[Dict[str, str]]
    template_type: Optional[str] = None
    template_answers: List[Dict[str, str]]
    attachments: Optional[List[str]] = []


class AnalyzeResponse(BaseModel):
    status: str  # "simple" or "complex"
    response: Optional[str] = None


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_query(request: AnalyzeRequest):
    """
    Analyze chat data to determine if it's simple (can be answered by AI)
    or complex (needs lawyer escalation).

    Returns:
        - status: "simple" or "complex"
        - response: AI-generated response if status is "simple"
    """
    try:
        print(f"Received analyze request: {request.dict()}")

        # Build a comprehensive query from the chat data
        query_parts = []

        # Add common answers
        for answer in request.common_answers:
            q_id = answer.get("q_id", "")
            ans = answer.get("ans", "")
            if ans:
                query_parts.append(f"{q_id}: {ans}")

        # Add template-specific answers
        for answer in request.template_answers:
            q_id = answer.get("q_id", "")
            ans = answer.get("ans", "")
            if ans:
                query_parts.append(f"{q_id}: {ans}")

        # Combine into a single query
        full_query = " | ".join(query_parts)

        if not full_query.strip():
            return AnalyzeResponse(status="complex", response=None)

        # Query the RAG system
        rag_service = get_rag_service()
        result = rag_service.query(
            question=full_query, max_results=5, include_documents=True
        )

        # Determine if the answer is confident enough
        confidence_threshold = 0.7

        if result["confidence"] >= confidence_threshold:
            # High confidence - can provide a simple response
            return AnalyzeResponse(status="simple", response=result["answer"])
        else:
            # Low confidence - escalate to complex/lawyer
            return AnalyzeResponse(status="complex", response=None)

    except Exception:
        # On error, default to complex status to ensure user gets help
        return AnalyzeResponse(status="complex", response=None)


@router.post("/embeddings")
async def get_embeddings(request: Dict[str, str]):
    """
    Get embeddings for a given text.

    Args:
        request: {"text": "text to embed"}

    Returns:
        {"embeddings": [list of floats]}
    """
    try:
        text = request.get("text", "")

        if not text:
            raise HTTPException(status_code=400, detail="Text is required")

        rag_service = get_rag_service()
        embeddings = rag_service.get_embeddings(text)

        return {"embeddings": embeddings}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error generating embeddings: {str(e)}"
        )
