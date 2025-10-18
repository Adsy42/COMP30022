#!/bin/bash

# Query Endpoint Test
# Tests the /api/query endpoint

API_URL="http://localhost:8000"

echo "❓ Testing AI Service Query Endpoint"
echo "===================================="
echo ""

# Array of test questions
questions=(
    "What is the contract term?"
    "What are the payment terms?"
    "How can the contract be terminated?"
    "What is the governing law?"
)

# Function to test a query
test_query() {
    local question="$1"
    local max_results="${2:-5}"
    local include_documents="${3:-true}"
    
    echo "Question: $question"
    echo "Max Results: $max_results"
    echo "Include Documents: $include_documents"
    
    # Create JSON payload
    json_payload=$(cat <<EOF
{
    "question": "$question",
    "max_results": $max_results,
    "include_documents": $include_documents
}
EOF
)
    
    response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/query" \
        -H "Content-Type: application/json" \
        -d "$json_payload")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "200" ]; then
        echo "✅ Query successful!"
        echo "Response:"
        echo "$body" | python -m json.tool
    else
        echo "❌ Query failed!"
        echo "HTTP Code: $http_code"
        echo "Response: $body"
    fi
    echo "----------------------------------------"
    echo ""
}

# Test each question
for question in "${questions[@]}"; do
    test_query "$question" 5 true
done

# Test with custom parameters
echo "🧪 Testing with custom parameters..."
test_query "What are the key terms of the agreement?" 3 true

# Test invalid query (should fail)
echo "🧪 Testing invalid query (should fail)..."
echo "Question: (empty)"
json_payload='{}'
response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/query" \
    -H "Content-Type: application/json" \
    -d "$json_payload")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" = "422" ]; then
    echo "✅ Invalid query correctly rejected!"
    echo "Response:"
    echo "$body" | python -m json.tool
else
    echo "❌ Invalid query should have been rejected!"
    echo "HTTP Code: $http_code"
    echo "Response: $body"
fi

echo ""
echo "🔗 Endpoint: POST $API_URL/api/query"
echo "📝 Test Questions: ${#questions[@]} questions tested"
