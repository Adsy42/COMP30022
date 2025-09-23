import pandas as pd
from typing import List
from langchain.schema import Document as LangchainDocument


class FAQProcessor:
    def __init__(self):
        pass

    def process_faq(self, file_path: str) -> List[LangchainDocument]:
        """Process FAQ Excel or CSV file and return documents"""
        try:
            # Read file based on extension
            if file_path.lower().endswith(".csv"):
                df = pd.read_csv(file_path)
            else:
                df = pd.read_excel(file_path)

            # Validate required columns
            required_columns = ["question", "answer"]
            if not all(col in df.columns for col in required_columns):
                raise ValueError(f"File must contain columns: {required_columns}")

            documents = []
            for index, row in df.iterrows():
                question = str(row["question"]).strip()
                answer = str(row["answer"]).strip()

                if question and answer and question != "nan" and answer != "nan":
                    # Create a combined text for better search
                    combined_text = f"Question: {question}\nAnswer: {answer}"

                    doc = LangchainDocument(
                        page_content=combined_text,
                        metadata={
                            "type": "faq",
                            "question": str(question),
                            "answer": str(answer),
                            "row_id": str(
                                index
                            ),  # Convert to string to avoid tuple issues
                        },
                    )
                    documents.append(doc)

            return documents

        except Exception as e:
            raise Exception(f"Error processing FAQ file {file_path}: {str(e)}")

    def get_faq_questions(self, file_path: str) -> List[str]:
        """Get list of questions from FAQ file"""
        try:
            # Read file based on extension
            if file_path.lower().endswith(".csv"):
                df = pd.read_csv(file_path)
            else:
                df = pd.read_excel(file_path)
            questions = df["question"].dropna().tolist()
            return [str(q).strip() for q in questions if str(q).strip()]
        except Exception as e:
            raise Exception(f"Error reading FAQ questions: {str(e)}")
