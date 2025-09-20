from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="AI Service",
    description="Customizable AI microservice - add your functionality here",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# TODO: Add your API routes here
# Example:
# from .api import your_routes
# app.include_router(your_routes.router, prefix="/api", tags=["your_tag"])


@app.get("/")
async def root():
    return {"message": "AI Service is running - customize this service as needed"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# Example endpoint - customize or remove as needed
@app.get("/example")
async def example_endpoint():
    return {
        "message": "This is an example endpoint - replace with your AI functionality"
    }
