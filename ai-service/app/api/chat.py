from fastapi import APIRouter, HTTPException
from typing import List

from ..models.schemas import QueryRequest, QueryResponse, ResourceInfo, IndexStats
from ..core.rag import RAGServicePinecone, resources
from ..core.document_processor import DocumentProcessor
from ..core.faq_processor import FAQProcessor

router = APIRouter(prefix="/api", tags=["chat"])


# Lazy initialization - only create services when needed
def get_rag_service():
    if not hasattr(get_rag_service, "_instance"):
        get_rag_service._instance = RAGServicePinecone()
    return get_rag_service._instance


def get_document_processor():
    if not hasattr(get_document_processor, "_instance"):
        get_document_processor._instance = DocumentProcessor()
    return get_document_processor._instance


def get_faq_processor():
    if not hasattr(get_faq_processor, "_instance"):
        get_faq_processor._instance = FAQProcessor()
    return get_faq_processor._instance


@router.post("/query", response_model=QueryResponse)
async def query_documents(request: QueryRequest):
    """Query the knowledge base"""
    try:
        rag_service = get_rag_service()
        result = rag_service.query(
            question=request.question,
            max_results=request.max_results,
            include_documents=request.include_documents,
        )

        return QueryResponse(
            answer=result["answer"],
            sources=result["sources"],
            confidence=result["confidence"],
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")


@router.get("/stats", response_model=IndexStats)
async def get_index_stats():
    """Get Pinecone index statistics"""
    try:
        rag_service = get_rag_service()
        stats = rag_service.get_index_stats()
        # Check if stats contains an error
        if "error" in stats:
            raise HTTPException(status_code=500, detail=stats["error"])
        return IndexStats(**stats)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting stats: {str(e)}")


@router.get("/resources", response_model=List[ResourceInfo])
async def list_resources():
    """List all uploaded resources"""
    return [ResourceInfo(**resource) for resource in resources.values()]


@router.delete("/resources/{resource_id}")
async def delete_resource(resource_id: str):
    """Delete a specific resource"""
    if resource_id not in resources:
        raise HTTPException(status_code=404, detail="Resource not found")

    try:
        # Remove from vector store
        rag_service = get_rag_service()
        rag_service.delete_resource(resource_id)

        # Remove from metadata
        del resources[resource_id]

        return {"message": "Resource deleted successfully"}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error deleting resource: {str(e)}"
        )
