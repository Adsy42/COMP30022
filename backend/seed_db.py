"""
Database seeding script to initialize templates and admin user.
Run this script after starting the MongoDB container.
"""
from app import create_app
from app.models.user import User
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


def seed_database():
    """Seed the database with initial data."""
    app = create_app()

    with app.app_context():
        print("Seeding database...")

        # Check if admin user exists (by username or email)
        existing_admin = User.find_by_username(app.db, "admin")
        existing_email = User.find_by_email(app.db, "admin@unimelb.edu.au")

        if not existing_admin and not existing_email:
            print("Creating admin user...")
            admin = User(
                username="admin",
                email="admin@unimelb.edu.au",
                password_hash=User.hash_password("admin123"),
                role="admin",
                is_active=True,
            )
            admin.save(app.db)
            print("✓ Admin user created (username: admin, password: admin123)")
        elif existing_admin:
            print("✓ Admin user already exists (username: admin)")
            # Update fields to ensure consistency
            updated = False
            if existing_admin.email != "admin@unimelb.edu.au":
                existing_admin.email = "admin@unimelb.edu.au"
                updated = True
            # Update password hash to ensure it's in the correct format
            existing_admin.password_hash = User.hash_password("admin123")
            existing_admin.save(app.db)
            if updated:
                print("  → User details updated")
            print("  → Password reset to: admin123")
        elif existing_email:
            print("✓ User with email admin@unimelb.edu.au already exists")
            # Update username and password
            existing_email.username = "admin"
            existing_email.password_hash = User.hash_password("admin123")
            existing_email.save(app.db)
            print("  → Username set to: admin")
            print("  → Password reset to: admin123")

        # Seed templates
        print("\nSeeding templates...")

        Template.upsert_template(app.db, "common", COMMON_TEMPLATE)
        print("✓ Common template created/updated")

        Template.upsert_template(app.db, "simple", SIMPLE_TEMPLATE)
        print("✓ Simple template created/updated")

        Template.upsert_template(app.db, "complex", COMPLEX_TEMPLATE)
        print("✓ Complex template created/updated")

        # Set default escalation email
        print("\nConfiguring escalation email...")
        from app.models.config import AppConfig

        existing_email_config = AppConfig.get(app.db, "escalation_email")
        if not existing_email_config:
            AppConfig.set(
                app.db,
                "escalation_email",
                "ric-contracts@unimelb.edu.au",
                description="Email address for escalation notifications",
            )
            print("✓ Default escalation email set: ric-contracts@unimelb.edu.au")
        else:
            print(f"✓ Escalation email already configured: {existing_email_config}")

        print("\n" + "=" * 60)
        print("✅ Database seeding completed successfully!")
        print("=" * 60)
        print("\n📋 Default credentials:")
        print("   Username: admin")
        print("   Password: admin123")
        print("\n⚠️  IMPORTANT: Change the default password in production!")
        print("\n📊 Summary:")
        common_count = app.db["templates"].count_documents({"template_type": "common"})
        simple_count = app.db["templates"].count_documents({"template_type": "simple"})
        complex_count = app.db["templates"].count_documents({"template_type": "complex"})
        user_count = app.db["users"].count_documents({})
        print(f"   • Users: {user_count}")
        print(f"   • Templates: {common_count + simple_count + complex_count} (common: {common_count}, simple: {simple_count}, complex: {complex_count})")
        print(f"   • Collections: {len(app.db.list_collection_names())}")
        print("")


if __name__ == "__main__":
    seed_database()
