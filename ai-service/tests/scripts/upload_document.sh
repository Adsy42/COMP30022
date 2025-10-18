#!/bin/bash

# Document Upload Endpoint Test
# Tests the /api/upload/document endpoint

API_URL="http://localhost:8000"
DOCUMENT_FILE="data/documents/test_small.pdf"

echo "📄 Testing AI Service Document Upload"
echo "====================================="
echo ""

# Check if document file exists
if [ ! -f "$DOCUMENT_FILE" ]; then
    echo "❌ Document file not found: $DOCUMENT_FILE"
    echo "Available documents:"
    ls -la data/documents/ 2>/dev/null || echo "No documents directory found"
    exit 1
fi

echo "Uploading document: $DOCUMENT_FILE"
echo ""

response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/upload/document" -F "file=@$DOCUMENT_FILE")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" = "200" ]; then
    echo "✅ Document uploaded successfully!"
    echo "Response:"
    echo "$body" | python -m json.tool
else
    echo "❌ Document upload failed!"
    echo "HTTP Code: $http_code"
    echo "Response: $body"
fi

echo ""
echo "🔗 Endpoint: POST $API_URL/api/upload/document"
echo "📁 File: $DOCUMENT_FILE"
