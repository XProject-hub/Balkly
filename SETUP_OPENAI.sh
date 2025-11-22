#!/bin/bash
# Setup OpenAI for AI Helper

cd /var/www/balkly

echo "🤖 Setting up OpenAI API..."

# Check if OpenAI key is already in .env
if grep -q "OPENAI_API_KEY" balkly-api/.env; then
    echo "✓ OpenAI already configured in .env"
else
    echo ""
    echo "Add these lines to balkly-api/.env file:"
    echo ""
    echo "OPENAI_API_KEY=your_api_key_here"
    echo "OPENAI_MODEL=gpt-4o-mini"
    echo ""
    echo "Then run: docker-compose restart api"
    exit 1
fi

# Restart to pick up env changes
docker-compose restart api
sleep 5

# Clear cache
docker exec balkly_api php artisan config:clear
docker exec balkly_api php artisan cache:clear

echo ""
echo "✅ OpenAI API Configured!"
echo ""
echo "Features:"
echo "  🤖 GPT-4 AI Enhancement"
echo "  ✍️  Professional title writing"
echo "  📝 Smart description formatting"
echo "  🏷️  Keyword extraction"
echo "  ❌ NO EMOJIS (clean professional text)"
echo ""
echo "🌐 Test: Create listing → 'Auto-Enhance Listing'"

