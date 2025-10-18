# 🗄️ Database Configuration & Initialization

This folder contains all database-related configuration, initialization scripts, and seeding logic.

## 📁 Structure

```
database/
├── init-mongo.js          # MongoDB schema initialization (runs on first container start)
├── init-backend.sh        # Backend initialization script (waits for DB, runs seeding)
├── seed_db.py             # Main database seeding script
└── seeds/                 # Organized seed modules
    ├── __init__.py
    ├── README.md
    ├── seed_users.py      # User seeding logic
    ├── seed_templates.py  # Template seeding logic
    ├── seed_config.py     # Config seeding logic
    ├── seed_form_questions.py
    ├── seed_analytics.py
    ├── data_form_questions.py  # Large data structures
    └── data_analytics.py
```

## 🚀 How It Works

### Stage 1: MongoDB Initialization
**File:** `init-mongo.js`  
**When:** First container creation only  
**What:** Creates database, collections, and indexes

### Stage 2: Backend Initialization  
**File:** `init-backend.sh`  
**When:** Every container startup (development)  
**What:** 
1. Waits for MongoDB to be ready (with retry mechanism)
2. Runs `seed_db.py` to populate data
3. Starts Flask server

### Stage 3: Data Seeding
**File:** `seed_db.py`  
**When:** Called by `init-backend.sh`  
**What:** Populates database with initial/test data

## 🎯 Usage

### Automatic (Development)
```bash
docker-compose up
# Everything happens automatically!
```

### Manual Seeding
```bash
# Inside container
docker-compose exec backend python /database/seed_db.py

# Seed specific data
docker-compose exec backend python /database/seed_db.py --essential
docker-compose exec backend python /database/seed_db.py --users
docker-compose exec backend python /database/seed_db.py --templates
```

### From Host Machine
```bash
# Mount database folder and run
docker-compose exec backend sh -c "cd /database && python seed_db.py"
```

## 📝 Why This Structure?

### ✅ Better Organization
- All database-related files in one place
- Clear separation from application code
- Easy to find initialization logic

### ✅ Logical Grouping
- `init-mongo.js` - MongoDB's responsibility (schema)
- `init-backend.sh` - Orchestration (wait + seed + start)
- `seed_db.py` + `seeds/` - Data population (Python's responsibility)

### ✅ Scalability
- Easy to add new seed types
- Simple to modify initialization flow
- Clear entry points for database operations

## 🔧 Configuration

### Environment Variables
Seeding scripts use environment variables from docker-compose:
- `MONGODB_URI` - Database connection string
- `FLASK_ENV` - Environment (development/production)

### Docker Compose Integration
```yaml
backend:
  volumes:
    - ./database:/database  # Mount database folder
  command: sh /database/init-backend.sh  # Use init script
```

## 📚 Adding New Seeds

See [seeds/README.md](./seeds/README.md) for detailed instructions on adding new seed types.

## 🎓 Best Practices

1. **Keep schema in MongoDB** - Use `init-mongo.js` for structure only
2. **Keep data in Python** - Use `seed_db.py` for data population
3. **Make seeds idempotent** - Safe to run multiple times
4. **Organize by entity** - One seed file per model/entity
5. **Separate data from logic** - Use `data_*.py` for large datasets

## 🔗 Related Files

- **Backend:** Uses `/app` for application code
- **Database:** Uses `/database` for initialization
- **Volumes:** Both folders mounted in docker-compose

## 📖 Documentation

- [DATABASE_INIT.md](../backend/DATABASE_INIT.md) - Detailed initialization flow
- [seeds/README.md](./seeds/README.md) - Seeding system documentation
- [DB_INIT_IMPROVEMENTS.md](../DB_INIT_IMPROVEMENTS.md) - Architecture decisions
