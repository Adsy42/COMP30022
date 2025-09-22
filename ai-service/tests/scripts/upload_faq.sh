#!/bin/bash

# FAQ Upload Endpoint Test
# Tests the /api/upload/faq endpoint

API_URL="http://localhost:8000"
FAQ_FILE="data/documents/sample_faqs.csv"

echo "📋 Testing AI Service FAQ Upload"
echo "==============================="
echo ""

# Check if FAQ file exists
if [ ! -f "$FAQ_FILE" ]; then
    echo "❌ FAQ file not found: $FAQ_FILE"
    echo "Available files:"
    ls -la data/documents/ 2>/dev/null || echo "No documents directory found"
    exit 1
fi

echo "Uploading FAQ file: $FAQ_FILE"
echo ""

response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/upload/faq" -F "file=@$FAQ_FILE")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" = "200" ]; then
    echo "✅ FAQ uploaded successfully!"
    echo "Response:"
    echo "$body" | python -m json.tool
else
    echo "❌ FAQ upload failed!"
    echo "HTTP Code: $http_code"
    echo "Response: $body"
fi

echo ""
echo "🔗 Endpoint: POST $API_URL/api/upload/faq"
echo "📁 File: $FAQ_FILE"
