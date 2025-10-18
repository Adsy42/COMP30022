// MongoDB initialization script
// This creates the database, collections, and indexes
// Data seeding is handled by backend/seed_db.py for better consistency

db = db.getSiblingDB("legal_ai");

// Create collections
db.createCollection("users");
db.createCollection("templates");
db.createCollection("chats");
db.createCollection("uploads");
db.createCollection("app_config");
db.createCollection("form_questions");
db.createCollection("analytics");

// Create indexes for performance
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ is_active: 1 });

db.templates.createIndex({ template_type: 1, is_active: 1 });
db.templates.createIndex({ version: -1 });

db.chats.createIndex({ chat_id: 1 }, { unique: true });
db.chats.createIndex({ status: 1 });
db.chats.createIndex({ created_at: -1 });
db.chats.createIndex({ escalated: 1 });

db.uploads.createIndex({ file_id: 1 }, { unique: true });
db.uploads.createIndex({ chat_id: 1 });

db.app_config.createIndex({ key: 1 }, { unique: true });

db.form_questions.createIndex({ id: 1 }, { unique: true });
db.form_questions.createIndex({ order: 1 });

db.analytics.createIndex({ created_at: -1 });

print("✅ MongoDB database and indexes initialized successfully!");
print("📝 Data will be seeded by the backend service on startup...");
