#!/bin/sh
# Backend initialization script
# This runs before starting the Flask server

echo "🚀 Starting backend initialization..."

# Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB to be ready..."
python -c "
import time
import sys
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

max_retries = 30
retry_count = 0

while retry_count < max_retries:
    try:
        client = MongoClient('mongodb://admin:password123@mongo:27017/legal_ai?authSource=admin', serverSelectionTimeoutMS=2000)
        client.admin.command('ping')
        print('✅ MongoDB is ready!')
        sys.exit(0)
    except ConnectionFailure:
        retry_count += 1
        print(f'⏳ MongoDB not ready yet... ({retry_count}/{max_retries})')
        time.sleep(2)

print('❌ MongoDB connection timeout!')
sys.exit(1)
"

if [ $? -ne 0 ]; then
    echo "❌ Failed to connect to MongoDB"
    exit 1
fi

# Run database seeding
echo ""
echo "🌱 Running database seeding..."
cd /database && python seed_db.py

if [ $? -ne 0 ]; then
    echo "⚠️  Seeding failed, but continuing with server startup..."
fi

echo ""
echo "✅ Backend initialization complete!"
echo "🚀 Starting Flask server..."
echo ""

# Return to app directory and start the Flask server
cd /app
exec flask run --host=0.0.0.0 --reload
