#!/bin/bash
echo "Testing all JR Graham Center pages..."
echo ""

BASE_URL="http://localhost:3002"
pages=("home" "about" "availability" "booking" "contact")

for page in "${pages[@]}"; do
    echo "Testing /$page..."
    status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/$page")
    if [ "$status" = "200" ]; then
        echo "✅ /$page - OK"
    else
        echo "❌ /$page - FAILED (Status: $status)"
    fi
done

echo ""
echo "Testing API..."
api_status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/spaces")
if [ "$api_status" = "200" ]; then
    echo "✅ /api/spaces - OK"
else
    echo "❌ /api/spaces - FAILED"
fi
echo "All tests completed!"
