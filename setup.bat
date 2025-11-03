@echo off
REM Balkly Platform - Automated Setup Script for Windows
REM Run this script to set up the entire platform in one command

echo.
echo ============================================
echo    Balkly Platform Setup (Windows)
echo ============================================
echo.

REM Step 1: Create environment files
echo [Step 1/6] Creating environment files...
if not exist balkly-api\.env (
    copy balkly-api\.env.example balkly-api\.env >nul
    echo [✓] Backend .env created
) else (
    echo [!] Backend .env already exists (skipped)
)

if not exist balkly-web\.env.local (
    copy balkly-web\.env.local.example balkly-web\.env.local >nul
    echo [✓] Frontend .env created
) else (
    echo [!] Frontend .env already exists (skipped)
)
echo.

REM Step 2: Start Docker services
echo [Step 2/6] Starting Docker services...
docker-compose up -d
echo [✓] All services started
echo.

REM Wait for services
echo [Step 2.5/6] Waiting for services to initialize (15 seconds)...
timeout /t 15 /nobreak >nul
echo.

REM Step 3: Setup backend
echo [Step 3/6] Setting up Laravel backend...
docker exec -it balkly_api bash -c "composer install --no-interaction"
echo [✓] Dependencies installed

docker exec -it balkly_api bash -c "php artisan key:generate"
echo [✓] Application key generated

docker exec -it balkly_api bash -c "php artisan migrate --force"
echo [✓] Database migrated

docker exec -it balkly_api bash -c "php artisan db:seed --force"
echo [✓] Database seeded
echo.

REM Step 4: Setup frontend
echo [Step 4/6] Setting up Next.js frontend...
docker exec -it balkly_web sh -c "npm install"
echo [✓] Frontend dependencies installed
echo.

REM Step 5: Restart services
echo [Step 5/6] Restarting services...
docker-compose restart web
echo [✓] Services restarted
echo.

REM Step 6: Final message
echo [Step 6/6] Setup complete!
echo.
echo ============================================
echo            Setup Complete!
echo ============================================
echo.
echo Your Balkly platform is now running!
echo.
echo Access URLs:
echo   Frontend:     http://localhost
echo   API:          http://localhost/api/v1
echo   Admin:        http://localhost/admin
echo   MinIO:        http://localhost:9001
echo.
echo Test Credentials:
echo   Admin:  admin@balkly.com / password123
echo   Seller: seller@balkly.com / password123
echo   Buyer:  buyer@balkly.com / password123
echo.
echo Next Steps:
echo   1. Add Stripe API keys to balkly-api\.env
echo   2. Add OpenAI key to balkly-api\.env (optional)
echo   3. Create MinIO bucket at http://localhost:9001
echo      Login: balkly / balkly_minio_pass
echo      Create bucket: balkly-media
echo   4. Visit http://localhost
echo.
echo Documentation: See docu\START_HERE.md
echo.
pause

