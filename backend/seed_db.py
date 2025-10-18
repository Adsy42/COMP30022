#!/usr/bin/env python
"""
Main database seeding script.
Run this script to initialize the database with all required data.

Usage:
    python seed_db.py              # Seed everything
    python seed_db.py --users      # Seed only users
    python seed_db.py --templates  # Seed only templates
    python seed_db.py --config     # Seed only config
    python seed_db.py --questions  # Seed only form questions
    python seed_db.py --analytics  # Seed only analytics
    python seed_db.py --essential  # Seed only essential data (users, templates, config)
    python seed_db.py --mock       # Seed only mock data (questions, analytics)
"""
import sys
import argparse
from app import create_app
from seeds import (
    seed_users,
    seed_templates,
    seed_config,
    seed_form_questions,
    seed_analytics,
)


def print_header(title):
    """Print a formatted header."""
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60)


def print_summary(stats):
    """Print a summary of seeded data."""
    print("\n" + "=" * 60)
    print("   SEEDING SUMMARY")
    print("=" * 60)
    if stats.get("users") is not None:
        print(f"   Users: {stats['users']}")
    if stats.get("templates") is not None:
        print(f"   Templates: {stats['templates']}")
    if stats.get("config") is not None:
        print(f"   Config entries: {stats['config']}")
    if stats.get("form_questions") is not None:
        print(f"   Form questions: {stats['form_questions']}")
    if stats.get("analytics") is not None:
        print(f"   Analytics records: {stats['analytics']}")
    print("=" * 60)


def seed_all(db, args):
    """Seed all data or specific categories."""
    stats = {}

    # Determine what to seed
    seed_everything = not any(
        [
            args.users,
            args.templates,
            args.config,
            args.questions,
            args.analytics,
            args.essential,
            args.mock,
        ]
    )

    # Essential data (required for app to function)
    if seed_everything or args.essential or args.users:
        stats["users"] = seed_users(db)

    if seed_everything or args.essential or args.templates:
        stats["templates"] = seed_templates(db)

    if seed_everything or args.essential or args.config:
        stats["config"] = seed_config(db)

    # Mock data (for development/testing)
    if seed_everything or args.mock or args.questions:
        stats["form_questions"] = seed_form_questions(db)

    if seed_everything or args.mock or args.analytics:
        stats["analytics"] = seed_analytics(db)

    return stats


def main():
    """Main entry point for seeding script."""
    parser = argparse.ArgumentParser(
        description="Seed the database with initial data.",
        epilog="If no options are specified, all data will be seeded.",
    )
    parser.add_argument("--users", action="store_true", help="Seed users only")
    parser.add_argument("--templates", action="store_true", help="Seed templates only")
    parser.add_argument("--config", action="store_true", help="Seed config only")
    parser.add_argument(
        "--questions", action="store_true", help="Seed form questions only"
    )
    parser.add_argument("--analytics", action="store_true", help="Seed analytics only")
    parser.add_argument(
        "--essential",
        action="store_true",
        help="Seed essential data only (users, templates, config)",
    )
    parser.add_argument(
        "--mock", action="store_true", help="Seed mock data only (questions, analytics)"
    )

    args = parser.parse_args()

    print_header("DATABASE SEEDING")
    print("\n Initializing database with seed data...")

    app = create_app()

    with app.app_context():
        try:
            stats = seed_all(app.db, args)
            print_summary(stats)
            print("\n Database seeding completed successfully!\n")

            # Print default credentials if users were seeded
            if stats.get("users") is not None:
                print(" Default Admin Credentials:")
                print("   Username: admin")
                print("   Password: admin123")
                print("\n  IMPORTANT: Change the default password in production!")
                print("")

            return 0
        except Exception as e:
            print(f"\n Error during seeding: {str(e)}")
            import traceback

            traceback.print_exc()
            return 1


if __name__ == "__main__":
    sys.exit(main())
