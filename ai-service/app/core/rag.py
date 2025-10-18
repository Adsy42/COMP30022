import os
from typing import List, Dict, Any
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain.schema import Document as LangchainDocument
from huggingface_hub import InferenceClient
from pinecone import Pinecone
import uuid
from ..config import settings

# Global storage for resource metadata
resources = {}


class RAGServicePinecone:
    def __init__(self, index_name: str = "legalai"):
        self.index_name = index_name

        # Initialize embeddings
        self.embeddings = HuggingFaceEmbeddings(
            model_name=settings.EMBEDDING_MODEL, model_kwargs={"device": "cpu"}
        )

        # Initialize Pinecone
        self._initialize_pinecone()

        # Initialize vector store
        self.vectorstore = PineconeVectorStore(
            index_name=index_name, embedding=self.embeddings
        )

        # Initialize LLM (Llama 3.2)
        self._initialize_llm()

    def _initialize_pinecone(self):
        """Initialize Pinecone client and create index if needed"""
        try:
            # Load environment variables from the project root
            from dotenv import load_dotenv
            import os

            project_root = os.path.dirname(
                os.path.dirname(
                    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
                )
            )
            env_path = os.path.join(project_root, ".env")
            load_dotenv(env_path)

            # Get Pinecone API key from environment
            api_key = os.getenv("PINECONE_API_KEY")
            if not api_key:
                raise ValueError("PINECONE_API_KEY environment variable is required")

            # Initialize Pinecone client
            self.pc = Pinecone(api_key=api_key)

            # Check if index exists
            if self.index_name not in [index.name for index in self.pc.list_indexes()]:
                print(
                    f"Index {self.index_name} not found. Please create it in the Pinecone console first."
                )
                print("Required settings: dimension=384, metric=cosine, type=dense")
                raise Exception(f"Index {self.index_name} not found")
            else:
                print(f"Using existing index: {self.index_name}")

        except Exception as e:
            print(f"Error initializing Pinecone: {e}")
            raise Exception(f"Could not initialize Pinecone: {e}")

    def _initialize_llm(self):
        """Initialize the Hugging Face InferenceClient directly"""
        try:
            # Get Hugging Face token from environment
            hf_token = os.getenv("HF_TOKEN") or os.getenv("HUGGINGFACE_API_TOKEN")
            if not hf_token:
                print(
                    "Warning: HF_TOKEN not found. Using public API (may have rate limits)"
                )
            else:
                print(f"Using Hugging Face token: {hf_token[:10]}...")

            # Use configured LLM model
            model_id = settings.LLM_MODEL

            print(f"Initializing Hugging Face Inference API with model: {model_id}")

            # Create InferenceClient directly as per Hugging Face template
            self.hf_client = InferenceClient(model=model_id, token=hf_token)

            # Store model_id for later use
            self.model_id = model_id

            return None

        except Exception as e:
            print(f"Error initializing Hugging Face API: {e}")
            # Fallback to a simpler model
            try:
                model_id = "gpt2"
                print(f"Trying fallback model: {model_id}")
                self.hf_client = InferenceClient(model=model_id, token=hf_token)
                self.model_id = model_id
                return None
            except Exception as e2:
                print(f"Error with fallback model: {e2}")
                raise Exception(f"Could not initialize any Hugging Face model: {e2}")

    def add_documents(self, documents: List[LangchainDocument], resource_id: str):
        """Add documents to the Pinecone vector store"""
        try:
            # Add metadata for resource tracking
            for doc in documents:
                doc.metadata["resource_id"] = resource_id
                # Generate unique ID for each document
                doc.metadata["id"] = str(uuid.uuid4())

            # Add to vector store
            self.vectorstore.add_documents(documents)

            print(
                f"Successfully added {len(documents)} documents to Pinecone for resource {resource_id}"
            )

        except Exception as e:
            raise Exception(f"Error adding documents: {str(e)}")

    def add_faq(self, faq_documents: List[LangchainDocument], resource_id: str):
        """Add FAQ documents to the Pinecone vector store"""
        try:
            # Add metadata for resource tracking and filter complex metadata
            for doc in faq_documents:
                # Ensure all metadata values are simple types (Pinecone requirement)
                clean_metadata = {
                    "resource_id": str(resource_id),
                    "type": "faq",
                    "question": str(doc.metadata.get("question", "")),
                    "answer": str(doc.metadata.get("answer", "")),
                    "row_id": str(doc.metadata.get("row_id", "")),
                    "id": str(uuid.uuid4()),
                }
                doc.metadata = clean_metadata

            # Add to vector store
            self.vectorstore.add_documents(faq_documents)

            print(
                f"Successfully added {len(faq_documents)} FAQ documents to Pinecone for resource {resource_id}"
            )

        except Exception as e:
            raise Exception(f"Error adding FAQ: {str(e)}")

    def query(
        self, question: str, max_results: int = 5, include_documents: bool = True
    ) -> Dict[str, Any]:
        """Query the knowledge base"""
        try:
            # Update retriever with max_results (default k=5)
            retriever = self.vectorstore.as_retriever(search_kwargs={"k": max_results})

            # Get relevant documents
            relevant_docs = retriever.invoke(question)

            if not relevant_docs:
                return {
                    "answer": "I couldn't find any relevant information to answer your question.",
                    "sources": [],
                    "confidence": 0.0,
                }

            # Create context from relevant documents
            context_parts = [doc.page_content for doc in relevant_docs]
            context = "\n\n".join(context_parts)

            # Create context for the LLM
            # Note: We'll use the context directly in the messages below

            # Use Hugging Face client directly as per their template
            # Format the prompt as a conversation message
            messages = [
                {
                    "role": "user",
                    "content": f"Context: {context}\n\nQuestion: {question}\n\nAnswer: Based on the provided context,",
                }
            ]

            try:
                completion = self.hf_client.chat.completions.create(
                    model=self.model_id,
                    messages=messages,
                    max_tokens=settings.MAX_TOKENS,
                    temperature=settings.TEMPERATURE,
                )
                answer = completion.choices[0].message.content.strip()
            except Exception as e:
                print(f"Chat completion failed: {e}")
                raise e

            print(f"LLM Response: {answer}")

            # Extract sources
            sources = []
            if include_documents:
                for doc in relevant_docs:
                    source = doc.metadata.get("source", "Unknown")
                    if source not in sources:
                        sources.append(source)

            # Calculate confidence (simple heuristic based on document relevance)
            confidence = min(len(relevant_docs) / max_results, 1.0)

            return {"answer": answer, "sources": sources, "confidence": confidence}

        except Exception as e:
            import traceback

            error_details = traceback.format_exc()
            print(f"Error processing query: {str(e)}")
            print(f"Full error details: {error_details}")
            raise Exception(
                f"Error processing query: {str(e)} - Details: {error_details}"
            )

    def delete_resource(self, resource_id: str):
        """Delete all documents for a specific resource from Pinecone"""
        try:
            # Get the index
            index = self.pc.Index(self.index_name)

            # Query for all vectors with the resource_id
            # Note: This is a simplified approach - in production you might want to store IDs differently
            query_response = index.query(
                vector=[0.0] * 384,  # Dummy vector for metadata filtering
                filter={"resource_id": {"$eq": resource_id}},
                top_k=10000,  # Large number to get all matches
                include_metadata=True,
            )

            # Extract IDs to delete
            ids_to_delete = [match.id for match in query_response.matches]

            if ids_to_delete:
                # Delete in batches of 100 (Pinecone limit)
                batch_size = 100
                for i in range(0, len(ids_to_delete), batch_size):
                    batch = ids_to_delete[i : i + batch_size]
                    index.delete(ids=batch)

                print(
                    f"Deleted {len(ids_to_delete)} documents for resource {resource_id}"
                )
            else:
                print(f"No documents found for resource {resource_id}")

        except Exception as e:
            raise Exception(f"Error deleting resource: {str(e)}")

    def get_document_count(self) -> int:
        """Get total number of documents in the Pinecone index"""
        try:
            index = self.pc.Index(self.index_name)
            stats = index.describe_index_stats()
            return stats.total_vector_count
        except Exception:
            return 0

    def get_index_stats(self) -> Dict[str, Any]:
        """Get detailed statistics about the Pinecone index"""
        try:
            index = self.pc.Index(self.index_name)
            stats = index.describe_index_stats()
            return {
                "total_vectors": stats.total_vector_count,
                "dimension": stats.dimension,
                "index_fullness": stats.index_fullness,
                "namespaces": stats.namespaces,
            }
        except Exception as e:
            return {"error": str(e)}
