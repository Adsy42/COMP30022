#!/bin/bash

# Health Check Endpoint Test
# Tests the /health endpoint

API_URL="http://localhost:8000"

echo "🏥 Testing AI Service Health Check"
echo "=================================="
echo ""

echo "Testing GET /health..."
response=$(curl -s -w "\n%{http_code}" "$API_URL/health")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" = "200" ]; then
    echo "✅ Health check passed!"
    echo "Response:"
    echo "$body" | python -m json.tool
else
    echo "❌ Health check failed!"
    echo "HTTP Code: $http_code"
    echo "Response: $body"
fi

echo ""
echo "Testing GET / (root endpoint)..."
response=$(curl -s -w "\n%{http_code}" "$API_URL/")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" = "200" ]; then
    echo "✅ Root endpoint working!"
    echo "Response:"
    echo "$body" | python -m json.tool
else
    echo "❌ Root endpoint failed!"
    echo "HTTP Code: $http_code"
    echo "Response: $body"
fi

echo ""
echo "🔗 Endpoints tested:"
echo "   GET $API_URL/health"
echo "   GET $API_URL/"
