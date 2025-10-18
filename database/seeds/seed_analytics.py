"""Seed analytics data."""
from app.models.analytics import Analytics
from .data_analytics import MOCK_ANALYTICS


def seed_analytics(db):
    """Create analytics data from mock data."""
    print("\n[Analytics] Seeding analytics data...")

    try:
        Analytics.initialize(db, MOCK_ANALYTICS)
        count = db.analytics.count_documents({})
        print(f"  ✓ Successfully seeded analytics data")
        return count
    except Exception as e:
        print(f"  ✗ Error seeding analytics: {str(e)}")
        return 0
