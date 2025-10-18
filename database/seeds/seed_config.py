"""Seed application configuration."""
from app.models.config import AppConfig


def seed_config(db):
    """Create default application configuration."""
    print("\n[Config] Seeding application configuration...")

    existing_email_config = AppConfig.get(db, "escalation_email")
    if not existing_email_config:
        AppConfig.set(
            db,
            "escalation_email",
            "ric-contracts@unimelb.edu.au",
            description="Email address for escalation notifications",
        )
        print("  ✓ Default escalation email set: ric-contracts@unimelb.edu.au")
    else:
        print(f"  ✓ Escalation email already configured: {existing_email_config}")

    return db["app_config"].count_documents({})
