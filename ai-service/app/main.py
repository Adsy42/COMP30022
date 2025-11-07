import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .api import chat, embeddings, analyze

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Legal AI RAG Service",
    description="AI microservice with RAG capabilities for legal contract information using Pinecone",
    version="1.0.0",
)

# CORS middleware
raw_origins = os.getenv("CORS_ALLOW_ORIGINS")
if raw_origins:
    allow_origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]
else:
    default_origins = {
        os.getenv("FRONTEND_PUBLIC_URL", "http://localhost:3000"),
        os.getenv("BACKEND_PUBLIC_URL", "http://localhost:5000"),
    }
    allow_origins = [origin for origin in default_origins if origin]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(embeddings.router)
app.include_router(analyze.router)


@app.get("/")
async def root():
    return {"message": "Legal AI RAG Service is running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
