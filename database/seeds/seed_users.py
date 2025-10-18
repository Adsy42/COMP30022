"""Seed admin users."""
from app.models.user import User


def seed_users(db):
    """Create default admin user."""
    print("\n[Users] Seeding admin user...")

    # Check if admin user exists (by username or email)
    existing_admin = User.find_by_username(db, "admin")
    existing_email = User.find_by_email(db, "admin@unimelb.edu.au")

    if not existing_admin and not existing_email:
        admin = User(
            username="admin",
            email="admin@unimelb.edu.au",
            password_hash=User.hash_password("admin123"),
            role="admin",
            is_active=True,
        )
        admin.save(db)
        print("  ✓ Admin user created (username: admin, password: admin123)")
    elif existing_admin:
        print("  ✓ Admin user already exists (username: admin)")
        # Update fields to ensure consistency
        updated = False
        if existing_admin.email != "admin@unimelb.edu.au":
            existing_admin.email = "admin@unimelb.edu.au"
            updated = True
        # Update password hash to ensure it's in the correct format
        existing_admin.password_hash = User.hash_password("admin123")
        existing_admin.save(db)
        if updated:
            print("    → User details updated")
        print("    → Password reset to: admin123")
    elif existing_email:
        print("  ✓ User with email admin@unimelb.edu.au already exists")
        # Update username and password
        existing_email.username = "admin"
        existing_email.password_hash = User.hash_password("admin123")
        existing_email.save(db)
        print("    → Username set to: admin")
        print("    → Password reset to: admin123")

    return db["users"].count_documents({})
