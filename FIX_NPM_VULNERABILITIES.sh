#!/bin/bash
cd /var/www/balkly

echo "🔒 Fixing npm vulnerabilities..."

# Fix vulnerabilities (bez breaking changes)
docker exec balkly_web npm audit fix

# Ako nije sve riješeno, pokušaj force (opasnije)
echo ""
echo "Checking if more fixes needed..."
VULN_COUNT=$(docker exec balkly_web npm audit --json 2>/dev/null | grep -o '"high":' | wc -l)

if [ "$VULN_COUNT" -gt 0 ]; then
    echo "⚠️  Still has vulnerabilities. Run manually if needed:"
    echo "docker exec balkly_web npm audit fix --force"
    echo ""
    echo "WARNING: --force can break things!"
fi

# Restart web
docker-compose restart web

echo ""
echo "✅ NPM packages updated!"

