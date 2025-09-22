from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Legal AI RAG Service",
    description="AI microservice with RAG capabilities for legal contract information using Pinecone",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
from .api import chat, embeddings

app.include_router(chat.router)
app.include_router(embeddings.router)

@app.get("/")
async def root():
    return {"message": "Legal AI RAG Service is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}