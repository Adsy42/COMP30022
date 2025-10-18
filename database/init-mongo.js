// MongoDB initialization script
db = db.getSiblingDB("legal_ai");

// Create collections
db.createCollection("users");
db.createCollection("queries");
db.createCollection("form_templates");
db.createCollection("analytics");

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.queries.createIndex({ timestamp: 1 });
db.queries.createIndex({ user_id: 1 });
db.queries.createIndex({ status: 1 });
db.form_templates.createIndex({ version: 1 });

// Insert default admin user
db.users.insertOne({
  email: "admin@unimelb.edu.au",
  password_hash: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LrR3y.A8IiG3lkJ8e", // 'admin123'
  role: "admin",
  created_at: new Date(),
  is_active: true,
});

// Insert default form template
db.form_templates.insertOne({
  version: 1,
  name: "Default Query Form",
  is_active: true,
  questions: {
    simple: [
      {
        id: "query_type",
        type: "select",
        question: "What type of query do you have?",
        options: [
          "Funding agreement",
          "Collaboration agreement",
          "Service contract",
          "Other",
        ],
        required: true,
      },
      {
        id: "query_text",
        type: "textarea",
        question: "Please describe your query:",
        required: true,
      },
    ],
    complex: [
      {
        id: "project_details",
        type: "textarea",
        question: "Please provide project details:",
        required: true,
      },
      {
        id: "urgency",
        type: "select",
        question: "How urgent is this matter?",
        options: ["Low", "Medium", "High", "Critical"],
        required: true,
      },
      {
        id: "attachments",
        type: "file",
        question: "Please attach relevant documents:",
        required: false,
      },
    ],
  },
  created_at: new Date(),
  updated_at: new Date(),
});

print("Database initialized successfully!");
