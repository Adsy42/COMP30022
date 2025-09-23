from fastapi import APIRouter, HTTPException, File, UploadFile
import os
import uuid
from datetime import datetime

from ..core.document_processor import DocumentProcessor
from ..core.faq_processor import FAQProcessor
from ..core.rag import RAGServicePinecone, resources

router = APIRouter(prefix="/api", tags=["embeddings"])

# Initialize services
rag_service = RAGServicePinecone()
document_processor = DocumentProcessor()
faq_processor = FAQProcessor()


@router.post("/upload/document")
async def upload_document(file: UploadFile = File(...)):
    """Upload and process a document (PDF or Word)"""
    try:
        # Validate file type
        if not file.filename.lower().endswith((".pdf", ".docx", ".doc")):
            raise HTTPException(
                status_code=400, detail="Only PDF and Word documents are supported"
            )

        # Generate unique ID
        resource_id = str(uuid.uuid4())

        # Save file temporarily
        file_path = f"temp_{resource_id}_{file.filename}"
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        # Process document
        chunks = document_processor.process_document(file_path)

        # Add to vector store
        rag_service.add_documents(chunks, resource_id)

        # Store metadata
        resources[resource_id] = {
            "id": resource_id,
            "name": file.filename,
            "type": "document",
            "upload_date": datetime.now().isoformat(),
            "size": len(content),
        }

        # Clean up temp file
        os.remove(file_path)

        return {"message": "Document uploaded successfully", "resource_id": resource_id}

    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=500, detail=f"Error processing document: {str(e)}"
        )


@router.post("/upload/faq")
async def upload_faq(file: UploadFile = File(...)):
    """Upload and process FAQ Excel or CSV sheet"""
    try:
        # Validate file type
        if not file.filename.lower().endswith((".xlsx", ".xls", ".csv")):
            raise HTTPException(
                status_code=400,
                detail="Only Excel (.xlsx, .xls) and CSV files are supported",
            )

        # Generate unique ID
        resource_id = str(uuid.uuid4())

        # Save file temporarily
        file_path = f"temp_{resource_id}_{file.filename}"
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        # Process FAQ
        faq_data = faq_processor.process_faq(file_path)

        # Add to vector store
        rag_service.add_faq(faq_data, resource_id)

        # Store metadata
        resources[resource_id] = {
            "id": resource_id,
            "name": file.filename,
            "type": "faq",
            "upload_date": datetime.now().isoformat(),
            "size": len(content),
        }

        # Clean up temp file
        os.remove(file_path)

        return {"message": "FAQ uploaded successfully", "resource_id": resource_id}

    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Error processing FAQ: {str(e)}")
