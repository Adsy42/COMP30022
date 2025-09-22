from fastapi import APIRouter, HTTPException, File, UploadFile
from typing import List
import os
import uuid
from datetime import datetime

from ..models.schemas import QueryRequest, QueryResponse, ResourceInfo, IndexStats
from ..core.rag import RAGServicePinecone
from ..core.document_processor import DocumentProcessor
from ..core.faq_processor import FAQProcessor

router = APIRouter(prefix="/api", tags=["chat"])

# Initialize services
rag_service = RAGServicePinecone()
document_processor = DocumentProcessor()
faq_processor = FAQProcessor()

# Import shared resources storage
from ..core.rag import resources


@router.post("/query", response_model=QueryResponse)
async def query_documents(request: QueryRequest):
    """Query the knowledge base"""
    try:
        result = rag_service.query(
            question=request.question,
            max_results=request.max_results,
            include_documents=request.include_documents
        )
        
        return QueryResponse(
            answer=result["answer"],
            sources=result["sources"],
            confidence=result["confidence"]
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")


@router.get("/stats", response_model=IndexStats)
async def get_index_stats():
    """Get Pinecone index statistics"""
    try:
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
        rag_service.delete_resource(resource_id)
        
        # Remove from metadata
        del resources[resource_id]
        
        return {"message": "Resource deleted successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting resource: {str(e)}")
