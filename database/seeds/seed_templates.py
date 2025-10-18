"""Seed form templates."""
from app.models.template import Template


# Sample template data based on api-spec examples
COMMON_TEMPLATE = [
    {
        "id": "q_name",
        "question": "What is your name?",
        "type": "freeform",
        "options": None,
    },
    {
        "id": "q_role",
        "question": "What is your role?",
        "type": "single",
        "options": [
            {"label": "Researcher", "followUp": None},
            {
                "label": "Sponsor",
                "followUp": {
                    "id": "q_kind_of_sponsor",
                    "question": "What kind of sponsor?",
                    "type": "single",
                    "options": [
                        {"label": "Industry", "followUp": None},
                        {"label": "Government", "followUp": None},
                        {"label": "Non-profit", "followUp": None},
                    ],
                },
            },
            {"label": "Administrator", "followUp": None},
        ],
    },
]

SIMPLE_TEMPLATE = [
    {
        "id": "q_project_name",
        "question": "What is the project name?",
        "type": "freeform",
        "options": None,
    },
    {
        "id": "q_grant_type",
        "question": "What type of grant is this?",
        "type": "single",
        "options": [
            {"label": "Collaboration Agreement", "followUp": None},
            {"label": "Funding Agreement", "followUp": None},
            {"label": "Service Contract", "followUp": None},
        ],
    },
    {
        "id": "q_brief_description",
        "question": "Please provide a brief description of your query:",
        "type": "freeform",
        "options": None,
    },
]

COMPLEX_TEMPLATE = [
    {
        "id": "q_detailed_description",
        "question": "Please provide detailed project information:",
        "type": "freeform",
        "options": None,
    },
    {
        "id": "q_topics",
        "question": "Which topics does your query involve?",
        "type": "multi",
        "options": [
            {"label": "Indemnity", "followUp": None},
            {"label": "Intellectual Property", "followUp": None},
            {"label": "Confidentiality", "followUp": None},
            {"label": "Payment Terms", "followUp": None},
            {"label": "Liability", "followUp": None},
        ],
    },
    {
        "id": "q_urgency",
        "question": "How urgent is this matter?",
        "type": "single",
        "options": [
            {"label": "Low", "followUp": None},
            {"label": "Medium", "followUp": None},
            {"label": "High", "followUp": None},
            {"label": "Critical", "followUp": None},
        ],
    },
    {
        "id": "q_other_details",
        "question": "Any other relevant details?",
        "type": "freeform",
        "options": None,
    },
]


def seed_templates(db):
    """Create default form templates."""
    print("\n[Templates] Seeding form templates...")

    Template.upsert_template(db, "common", COMMON_TEMPLATE)
    print("  ✓ Common template created/updated")

    Template.upsert_template(db, "simple", SIMPLE_TEMPLATE)
    print("  ✓ Simple template created/updated")

    Template.upsert_template(db, "complex", COMPLEX_TEMPLATE)
    print("  ✓ Complex template created/updated")

    common_count = db["templates"].count_documents({"template_type": "common"})
    simple_count = db["templates"].count_documents({"template_type": "simple"})
    complex_count = db["templates"].count_documents({"template_type": "complex"})

    return common_count + simple_count + complex_count
