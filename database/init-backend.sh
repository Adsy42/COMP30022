#!/bin/sh
# Backend initialization script
# This runs before starting the Flask server

echo "Ã°Å¸Å¡â‚¬ Starting backend initialization..."

# Wait for MongoDB to be ready
echo "Ã¢ÂÂ³ Waiting for MongoDB to be ready..."
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
        print('Ã¢Å“â€¦ MongoDB is ready!')
        sys.exit(0)
    except ConnectionFailure:
        retry_count += 1
        print(f'Ã¢ÂÂ³ MongoDB not ready yet... ({retry_count}/{max_retries})')
        time.sleep(2)

print('Ã¢ÂÅ’ MongoDB connection timeout!')
sys.exit(1)
"

if [ $? -ne 0 ]; then
    echo "Ã¢ÂÅ’ Failed to connect to MongoDB"
    exit 1
fi

# Run database seeding
echo ""
echo "Ã°Å¸Å’Â± Running database seeding..."
cd /database && python seed_db.py

if [ $? -ne 0 ]; then
    echo "Ã¢Å¡Â Ã¯Â¸Â  Seeding failed, but continuing with server startup..."
fi

echo ""
echo "Ã¢Å“â€¦ Backend initialization complete!"
echo "Ã°Å¸Å¡â‚¬ Starting Flask server..."
echo ""

# Return to app directory and start the Flask server
cd /app
exec flask run --host=0.0.0.0 --port=5001 --reload
