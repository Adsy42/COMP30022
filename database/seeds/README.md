# Database Seeds

This folder contains organized database seeding scripts for the Legal AI Query & Referral System.

## 📁 Structure

```
seeds/
├── __init__.py                  # Package initialization
├── seed_users.py                # User seeding logic
├── seed_templates.py            # Template seeding logic
├── seed_config.py               # Configuration seeding logic
├── seed_form_questions.py       # Form questions seeding logic
├── seed_analytics.py            # Analytics seeding logic
├── data_form_questions.py       # Form questions data
└── data_analytics.py            # Analytics data
```

## 🎯 Organization Principle

Seeds are organized by **data type/model**:

- **Logic files** (`seed_*.py`): Contain seeding functions that interact with models
- **Data files** (`data_*.py`): Contain large data structures (separated for clarity)

## 🚀 Usage

### Seed Everything

```bash
python seed_db.py
```

### Seed Specific Categories

```bash
# Essential data only (users, templates, config)
python seed_db.py --essential

# Mock data only (form questions, analytics)
python seed_db.py --mock

# Individual categories
python seed_db.py --users
python seed_db.py --templates
python seed_db.py --config
python seed_db.py --questions
python seed_db.py --analytics
```

## 📝 Adding New Seeds

### 1. Create a seed function

Create `seeds/seed_<name>.py`:

```python
"""Seed <entity name>."""
from app.models.<model> import <Model>

def seed_<entity>(db):
    """Create <entity> data."""
    print("\n[<Entity>] Seeding <entity>...")
    
    # Your seeding logic here
    
    count = db.<collection>.count_documents({})
    print(f"  ✓ Successfully seeded {count} <entity>")
    return count
```

### 2. Add large data structures to data files

If your seed data is large (>50 lines), create `seeds/data_<name>.py`:

```python
"""<Entity> data."""

DATA = [
    # Your data here
]
```

### 3. Update package exports

Add to `seeds/__init__.py`:

```python
from .seed_<name> import seed_<entity>

__all__ = [
    # ... existing exports
    'seed_<entity>',
]
```

### 4. Update main seed script

Add to `seed_db.py`:

```python
from seeds import (
    # ... existing imports
    seed_<entity>,
)

# Add argument
parser.add_argument('--<entity>', action='store_true', help='Seed <entity> only')

# Add to seed_all function
if seed_everything or args.<entity>:
    stats['<entity>'] = seed_<entity>(db)
```

## 📊 Current Seeds

### Essential Data (Required)

- **Users**: Admin users for authentication
- **Templates**: Form templates (common, simple, complex)
- **Config**: Application configuration (escalation email, etc.)

### Mock Data (Development)

- **Form Questions**: Frontend form questions with nested structure
- **Analytics**: KPI metrics and question analytics

## 🔄 Idempotency

All seed functions are designed to be **idempotent**:

- Running multiple times won't create duplicates
- Existing data will be updated if needed
- Safe to run in development and production

## 🛡️ Best Practices

1. **Keep functions focused**: One seed function per model/entity
2. **Separate data from logic**: Use `data_*.py` files for large datasets
3. **Make it idempotent**: Check if data exists before creating
4. **Return counts**: Always return the number of records created/updated
5. **Print clear messages**: Use consistent formatting for output
6. **Handle errors gracefully**: Wrap in try-except and print errors

## Example Output

```
============================================================
  DATABASE SEEDING
============================================================

🌱 Initializing database with seed data...

[Users] Seeding admin user...
  ✓ Admin user created (username: admin, password: admin123)

[Templates] Seeding form templates...
  ✓ Common template created/updated
  ✓ Simple template created/updated
  ✓ Complex template created/updated

[Config] Seeding application configuration...
  ✓ Default escalation email set: ric-contracts@unimelb.edu.au

[Form Questions] Seeding form questions...
  ✓ Successfully seeded 5 form questions

[Analytics] Seeding analytics data...
  ✓ Successfully seeded analytics data

============================================================
  📊 SEEDING SUMMARY
============================================================
  • Users: 1
  • Templates: 3
  • Config entries: 1
  • Form questions: 5
  • Analytics records: 1
============================================================

✅ Database seeding completed successfully!

📋 Default Admin Credentials:
   Username: admin
   Password: admin123

⚠️  IMPORTANT: Change the default password in production!
```
