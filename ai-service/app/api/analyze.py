from __future__ import annotations

import os
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Optional
from pydantic import BaseModel

from ..core.rag import RAGServicePinecone


def _get_answer(answers: List[Dict[str, str]], q_id: str) -> Optional[str]:
    for answer in answers:
        if answer.get("q_id") == q_id:
            return answer.get("ans")
    return None


def _build_fallback_response(request: AnalyzeRequest) -> str:
    name = _get_answer(request.common_answers, "q_name")
    role = _get_answer(request.common_answers, "q_role")
    project = _get_answer(request.template_answers, "q_project_name")
    grant_type = _get_answer(request.template_answers, "q_grant_type")
    description = _get_answer(request.template_answers, "q_brief_description")

    lines = [
        "Thanks for sharing those details." + (f" Hi {name}." if name else ""),
    ]

    if role:
        lines.append(f"• Role noted: {role}.")
    if project:
        lines.append(f"• Project: {project}.")
    if grant_type:
        lines.append(f"• Grant type: {grant_type}.")
    if description:
        lines.append(f"• Summary of your query: {description}.")

    lines.append(
        "This looks like a contract question our Contracts team handles regularly. Please review your agreement for any sponsor obligations and reach out if you'd like personalised support. If you need a human to step in, choose the escalate option and we'll connect you."  # noqa: E501
    )

    return "\n".join(lines)


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
    fallback = _build_fallback_response(request)

    pinecone_key = os.getenv("PINECONE_API_KEY")
    hf_token = os.getenv("HF_TOKEN") or os.getenv("HUGGINGFACE_API_TOKEN")
    if not pinecone_key or not hf_token:
        print(
            "AI analyze fallback: missing credentials",
            {"PINECONE_API_KEY": bool(pinecone_key), "HF_TOKEN": bool(hf_token)},
        )
        return AnalyzeResponse(status="simple", response=fallback)

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

    except Exception as exc:
        print(f"AI analyze error, falling back to canned response: {exc}")
        return AnalyzeResponse(status="simple", response=fallback)


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
