@echo off
REM Windows Batch Script to Run Spring Boot with Supabase (PostgreSQL)
REM IMPORTANT: Update the credentials below with your actual Supabase details

echo Starting Bookstore Backend with Supabase Database...
echo.

REM Set environment variables - UPDATE THESE WITH YOUR CREDENTIALS
set SPRING_PROFILES_ACTIVE=prod
set SUPABASE_DB_URL=jdbc:postgresql://db.YOUR-PROJECT-REF.supabase.co:5432/postgres
set SUPABASE_DB_USER=postgres
set SUPABASE_DB_PASSWORD=your-supabase-password-here
set JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
set JWT_EXPIRATION=86400000
set FRONTEND_URL=http://localhost:5173
set PORT=8080

echo Environment variables set successfully!
echo Running Maven Spring Boot...
echo.

REM Run Spring Boot
mvn spring-boot:run

pause
