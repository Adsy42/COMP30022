#!/bin/bash

# Resources Endpoint Test
# Tests the /api/resources endpoint

API_URL="http://localhost:8000"

echo "📚 Testing AI Service Resources Endpoint"
echo "======================================="
echo ""

echo "Testing GET /api/resources..."
response=$(curl -s -w "\n%{http_code}" "$API_URL/api/resources")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" = "200" ]; then
    echo "✅ Resources endpoint working!"
    echo "Response:"
    echo "$body" | python -m json.tool
else
    echo "❌ Resources endpoint failed!"
    echo "HTTP Code: $http_code"
    echo "Response: $body"
fi

echo ""
echo "Testing GET /api/stats..."
response=$(curl -s -w "\n%{http_code}" "$API_URL/api/stats")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" = "200" ]; then
    echo "✅ Stats endpoint working!"
    echo "Response:"
    echo "$body" | python -m json.tool
else
    echo "❌ Stats endpoint failed!"
    echo "HTTP Code: $http_code"
    echo "Response: $body"
fi

echo ""
echo "🔗 Endpoints tested:"
echo "   GET $API_URL/api/resources"
echo "   GET $API_URL/api/stats"
