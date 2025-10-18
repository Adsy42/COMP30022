"""Seed form questions."""
from app.models.form_question import FormQuestion
from .data_form_questions import FORM_QUESTIONS


def seed_form_questions(db):
    """Create form questions from mock data."""
    print("\n[Form Questions] Seeding form questions...")

    try:
        FormQuestion.bulk_insert(db, FORM_QUESTIONS)
        count = db.form_questions.count_documents({})
        print(f"  ✓ Successfully seeded {count} form questions")
        return count
    except Exception as e:
        print(f"  ✗ Error seeding form questions: {str(e)}")
        return 0
