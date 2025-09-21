#!/usr/bin/env python3
"""
AI Service Runner
Simple script to start the Legal AI RAG Service
"""

import uvicorn
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def check_environment():
    """Check if required environment variables are set."""
    required_vars = ["PINECONE_API_KEY", "HF_TOKEN"]
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print("❌ Missing required environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\nPlease check your .env file and ensure all required variables are set.")
        print("See env.example for reference.")
        return False
    
    return True

def main():
    """Main function to start the AI service."""
    print("🚀 Starting Legal AI RAG Service")
    print("=" * 40)
    
    # Check if we're in the right directory
    if not os.path.exists("app/main.py"):
        print("❌ Error: app/main.py not found.")
        print("Please run this script from the ai-service directory.")
        sys.exit(1)
    
    # Check environment variables
    if not check_environment():
        sys.exit(1)
    
    print("✅ Environment variables loaded")
    print("✅ Starting FastAPI server...")
    print("")
    print("🌐 Service will be available at:")
    print("   - Main: http://localhost:8000")
    print("   - API Docs: http://localhost:8000/docs")
    print("   - Health: http://localhost:8000/health")
    print("")
    print("Press Ctrl+C to stop the service")
    print("=" * 40)
    
    try:
        # Start the server
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n👋 Service stopped by user")
    except Exception as e:
        print(f"\n❌ Error starting service: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
